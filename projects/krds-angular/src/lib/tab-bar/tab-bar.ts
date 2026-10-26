import { Component, input, output } from '@angular/core'

/** 탭바 항목 */
export interface KrdsTabBarItem {
  text: string
  /** 아이콘 클래스 (예: 'ico-bread-home') */
  icon: string
  /** 링크 주소 (없으면 버튼) */
  href?: string
  /** 현재 페이지 (aria-current) */
  selected?: boolean
}

/** 탭바 항목 클릭 이벤트 */
export interface KrdsTabBarClick {
  item: KrdsTabBarItem
  event: MouseEvent
}

/**
 * KRDS 탭바. 좁은 화면 아래쪽에 고정되는 주요 메뉴 내비게이션 (넓은 화면에서는 KRDS CSS가 숨김).
 * 현재 페이지는 aria-current="page", href 없는 항목은 버튼이다
 *
 * @example <nav krdsTabBar [items]="[{ text: '홈', icon: 'ico-bread-home', href: '/', selected: true }]"></nav>
 */
@Component({
  selector: 'nav[krdsTabBar]',
  host: {
    class: 'krds-tab-bar',
    '[attr.aria-label]': 'label()'
  },
  template: `
    <ul>
      @for (item of items(); track $index) {
        <li>
          @if (item.href) {
            <a
              class="tab-bar-item"
              [class.active]="item.selected"
              [href]="item.href"
              [attr.aria-current]="item.selected ? 'page' : null"
              (click)="itemClick.emit({ item, event: $event })"
            >
              <i class="svg-icon" [class]="item.icon" aria-hidden="true"></i><span class="tab-bar-label">{{ item.text }}</span>
            </a>
          } @else {
            <button
              type="button"
              class="tab-bar-item"
              [class.active]="item.selected"
              [attr.aria-current]="item.selected ? 'page' : null"
              (click)="itemClick.emit({ item, event: $event })"
            >
              <i class="svg-icon" [class]="item.icon" aria-hidden="true"></i><span class="tab-bar-label">{{ item.text }}</span>
            </button>
          }
        </li>
      }
    </ul>
  `
})
export class KrdsTabBar {
  /** 항목 */
  readonly items = input.required<KrdsTabBarItem[]>()
  /** 내비게이션 이름 */
  readonly label = input('하단 메뉴')

  /** 항목을 눌렀을 때 */
  readonly itemClick = output<KrdsTabBarClick>()
}
