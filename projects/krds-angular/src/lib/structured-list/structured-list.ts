import { Component, Directive, booleanAttribute, input } from '@angular/core'

/**
 * KRDS 구조화 목록. 항목(`<li krdsStructuredItem>`) 안에 KRDS 영역 클래스(card-top·card-body·card-btm·card-btn)로 내용을 나눈다
 *
 * @example
 * <ul krdsStructuredList>
 *   <li krdsStructuredItem>
 *     <div class="card-top"><span krdsBadge>접수중</span></div>
 *     <div class="card-body"><p class="c-tit">청년 주거 지원</p></div>
 *     <div class="card-btn"><a krdsLink href="/apply">신청하기</a></div>
 *   </li>
 * </ul>
 */
@Directive({
  selector: 'ul[krdsStructuredList]',
  host: {
    class: 'krds-structured-list',
    '[class.type-full]': 'full()'
  }
})
export class KrdsStructuredList {
  /** 한 줄에 항목 하나 (전체 폭) */
  readonly full = input(true, { transform: booleanAttribute })
}

/** 구조화 목록의 항목 */
@Component({
  selector: 'li[krdsStructuredItem]',
  host: { class: 'structured-item' },
  template: '<div class="in"><ng-content /></div>'
})
export class KrdsStructuredItem {}
