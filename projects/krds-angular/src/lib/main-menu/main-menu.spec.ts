import { Component, signal } from '@angular/core'
import { page } from 'vitest/browser'
import { controlledBy, expectNoA11yViolations, isVisible, render, user } from '../../test/render'
import { KrdsMainMenu, KrdsMainMenuBanner, KrdsMainMenuBottom, type KrdsMainMenuItem, type KrdsMainMenuToggle } from './main-menu'

/** PC 메가 메뉴 데이터 (2단계 컬럼 + 마지막 단계) */
const pcItems: KrdsMainMenuItem[] = [
  {
    text: '정보서비스',
    subItems: [
      {
        text: '민원신청',
        titleLink: { href: '#!', text: '바로가기' },
        layout: 'between',
        banner: true,
        items: [
          { text: '증명서 발급', href: '#!' },
          { text: '전입신고', href: '#!' },
          { text: '주민등록 등본', href: '#!', selected: true }
        ]
      },
      { text: '생활지원', items: [{ text: '주거 지원', href: '#!' }] },
      {
        text: '고용정보',
        items: [
          { text: '채용 공고', href: '#!', description: '메뉴에 관한 간략한 설명입니다.', external: true },
          { text: '직업 훈련', href: '#!', description: '메뉴에 관한 간략한 설명입니다.', selected: true }
        ]
      },
      { text: '통합검색 바로가기', href: '#!' },
      { text: '외부 서비스', href: 'https://www.krds.go.kr', external: true }
    ]
  },
  { text: '정책정보', subItems: [{ text: '정책자료', items: [{ text: '보도자료', href: '#!' }] }] },
  {
    text: '알림소식',
    title: '알림소식',
    layout: 'between',
    items: [
      { text: '공지사항', href: '#!' },
      { text: '행사안내', href: '#!' }
    ]
  },
  { text: '기관소개', href: '#!' }
]

/** 모바일 드로어 데이터 (3·4단계 포함) */
const mobileItems: KrdsMainMenuItem[] = [
  {
    text: '정보서비스',
    subItems: [
      { text: '민원신청', href: '#!' },
      {
        text: '고용정보',
        items: [
          { text: '채용 공고', href: '#!' },
          {
            text: '직업 훈련',
            href: '#!',
            items: [
              { text: '국비 지원 과정', href: '#!' },
              { text: '온라인 과정', href: '#!' }
            ]
          }
        ]
      }
    ]
  },
  { text: '정책정보', subItems: [{ text: '정책자료', href: '#!' }] }
]

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsMainMenu, KrdsMainMenuBanner, KrdsMainMenuBottom], template: '<krds-main-menu [items]="pcItems" />' })
class Host {
  readonly pcItems = pcItems
  readonly mobileItems = mobileItems
  readonly open = signal(false)
  readonly toggles: KrdsMainMenuToggle[] = []
  readonly clicked: string[] = []
}

const byText = (root: Element, selector: string, text: string) =>
  [...root.querySelectorAll<HTMLElement>(selector)].find(el => el.textContent?.trim().startsWith(text))!

const inHeader = (template: string) => `<header id="krds-header">${template}</header>`

