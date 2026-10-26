import { Component, signal } from '@angular/core'
import { classesOf, expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsTabPanel, KrdsTabs, type KrdsTabItem } from './tabs'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsTabs, KrdsTabPanel], template: '<krds-tabs [tabs]="tabs" />' })
class Host {
  readonly tabs: KrdsTabItem[] = [
    { id: 'notice', label: '공지' },
    { id: 'faq', label: '자주 묻는 질문' },
    { id: 'qna', label: '문의', disabled: true }
  ]
  readonly selected = signal<string | undefined>(undefined)
}

const template = (attrs = '') => `
  <krds-tabs [tabs]="tabs" [(selected)]="selected" ${attrs}>
    <ng-template krdsTabPanel="notice"><p>공지 목록</p></ng-template>
    <ng-template krdsTabPanel="faq"><p>질문 목록</p></ng-template>
    <ng-template krdsTabPanel="qna"><p>문의 목록</p></ng-template>
  </krds-tabs>
`

describe('KrdsTabs', () => {
  it('ARIA 연결, 첫 활성 탭 선택, 클릭 전환, 방향키 초점 이동', async () => {
    const { host, $, $$, click } = await render(Host, template())
    expect(classesOf($('krds-tabs'))).toEqual(['krds-tab-area', 'layer'])
    expect(classesOf($('.tab'))).toEqual(['line', 'tab'])
    const items = $$('[role="tablist"] > li')
    const tabs = $$('[role="tab"]')
    const panels = $$('[role="tabpanel"]')
    expect(items.map(item => item.getAttribute('role'))).toEqual(['presentation', 'presentation', 'presentation'])
    expect(tabs.every(tab => tab.matches('button.btn-tab'))).toBe(true)
    expect(tabs[0].getAttribute('aria-controls')).toBe(panels[0].id)
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id)
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs[0].querySelector('.sr-only')?.textContent?.trim()).toBe('선택됨')
    expect(panels[0].textContent?.trim()).toBe('공지 목록')
    // 선택하지 않은 패널은 KRDS CSS가 숨긴다
    expect(getComputedStyle(panels[1]).display).toBe('none')

    await click(tabs[1])
    expect(host.selected()).toBe('faq')
    expect(items[1].classList).toContain('active')
    expect(panels[1].classList).toContain('active')
    expect(getComputedStyle(panels[1]).display).not.toBe('none')

    tabs[1].focus()
    await user.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(tabs[0])
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(tabs[1])
  })

  it('비활성 탭은 눌러도 바뀌지 않고, 바깥에서 고른 탭을 반영한다', async () => {
    const { host, $$, click, stable } = await render(Host, template())
    const tabs = $$<HTMLButtonElement>('[role="tab"]')
    const disabled = tabs[2]
    expect(disabled.disabled).toBe(true)
    await click(disabled)
    expect(host.selected()).toBeUndefined()

    host.selected.set('faq')
    await stable()
    expect(tabs[1].getAttribute('aria-selected')).toBe('true')
    expect(tabs[0].getAttribute('aria-selected')).toBe('false')
  })

  it('버튼형·전체 폭', async () => {
    const { $ } = await render(Host, template('variant="fill" full'))
    expect(classesOf($('.tab'))).toEqual(['fill', 'full', 'tab'])
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(Host, template())
    await expectNoA11yViolations(el)
  })
})
