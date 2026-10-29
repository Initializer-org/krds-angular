import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core'

/** 맥락적 도움말이 펼쳐지는 위치 */
export type KrdsContextualHelpPosition = 'top left' | 'top center' | 'top right' | 'bottom left' | 'bottom center' | 'bottom right'

/** 열린 도움말의 닫기 함수 (원본처럼 하나를 열면 다른 도움말은 닫는다) */
const openHelps = new Set<() => void>()

let nextId = 0

/**
 * KRDS 맥락적 도움말. 도움말 버튼을 누르면 제목·설명·링크가 있는 팝오버를 열고 그 안의 첫 조작 요소로 초점을 옮긴다.
 * 닫기 버튼·Esc는 닫고 초점을 도움말 버튼으로 돌려주며, 바깥을 누르면 닫는다
 *
 * @example
 * <krds-contextual-help heading="신청 자격" position="bottom left">
 *   <p>만 19세 이상 국민이면 신청할 수 있습니다.</p>
 *   <div class="btn-wrap"><a class="krds-btn xsmall link basic" href="/guide">바로가기</a></div>
 * </krds-contextual-help>
 */
@Component({
  selector: 'krds-contextual-help',
  host: {
    '[class]': "'krds-contextual-help ' + position()",
    '(document:keydown.escape)': 'open() && close(true)',
    '(document:click)': 'onDocumentClick($event)',
    '(window:resize)': 'open() && adjustPosition()'
  },
  template: `
    <div #action class="tooltip-action">
      <button
        #trigger
        type="button"
        class="krds-btn medium icon tooltip-btn"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="popoverId"
        (click)="toggle()"
      >
        <span class="sr-only">도움말</span>
        <i class="svg-icon" [class]="helpIcon() ? 'ico-help' : 'ico-tooltip'"></i>
      </button>
      <!-- KRDS 원본은 role="tooltip"이지만 안에 버튼·링크가 있으므로 제목으로 이름 붙인 비모달 대화 상자로 둔다 -->
      <div
        #popover
        class="tooltip-popover"
        role="dialog"
        [id]="popoverId"
        [attr.aria-labelledby]="popoverId + '-title'"
        [style.display]="open() ? 'block' : 'none'"
      >
        <h4 class="tooltip-title" [id]="popoverId + '-title'">{{ heading() }}</h4>
        <div class="tooltip-contents"><ng-content /></div>
        <button type="button" class="krds-btn xsmall icon tooltip-close" (click)="close(true)">
          <span class="sr-only">닫기</span>
          <i class="svg-icon ico-modal-close"></i>
        </button>
      </div>
    </div>
  `
})
export class KrdsContextualHelp {
  /** 도움말 제목 (title 속성은 기본 툴팁이 되므로 heading으로 받음) */
  readonly heading = input.required<string>()
  /** 물음표 모양 도움 아이콘 (기본은 정보 아이콘) */
  readonly helpIcon = input(false, { transform: booleanAttribute })
  /** 펼쳐지는 위치 */
  readonly position = input<KrdsContextualHelpPosition>('top left')

  protected readonly open = signal(false)
  protected readonly popoverId = `krds-contextual-help-${nextId++}`
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger')
  private readonly popover = viewChild.required<ElementRef<HTMLElement>>('popover')
  private readonly action = viewChild.required<ElementRef<HTMLElement>>('action')
  private readonly document = inject(DOCUMENT)
  private readonly injector = inject(Injector)
  private readonly closeOthers = () => this.close(false)

  constructor() {
    inject(DestroyRef).onDestroy(() => openHelps.delete(this.closeOthers))
  }

  protected toggle() {
    if (this.open()) return this.close(false)
    openHelps.forEach(close => close())
    openHelps.add(this.closeOthers)
    this.open.set(true)
    afterNextRender(
      () => {
        this.popover().nativeElement.querySelector<HTMLElement>('a, button, [tabindex="0"], input, textarea, select')?.focus()
        this.adjustPosition()
      },
      { injector: this.injector }
    )
  }

  /** 닫기. 닫기 버튼·Esc는 초점을 도움말 버튼으로 돌려준다 (팝오버가 숨으며 초점을 잃지 않게) */
  protected close(returnFocus: boolean) {
    if (!this.open()) return
    const focusInside = this.popover().nativeElement.contains(this.document.activeElement)
    this.open.set(false)
    openHelps.delete(this.closeOthers)
    if (returnFocus || focusInside) this.trigger().nativeElement.focus()
  }

  protected onDocumentClick(event: MouseEvent) {
    if (this.open() && !this.action().nativeElement.contains(event.target as Node)) this.close(false)
  }

  /** 모바일에서는 화면 폭에 맞춰 펼친다 */
  protected adjustPosition() {
    const popover = this.popover().nativeElement
    if (window.innerWidth > 768) {
      popover.style.left = ''
      popover.style.right = ''
      popover.style.width = '360px'
      return
    }
    const paddingX = parseInt(getComputedStyle(this.document.documentElement).getPropertyValue('--krds-contents-padding-x')) || 0
    popover.style.left = `-${this.action().nativeElement.getBoundingClientRect().left - paddingX}px`
    popover.style.width = `${this.document.body.clientWidth - paddingX * 2}px`
  }
}
