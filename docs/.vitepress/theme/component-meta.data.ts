import ts from 'typescript'
import { createMarkdownRenderer, defineLoader, type SiteConfig } from 'vitepress'

export interface ComponentApi {
  selector?: string
  exportAs?: string
  inputs: { name: string; type: string; default?: string; required: boolean; twoWay: boolean; description: string }[]
  outputs: { name: string; type: string; description: string }[]
  methods: { name: string; signature: string; description: string }[]
  /** 입력·출력·메서드가 쓰는 라이브러리 타입(KrdsSideNavItem 등)의 선언, 강조한 HTML */
  types?: string
}

declare const data: Record<string, ComponentApi>
export { data }

const decorators = new Set(['Component', 'Directive', 'Injectable'])
const lifecycle = /^ng[A-Z]/

const isPublic = (member: ts.ClassElement) =>
  !(ts.getCombinedModifierFlags(member) & (ts.ModifierFlags.Private | ts.ModifierFlags.Protected | ts.ModifierFlags.Static)) &&
  !(member.name && ts.isPrivateIdentifier(member.name))

/** 데코레이터 객체 리터럴의 문자열 속성 (selector, exportAs) */
const stringOption = (options: ts.ObjectLiteralExpression | undefined, key: string) => {
  const property = options?.properties.find(
    (property): property is ts.PropertyAssignment => ts.isPropertyAssignment(property) && property.name.getText() === key
  )
  return property && ts.isStringLiteralLike(property.initializer) ? property.initializer.text.replace(/\s+/g, ' ').trim() : undefined
}

/**
 * 컴포넌트·디렉티브·서비스 소스에서 API 표를 만든다 (TypeScript 컴파일러 API).
 * signal 입력(input, input.required, model)·출력(output)과 공개 메서드를 선언 순서대로, 설명은 JSDoc에서 읽는다.
 * 여기서 쓰는 라이브러리 타입은 선언을 그대로 보여 준다 (그 타입이 다시 쓰는 타입까지)
 */
