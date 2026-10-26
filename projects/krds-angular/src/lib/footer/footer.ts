import { Component, Directive, input } from '@angular/core'

/** 푸터 위쪽 관련 사이트 영역 (`<div krdsFooterTop>`) */
@Component({
  selector: '[krdsFooterTop]',
  host: { class: 'foot-quick' },
  template: '<div class="inner"><ng-content /></div>'
})
export class KrdsFooterTop {}

/** 푸터 로고 영역 */
@Directive({
  selector: '[krdsFooterLogo]',
  host: { class: 'f-logo' }
})
export class KrdsFooterLogo {}

/** 푸터 기관 정보·링크 영역 */
@Directive({
  selector: '[krdsFooterContent]',
  host: { class: 'f-cnt' }
})
export class KrdsFooterContent {}

/** 푸터 아래쪽 정책 링크·저작권 영역 */
@Directive({
  selector: '[krdsFooterBottom]',
  host: { class: 'f-btm' }
})
export class KrdsFooterBottom {}

/**
 * KRDS 푸터. 기본 `<footer>`(contentinfo 랜드마크)에 붙여 영역을 KRDS 구조로 배치한다
 *
 * @example
 * <footer krdsFooter>
 *   <div krdsFooterTop>...</div>
 *   <div krdsFooterLogo><span class="sr-only">기관명</span></div>
 *   <div krdsFooterContent>...</div>
 *   <div krdsFooterBottom>...</div>
 * </footer>
 */
@Component({
  selector: 'footer[krdsFooter]',
  host: { '[id]': 'id()' },
  template: `
    <ng-content select="[krdsFooterTop]" />
    <div class="inner">
      <ng-content select="[krdsFooterLogo]" />
      <ng-content select="[krdsFooterContent]" />
      <ng-content select="[krdsFooterBottom]" />
    </div>
  `
})
export class KrdsFooter {
  /** id (KRDS CSS 기준 krds-footer) */
  readonly id = input('krds-footer')
}
