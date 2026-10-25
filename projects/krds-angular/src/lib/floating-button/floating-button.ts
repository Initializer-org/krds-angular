import { Component, DOCUMENT, ElementRef, booleanAttribute, computed, inject, input, output, signal, viewChild } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

/** 플로팅 버튼 항목 (단일형 버튼·확장형 항목 공통) */
export interface KrdsFloatingButtonItem {
  /** 버튼 이름 (레이블) */
  label: string
  /** 아이콘 클래스 (예: 'ico-faq') */
  icon: string
  /** 링크 주소 (없으면 버튼으로 렌더링) */
  href?: string
  /** 링크를 새 창으로 열기 ('새 창 열림' 안내 포함) */
  external?: boolean
}

/** 확장형 항목 선택 이벤트 (링크 항목은 event.preventDefault()로 라우터 이동 가능) */
export interface KrdsFloatingButtonSelect {
  item: KrdsFloatingButtonItem
  index: number
  event: MouseEvent
}

let nextId = 0

/**
 * KRDS 플로팅 버튼. 화면에서 가장 자주 쓰는 중요한 작업을 화면 오른쪽 아래에 고정해 보여 준다.
 * `items`가 없으면 단일형(아이콘 + 레이블, 클릭은 기본 `(click)`으로 받음),
 * 있으면 확장형(+ 버튼으로 항목을 펼치고 X로 닫음, 선택은 `(itemSelect)`)이다
 *
 * @example
 * <krds-floating-button label="채팅 상담" icon="ico-faq" (click)="openChat()" />
 * <krds-floating-button label="상담 메뉴" [items]="items" (itemSelect)="onSelect($event)" />
 */
@Component({
  selector: 'krds-floating-button',
  imports: [NgTemplateOutlet],
  host: {
    class: 'krds-floating-button',
    '[class.expand]': '!!items()',
    '[class.active]': 'open()',
    '(focusout)': 'onFocusout($event)',
    // Safari 등은 버튼을 클릭해도 초점을 주지 않으므로 Esc는 문서 전체에서 받는다
    '(document:keydown.escape)': 'open() && close(true)'
  },
  template: `
    @if (items(); as items) {
      @if (open()) {
        <div class="floating-dim" aria-hidden="true" (click)="close()"></div>
      }
      <button
        #toggle
        type="button"
        class="floating-toggle"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="listId"
        (click)="open.set(!open())"
      >
        <span class="floating-icon"><i class="svg-icon ico-plus" aria-hidden="true"></i></span>
        <span class="sr-only">{{ label() }}</span>
      </button>
      <!-- .floating-list가 display: flex라 hidden 속성 대신 인라인 display로 숨긴다 -->
      <ul class="floating-list" [id]="listId" [style.display]="open() ? null : 'none'">
        @for (item of items; track $index) {
          <li>
            <ng-container *ngTemplateOutlet="action; context: { $implicit: item, index: $index }" />
          </li>
        }
      </ul>
    } @else {
      <ng-container *ngTemplateOutlet="action; context: { $implicit: single(), hideLabel: hideLabel() }" />
    }

    <ng-template #action let-item let-index="index" let-hideLabel="hideLabel">
      @if (item.href) {
        <a
          class="floating-action"
          [href]="item.href"
          [attr.target]="item.external ? '_blank' : null"
          [attr.rel]="item.external ? 'noopener noreferrer' : null"
          [attr.title]="item.external ? '새 창 열림' : null"
          (click)="onAction(item, index, $event)"
        >
          <ng-container *ngTemplateOutlet="content; context: { $implicit: item, hideLabel }" />
        </a>
      } @else {
        <button type="button" class="floating-action" (click)="onAction(item, index, $event)">
          <ng-container *ngTemplateOutlet="content; context: { $implicit: item, hideLabel }" />
        </button>
      }
    </ng-template>

    <ng-template #content let-item let-hideLabel="hideLabel">
      <span class="floating-icon"><i class="svg-icon" [class]="item.icon" aria-hidden="true"></i></span>
      <span [class]="hideLabel ? 'sr-only' : 'floating-label'">{{ item.label }}</span>
    </ng-template>
  `
})
export class KrdsFloatingButton {
  /** 단일형 버튼의 레이블, 확장형은 확장 버튼의 이름 (화면에는 숨김) */
  readonly label = input.required<string>()
  /** 단일형 버튼의 아이콘 클래스 */
  readonly icon = input('ico-plus')
  /** 단일형 버튼의 링크 주소 */
  readonly href = input<string>()
  /** 단일형 링크를 새 창으로 열기 ('새 창 열림' 안내 포함) */
  readonly external = input(false, { transform: booleanAttribute })
  /** 단일형 레이블을 화면에서 숨김 (아이콘만 표시, 화면낭독기는 읽음) */
  readonly hideLabel = input(false, { transform: booleanAttribute })
  /** 확장형 항목 (지정하면 확장형, 3개 이하 권장) */
  readonly items = input<KrdsFloatingButtonItem[]>()

  /** 확장형 항목을 선택했을 때 */
  readonly itemSelect = output<KrdsFloatingButtonSelect>()

  protected readonly open = signal(false)
  protected readonly listId = `krds-floating-list-${nextId++}`
  protected readonly single = computed<KrdsFloatingButtonItem>(() => ({
    label: this.label(),
    icon: this.icon(),
    href: this.href(),
    external: this.external()
  }))

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly document = inject(DOCUMENT)
  private readonly toggle = viewChild<ElementRef<HTMLButtonElement>>('toggle')

  // 초점은 바로 옮긴다: itemSelect 핸들러가 모달을 열거나 다른 곳으로 초점을 옮기면 그쪽이 이긴다
  protected close(returnFocus = false) {
    this.open.set(false)
    if (returnFocus) this.toggle()?.nativeElement.focus()
  }

  // Tab으로 초점이 바깥으로 나가면 닫는다 (relatedTarget이 없는 클릭은 가림막 클릭으로 처리)
  protected onFocusout(event: FocusEvent) {
    const next = event.relatedTarget as Node | null
    if (next && !this.host.nativeElement.contains(next)) this.close()
  }

  protected onAction(item: KrdsFloatingButtonItem, index: number | undefined, event: MouseEvent) {
    // 단일형 클릭은 기본 click 이벤트가 그대로 바깥으로 전달된다
    if (index === undefined) return

    // 먼저 초점을 확장 버튼으로 돌려준 뒤 알린다 (tel:·mailto:처럼 페이지에 남는 링크 포함)
    this.close(true)
    this.itemSelect.emit({ item, index, event })

    // 같은 페이지의 실제 대상(#id)으로 이동하는 링크면 초점을 놓아, 브라우저가 대상 위치에서 탐색을 잇게 한다.
    // 핸들러가 이동을 취소했거나(preventDefault) 대상이 없거나(#/route 등) 초점을 다른 곳으로 옮겼으면 그대로 둔다
    const toggle = this.toggle()?.nativeElement
    const hash = item.href?.startsWith('#') ? decodeURIComponent(item.href.slice(1)) : ''
    if (hash && !event.defaultPrevented && this.document.getElementById(hash) && this.document.activeElement === toggle) {
      toggle?.blur()
    }
  }
}
