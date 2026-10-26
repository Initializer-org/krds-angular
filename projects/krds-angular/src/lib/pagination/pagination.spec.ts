import { Component, signal } from '@angular/core'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsPagination } from './pagination'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsPagination], template: '<nav krdsPagination [max]="5"></nav>' })
class Host {
  readonly page = signal(1)
  readonly max = signal(20)
}

/** 보이는 페이지 (생략은 …) */
const pages = (el: Element) =>
  [...el.querySelectorAll('.page-links > *')].map(item =>
    item.classList.contains('link-dot') ? '…' : item.textContent?.replace('현재페이지', '').trim()
  )

describe('KrdsPagination', () => {
  it('이름 붙은 nav, 현재 페이지 표시, 처음·끝은 늘 보이고 가운데만 보이며 나머지는 생략', async () => {
    const { host, el, $, stable } = await render(Host, '<nav krdsPagination [max]="max()" [(page)]="page"></nav>')
    const nav = $('nav')
    expect(nav.className).toBe('krds-pagination')
    expect(nav.getAttribute('aria-label')).toBe('페이지 내비게이션')
    expect(pages(el)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '…', '20'])
    const current = $('.page-link.active')
    expect(current.getAttribute('aria-current')).toBe('page')
    expect(current.querySelector('.sr-only')?.textContent).toBe('현재페이지')
    // 첫 페이지의 이전은 초점을 받지 않는 비활성 링크
    const prev = $('.page-navi.prev')
    expect(prev.classList).toContain('disabled')
    expect(prev.getAttribute('role')).toBe('link')
    expect(prev.getAttribute('aria-disabled')).toBe('true')
    expect(prev.hasAttribute('href')).toBe(false)

    host.page.set(10)
    await stable()
    expect(pages(el)).toEqual(['1', '…', '6', '7', '8', '9', '10', '11', '12', '13', '…', '20'])

    host.page.set(20)
    await stable()
    expect(pages(el)).toEqual(['1', '…', '13', '14', '15', '16', '17', '18', '19', '20'])
    expect($('.page-navi.next').getAttribute('aria-disabled')).toBe('true')
    expect($('.page-navi.next').hasAttribute('href')).toBe(false)

    host.max.set(10)
    host.page.set(1)
    await stable()
    expect(pages(el)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
  })

  it('이전·다음·페이지 링크로 이동하고, 주소(#)는 바뀌지 않는다', async () => {
    const { host, el, $, click } = await render(Host, '<nav krdsPagination [max]="max()" [(page)]="page"></nav>')
    const hash = location.hash
    await click($('.page-navi.next'))
    expect(host.page()).toBe(2)
    await click([...el.querySelectorAll('.page-link')].find(link => link.textContent?.trim() === '5')!)
    expect(host.page()).toBe(5)
    await click($('.page-navi.prev'))
    expect(host.page()).toBe(4)
    expect(location.hash).toBe(hash)
  })

  it('접근성 위반이 없다 (가운데 페이지, 이전이 비활성인 첫 페이지)', async () => {
    const { el } = await render(
      Host,
      '<nav krdsPagination [max]="20" [page]="10"></nav><nav krdsPagination [max]="20" label="두 번째"></nav>'
    )
    await expectNoA11yViolations(el)
  })
})
