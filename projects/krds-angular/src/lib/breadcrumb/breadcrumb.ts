import { Component, booleanAttribute, input, output } from '@angular/core'

/** 브레드크럼 항목 */
export interface KrdsBreadcrumbItem {
  /** 문구 */
  text: string
  /** 링크 주소 */
  href?: string
}

/** 브레드크럼 항목 클릭 이벤트 (라우터로 이동하려면 event.preventDefault()) */
export interface KrdsBreadcrumbClick {
  item: KrdsBreadcrumbItem
  event: MouseEvent
}

/**
 * KRDS 브레드크럼. 마지막 항목이 현재 페이지(aria-current="page")이고, 첫 항목은 홈 아이콘으로 보인다
 *
 * @example <nav krdsBreadcrumb [items]="[{ text: '홈', href: '/' }, { text: '민원 안내', href: '/guide' }, { text: '전입 신고' }]"></nav>
 */
@Component({
  selector: 'nav[krdsBreadcrumb]',
  host: {
    class: 'krds-breadcrumb-wrap',
    '[attr.aria-label]': 'label()'
  },
  template: `
    <ol class="breadcrumb">
      @for (item of items(); track $index; let first = $first; let last = $last) {
        <li [class.home]="first && showHomeIcon()">
          <a
            class="txt"
            [href]="item.href || '#'"
            [attr.aria-current]="last ? 'page' : null"
            (click)="itemClick.emit({ item, event: $event })"
          >
            <span>{{ item.text }}</span>
          </a>
        </li>
      }
    </ol>
  `
})
export class KrdsBreadcrumb {
  /** 항목 (마지막이 현재 페이지) */
  readonly items = input.required<KrdsBreadcrumbItem[]>()
  /** 내비게이션 이름 */
  readonly label = input('현재 경로')
  /** 첫 항목을 홈 아이콘으로 */
  readonly showHomeIcon = input(true, { transform: booleanAttribute })

  /** 항목을 클릭했을 때 */
  readonly itemClick = output<KrdsBreadcrumbClick>()
}
