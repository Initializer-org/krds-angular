import { Component } from '@angular/core'
import { classesOf, expectNoA11yViolations, isVisible, render, user } from '../../test/render'
import { KrdsContextualHelp } from './contextual-help'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsContextualHelp], template: '<krds-contextual-help heading="a">a</krds-contextual-help>' })
class Host {}

const help = (attrs = '') => `
  <div style="display: flex; align-items: center; gap: 8px; padding: 300px 0">
    <p>신청 자격</p>
    <krds-contextual-help heading="도움말 제목" ${attrs}>
      <p>컴포넌트 주변에 배치되어 상세 정보를 제공합니다.</p>
      <div class="btn-wrap"><a href="#!" class="krds-btn xsmall link basic">바로가기</a></div>
    </krds-contextual-help>
  </div>
`

describe('KrdsContextualHelp', () => {
  it('도움말 버튼으로 열면 첫 링크로 초점, 닫기 버튼·Esc로 닫으면 버튼으로 초점, 바깥 클릭으로 닫힘', async () => {
    const { el, $ } = await render(Host, help() + '<button type="button" class="outside">바깥</button>')
    expect(classesOf($('krds-contextual-help'))).toEqual(['krds-contextual-help', 'left', 'top'])
    const button = $<HTMLButtonElement>('.tooltip-btn')
    const popover = $('.tooltip-popover')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-controls')).toBe(popover.id)
    expect(popover.getAttribute('role')).toBe('dialog')
    expect(document.getElementById(popover.getAttribute('aria-labelledby')!)?.textContent).toBe('도움말 제목')
    expect(isVisible(popover)).toBe(false)

    await user.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(isVisible(popover)).toBe(true)
    await vi.waitFor(() => expect(document.activeElement).toBe(popover.querySelector('a')))
    expect(popover.style.width).toBe('360px')
    await expectNoA11yViolations(el)

    await user.click(popover.querySelector('.tooltip-close')!)
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(button)

    await user.click(button)
    await user.keyboard('{Escape}')
    expect(isVisible(popover)).toBe(false)
    expect(document.activeElement).toBe(button)

    await user.click(button)
    await user.click($('.outside'))
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })

  it('하나를 열면 다른 도움말은 닫히고, 위치·도움 아이콘', async () => {
    const { $$ } = await render(Host, help('position="bottom right" helpIcon') + help())
    const [first, second] = $$<HTMLButtonElement>('.tooltip-btn')
    expect(classesOf($$('krds-contextual-help')[0])).toEqual(['bottom', 'krds-contextual-help', 'right'])
    expect(first.querySelector('i')?.classList).toContain('ico-help')
    expect(second.querySelector('i')?.classList).toContain('ico-tooltip')
    await user.click(first)
    await user.click(second)
    expect(first.getAttribute('aria-expanded')).toBe('false')
    expect(second.getAttribute('aria-expanded')).toBe('true')
  })
})
