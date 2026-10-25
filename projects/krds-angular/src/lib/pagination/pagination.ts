import { Component, computed, input, model, numberAttribute } from '@angular/core'

type PageItem = { type: 'page'; page: number } | { type: 'ellipsis'; key: string }

/**
 * KRDS 페이지네이션. 현재 페이지는 `[(page)]`로 주고받는다. 처음·끝 페이지는 늘 보이고, 나머지는 현재 페이지 주변 pageRange개만 보이며 그 밖은 생략(…)으로 줄인다.
 * 링크를 눌러도 주소는 바뀌지 않는다 (기본 동작을 막고 page만 바꿈)
 *
 * @example <nav krdsPagination [max]="20" [(page)]="page"></nav>
 */
@Component({
  selector: 'nav[krdsPagination]',
  host: {
    class: 'krds-pagination',
    '[attr.aria-label]': 'label()'
  },
  template: `
    @if (current() <= minPage()) {
      <span class="page-navi prev disabled">이전</span>
    } @else {
      <a href="#" class="page-navi prev" (click)="go($event, current() - 1)">이전</a>
    }
    <div class="page-links">
      @for (item of pages(); track item.type === 'page' ? item.page : item.key) {
        @if (item.type === 'page') {
          <a
            href="#"
            class="page-link"
            [class.active]="item.page === current()"
            [attr.aria-current]="item.page === current() ? 'page' : null"
            (click)="go($event, item.page)"
          >
            @if (item.page === current()) {
              <span class="sr-only">현재페이지</span>
            }
            {{ item.page }}
          </a>
        } @else {
          <span class="page-link link-dot"></span>
        }
      }
    </div>
    @if (current() >= max()) {
      <span class="page-navi next disabled">다음</span>
    } @else {
      <a href="#" class="page-navi next" (click)="go($event, current() + 1)">다음</a>
    }
  `
})
export class KrdsPagination {
  /** 현재 페이지 */
  readonly page = model(1)
  /** 첫 페이지 */
  readonly min = input(1, { transform: numberAttribute })
  /** 마지막 페이지 */
  readonly max = input.required({ transform: numberAttribute })
  /** 가운데에 보일 페이지 수 */
  readonly pageRange = input(8, { transform: numberAttribute })
  /** 내비게이션 이름 */
  readonly label = input('페이지 내비게이션')

  protected readonly minPage = computed(() => Math.max(1, this.min()))
  protected readonly current = computed(() => this.page() ?? this.minPage())

  protected readonly pages = computed<PageItem[]>(() => {
    const total = this.max()
    const min = this.minPage()
    const range = this.pageRange()
    const pageItems = (from: number, to: number) =>
      Array.from({ length: Math.max(to - from + 1, 0) }, (_, i): PageItem => ({ type: 'page', page: from + i }))
    // 처음·끝 경계 1페이지와 가운데 range개를 모두 보일 수 있으면 생략하지 않는다
    if (total <= range + 2) return pageItems(min, total)

    const left = Math.min(1, total)
    const right = Math.max(total, 1)
    const rangeEnd = Math.min(total, Math.max(min, this.current() - Math.floor(range / 2)) + range - 1)
    const rangeStart = Math.max(min, rangeEnd - range + 1)
    const start = Math.max(rangeStart, left + 1)
    const end = Math.min(rangeEnd, right - 1)
    return [
      ...pageItems(min, left),
      ...(rangeStart > left + 1 ? [{ type: 'ellipsis', key: 'left' } as const] : []),
      ...pageItems(start, end),
      ...(rangeEnd < right - 1 ? [{ type: 'ellipsis', key: 'right' } as const] : []),
      ...pageItems(right, total)
    ]
  })

  protected go(event: MouseEvent, page: number) {
    event.preventDefault()
    if (page !== this.current()) this.page.set(page)
  }
}
