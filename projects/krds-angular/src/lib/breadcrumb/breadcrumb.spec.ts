import { Component } from '@angular/core'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsBreadcrumb, type KrdsBreadcrumbClick } from './breadcrumb'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsBreadcrumb], template: '<nav krdsBreadcrumb [items]="items"></nav>' })
class Host {
  readonly items = [{ text: '홈', href: '/' }, { text: '민원 안내', href: '/guide' }, { text: '전입 신고' }]
  readonly clicks: KrdsBreadcrumbClick[] = []
}

describe('KrdsBreadcrumb', () => {
  it('KRDS 마크업: 이름 붙은 nav, 첫 항목은 홈, 마지막 항목은 현재 페이지, 클릭 이벤트', async () => {
    const { host, $, $$, click } = await render(
      Host,
      '<nav krdsBreadcrumb [items]="items" (itemClick)="$event.event.preventDefault(); clicks.push($event)"></nav>'
    )
    const nav = $('nav')
    expect(nav.className).toBe('krds-breadcrumb-wrap')
    expect(nav.getAttribute('aria-label')).toBe('현재 경로')
    const items = $$('ol.breadcrumb > li')
    expect(items.map(li => li.className)).toEqual(['home', '', ''])
    const links = $$<HTMLAnchorElement>('a.txt')
    expect(links.map(a => a.getAttribute('href'))).toEqual(['/', '/guide', '#'])
    expect(links.map(a => a.getAttribute('aria-current'))).toEqual([null, null, 'page'])
    expect(links[1].querySelector('span')?.textContent).toBe('민원 안내')

    await click(links[1])
    expect(host.clicks.map(({ item }) => item.text)).toEqual(['민원 안내'])
  })

  it('홈 아이콘 끄기와 이름 바꾸기', async () => {
    const { $ } = await render(Host, '<nav krdsBreadcrumb label="위치" [showHomeIcon]="false" [items]="items"></nav>')
    expect($('nav').getAttribute('aria-label')).toBe('위치')
    expect($('li').className).toBe('')
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(Host, '<nav krdsBreadcrumb [items]="items"></nav>')
    await expectNoA11yViolations(el)
  })
})