export default defineLoader({
  watch: ['../../../projects/krds-angular/src/lib/**/*.ts'],
  async load(files): Promise<Record<string, ComponentApi>> {
    const sources = files.filter(file => !file.endsWith('.spec.ts'))
    const program = ts.createProgram(sources, {
      strict: true,
      skipLibCheck: true,
      experimentalDecorators: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.Preserve,
      noEmit: true
    })
    const checker = program.getTypeChecker()

    /** 값 목록 유니온(KrdsButtonVariant 등)은 별칭 대신 값이 보이게 선언 순서대로 펼치고, 선택 입력의 undefined는 뺀다 (기본값 "-"가 뜻함) */
    const typeText = (type: ts.Type, node: ts.Node, typeArgument?: ts.TypeNode) => {
      const flags = ts.TypeFormatFlags.NoTruncation
      const alias = (type.aliasSymbol ?? (typeArgument && checker.getTypeFromTypeNode(typeArgument).aliasSymbol))?.declarations?.[0]
      if (alias && ts.isTypeAliasDeclaration(alias) && ts.isUnionTypeNode(alias.type) && alias.type.types.every(ts.isLiteralTypeNode)) {
        return alias.type.types.map(member => member.getText()).join(' | ')
      }
      if (!type.isUnion()) return checker.typeToString(type, node, flags)
      const members = type.types.filter(member => !(member.flags & ts.TypeFlags.Undefined))
      const literal = members.every(member => member.isLiteral() || member.flags & ts.TypeFlags.BooleanLiteral)
      if (!literal) return checker.typeToString(type, node, flags).replace(/ \| undefined$/, '')
      const booleans = members.filter(member => member.flags & ts.TypeFlags.BooleanLiteral).length === 2
      return [
        ...members
          .filter(member => !(member.flags & ts.TypeFlags.BooleanLiteral))
          .map(member => checker.typeToString(member).replace(/"/g, "'")),
        ...(booleans ? ['boolean'] : [])
      ].join(' | ')
    }
    const description = (node: ts.Node) => {
      const symbol = ts.isClassElement(node) && node.name ? checker.getSymbolAtLocation(node.name) : undefined
      return symbol ? ts.displayPartsToString(symbol.getDocumentationComment(checker)).replace(/\s*\n\s*/g, ' ') : ''
    }

    const apis: Record<string, ComponentApi> = {}
    /** hostDirectives로 밖에 연 입력 ([클래스, 디렉티브, 'name' 또는 'name: alias']) */
    const hostInputs: [string, string, string][] = []
    /** 내보내는 interface·type 선언 (값 목록 유니온은 표에서 펼치므로 뺀다) */
    const declarations = new Map<string, string>()
    for (const file of sources) {
      for (const statement of program.getSourceFile(file)?.statements ?? []) {
        const exported = ts.getCombinedModifierFlags(statement as ts.Declaration) & ts.ModifierFlags.Export
        if (exported && (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement))) {
          const literals =
            ts.isTypeAliasDeclaration(statement) && ts.isUnionTypeNode(statement.type) && statement.type.types.every(ts.isLiteralTypeNode)
          if (!literals) declarations.set(statement.name.text, statement.getFullText().trim())
          continue
        }
        if (!ts.isClassDeclaration(statement) || !statement.name) continue
        const decorator = ts
          .getDecorators(statement)
          ?.map(({ expression }) => expression)
          .find(
            (expression): expression is ts.CallExpression =>
              ts.isCallExpression(expression) && decorators.has(expression.expression.getText())
          )
        if (!decorator) continue
        const options = decorator.arguments[0] && ts.isObjectLiteralExpression(decorator.arguments[0]) ? decorator.arguments[0] : undefined
        const api: ComponentApi = {
          selector: stringOption(options, 'selector'),
          exportAs: stringOption(options, 'exportAs'),
          inputs: [],
          outputs: [],
          methods: []
        }
        for (const member of statement.members) {
          if (!isPublic(member) || !member.name || lifecycle.test(member.name.getText())) continue
          if (ts.isMethodDeclaration(member)) {
            const signature = checker.getSignatureFromDeclaration(member)
            if (signature)
              api.methods.push({
                name: member.name.getText(),
                signature: checker.signatureToString(signature).replace(/\?: ([^,)]+) \| undefined/g, '?: $1'),
                description: description(member)
              })
            continue
          }
          // readonly label = input<string>(), input.required(...), model(...), output<T>()
          if (!ts.isPropertyDeclaration(member) || !member.initializer || !ts.isCallExpression(member.initializer)) continue
          const call = member.initializer
          const callee = call.expression.getText()
          const kind = callee.replace(/\.required$/, '')
          if (kind !== 'input' && kind !== 'model' && kind !== 'output') continue
          const required = callee.endsWith('.required')
          const settings = call.arguments[required ? 0 : 1]
          const alias = settings && ts.isObjectLiteralExpression(settings) ? stringOption(settings, 'alias') : undefined
          // InputSignal<T>, InputSignalWithTransform<T, 쓰는 값>, ModelSignal<T>, OutputEmitterRef<T>의 T
          const [valueType] = checker.getTypeArguments(checker.getTypeAtLocation(member) as ts.TypeReference)
          const type = valueType ? typeText(valueType, member, call.typeArguments?.[0]) : 'unknown'
          const name = alias ?? member.name.getText()
          if (kind === 'output') {
            api.outputs.push({ name, type, description: description(member) })
            continue
          }
          const initial = required ? undefined : call.arguments[0]?.getText()
          api.inputs.push({
            name,
            type,
            default: initial === 'undefined' ? undefined : initial,
            required,
            twoWay: kind === 'model',
            description: description(member)
          })
        }
        apis[statement.name.text] = api
        // hostDirectives: [{ directive: KrdsDropdown, inputs: ['position: dropPosition'] }]
        const hostDirectives = options?.properties.find(
          (property): property is ts.PropertyAssignment => ts.isPropertyAssignment(property) && property.name.getText() === 'hostDirectives'
        )?.initializer
        for (const entry of hostDirectives && ts.isArrayLiteralExpression(hostDirectives) ? hostDirectives.elements : []) {
          if (!ts.isObjectLiteralExpression(entry)) continue
          const props = Object.fromEntries(
            entry.properties.filter(ts.isPropertyAssignment).map(property => [property.name.getText(), property.initializer])
          )
          const inputs = props['inputs']
          if (!inputs || !ts.isArrayLiteralExpression(inputs)) continue
          for (const mapping of inputs.elements.filter(ts.isStringLiteralLike))
            hostInputs.push([statement.name.text, props['directive'].getText(), mapping.text])
        }
      }
    }
    for (const [target, directive, mapping] of hostInputs) {
      const [name, alias = name] = mapping.split(':').map(part => part.trim())
      const input = apis[directive]?.inputs.find(candidate => candidate.name === name)
      if (input && !apis[target].inputs.some(candidate => candidate.name === alias)) apis[target].inputs.push({ ...input, name: alias })
    }

    const config: SiteConfig = (globalThis as { VITEPRESS_CONFIG?: SiteConfig }).VITEPRESS_CONFIG!
    const md = await createMarkdownRenderer(config.srcDir, config.markdown, config.site.base, config.logger)
    const referenced = (text: string) => [...text.matchAll(/\bKrds\w+/g)].map(([name]) => name).filter(name => declarations.has(name))
    for (const api of Object.values(apis)) {
      const names = new Set(
        [...api.inputs, ...api.outputs]
          .map(({ type }) => type)
          .concat(api.methods.map(({ signature }) => signature))
          .flatMap(referenced)
      )
      for (const name of names) referenced(declarations.get(name)!).forEach(next => names.add(next))
      if (names.size) api.types = await md.renderAsync(`\`\`\`ts\n${[...names].map(name => declarations.get(name)).join('\n\n')}\n\`\`\`\n`)
    }
    return apis
  }
})
