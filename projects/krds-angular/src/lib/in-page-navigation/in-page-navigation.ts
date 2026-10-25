import { Component, DOCUMENT, DestroyRef, Directive, afterNextRender, booleanAttribute, inject, input, output, signal } from '@angular/core'

/** 콘텐츠 내 탐색 항목 */
export interface KrdsInPageNavItem {
  /** 같은 페이지의 #id (또는 다른 주소) */
  href: string
  text: string
  /** 처음 활성 항목 (autoActive가 아니면 계속 활성 표시) */
  active?: boolean
}

/** 콘텐츠 내 탐색 항목 클릭 이벤트 */
export interface KrdsInPageNavClick {
  item: KrdsInPageNavItem
  event: MouseEvent | KeyboardEvent
}

/** 콘텐츠 내 탐색 아래쪽 버튼 영역 (`<div krdsInPageAction>`) */
@Directive({
  selector: '[krdsInPageAction]',
  host: { class: 'in-page-navigation-action' }
})
export class KrdsInPageAction {}

/**
 * KRDS 콘텐츠 내 탐색. #id 항목을 누르면 고정 헤더 높이만큼 비켜 부드럽게 스크롤하고, 키보드로 누르면 그 섹션의 제목으로 초점을 옮긴다.
 * autoActive면 스크롤 위치에 따라 현재 섹션을 표시한다 (aria-current). 아래쪽 버튼 등은 `[krdsInPageAction]` 요소로 넣는다
 *
 * @example <krds-in-page-navigation heading="전입 신고" [items]="[{ href: '#target', text: '신청 대상' }, { href: '#docs', text: '구비 서류' }]" />
 */
@Component({
  selector: 'krds-in-page-navigation',
  host: { class: 'krds-in-page-navigation-type' },
  template: `
    <div class="krds-in-page-navigation-area">
      @if (caption() || heading()) {
        <div class="in-page-navigation-header">
          @if (caption()) {
            <p class="quick-caption">{{ caption() }}</p>
          }
          @if (heading()) {
            <p class="quick-title">{{ heading() }}</p>
          }
        </div>
      }
      <nav class="in-page-navigation-list" [attr.aria-label]="caption() || heading()">
        <ul>
          @for (item of items(); track item.href) {
            <li>
              <a
                [href]="item.href"
                [class.active]="isActive(item)"
                [attr.aria-current]="isActive(item) ? 'true' : null"
                (click)="select(item, $event)"
                (keydown.enter)="onKey(item, $event)"
                (keydown.space)="onKey(item, $event)"
              >
                {{ item.text }}
              </a>
            </li>
          }
        </ul>
      </nav>
      <ng-content select="[krdsInPageAction]" />
    </div>
  `
})
export class KrdsInPageNavigation {
  /** 페이지 제목 (title 속성은 기본 툴팁이 되므로 heading으로 받음) */
  readonly heading = input<string>()
  /** 머리 문구 */
  readonly caption = input('이 페이지의 구성')
  /** 항목 */
  readonly items = input<KrdsInPageNavItem[]>([])
  /** 스크롤 위치에 따라 현재 섹션 표시 */
  readonly autoActive = input(true, { transform: booleanAttribute })
  /** 스크롤할 때 비켜 갈 고정 헤더 요소들 */
  readonly headerTopSelector = input('#krds-masthead')
  readonly headerInnerSelector = input('#krds-header .header-in')

  /** 항목을 눌렀을 때 */
  readonly itemClick = output<KrdsInPageNavClick>()

  private readonly document = inject(DOCUMENT)
  private readonly activeHref = signal('')

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const items = this.items()
      this.activeHref.set((items.find(item => item.active) ?? items[0])?.href ?? '')
      if (!this.autoActive()) return
      const onScroll = () => this.updateActive()
      this.updateActive()
      window.addEventListener('scroll', onScroll, { passive: true })
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll))
    })
  }

  protected isActive(item: KrdsInPageNavItem) {
    return this.activeHref() === item.href || (!this.autoActive() && !!item.active)
  }

  protected onKey(item: KrdsInPageNavItem, event: Event) {
    event.preventDefault()
    this.select(item, event as KeyboardEvent)
  }

  protected select(item: KrdsInPageNavItem, event: MouseEvent | KeyboardEvent) {
    this.itemClick.emit({ item, event })
    if (!item.href.startsWith('#')) return
    event.preventDefault()
    const target = this.document.querySelector(item.href)
    if (!target) return
    const headerHeight = [this.headerTopSelector(), this.headerInnerSelector()].reduce(
      (sum, selector) => sum + (this.document.querySelector<HTMLElement>(selector)?.clientHeight ?? 0),
      0
    )
    window.scrollTo({ left: 0, top: target.getBoundingClientRect().top + window.scrollY - headerHeight, behavior: 'smooth' })
    this.activeHref.set(item.href)
    // 키보드로 이동하면 섹션 제목으로 초점을 옮겨 이어서 읽게 한다
    if (event instanceof KeyboardEvent) {
      const heading = target.querySelector<HTMLElement>('.sec-tit, h1, h2, h3, h4, h5, h6')
      heading?.setAttribute('tabindex', '-1')
      heading?.focus({ preventScroll: true })
    }
  }

  /** 스크롤 위치로 현재 섹션 (끝까지 내리면 마지막, 첫 섹션 위면 첫 섹션) */
  private updateActive() {
    const sections = this.items()
      .filter(item => item.href.startsWith('#'))
      .map(item => ({ href: item.href, el: this.document.querySelector<HTMLElement>(item.href) }))
      .filter((section): section is { href: string; el: HTMLElement } => !!section.el)
    if (!sections.length) return
    const { scrollY, innerHeight } = window
    const topOffset = Math.ceil(innerHeight / 5)
    let active = ''
    if (scrollY + innerHeight >= this.document.body.scrollHeight) active = sections[sections.length - 1].href
    else if (scrollY <= sections[0].el.offsetTop) active = sections[0].href
    else
      active =
        sections.find(({ el }) => scrollY > el.offsetTop - topOffset && scrollY <= el.offsetTop - topOffset + el.offsetHeight)?.href ?? ''
    if (active) this.activeHref.set(active)
  }
}
