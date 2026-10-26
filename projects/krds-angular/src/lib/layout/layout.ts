import {
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  inject,
  input,
  output,
  signal
} from '@angular/core'

/** 레이아웃 크기 */
export interface KrdsLayoutSize {
  width: number
  height: number
}

/** 스크롤 정보 */
export interface KrdsLayoutScroll {
  scrollY: number
  scrollHeight: number
  /** 본문(#container) 위쪽에서 50px 넘게 내려온 뒤의 스크롤 방향 (그 위에서는 null) */
  direction: 'up' | 'down' | null
}

/** 본문 위쪽에서 이만큼 내려온 뒤부터 스크롤 방향을 본다 */
const SCROLL_OFFSET = 50

/**
 * KRDS 페이지 레이아웃(.g-wrap). 본문(#container) 아래로 스크롤하면 방향에 따라 scroll-down·scroll-up 클래스를 붙여
 * KRDS CSS가 내려갈 때 헤더를 숨기고 올라올 때 보이게 한다 (도움 패널도 이 클래스를 보고 위치를 맞춤)
 *
 * @example
 * <div krdsLayout>
 *   <div krdsSkipLink>...</div>
 *   <header krdsHeader>...</header>
 *   <div id="container">...</div>
 * </div>
 */
@Directive({
  selector: '[krdsLayout]',
  host: {
    class: 'g-wrap',
    '[id]': 'id()',
    '[class.scroll-down]': "direction() === 'down'",
    '[class.scroll-up]': "direction() === 'up'"
  }
})
export class KrdsLayout {
  /** id (KRDS 기준 wrap) */
  readonly id = input('wrap')
  /** 스크롤 방향 감지 */
  readonly scrollDetection = input(true, { transform: booleanAttribute })

  /** 스크롤할 때 (resize·scroll은 기본 DOM 이벤트와 겹쳐 쓰지 않음) */
  readonly scrolled = output<KrdsLayoutScroll>()
  /** 레이아웃 크기가 바뀔 때 */
  readonly resized = output<KrdsLayoutSize>()
  /** 문서 높이가 바뀔 때 */
  readonly scrollHeightChange = output<number>()

  protected readonly direction = signal<'up' | 'down' | null>(null)
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly document = inject(DOCUMENT)
  private lastScrollY = 0
  private scrollHeight = 0

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const observer = new ResizeObserver(entries =>
        entries.forEach(({ contentRect: { width, height } }) => this.resized.emit({ width, height }))
      )
      observer.observe(this.host)
      destroyRef.onDestroy(() => observer.disconnect())
      if (!this.scrollDetection()) return
      this.scrollHeight = this.document.body.scrollHeight
      this.lastScrollY = window.scrollY
      const onScroll = () => this.onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll))
    })
  }

  private onScroll() {
    const { scrollY } = window
    const height = this.document.body.scrollHeight
    if (height !== this.scrollHeight) {
      this.scrollHeight = height
      this.scrollHeightChange.emit(height)
    }
    const container = this.document.querySelector<HTMLElement>('#container')
    if (container && scrollY > container.offsetTop + SCROLL_OFFSET) {
      if (scrollY > this.lastScrollY) this.direction.set('down')
      else if (scrollY < this.lastScrollY) this.direction.set('up')
    } else {
      this.direction.set(null)
    }
    this.lastScrollY = scrollY
    this.scrolled.emit({ scrollY, scrollHeight: height, direction: this.direction() })
  }
}