describe('KrdsMainMenu (PC)', () => {
  afterEach(() => document.body.classList.remove('is-gnb-web', 'hasScrollY'))

  it('패널 토글·2단계 전환·방향키·Home·End, Esc·배경 클릭으로 닫힘, 배경 딤과 body 상태', async () => {
    const { host, el } = await render(
      Host,
      inHeader(`
        <krds-main-menu [items]="pcItems" (menuToggle)="toggles.push($event)">
          <ng-template krdsMainMenuBanner let-subItem="subItem"><span krdsBadge>신규 서비스</span>{{ subItem?.text }}</ng-template>
        </krds-main-menu>
      `)
    )
    const nav = el.querySelector('nav.krds-main-menu')!
    expect(nav.getAttribute('aria-label')).toBe('메인 메뉴')
    const trigger = byText(el, 'button', '정보서비스')
    const policy = byText(el, 'button', '정책정보')
    const notice = byText(el, 'button', '알림소식')
    const about = byText(el, 'a', '기관소개')
    const panel = controlledBy(trigger)!
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-haspopup')).toBe('true')
    expect(isVisible(panel)).toBe(false)
    expect(about.hasAttribute('aria-expanded')).toBe(false)

    await user.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.classList).toContain('active')
    await vi.waitFor(() => expect(isVisible(panel)).toBe(true))
    expect(document.body.classList).toContain('is-gnb-web')
    expect(document.querySelector('body > .gnb-backdrop.active')).toBeTruthy()
    expect(host.toggles).toEqual([{ index: 0, expanded: true }])

    // 링크가 아닌 첫 2단계가 기본으로 열리고, 배너 템플릿을 그린다
    const apply = byText(el, 'button', '민원신청')
    const support = byText(el, 'button', '생활지원')
    const job = byText(el, 'button', '고용정보')
    expect(apply.getAttribute('aria-expanded')).toBe('true')
    expect(isVisible(controlledBy(apply))).toBe(true)
    expect(controlledBy(apply)?.querySelector('.gnb-sub-banner')?.textContent).toContain('민원신청')
    expect(isVisible(controlledBy(support))).toBe(false)
    const search = byText(el, 'a', '통합검색 바로가기')
    expect(search.hasAttribute('aria-expanded')).toBe(false)
    expect(byText(el, 'a', '외부 서비스').title).toBe('새 창 열림')

    await user.click(support)
    expect(support.getAttribute('aria-expanded')).toBe('true')
    expect(apply.getAttribute('aria-expanded')).toBe('false')
    await vi.waitFor(() => expect(isVisible(controlledBy(support))).toBe(true))

    // 2단계 사이 방향키 (초점만 이동)
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(job)
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(search)
    await user.keyboard('{ArrowUp}')
    expect(document.activeElement).toBe(job)
    await user.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(support)

    // 설명형 링크도 selected면 강조
    await user.click(job)
    expect(byText(el, '.type-description a', '직업 훈련').classList).toContain('active')

    // Esc로 닫으면 1단계 버튼으로 초점
    await user.keyboard('{Escape}')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger)
    await vi.waitFor(() => expect(document.body.classList).not.toContain('is-gnb-web'))
    expect(document.querySelector('.gnb-backdrop')).toBeNull()

    // 1단계 방향키·Home·End
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(policy)
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(notice)
    await user.keyboard('{End}')
    expect(document.activeElement).toBe(about)
    await user.keyboard('{Home}')
    expect(document.activeElement).toBe(trigger)

    // 열린 상태에서 다른 1단계를 누르면 전환 (이전 패널 닫힘도 알림)
    await user.click(trigger)
    await user.click(policy)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(policy.getAttribute('aria-expanded')).toBe('true')
    expect(host.toggles.slice(-3)).toEqual([
      { index: 0, expanded: true },
      { index: 0, expanded: false },
      { index: 1, expanded: true }
    ])

    // 바깥(배경) 클릭으로 닫힘
    await vi.waitFor(() => expect(document.querySelector('.gnb-backdrop')).toBeTruthy())
    document.querySelector<HTMLElement>('.gnb-backdrop')!.click()
    await vi.waitFor(() => expect(policy.getAttribute('aria-expanded')).toBe('false'))
    await vi.waitFor(() => expect(document.body.classList).not.toContain('is-gnb-web'))
  })

  it('패널 안 링크를 누르면 패널을 닫고 1단계 버튼으로 초점 (라우터 이동)', async () => {
    const { host, el } = await render(
      Host,
      inHeader('<krds-main-menu [items]="pcItems" (itemClick)="$event.event.preventDefault(); clicked.push($event.item.text)" />')
    )
    const trigger = byText(el, 'button', '정보서비스')
    await user.click(trigger)
    await user.click(byText(el, 'a', '전입신고'))
    expect(host.clicked.at(-1)).toBe('전입신고')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger))
  })

  it('2단계 없는 메뉴(single-list): Tab으로 패널 안은 유지, 메뉴를 벗어나면 닫힘', async () => {
    const { el } = await render(
      Host,
      inHeader('<krds-main-menu [items]="pcItems.slice(2)" /><a href="#!" class="krds-btn small text">본문 링크</a>')
    )
    const trigger = byText(el, 'button', '알림소식')
    const panel = controlledBy(trigger)!
    await user.click(trigger)
    await vi.waitFor(() => expect(isVisible(panel)).toBe(true))
    expect(panel.querySelector('.gnb-sub-list.single-list.between')).toBeTruthy()

    await vi.waitFor(async () => {
      trigger.focus()
      await user.keyboard('{Tab}')
      expect(document.activeElement).toBe(byText(el, 'a', '공지사항'))
    })
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(trigger)
    await user.keyboard('{End}')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    await user.keyboard('{Tab}')
    expect(document.activeElement).toBe(byText(el, 'a', '본문 링크'))
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    await expectNoA11yViolations(el)
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(Host, inHeader('<krds-main-menu [items]="pcItems" />'))
    const trigger = byText(el, 'button', '정보서비스')
    await user.click(trigger)
    // 전환 중에는 패널이 숨겨져 검사에서 빠지므로 다 보일 때까지 기다린다
    await vi.waitFor(() => expect(isVisible(controlledBy(byText(el, 'button', '민원신청'))?.querySelector('a'))).toBe(true))
    await expectNoA11yViolations(el)
  })
})

