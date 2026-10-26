import { Component, DOCUMENT, DestroyRef, ElementRef, afterNextRender, inject, input, model, signal, viewChild } from '@angular/core'

/** 콘텐츠 내 탐색 위치에 쓰는 버튼 아래쪽 끝 값을 마지막으로 쓴 패널 */
let buttonBottomOwner: symbol | null = null

/**
 * KRDS 도움 패널. 도움말 버튼으로 오른쪽 패널을 열고, 접어두기로 닫는다 (`[(open)]`).
 * 원본처럼 보이는 공식 배너·헤더 높이만큼 버튼과 패널 내용을 내려 헤더에 가려지지 않게 하고,
 * 같은 오른쪽에 고정되는 콘텐츠 내 탐색이 버튼 아래에 서도록 버튼 아래쪽 끝을 CSS 변수로 알린다
 *
 * @example <krds-panel [(open)]="helpOpen"><krds-tabs [tabs]="tabs">...</krds-tabs></krds-panel>
 */
@Component({
  selector: 'krds-panel',
  host: {
    class: 'inner help-panel-flexible',
    '[style.--krds-help-panel--header-offset]': "headerOffset() + 'px'"
  },
  template: `
    <button
      #expand
      type="button"
      class="krds-btn small tertiary btn-help-panel expand btn-help-exec"
      (transitionend)="updateOffset()"
      (click)="open.set(true)"
    >
      <i class="svg-icon ico-fold"></i> 도움말
    </button>
    <div class="krds-help-panel" [class.expand]="open()">
      <div class="help-panel-wrap">
        <div class="help-conts-area">
          <ng-content />
          <button type="button" class="krds-btn small tertiary btn-help-panel fold" (click)="close()">
            <span class="sr-only">도움말</span> 접어두기 <i class="svg-icon ico-angle right"></i>
          </button>
        </div>
      </div>
    </div>
  `
})
export class KrdsPanel {
  /** 열림 */
  readonly open = model(false)
  /** 높이만큼 비켜 갈 공식 배너·헤더 */
  readonly headerTopSelector = input('#krds-masthead')
  readonly headerInnerSelector = input('#krds-header .header-in')

  protected readonly headerOffset = signal(0)
  private readonly expand = viewChild.required<ElementRef<HTMLButtonElement>>('expand')
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly document = inject(DOCUMENT)
  private readonly owner = Symbol('KrdsPanel')
  private frame = 0

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const update = () => this.updateOffset()
      update()
      window.addEventListener('scroll', update, { passive: true })
      window.addEventListener('resize', update)
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(this.frame)
        window.removeEventListener('scroll', update)
        window.removeEventListener('resize', update)
        // 다른 패널이 쓴 값은 남겨 둔다
        if (buttonBottomOwner === this.owner) this.document.documentElement.style.removeProperty('--krds-help-panel--button-bottom')
      })
    })
  }

  /** 닫고, 패널 안에 있던 초점은 도움말 버튼으로 돌려준다 */
  protected close() {
    const focusInside = this.host.querySelector('.krds-help-panel')?.contains(this.document.activeElement)
    this.open.set(false)
    if (focusInside) this.expand().nativeElement.focus()
  }

  protected updateOffset() {
    cancelAnimationFrame(this.frame)
    // 레이아웃이 같은 스크롤 이벤트에서 붙이는 scroll-down 클래스를 반영한 뒤 잰다
    this.frame = requestAnimationFrame(() => {
      const masthead = this.document.querySelector<HTMLElement>(this.headerTopSelector())
      const header = this.document.querySelector<HTMLElement>(this.headerInnerSelector())
      const mastheadShown = !!masthead && masthead.getBoundingClientRect().bottom > 0
      const headerHidden = !!this.document.querySelector('.g-wrap.scroll-down')
      const offset = !header ? 0 : mastheadShown ? masthead.offsetHeight + header.offsetHeight : headerHidden ? 0 : header.offsetHeight
      this.headerOffset.set(offset)
      const button = this.expand().nativeElement
      const bottom = parseFloat(getComputedStyle(button).top) + offset + button.offsetHeight
      if (Number.isFinite(bottom)) {
        this.document.documentElement.style.setProperty('--krds-help-panel--button-bottom', `${bottom}px`)
        buttonBottomOwner = this.owner
      }
    })
  }
}
