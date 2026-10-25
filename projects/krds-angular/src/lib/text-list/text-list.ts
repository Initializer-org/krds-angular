import { Directive, input } from '@angular/core'

/** 텍스트 목록 스타일 */
export type KrdsTextListVariant = 'decimal' | 'dash' | 'hollow' | 'ordered'

/**
 * KRDS 텍스트 목록. 기본 `<ul>`·`<ol>`에 KRDS 클래스만 붙인다
 *
 * @example <ol krdsTextList variant="decimal"><li>신청서를 작성합니다.</li></ol>
 */
@Directive({
  selector: 'ul[krdsTextList], ol[krdsTextList]',
  host: { '[class]': "'krds-info-list ' + variant()" }
})
export class KrdsTextList {
  /** 스타일 */
  readonly variant = input<KrdsTextListVariant>('dash')
}