describe('KrdsMainMenu (모바일)', () => {
  beforeEach(() => page.viewport(414, 896))
  afterEach(async () => {
    document.body.classList.remove('is-gnb-mobile')
    await page.viewport(1200, 900)
  })

  const mobileTemplate = `
    <button type="button" class="opener" aria-controls="mobile-nav" (click)="open.set(true)">전체메뉴 열기</button>
    <krds-main-menu variant="mobile" [items]="mobileItems" [(open)]="open">
      <div krdsMainMenuHeader class="gnb-login"><button type="button" class="krds-btn large text">로그인을 해주세요</button></div>
      <div krdsMainMenuBottom><a href="#!" class="krds-btn small text">개인정보처리방침</a></div>
    </krds-main-menu>
  `

  it('드로어 열고 닫기, 포커스 가두기, 3·4단계, Esc·닫기 버튼, 연 버튼으로 초점 복귀', async () => {
    const { host, el, $ } = await render(Host, mobileTemplate)
    const opener = $<HTMLButtonElement>('.opener')
    const drawer = $('#mobile-nav')
    const wrap = $('.gnb-wrap')
    const close = $('#close-nav')
    expect(drawer.classList).toContain('krds-main-menu-mobile')
    expect(isVisible(drawer)).toBe(false)

    await user.click(opener)
    await vi.waitFor(() => expect(drawer.classList).toContain('is-open'))
    expect(document.body.classList).toContain('is-gnb-mobile')
    await vi.waitFor(() => expect(document.activeElement).toBe(wrap))
    expect($('.gnb-body > .gnb-bottom a')).toBeTruthy()

    // 포커스 가두기
    const login = byText(el, 'button', '로그인을 해주세요')
    await user.keyboard('{Tab}')
    expect(document.activeElement).toBe(login)
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(close)
    await user.keyboard('{Tab}')
    expect(document.activeElement).toBe(login)

    // 1단계 탭과 패널
    const tabs = [...el.querySelectorAll<HTMLElement>('[role="tab"]')]
    expect(tabs.map(tab => tab.getAttribute('aria-selected'))).toEqual(['true', 'false'])
    expect(controlledBy(tabs[0])?.getAttribute('role')).toBe('tabpanel')
    expect(controlledBy(tabs[0])?.getAttribute('aria-labelledby')).toBe(tabs[0].id)

    // 3단계 펼침
    const depth3Trigger = byText(el, 'a.gnb-sub-trigger', '고용정보')
    const depth3Wrap = controlledBy(depth3Trigger)!
    expect(depth3Trigger.getAttribute('aria-expanded')).toBe('false')
    depth3Trigger.focus()
    await user.keyboard('{Enter}')
    expect(depth3Trigger.getAttribute('aria-expanded')).toBe('true')
    expect(depth3Wrap.classList).toContain('is-open')

    // 4단계: 열면 이전화면 버튼으로 초점, 안에서 포커스 가두기, Esc는 4단계만 닫음
    const depth4Trigger = byText(el, 'a.depth3-trigger', '직업 훈련')
    const depth4Wrap = depth4Trigger.nextElementSibling as HTMLElement
    const prev = depth4Wrap.querySelector<HTMLElement>('.trigger-prev')!
    await vi.waitFor(() => expect(isVisible(depth4Trigger)).toBe(true))
    await user.click(depth4Trigger)
    await vi.waitFor(() => expect(document.activeElement).toBe(prev))
    expect(depth4Wrap.classList).toContain('is-open')
    expect(depth4Trigger.getAttribute('aria-expanded')).toBe('true')
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(byText(depth4Wrap, 'a', '온라인 과정'))
    await user.keyboard('{Tab}')
    expect(document.activeElement).toBe(prev)
    await user.keyboard('{Escape}')
    expect(depth4Wrap.classList).not.toContain('is-open')
    expect(document.activeElement).toBe(depth4Trigger)
    expect(drawer.classList).toContain('is-open')

    // 이전화면 버튼으로 닫기
    await user.keyboard('{Enter}')
    await vi.waitFor(() => expect(document.activeElement).toBe(prev))
    await user.click(prev)
    expect(depth4Wrap.classList).not.toContain('is-open')
    expect(document.activeElement).toBe(depth4Trigger)

    // Esc로 드로어를 닫으면 연 버튼으로 초점
    await user.keyboard('{Escape}')
    expect(host.open()).toBe(false)
    await vi.waitFor(() => expect(document.activeElement).toBe(opener))
    await vi.waitFor(() => expect(isVisible(drawer)).toBe(false))
    expect(document.body.classList).not.toContain('is-gnb-mobile')

    // 닫기 버튼
    await user.click(opener)
    await vi.waitFor(() => expect(document.activeElement).toBe(wrap))
    await user.click(close)
    expect(host.open()).toBe(false)
  })

  it('single-list(items)와 바로가기 링크 메뉴도 패널에 링크로, 처음부터 열린 드로어', async () => {
    const { el } = await render(
      Host,
      `<krds-main-menu variant="mobile" [open]="true" [items]="[{ text: '민원 안내', items: [{ text: '민원 신청 방법', href: '/guide' }] }, { text: '알림', href: '/notice' }]" />`
    )
    const panels = el.querySelectorAll('.gnb-sub-list')
    expect(panels[0].querySelector('.gnb-sub-trigger')?.getAttribute('href')).toBe('/guide')
    expect(panels[0].textContent).toContain('민원 신청 방법')
    expect(panels[1].querySelector('.gnb-sub-trigger')?.getAttribute('href')).toBe('/notice')
    expect(el.querySelector('.krds-main-menu-mobile')?.classList).toContain('is-open')
  })

  it('접근성 위반이 없다', async () => {
    const { el, $ } = await render(Host, mobileTemplate)
    await user.click($('.opener'))
    await vi.waitFor(() => expect(document.activeElement).toBe($('.gnb-wrap')))
    await expectNoA11yViolations(el)
  })
})
