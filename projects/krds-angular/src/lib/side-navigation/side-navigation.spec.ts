import { Component, signal } from '@angular/core'
import { userEvent } from 'vitest/browser'
import { controlledBy, expectNoA11yViolations, render } from '../../test/render'
import { KrdsSideNavigation, type KrdsSideNavClick, type KrdsSideNavItem } from './side-navigation'

const menu = (): KrdsSideNavItem[] => [
  {
    text: '2Depth-menu',
    expanded: true,
    subItems: [
      {
        text: '3Depth-menu',
        popupTitle: '3Depth-title',
        subItems: [
          { text: '4Depth-a', href: '#!' },
          { text: '4Depth-b', href: '#!' }
        ]
      },
      { text: '3Depth-link', href: '#!' }
    ]
  },
  { text: '2Depth-second', subItems: [{ text: '3Depth-second', href: '#!' }] },
  { text: '2Depth-link', href: '#lnb-link' }
]

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsSideNavigation], template: '<nav krdsSideNavigation heading="메뉴"></nav>' })
class Host {
  readonly items = signal(menu())
  readonly second = signal(menu())
  readonly clicks: KrdsSideNavClick[] = []
}

const byText = (root: Element, selector: string, text: string) =>
  [...root.querySelectorAll<HTMLElement>(selector)].find(el => el.textContent?.trim() === text)!

describe('KrdsSideNavigation', () => {
  it('2단계 펼침·3단계 팝업 열고 닫기와 초점 이동, [(items)]', async () => {
    const { host, el, $, stable } = await render(
      Host,
      '<nav krdsSideNavigation heading="1Depth-title" [(items)]="items"></nav><a href="#!" class="after">본문</a>'
    )
    expect($('nav').className).toBe('krds-side-navigation')
    expect($('h2.lnb-tit').textContent).toBe('1Depth-title')
    expect($('[role="menubar"]')).toBeTruthy()
    const [first, second] = [...el.querySelectorAll<HTMLElement>('.lnb-toggle')]
    expect(first.getAttribute('aria-expanded')).toBe('true')
    expect(first.closest('li')?.classList).toContain('active')
    expect(controlledBy(first)?.getAttribute('role')).toBe('menu')

    const popupButton = byText(el, '.lnb-toggle-popup', '3Depth-menu')
    const menu = controlledBy(popupButton)!
    const popup = menu.closest<HTMLElement>('.lnb-submenu-lv2')!
    const title = popup.querySelector<HTMLElement>('.lnb-btn-tit')!
    expect(menu.getAttribute('role')).toBe('menu')
    expect(menu.getAttribute('aria-label')).toBe('3Depth-title')
    expect(popupButton.getAttribute('aria-haspopup')).toBe('true')
    expect(popupButton.getAttribute('aria-expanded')).toBe('false')

    // 열면 전환이 끝난 뒤 팝업 제목으로 초점
    await userEvent.click(popupButton)
    expect(popupButton.getAttribute('aria-expanded')).toBe('true')
    expect(popup.classList).toContain('active')
    expect(host.items()[0].subItems?.[0].expanded).toBe(true)
    await vi.waitFor(() => expect(document.activeElement).toBe(title))
    expect(title.textContent?.trim()).toBe('3Depth-title')

    // 제목 버튼으로 닫으면 팝업 버튼으로 초점
    await userEvent.keyboard('{Enter}')
    expect(popupButton.getAttribute('aria-expanded')).toBe('false')
    await vi.waitFor(() => expect(document.activeElement).toBe(popupButton))

    // Tab으로 팝업을 벗어나면 닫히고, 초점은 옮겨 간 곳에 그대로 둔다 (WAI-ARIA 메뉴 패턴)
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(document.activeElement).toBe(title))
    await userEvent.keyboard('{Tab}{Tab}{Tab}')
    const link = byText(el, '.lnb-link', '3Depth-link')
    expect(document.activeElement).toBe(link)
    expect(popupButton.getAttribute('aria-expanded')).toBe('false')
    await new Promise(requestAnimationFrame)
    expect(document.activeElement).toBe(link)

    // 팝업이 열린 채로 2단계를 접으면 팝업도 닫힘
    await userEvent.click(popupButton)
    await userEvent.click(first)
    expect(first.getAttribute('aria-expanded')).toBe('false')
    await userEvent.click(first)
    expect(popupButton.getAttribute('aria-expanded')).toBe('false')

    // 2단계는 키보드(Space)로도 펼침
    second.focus()
    await userEvent.keyboard('[Space]')
    await stable()
    expect(second.getAttribute('aria-expanded')).toBe('true')
    expect(host.items()[1].expanded).toBe(true)
  })

  it('하위 메뉴 없는 2단계는 링크, 링크 클릭 이벤트', async () => {
    const { host, el, click } = await render(
      Host,
      '<nav krdsSideNavigation heading="메뉴" [(items)]="items" (itemClick)="$event.event.preventDefault(); clicks.push($event)"></nav>'
    )
    const link = byText(el, '.lnb-link', '2Depth-link')
    expect(link.tagName).toBe('A')
    expect(link.getAttribute('href')).toBe('#lnb-link')
    expect(link.hasAttribute('aria-expanded')).toBe(false)
    await click(link)
    await click(byText(el, '.lnb-link', '3Depth-link'))
    expect(host.clicks.map(({ item }) => item.text)).toEqual(['2Depth-link', '3Depth-link'])
  })

  it('여러 개 배치: id가 겹치지 않고 aria-controls는 자기 내비게이션 안을 가리킨다', async () => {
    const { el } = await render(
      Host,
      `
        <nav krdsSideNavigation heading="첫 번째" aria-label="첫 번째 사이드 메뉴" [(items)]="items"></nav>
        <nav krdsSideNavigation heading="두 번째" aria-label="두 번째 사이드 메뉴" [(items)]="second"></nav>
      `
    )
    const ids = [...el.querySelectorAll('[id]')].map(node => node.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const nav of el.querySelectorAll('nav')) {
      for (const control of nav.querySelectorAll('[aria-controls]')) expect(nav.contains(controlledBy(control))).toBe(true)
    }
    await expectNoA11yViolations(el)
  })

  it('접근성 위반이 없다 (팝업 열림)', async () => {
    const { el } = await render(Host, '<nav krdsSideNavigation heading="메뉴" [(items)]="items"></nav>')
    const popupButton = byText(el, '.lnb-toggle-popup', '3Depth-menu')
    await userEvent.click(popupButton)
    const popup = controlledBy(popupButton)!.closest('.lnb-submenu-lv2')!
    expect(popup.classList).toContain('active')
    await vi.waitFor(() => expect(document.activeElement).toBe(popup.querySelector('.lnb-btn-tit')))
    await expectNoA11yViolations(el)
  })
})
