import { Component, Directive, TemplateRef, booleanAttribute, computed, contentChildren, inject, input, model } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

/** 탭 */
export interface KrdsTabItem {
  /** 탭 id (패널의 krdsTabPanel과 같게) */
  id: string
  /** 탭 이름 */
  label: string
  /** 비활성화 */
  disabled?: boolean
}

/** 탭 스타일 */
export type KrdsTabsVariant = 'line' | 'fill'

/** 탭 패널 내용 (`<ng-template krdsTabPanel="탭 id">`) */
@Directive({ selector: 'ng-template[krdsTabPanel]' })
export class KrdsTabPanel {
  /** 패널이 속한 탭 id */
  readonly id = input.required<string>({ alias: 'krdsTabPanel' })
  readonly template = inject(TemplateRef)
}

let nextId = 0

/**
 * KRDS 탭. 탭 목록은 `tabs`로, 패널 내용은 탭 id별 `<ng-template krdsTabPanel>`으로 넣는다.
 * 선택한 탭 id는 `[(selected)]`로 주고받고(없으면 첫 활성 탭), 방향키(←·→)로 탭 사이 초점을 옮긴다
 *
 * @example
 * <krds-tabs [tabs]="[{ id: 'notice', label: '공지' }, { id: 'faq', label: '자주 묻는 질문' }]" [(selected)]="tab">
 *   <ng-template krdsTabPanel="notice">공지 목록</ng-template>
 *   <ng-template krdsTabPanel="faq">질문 목록</ng-template>
 * </krds-tabs>
 */
@Component({
  selector: 'krds-tabs',
  imports: [NgTemplateOutlet],
  host: { class: 'krds-tab-area layer' },
  template: `
    <div class="tab" [class]="variant()" [class.full]="full()">
      <ul role="tablist">
        @for (tab of tabs(); track tab.id) {
          <!-- KRDS 원본은 li에 role="tab"을 두지만, 초점을 받는 button에 두어야 탭 안에 버튼이 겹치지 않는다 (WAI-ARIA 탭 패턴) -->
          <li role="presentation" [class.active]="tab.id === active()">
            <button
              type="button"
              class="btn-tab"
              role="tab"
              [id]="tabId(tab.id)"
              [attr.aria-selected]="tab.id === active()"
              [attr.aria-controls]="panelId(tab.id)"
              [disabled]="tab.disabled"
              (click)="select(tab)"
              (keydown)="onKeydown($event)"
            >
              {{ tab.label }}
              @if (tab.id === active()) {
                <i class="sr-only"> {{ selectedText() }}</i>
              }
            </button>
          </li>
        }
      </ul>
    </div>
    <div class="tab-conts-wrap">
      @for (tab of tabs(); track tab.id) {
        <section
          class="tab-conts"
          role="tabpanel"
          [class.active]="tab.id === active()"
          [id]="panelId(tab.id)"
          [attr.aria-labelledby]="tabId(tab.id)"
        >
          <ng-container [ngTemplateOutlet]="panelOf(tab.id)" />
        </section>
      }
    </div>
  `
})
export class KrdsTabs {
  /** 탭 목록 */
  readonly tabs = input.required<KrdsTabItem[]>()
  /** 선택한 탭 id */
  readonly selected = model<string>()
  /** 스타일 */
  readonly variant = input<KrdsTabsVariant>('line')
  /** 탭을 전체 폭으로 나눔 */
  readonly full = input(false, { transform: booleanAttribute })
  /** 선택한 탭을 화면낭독기에 알리는 문구 */
  readonly selectedText = input('선택됨')

  private readonly uid = nextId++
  private readonly panels = contentChildren(KrdsTabPanel)

  protected readonly active = computed(() => this.selected() ?? this.tabs().find(tab => !tab.disabled)?.id)

  protected tabId(id: string) {
    return `krds-tab-${this.uid}-${id}`
  }

  protected panelId(id: string) {
    return `krds-tab-panel-${this.uid}-${id}`
  }

  protected panelOf(id: string) {
    return this.panels().find(panel => panel.id() === id)?.template ?? null
  }

  protected select(tab: KrdsTabItem) {
    if (!tab.disabled && tab.id !== this.active()) this.selected.set(tab.id)
  }

  protected onKeydown(event: KeyboardEvent) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const item = (event.currentTarget as HTMLElement).parentElement
    const sibling = event.key === 'ArrowRight' ? item?.nextElementSibling : item?.previousElementSibling
    sibling?.querySelector('button')?.focus()
  }
}
