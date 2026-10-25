import {
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
  signal,
  viewChild,
  Injector
} from '@angular/core'

/** 툴팁 버튼 형태: default는 작은 텍스트 버튼, icon은 아이콘 버튼, button은 일반 버튼 */
export type KrdsTooltipType = 'default' | 'icon' | 'button'

let nextId = 0

/**
 * KRDS 툴팁. 버튼에 마우스를 올리거나 초점을 주면 설명을 보여 주고, 떠나거나 Esc·스크롤·화면 크기 변경이면 숨긴다.
 * 버튼 이름은 버튼 글자와 설명을 합친 것(aria-labelledby)이라 아이콘 버튼도 설명으로 이름을 얻는다
 *
 * @example <krds-tooltip content="신청 후 3일 안에 처리됩니다">처리 기간 <i class="svg-icon ico-angle right"></i></krds-tooltip>
 */
@Component({
  selector: 'krds-tooltip',
  host: {
    '(document:keydown.escape)': 'hide()',
    '(window:scroll)': 'hide()',
    '(window:resize)': 'hide()'
  },
  template: `
    <button
      #button
      type="button"
      [class]="buttonClass()"
      [disabled]="disabled()"
      [attr.aria-labelledby]="popoverId"
      (mouseover)="show()"
      (mouseout)="hide()"
      (focusin)="show()"
      (focusout)="hide()"
    >
      <ng-content />
    </button>
    <div
      #popover
      class="krds-tooltip-popover"
      role="tooltip"
      [id]="popoverId"
      [class]="popoverClass()"
      [style]="popoverStyle()"
      [attr.aria-hidden]="!visible()"
    >
      <span class="sr-only">{{ buttonText() }}</span> {{ content() }}
    </div>
  `
})
export class KrdsTooltip {
  /** 설명 */
  readonly content = input.required<string>()
  /** 버튼 형태 */
  readonly type = input<KrdsTooltipType>('default')
  /** 위아래로 펼침 */
  readonly vertical = input(false, { transform: booleanAttribute })
  /** 상자형 */
  readonly box = input(false, { transform: booleanAttribute })
  /** 비활성화 */
  readonly disabled = input(false, { transform: booleanAttribute })

  protected readonly popoverId = `krds-tooltip-${nextId++}`
  protected readonly visible = signal(false)
  protected readonly buttonText = signal('')
  private readonly position = signal<{ style: Record<string, string>; classes: string[] }>({ style: {}, classes: [] })
  private readonly button = viewChild.required<ElementRef<HTMLButtonElement>>('button')
  private readonly popover = viewChild.required<ElementRef<HTMLElement>>('popover')
  private readonly injector = inject(Injector)

  protected readonly buttonClass = computed(() => {
    const type = this.type()
    return [
      'krds-btn krds-tooltip',
      type === 'default' ? 'small text' : type === 'icon' ? 'icon' : '',
      !this.box() && this.vertical() && 'tooltip-vertical',
      this.box() && !this.vertical() && 'tooltip-box'
    ]
      .filter(Boolean)
      .join(' ')
  })

  protected readonly popoverClass = computed(() =>
    [
      'krds-tooltip-popover',
      ...this.position().classes,
      this.box() && 'tooltip-box',
      this.vertical() && 'tooltip-vertical',
      this.visible() && 'active'
    ]
      .filter(Boolean)
      .join(' ')
  )

  protected readonly popoverStyle = computed(() => ({ ...this.position().style, display: this.visible() ? null : 'none' }))

  constructor() {
    // 설명 앞에 버튼 글자를 붙여 버튼 이름이 '글자 + 설명'이 되게 한다
    afterNextRender(() => this.buttonText.set(this.button().nativeElement.textContent?.trim() ?? ''))
  }

  protected show() {
    if (this.disabled() || !this.content()) return
    this.visible.set(true)
    afterNextRender(() => this.updatePosition(), { injector: this.injector })
  }

  protected hide() {
    if (!this.visible()) return
    this.visible.set(false)
    this.position.set({ style: {}, classes: [] })
  }

  /** 버튼 위치와 화면 가운데를 기준으로 위·아래·좌·우를 정한다 (모바일·상자형·세로형은 위아래) */
  private updatePosition() {
    const gap = 12
    const { clientHeight: height, clientWidth: width } = this.popover().nativeElement
    const { top, left, right, height: itemHeight, width: itemWidth } = this.button().nativeElement.getBoundingClientRect()
    const halfWidth = window.innerWidth / 2
    const classes: string[] = []
    let tooltipTop: number
    let tooltipLeft: number
    if (window.innerWidth <= 768 || this.box() || this.vertical()) {
      if (top + itemHeight > window.innerHeight / 2) {
        tooltipTop = top - height - gap
        classes.push('top')
      } else {
        tooltipTop = top + itemHeight + gap
        classes.push('bottom')
      }
      if (left + itemWidth > halfWidth) {
        tooltipLeft = right - width
        if (window.innerWidth - (left + itemWidth) > width / 2) tooltipLeft = left + (itemWidth - width) / 2
        else classes.push('right')
      } else {
        tooltipLeft = left + (itemWidth - width) / 2
        if (tooltipLeft < 0) {
          tooltipLeft = left
          classes.push('left')
        }
      }
    } else {
      tooltipTop = top + (itemHeight - height) / 2
      if (left + itemWidth > halfWidth) {
        tooltipLeft = left - width - gap
        classes.push('right')
      } else {
        tooltipLeft = right + gap
      }
    }
    const small = window.innerWidth <= 420
    this.position.set({
      style: { top: `${tooltipTop}px`, left: small ? '50%' : `${tooltipLeft}px`, transform: small ? 'translateX(-50%)' : 'none' },
      classes
    })
  }
}
