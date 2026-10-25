import { Component, ElementRef, inject, input, model, output } from '@angular/core'

/** 사이드 메뉴 4단계(팝업 안) 항목 */
export interface KrdsSideNavPopupItem {
  text: string
  href?: string
}

/** 사이드 메뉴 3단계 항목 (subItems가 있으면 팝업을 여는 버튼) */
export interface KrdsSideNavSubItem {
  text: string
  href?: string
  /** 팝업 열림 */
  expanded?: boolean
  /** 팝업 제목 (기본: text) */
  popupTitle?: string
  subItems?: KrdsSideNavPopupItem[]
}

/** 사이드 메뉴 2단계 항목 (subItems가 있으면 펼침 버튼) */
export interface KrdsSideNavItem {
  text: string
  href?: string
  /** 펼침 */
  expanded?: boolean
  subItems?: KrdsSideNavSubItem[]
}

/** 사이드 메뉴 링크 클릭 이벤트 (라우터로 이동하려면 event.preventDefault()) */
export interface KrdsSideNavClick {
  item: KrdsSideNavItem | KrdsSideNavSubItem | KrdsSideNavPopupItem
  event: MouseEvent
}

let nextId = 0

/**
 * KRDS 사이드 메뉴. 펼침 상태는 항목의 expanded로 `[(items)]`에 담아 주고받는다.
 * 2단계를 접으면 그 안의 팝업도 닫히고, 3단계 팝업은 열면 제목 버튼으로 초점을 옮기며 초점이 밖으로 나가면 닫고 연 버튼으로 초점을 돌려준다
 *
 * @example <nav krdsSideNavigation heading="민원 안내" [(items)]="menu"></nav>
 */
@Component({
  selector: 'nav[krdsSideNavigation]',
  host: { class: 'krds-side-navigation' },
  template: `
    <h2 class="lnb-tit">{{ heading() }}</h2>
    <ul class="lnb-list" role="menubar">
      @for (item of items(); track $index; let i = $index) {
        <li class="lnb-item" role="none" [class.active]="item.expanded">
          @if (item.subItems) {
            <button
              type="button"
              class="lnb-btn lnb-toggle"
              role="menuitem"
              [class.active]="item.expanded"
              [attr.aria-controls]="menuId(i)"
              [attr.aria-expanded]="item.expanded ? 'true' : 'false'"
              (click)="toggleItem(i)"
            >
              {{ item.text }}
            </button>
            <div class="lnb-submenu">
              <ul role="menu" [id]="menuId(i)">
                @for (sub of item.subItems; track $index; let j = $index) {
                  <li class="lnb-subitem" role="none" [class.active]="sub.expanded">
                    @if (sub.subItems) {
                      <button
                        #trigger
                        type="button"
                        class="lnb-btn lnb-toggle-popup"
                        role="menuitem"
                        aria-haspopup="true"
                        [attr.aria-controls]="menuId(i, j)"
                        [attr.aria-expanded]="sub.expanded ? 'true' : 'false'"
                        (click)="togglePopup(i, j, popup, title)"
                      >
                        {{ sub.text }}
                      </button>
                      <!-- KRDS 원본은 이 div가 role="menu"라 제목 버튼·ul이 메뉴 안에 섞인다.
                           div는 바깥 메뉴 안에 둘 수 있는 group으로, 메뉴는 ul로 옮겨 항목이 메뉴에 바로 속하게 한다 -->
                      <div
                        #popup
                        class="lnb-submenu-lv2"
                        role="group"
                        [attr.aria-label]="sub.popupTitle || sub.text"
                        [class.active]="sub.expanded"
                        (focusout)="onPopupFocusout($event, i, j, popup, trigger)"
                      >
                        <button #title type="button" class="lnb-btn-tit" role="menuitem" (click)="closePopup(i, j, trigger)">
                          {{ sub.popupTitle || sub.text }}
                        </button>
                        <ul role="menu" [id]="menuId(i, j)" [attr.aria-label]="sub.popupTitle || sub.text">
                          @for (link of sub.subItems; track $index) {
                            <li role="none">
                              <a
                                class="lnb-btn"
                                role="menuitem"
                                [href]="link.href || '#'"
                                (click)="itemClick.emit({ item: link, event: $event })"
                              >
                                {{ link.text }}
                              </a>
                            </li>
                          }
                        </ul>
                      </div>
                    } @else {
                      <a
                        class="lnb-btn lnb-link"
                        role="menuitem"
                        [href]="sub.href || '#'"
                        (click)="itemClick.emit({ item: sub, event: $event })"
                      >
                        {{ sub.text }}
                      </a>
                    }
                  </li>
                }
              </ul>
            </div>
          } @else {
            <a class="lnb-btn lnb-link" role="menuitem" [href]="item.href || '#'" (click)="itemClick.emit({ item, event: $event })">
              {{ item.text }}
            </a>
          }
        </li>
      }
    </ul>
  `
})
export class KrdsSideNavigation {
  /** 메뉴 제목 (title 속성은 기본 툴팁이 되므로 heading으로 받음) */
  readonly heading = input.required<string>()
  /** 메뉴 항목 (expanded로 펼침 상태) */
  readonly items = model<KrdsSideNavItem[]>([])

