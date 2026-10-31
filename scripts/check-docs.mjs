/**
 * 문서 사이트 예제 검사: 빌드한 사이트(docs/.vitepress/dist)의 모든 페이지를 Chromium으로 열어
 * Angular 예제가 오류 없이 그려지는지, 예제 영역에 axe-core 접근성 위반이 없는지 확인한다.
 * 사용: pnpm docs:build && pnpm docs:test [경로 접두사...] (예: pnpm docs:test /components/select /frame/select)
 * 포트는 DOCS_TEST_PORT(기본 4173)
 */
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { globSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { relative } from 'node:path'
import { chromium } from 'playwright'

const dist = 'docs/.vitepress/dist'
const port = Number(process.env.DOCS_TEST_PORT ?? 4173)
const prefixes = process.argv.slice(2)
const origin = `http://localhost:${port}`
const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf-8')

const pages = globSync(`${dist}/**/*.html`)
  .filter(file => !file.endsWith('/404.html'))
  .map(
    file =>
      '/' +
      relative(dist, file)
        .replace(/(^|\/)index\.html$/, '$1')
        .replace(/\.html$/, '')
  )
  .filter(path => !prefixes.length || prefixes.some(prefix => path.startsWith(prefix)))
  .sort()

// pnpm exec를 거치면 kill이 vitepress까지 닿지 않으므로 node로 바로 띄운다
const vitepress = 'node_modules/vitepress/bin/vitepress.js'
const server = spawn(process.execPath, [vitepress, 'preview', 'docs', '--port', String(port), '--strictPort'], { stdio: 'ignore' })
server.on(
  'exit',
  code => code && console.error(`vitepress preview 종료 (코드 ${code}): 포트 ${port}를 다른 프로세스가 쓰고 있는지 확인하세요`)
)
const browser = await chromium.launch()
const problems = []
try {
  for (let tries = 0; ; tries++) {
    if (
      await fetch(origin).then(
        response => response.ok,
        () => false
      )
    )
      break
    if (tries > 100) throw new Error('vitepress preview가 시작되지 않았습니다')
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
  page.setDefaultTimeout(10_000)
  let errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => message.type() === 'error' && errors.push(message.text()))

  for (const path of pages) {
    errors = []
    await page.goto(origin + path, { waitUntil: 'networkidle' })
    // 모든 예제가 그려지고 CSS 전환이 끝날 때까지
    await page
      .waitForFunction(() => !document.querySelector('.angular-demo:empty'), null, { timeout: 10_000 })
      .catch(() => {
        errors.push('그려지지 않은 예제가 있습니다')
      })
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter(a => a.effect?.getTiming().iterations !== Infinity)
          .map(a => a.finished)
      )
    )
    // 컴포넌트 문서는 예제 영역만, 예제 전용 화면(frame/)은 화면 전체를 검사한다. 예제 화면은 페이지 조각이라 랜드마크 규칙(region)은 뺀다
    const frame = path.startsWith('/frame/')
    const context = frame || path === '/playground' ? 'body' : '.demo'
    if (await page.locator(context).count()) {
      await page.addScriptTag({ content: axeSource })
      const violations = await page.evaluate(
        ([selector, frame]) =>
          window.axe
            .run({ include: [...document.querySelectorAll(selector)] }, { rules: { region: { enabled: !frame } } })
            .then(result => result.violations),
        [context, frame]
      )
      for (const violation of violations) {
        errors.push(`${violation.id}: ${violation.help}\n    ${violation.nodes.map(node => node.target.join(' ')).join('\n    ')}`)
      }
    }
    if (path === '/playground') {
      try {
        for (const width of [1920, 1440, 1024, 390]) {
          await page.setViewportSize({ width, height: 1080 })
          const layout = await page.evaluate(() => ({
            menuRight: document.querySelector('.krds-side-navigation').getBoundingClientRect().right,
            contentLeft: document.querySelector('.contents').getBoundingClientRect().left,
            menuDisplay: getComputedStyle(document.querySelector('.krds-side-navigation')).display,
            brandWidth: document.querySelector('.pg-brand span').getBoundingClientRect().width,
            pageWidth: document.documentElement.scrollWidth
          }))
          assert.ok(layout.brandWidth > 50, `${width}px: 로고 이름이 숨겨짐`)
          if (width >= 1024) assert.ok(layout.menuRight <= layout.contentLeft, `${width}px: LNB가 본문을 침범함`)
          else assert.equal(layout.menuDisplay, 'none')
          assert.ok(layout.pageWidth <= width, `${width}px: 페이지 가로 넘침`)
        }
        await page.setViewportSize({ width: 1200, height: 900 })

        await page.getByRole('button', { name: '예시 신청하기', exact: true }).click()
        await page.waitForFunction(() => document.activeElement?.id === 'pg-name')
        await page.getByText('이름을 입력해 주세요.', { exact: true }).waitFor({ state: 'visible' })
        await page.getByRole('textbox', { name: '이름 (필수)', exact: true }).fill('체험 사용자')
        await page.getByRole('combobox', { name: '신청 유형 (필수)', exact: true }).selectOption('certificate')
        await page.getByText('개인정보 수집·이용 동의 (필수)', { exact: true }).click()
        await page.getByRole('button', { name: '예시 신청하기', exact: true }).click()
        const dialog = page.getByRole('dialog')
        await dialog.waitFor({ state: 'visible' })
        assert.match(await dialog.innerText(), /체험 사용자님의 입력을 확인했습니다/)
        await dialog.getByRole('button', { name: '닫기', exact: true }).first().click()
        await dialog.waitFor({ state: 'hidden' })
        await page.getByRole('button', { name: '초기화', exact: true }).click()
        await page.waitForFunction(() => document.querySelector('#pg-name').value === '')
        assert.equal(await page.locator('#pg-agree').isChecked(), false)
        await page.getByRole('button', { name: '다음 단계', exact: true }).click()
        await page.getByText('현재 단계: 2 / 4', { exact: true }).waitFor({ state: 'visible' })
        await page.getByRole('link', { name: '2', exact: true }).click()
        await page.getByText('여권 재발급', { exact: true }).waitFor({ state: 'visible' })
        assert.equal(await page.getByText('주민등록표 등본 발급', { exact: true }).count(), 0)
        await page.setViewportSize({ width: 390, height: 844 })
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
        await page.getByRole('button', { name: '전체메뉴', exact: true }).click()
        await page.getByRole('button', { name: '전체메뉴 닫기', exact: true }).click()
        await page.waitForFunction(() => document.querySelector('[aria-controls="mobile-nav"]').getAttribute('aria-expanded') === 'false')
      } catch (error) {
        errors.push(`플레이그라운드 동작: ${error.stack}`)
      } finally {
        await page.setViewportSize({ width: 1200, height: 900 })
      }
    }
    if (errors.length) problems.push(`${path}\n  ${errors.join('\n  ')}`)
    else console.log(`ok ${path}`)
  }
} finally {
  await browser.close()
  server.kill()
}

if (problems.length) {
  console.error(`\n문제가 있는 페이지 ${problems.length}개:\n\n${problems.join('\n\n')}`)
  process.exit(1)
}
console.log(`\n${pages.length}개 페이지 문제 없음`)
