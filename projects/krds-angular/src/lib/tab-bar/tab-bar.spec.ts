import { Component } from '@angular/core'
import { page } from 'vitest/browser'
import { expectNoA11yViolations, isVisible, render, user } from '../../test/render'
import { KrdsTabBar, type KrdsTabBarClick } from './tab-bar'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsTabBar], template: '<nav krdsTabBar [items]="items"></nav>' })
class Host {
  readonly items = [
    { text: '홈', icon: 'ico-bread-home', href: '#home', selected: true },
    { text: '내정보', icon: 'ico-my', href: '#my' },
    { text: '전체', icon: 'ico-all' }
  ]
  readonly clicks: KrdsTabBarClick[] = []
}

describe('KrdsTabBar', () => {
  // 탭바는 좁은 화면 전용 (넓은 화면에서는 숨김)
  beforeEach(() => page.viewport(375, 700))
  afterEach(() => page.viewport(1200, 900))

  it('이름 붙은 내비게이션 목록, 현재 페이지는 aria-current, href 없는 항목은 버튼', async () => {
    const { host, $, $$ } = await render(Host, '<nav krdsTabBar [items]="items" (itemClick)="clicks.push($event)"></nav>')
    const nav = $('nav')
    expect(nav.className).toBe('krds-tab-bar')
    expect(nav.getAttribute('aria-label')).toBe('하단 메뉴')
    expect(isVisible(nav)).toBe(true)
    expect($$('li')).toHaveLength(3)
    const [home, my] = $$<HTMLAnchorElement>('a.tab-bar-item')
    expect(home.getAttribute('aria-current')).toBe('page')
    expect(my.hasAttribute('aria-current')).toBe(false)
    const all = $<HTMLButtonElement>('button.tab-bar-item')
    expect(all.type).toBe('button')
    await user.click(all)
    expect(host.clicks.map(({ item }) => item.text)).toEqual(['전체'])
    await expectNoA11yViolations(nav)
  })

  it('페이지 아래에 탭바 높이만큼 여백, 넓은 화면에서는 숨김', async () => {
    const { $ } = await render(Host, '<nav krdsTabBar label="주요 메뉴" [items]="items"></nav>')
    const nav = $('nav')
    expect(nav.getAttribute('aria-label')).toBe('주요 메뉴')
    expect(parseFloat(getComputedStyle(document.body).paddingBottom)).toBeCloseTo(nav.offsetHeight, 0)
    await page.viewport(1200, 900)
    expect(isVisible(nav)).toBe(false)
    expect(getComputedStyle(document.body).paddingBottom).toBe('0px')
  })
})