  /** 링크를 클릭했을 때 */
  readonly itemClick = output<KrdsSideNavClick>()

  private readonly uid = nextId++
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement

  protected menuId(i: number, j?: number) {
    return j === undefined ? `krds-lnb-${this.uid}-${i}` : `krds-lnb-${this.uid}-${i}-${j}`
  }

  private updateSub(i: number, j: number, update: (sub: KrdsSideNavSubItem) => KrdsSideNavSubItem) {
    this.items.update(items =>
      items.map((item, index) =>
        index === i && item.subItems
          ? { ...item, subItems: item.subItems.map((sub, subIndex) => (subIndex === j ? update(sub) : sub)) }
          : item
      )
    )
  }

  /** 2단계 펼치고 접기 (접으면 그 안의 팝업도 닫음) */
  protected toggleItem(i: number) {
    this.items.update(items =>
      items.map((item, index) => {
        if (index !== i || !item.subItems) return item
        const expanded = !item.expanded
        return { ...item, expanded, subItems: expanded ? item.subItems : item.subItems.map(sub => ({ ...sub, expanded: false })) }
      })
    )
  }

  /** 3단계 팝업 열고 닫기 (열면 전환이 끝난 뒤 제목 버튼으로 초점) */
  protected togglePopup(i: number, j: number, popup: HTMLElement, title: HTMLElement) {
    const opening = !this.items()[i].subItems?.[j].expanded
    this.updateSub(i, j, sub => ({ ...sub, expanded: opening }))
    if (!opening) return
    popup.addEventListener('transitionend', () => title.focus(), { once: true })
    // 전환이 없으면(transition: none 등) transitionend가 오지 않으므로 그린 뒤 바로 초점
    requestAnimationFrame(() => {
      if (!popup.getAnimations({ subtree: true }).length) title.focus()
    })
  }

  /** 팝업 닫고 연 버튼으로 초점 */
  protected closePopup(i: number, j: number, trigger: HTMLElement) {
    if (!this.items()[i].subItems?.[j].expanded) return
    this.updateSub(i, j, sub => ({ ...sub, expanded: false }))
    requestAnimationFrame(() => {
      // 초점이 갈 곳을 잃었거나(숨겨진 팝업 안) 같은 항목 안에 있을 때만 돌려주고, 다른 곳으로 옮겨 간 초점은 빼앗지 않는다
      const active = this.host.ownerDocument.activeElement
      if (!active || active === this.host.ownerDocument.body || trigger.parentElement?.contains(active)) trigger.focus()
    })
  }

  protected onPopupFocusout(event: FocusEvent, i: number, j: number, popup: HTMLElement, trigger: HTMLElement) {
    if (!popup.contains(event.relatedTarget as Node | null)) this.closePopup(i, j, trigger)
  }
}
