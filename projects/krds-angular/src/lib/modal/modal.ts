import {
  Component,
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  inject,
  input,
  model
} from '@angular/core'

/** 모달 크기 */
export type KrdsModalSize = 'small' | 'medium' | 'large'

const SIZE_CLASS: Record<KrdsModalSize, string> = { small: 'modal-sm', medium: 'modal-md', large: 'modal-lg' }
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

let nextId = 0

/** 모달 아래쪽 버튼 영역 (`<div krdsModalFooter>`) */
@Directive({
  selector: '[krdsModalFooter]',
  host: { class: 'modal-btn btn-wrap' }
})
export class KrdsModalFooter {}

/**
 * KRDS 모달. `[(open)]`으로 열고 닫고, 브라우저에서는 body 끝으로 옮겨 다른 요소의 쌓임 순서에 가리지 않게 한다.
 * 열리면 내용으로 초점을 옮기고 Tab 초점을 모달 안에 가두며 배경 스크롤을 막고, 닫히면 연 요소로 초점을 돌려준다.
 * Esc·배경 클릭으로 닫히고 `persistent`면 닫기·버튼으로만 닫힌다
 *
 * @example
 * <krds-modal heading="신청을 취소할까요?" [(open)]="confirmOpen">
 *   <p>취소하면 입력한 내용이 사라집니다.</p>
 *   <div krdsModalFooter>
 *     <button krdsButton variant="tertiary" (click)="confirmOpen.set(false)">아니요</button>
 *     <button krdsButton (click)="cancel()">예</button>
 *   </div>
 * </krds-modal>
 */
@Component({
  selector: 'krds-modal',
  host: {
    '(document:keydown)': 'onKeydown($event)'
  },
  template: `
    @if (open()) {
      <section
        class="krds-modal fade in shown"
        role="dialog"
        aria-modal="true"
        [id]="id()"
        [attr.aria-labelledby]="titleId()"
        [attr.data-type]="full() ? 'full' : bottomSheet() ? 'bottom-sheet' : null"
      >
        <div class="modal-dialog" [class]="sizeClass()">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title" [id]="titleId()">{{ heading() }}</h2>
            </div>
            <div class="modal-conts" tabindex="-1">
              <div class="conts-area"><ng-content /></div>
            </div>
            <ng-content select="[krdsModalFooter]" />
            <button type="button" class="krds-btn medium icon btn-close close-modal" (click)="open.set(false)">
              <span class="sr-only">닫기</span>
              <i class="svg-icon ico-popup-close"></i>
            </button>
          </div>
        </div>
        <div class="modal-back" [class.in]="backdrop()" (click)="persistent() || open.set(false)"></div>
      </section>
    }
  `
})
export class KrdsModal {
  /** 열림 여부 */
  readonly open = model(false)
  /** 제목 (대화 상자의 이름) */
  readonly heading = input.required<string>()
  /** 대화 상자 id (없으면 자동 생성) */
  readonly modalId = input<string>()
  /** 배경을 어둡게 */
  readonly backdrop = input(true, { transform: booleanAttribute })
  /** 크기 */
  readonly size = input<KrdsModalSize>('medium')
  /** 화면 전체 */
  readonly full = input(false, { transform: booleanAttribute })
  /** 바텀시트 (모바일 아래에서 올라옴) */
  readonly bottomSheet = input(false, { transform: booleanAttribute })
  /** Esc·배경 클릭으로 닫지 않음 */
  readonly persistent = input(false, { transform: booleanAttribute })

  private readonly uid = nextId++
  protected readonly id = computed(() => this.modalId() ?? `krds-modal-${this.uid}`)
  protected readonly titleId = computed(() => `${this.id()}-title`)
  protected readonly sizeClass = computed(() => SIZE_CLASS[this.size()])

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly document = inject(DOCUMENT)
  private opened = false
  private originalOverflow = ''
  private previousFocus: HTMLElement | null = null

  constructor() {
    // 다른 요소의 쌓임 순서(z-index·transform)에 가리지 않게 body 끝으로 옮긴다 (Vue의 Teleport)
    afterNextRender(() => this.document.body.appendChild(this.host))
    inject(DestroyRef).onDestroy(() => {
      if (this.opened) this.restore()
      this.host.remove()
    })
    // 열림이 바뀐 뒤 그려진 화면 기준으로 초점·스크롤을 맞춘다 (브라우저에서만 실행)
    afterRenderEffect(() => {
      const open = this.open()
      if (open && !this.opened) {
        this.opened = true
        this.originalOverflow = this.document.body.style.overflow
        this.document.body.style.overflow = 'hidden'
        this.previousFocus = this.document.activeElement as HTMLElement | null
        this.host.querySelector<HTMLElement>('.modal-conts')?.focus()
      } else if (!open && this.opened) {
        this.restore()
      }
    })
  }

  private restore() {
    this.opened = false
    this.document.body.style.overflow = this.originalOverflow
    this.previousFocus?.focus()
    this.previousFocus = null
  }

  protected onKeydown(event: KeyboardEvent) {
    if (!this.open()) return
    if (event.key === 'Escape' && !this.persistent()) {
      this.open.set(false)
      return
    }
    if (event.key !== 'Tab') return
    const dialog = this.host.querySelector<HTMLElement>('.krds-modal')!
    const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el => !el.hasAttribute('disabled'))
    if (!focusable.length) return event.preventDefault()
    const active = this.document.activeElement as HTMLElement | null
    const index = active ? focusable.indexOf(active) : -1
    // 처음 초점을 받는 .modal-conts(목록에 없음)에서 Shift+Tab, 모달 밖으로 나간 초점도 모달 안으로 돌린다
    const wrap = event.shiftKey ? index <= 0 : index === focusable.length - 1 || !dialog.contains(active)
    if (wrap) {
      event.preventDefault()
      ;(event.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus()
    }
  }
}
