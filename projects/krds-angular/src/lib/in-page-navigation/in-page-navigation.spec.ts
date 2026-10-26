import { Component } from '@angular/core'
import { userEvent } from 'vitest/browser'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsInPageAction, KrdsInPageNavigation, type KrdsInPageNavClick } from './in-page-navigation'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsInPageNavigation, KrdsInPageAction], template: '<krds-in-page-navigation />' })
class Host {
  readonly items = [
    { href: '#section_01', text: '서비스 개요' },
    { href: '#section_02', text: '신청 방법' },
    { href: '#section_03', text: '제출 서류' },
    { href: '#section_04', text: '정보 변경 내역' }
  ]
  readonly clicks: KrdsInPageNavClick[] = []
}

const page = `
  <div class="contents">
    <krds-in-page-navigation heading="장애아동수당" [items]="items" (itemClick)="clicks.push($event)">
      <div krdsInPageAction><button type="button" class="krds-btn medium">온라인 신청하기</button></div>
    </krds-in-page-navigation>
    @for (item of items; track item.href) {
      <section [id]="item.href.slice(1)" style="min-height: 800px"><h2 class="sec-tit">{{ item.text }}</h2></section>
    }
  </div>
`

const link = (el: Element, text: string) =>
  [...el.querySelectorAll<HTMLElement>('.in-page-navigation-list a')].find(a => a.textContent?.trim() === text)!

describe('KrdsInPageNavigation', () => {
  afterEach(() => window.scrollTo({ top: 0, behavior: 'instant' }))

  it('KRDS 마크업: 머리 문구·제목, 이름 붙은 목록, 넣은 액션 영역', async () => {
    const { $, $$ } = await render(Host, page)
    expect($('krds-in-page-navigation').className).toBe('krds-in-page-navigation-type')
    expect($('.quick-caption').textContent).toBe('이 페이지의 구성')
    expect($('.quick-title').textContent).toBe('장애아동수당')
    expect($('nav.in-page-navigation-list').getAttribute('aria-label')).toBe('이 페이지의 구성')
    expect($$('.krds-in-page-navigation-area > .in-page-navigation-action > button')).toHaveLength(1)
  })

  it('클릭·스크롤 위치에 따라 현재 섹션 표시, 키보드로 고르면 섹션 제목으로 초점', async () => {
    const { host, el } = await render(Host, page)
    await vi.waitFor(() => expect(link(el, '서비스 개요').classList).toContain('active'))
    expect(link(el, '서비스 개요').getAttribute('aria-current')).toBe('true')

    await userEvent.click(link(el, '제출 서류'))
    expect(host.clicks.map(({ item }) => item.text)).toEqual(['제출 서류'])
    await vi.waitFor(() => expect(Math.abs(document.getElementById('section_03')!.getBoundingClientRect().top)).toBeLessThan(2), {
      timeout: 3000
    })
    await vi.waitFor(() => expect(link(el, '제출 서류').classList).toContain('active'))
    expect(link(el, '서비스 개요').hasAttribute('aria-current')).toBe(false)

    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })
    await vi.waitFor(() => expect(link(el, '정보 변경 내역').classList).toContain('active'))
    window.scrollTo({ top: 0, behavior: 'instant' })
    await vi.waitFor(() => expect(link(el, '서비스 개요').classList).toContain('active'))

    link(el, '신청 방법').focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(document.activeElement).toBe(document.querySelector('#section_02 .sec-tit')))
  })

  it('autoActive를 끄면 항목의 active를 그대로 쓴다', async () => {
    const { el } = await render(
      Host,
      `<krds-in-page-navigation [autoActive]="false" [items]="[{ href: '#a', text: '가' }, { href: '#b', text: '나', active: true }]" />`
    )
    await vi.waitFor(() => expect(link(el, '나').classList).toContain('active'))
    expect(link(el, '가').classList).not.toContain('active')
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(Host, page)
    await expectNoA11yViolations(el)
  })
})
