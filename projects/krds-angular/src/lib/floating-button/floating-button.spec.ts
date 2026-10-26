import { Component } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsFloatingButton, type KrdsFloatingButtonItem, type KrdsFloatingButtonSelect } from './floating-button'

const items: KrdsFloatingButtonItem[] = [
  { label: '자주 묻는 질문', icon: 'ico-faq' },
  { label: '전화 상담', icon: 'ico-call', href: 'tel:1555-6365' }
]

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsFloatingButton], template: '<krds-floating-button label="상담" />' })
class Host {
  items = items
  selected: KrdsFloatingButtonSelect[] = []
  clicks = 0
  prevent = false
  onSelect(selection: KrdsFloatingButtonSelect) {
    this.selected.push(selection)
    if (this.prevent) selection.event.preventDefault()
  }
}

const expandTemplate = `
  <krds-floating-button label="상담 메뉴" [items]="items" (itemSelect)="onSelect($event)" />
  <button class="outside">바깥 버튼</button>
`

describe('KrdsFloatingButton', () => {
  it('단일형: 아이콘과 레이블을 가진 버튼, 클릭은 기본 click으로 받는다', async () => {
    const { el, host, $, click } = await render(
      Host,
      '<krds-floating-button label="채팅 상담" icon="ico-faq" class="my-fab" (click)="clicks = clicks + 1" />'
    )
    const root = $('krds-floating-button')
    expect(classesOf(root)).toEqual(['krds-floating-button', 'my-fab'])
    // KRDS 스타일이 테스트 페이지에 들어 있는지 (angular.json의 test-build)
    expect(getComputedStyle(root).position).toBe('fixed')
    const button = $('button.floating-action')
    expect(button.querySelector('.floating-label')?.textContent).toBe('채팅 상담')
    expect(button.querySelector('i')?.className).toBe('svg-icon ico-faq')

    await click(button)
    expect(host.clicks).toBe(1)
    await expectNoA11yViolations(el)
  })

  it('단일형: hideLabel이면 레이블을 화면에서 숨기고 이름은 유지', async () => {
    const { $ } = await render(Host, '<krds-floating-button label="맨 위로" icon="ico-go-top" hideLabel />')
    expect($('button .sr-only').textContent).toBe('맨 위로')
    expect($('.floating-label')).toBeNull()
  })

  it('단일형: href가 있으면 링크, external이면 새 창 안내', async () => {
    const { $ } = await render(Host, '<krds-floating-button label="채팅 상담" href="https://example.go.kr" external />')
    const link = $<HTMLAnchorElement>('a.floating-action')
    expect(link.getAttribute('href')).toBe('https://example.go.kr')
    expect(link.target).toBe('_blank')
    expect(link.rel).toBe('noopener noreferrer')
    expect(link.title).toBe('새 창 열림')
  })

  it('확장형: 펼치기·항목 선택 후 닫고 초점을 확장 버튼으로', async () => {
    const { el, host, $, click } = await render(Host, expandTemplate)
    const root = $('krds-floating-button')
    const toggle = $('.floating-toggle')
    const list = $('.floating-list')
    expect(root.classList).toContain('expand')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(toggle.getAttribute('aria-controls')).toBe(list.id)
    expect(list.style.display).toBe('none')

    await click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(root.classList).toContain('active')
    expect(list.style.display).toBe('')
    expect($('.floating-dim')).toBeTruthy()
    expect($('a.floating-action').getAttribute('href')).toBe('tel:1555-6365')
    await expectNoA11yViolations(el)

    await click($('button.floating-action'))
    expect(host.selected.map(({ item, index }) => [item, index])).toEqual([[items[0], 0]])
    expect(host.selected[0].event).toBeInstanceOf(MouseEvent)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle)
  })

  it('확장형: Esc·가림막 클릭·바깥으로 초점 이동 시 닫힘', async () => {
    const { $, click, stable } = await render(Host, expandTemplate)
    const toggle = $('.floating-toggle')

    await click(toggle)
    toggle.blur() // Safari처럼 클릭해도 초점이 버튼에 가지 않은 상황
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await stable()
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle)

    await click(toggle)
    await click($('.floating-dim'))
    expect(toggle.getAttribute('aria-expanded')).toBe('false')

    await click(toggle)
    toggle.focus()
    $('.outside').focus()
    await stable()
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
  })

  it.each([
    ['대상이 있는 #id', '#pg-target', false, false],
    ['대상이 없는 해시 라우터 주소', '#/notice', false, true],
    ['핸들러가 이동을 취소', '#pg-target', true, true]
  ])('확장형: 같은 페이지 안 링크 - %s', async (_, href, prevent, keepsFocus) => {
    const { host, $, click } = await render(
      Host,
      `
      <h2 id="pg-target">대상</h2>
      <krds-floating-button label="상담 메뉴" [items]="[{ label: '본문으로', icon: 'ico-go-top', href: '${href}' }]" (itemSelect)="onSelect($event)" />
    `
    )
    host.prevent = prevent
    const toggle = $('.floating-toggle')
    await click(toggle)
    // jsdom은 해시 이동을 하지 않으므로 이동 여부는 보지 않고 초점만 확인한다
    await click($('a.floating-action'))
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement === toggle).toBe(keepsFocus)
  })
})
