import { Component, signal } from '@angular/core'
import { page } from 'vitest/browser'
import { expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsMainMenu, type KrdsMainMenuItem } from '../main-menu/main-menu'
import { KrdsHeader, KrdsHeaderBranding, KrdsHeaderUtility } from './header'

const menu: KrdsMainMenuItem[] = [
  { text: '민원', subItems: [{ text: '민원 신청', items: [{ text: '전입 신고', href: '#!' }] }] },
  { text: '기관소개', href: '#!' }
]

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsHeader, KrdsHeaderUtility, KrdsHeaderBranding, KrdsMainMenu], template: '<header krdsHeader></header>' })
class Host {
  readonly menu = menu
  readonly open = signal(false)
}

const template = `
  <header krdsHeader>
    <div krdsHeaderUtility>
      <ul class="utility-list"><li><a href="#!" class="krds-btn small text">메뉴명</a></li></ul>
    </div>
    <div krdsHeaderBranding>
      <h2 class="logo"><a href="#!"><span class="sr-only">KRDS - Korea Design System</span></a></h2>
      <div class="header-actions">
        <button type="button" class="btn-navi all" aria-controls="mobile-nav" [attr.aria-expanded]="open()" (click)="open.set(true)">전체메뉴</button>
      </div>
    </div>
    <krds-main-menu [items]="menu" />
    <krds-main-menu krdsHeaderMobile variant="mobile" [items]="menu" [(open)]="open" />
  </header>
`

describe('KrdsHeader', () => {
  it('banner 랜드마크(#krds-header)에 영역을 KRDS 구조로 배치', async () => {
    const { $ } = await render(Host, template)
    const header = $('header')
    expect(header.id).toBe('krds-header')
    const headerIn = header.querySelector(':scope > .header-in')!
    const inner = headerIn.querySelector(':scope > .header-container > .inner')!
    expect([...inner.children].map(child => child.className)).toEqual(['header-utility', 'header-branding'])
    // PC 메뉴는 header-in 안, 모바일 드로어는 header-in 밖
    expect(headerIn.querySelector('.krds-main-menu')).toBeTruthy()
    expect(headerIn.querySelector('.krds-main-menu-mobile')).toBeNull()
    expect(header.querySelector(':scope > krds-main-menu .krds-main-menu-mobile')).toBeTruthy()
  })

  it('모바일: 전체메뉴 버튼으로 드로어를 열고 Esc로 닫으면 버튼으로 초점', async () => {
    await page.viewport(414, 896)
    try {
      const { $ } = await render(Host, template)
      const all = $<HTMLButtonElement>('.btn-navi.all')
      const drawer = document.getElementById(all.getAttribute('aria-controls')!)!
      expect(drawer.classList).toContain('krds-main-menu-mobile')
      await user.click(all)
      await vi.waitFor(() => expect(drawer.classList).toContain('is-open'))
      expect(all.getAttribute('aria-expanded')).toBe('true')
      await vi.waitFor(() => expect(document.activeElement).toBe(drawer.querySelector('.gnb-wrap')))
      await user.keyboard('{Escape}')
      await vi.waitFor(() => expect(document.activeElement).toBe(all))
      expect(all.getAttribute('aria-expanded')).toBe('false')
    } finally {
      document.body.classList.remove('is-gnb-mobile')
      await page.viewport(1200, 900)
    }
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(Host, template)
    await expectNoA11yViolations(el)
  })
})
