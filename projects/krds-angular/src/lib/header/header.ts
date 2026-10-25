import { Component, Directive, input } from '@angular/core'

/** 헤더 위쪽 유틸리티 영역 (`<div krdsHeaderUtility>`) */
@Directive({
  selector: '[krdsHeaderUtility]',
  host: { class: 'header-utility' }
})
export class KrdsHeaderUtility {}

/** 헤더 로고·주요 버튼 영역 (`<div krdsHeaderBranding>`) */
@Directive({
  selector: '[krdsHeaderBranding]',
  host: { class: 'header-branding' }
})
export class KrdsHeaderBranding {}

/**
 * KRDS 헤더. 기본 `<header>`(banner 랜드마크)에 붙여 KRDS 구조로 배치한다.
 * 유틸리티·브랜딩은 `[krdsHeaderUtility]`·`[krdsHeaderBranding]`, PC 메뉴는 그냥 넣고, 모바일 드로어는 `krdsHeaderMobile` 속성을 붙여 넣는다
 *
 * @example
 * <header krdsHeader>
 *   <div krdsHeaderUtility>...</div>
 *   <div krdsHeaderBranding><h2 class="logo">...</h2></div>
 *   <krds-main-menu [items]="menu" />
 *   <krds-main-menu krdsHeaderMobile variant="mobile" [items]="menu" [(open)]="menuOpen" />
 * </header>
 */
@Component({
  selector: 'header[krdsHeader]',
  host: { '[id]': 'id()' },
  template: `
    <div class="header-in">
      <div class="header-container">
        <div class="inner">
          <ng-content select="[krdsHeaderUtility]" />
          <ng-content select="[krdsHeaderBranding]" />
        </div>
      </div>
      <ng-content />
    </div>
    <ng-content select="[krdsHeaderMobile]" />
  `
})
export class KrdsHeader {
  /** id (KRDS CSS 기준 krds-header) */
  readonly id = input('krds-header')
}
