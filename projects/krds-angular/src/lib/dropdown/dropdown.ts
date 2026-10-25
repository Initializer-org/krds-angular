import { Directive, ElementRef, afterRenderEffect, computed, inject, input, model, signal, untracked } from '@angular/core'

/** 드롭다운 메뉴 위치 (center는 넘치면 자동으로 좌우를 맞춤) */
export type KrdsDropdownPosition = 'center' | 'left' | 'right'

/**
 * KRDS 드롭다운. KRDS 마크업(.drop-btn 버튼과 .drop-menu)에 붙이면 버튼으로 열고 닫고(aria-expanded),
 * Esc는 닫고 버튼으로 초점을 돌려주며, 바깥 클릭·초점 이탈로 닫는다. 메뉴가 화면 밖으로 넘치면 좌우 위치를 맞춘다
 *
 * @example
 * <div krdsDropdown>
 *   <button type="button" class="krds-btn small text drop-btn">메뉴명 <i class="svg-icon ico-toggle"></i></button>
 *   <div class="drop-menu"><div class="drop-in"><ul class="drop-list"><li><a href="/a" class="item-link">메뉴</a></li></ul></div></div>
 * </div>
 */
@Directive({
  selector: '[krdsDropdown]',
  exportAs: 'krdsDropdown',
  host: {
    class: 'krds-drop-wrap',
    '[class.active]': 'open()',
    '[class.drop-left]': "side() === 'left'",
    '[class.drop-right]': "side() === 'right'",
    '(click)': 'onClick($event)',
    '(focusin)': 'onFocusin($event)',
    '(focusout)': 'onFocusout($event)',
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'open() && close(true)'
  }
})
export class KrdsDropdown {
  /** 열림 */
  readonly open = model(false)
  /** 메뉴 위치 */
  readonly position = input<KrdsDropdownPosition>('center')

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly autoSide = signal<'left' | 'right' | null>(null)
  protected readonly side = computed(() => (this.position() === 'center' ? this.autoSide() : this.position()))

  constructor() {
    // KRDS CSS는 .drop-menu를 숨겨 두기만 하므로 열림에 맞춰 보이고, 버튼 상태를 맞춘다 (브라우저에서만)
    afterRenderEffect(() => {
      const open = this.open()
      untracked(() => {
        const menu = this.host.querySelector<HTMLElement>('.drop-menu')
        const button = this.button()
        if (menu) menu.style.display = open ? 'block' : 'none'
        button?.setAttribute('aria-expanded', String(open))
        button?.classList.toggle('active', open)
        if (!open || !menu || this.position() !== 'center') return
        const rect = menu.getBoundingClientRect()
        this.autoSide.set(rect.left < 0 ? 'left' : window.innerWidth < rect.right ? 'right' : null)
      })
    })
  }

  private button() {
    return this.host.querySelector<HTMLElement>('.drop-btn')
  }

  /** 열고 닫기 */
  toggle() {
    this.open.set(!this.open())
  }

  /** 닫기 (returnFocus면 버튼으로 초점) */
  close(returnFocus = false) {
    this.open.set(false)
    if (returnFocus) this.button()?.focus()
  }

  protected onClick(event: MouseEvent) {
    const button = (event.target as Element).closest('.drop-btn')
    if (button && this.host.contains(button)) this.toggle()
  }

  /** 원본처럼 초점을 받은 항목을 위로 올려 초점 테두리가 이웃 항목에 가리지 않게 한다 */
  protected onFocusin(event: FocusEvent) {
    const item = (event.target as Element).closest<HTMLElement>('.drop-list .item-link')
    if (!item) return
    this.host.querySelectorAll<HTMLElement>('.drop-list .item-link').forEach(link => {
      link.style.position = 'relative'
      link.style.zIndex = link === item ? '1' : '0'
    })
  }

  /** 초점이 밖으로 옮겨 가면 닫는다. 갈 곳 없이 빠진 초점(다른 창으로 전환 등)은 무시하고, 빈 곳 클릭은 문서 클릭으로 닫는다 */
  protected onFocusout(event: FocusEvent) {
    const next = event.relatedTarget as Node | null
    if (this.open() && next && !this.host.contains(next)) this.close()
  }

  protected onDocumentClick(event: MouseEvent) {
    if (this.open() && !this.host.contains(event.target as Node)) this.close()
  }
}
