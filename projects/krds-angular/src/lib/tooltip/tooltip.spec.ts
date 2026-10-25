import { Component } from '@angular/core'
import { userEvent } from 'vitest/browser'
import { classesOf, expectNoA11yViolations, isVisible, render } from '../../test/render'
import { KrdsTooltip } from './tooltip'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsTooltip], template: '<krds-tooltip content="a">a</krds-tooltip>' })
class Host {}

const tooltips = (modifier = '') => `
  <div style="height: 300px; padding: 40px">
    <div style="display: flex; align-items: flex-start; gap: 10px">
      <krds-tooltip ${modifier} content="툴팁의 기본 설정입니다">처리 기간 <i class="svg-icon ico-angle right"></i></krds-tooltip>
      <krds-tooltip ${modifier} type="icon" content="아이콘 버튼에 제공되는 툴팁"><i class="svg-icon ico-help"></i></krds-tooltip>
      <krds-tooltip ${modifier} type="button" content="버튼에 제공되는 툴팁">도움말</krds-tooltip>
    </div>
  </div>
`

describe('KrdsTooltip', () => {
  it('마우스를 올리면 보이고 떠나면 숨김, 초점·Esc, 이름은 버튼 글자와 설명', async () => {
    const { $$ } = await render(Host, tooltips())
    const [text, icon, plain] = $$<HTMLButtonElement>('button')
    expect(classesOf(text)).toEqual(['krds-btn', 'krds-tooltip', 'small', 'text'])
    expect(classesOf(icon)).toEqual(['icon', 'krds-btn', 'krds-tooltip'])
    expect(classesOf(plain)).toEqual(['krds-btn', 'krds-tooltip'])
    const popover = document.getElementById(text.getAttribute('aria-labelledby')!)!
    expect(popover.getAttribute('role')).toBe('tooltip')
    await vi.waitFor(() => expect(popover.textContent?.replace(/\s+/g, ' ').trim()).toBe('처리 기간 툴팁의 기본 설정입니다'))
    expect(isVisible(popover)).toBe(false)

    await userEvent.hover(text)
    await vi.waitFor(() => expect(isVisible(popover)).toBe(true))
    expect(popover.classList).toContain('active')
    expect(popover.getAttribute('aria-hidden')).toBe('false')
    expect(popover.style.top).not.toBe('')
    await userEvent.unhover(text)
    await vi.waitFor(() => expect(isVisible(popover)).toBe(false))

    icon.focus()
    const iconPopover = document.getElementById(icon.getAttribute('aria-labelledby')!)!
    await vi.waitFor(() => expect(isVisible(iconPopover)).toBe(true))
    await userEvent.keyboard('{Escape}')
    expect(isVisible(iconPopover)).toBe(false)
  })

  it('세로형·상자형은 위아래로 펼친다', async () => {
    const { $$ } = await render(Host, tooltips('vertical') + tooltips('box'))
    const buttons = $$<HTMLButtonElement>('button')
    expect(buttons[0].classList).toContain('tooltip-vertical')
    expect(buttons[3].classList).toContain('tooltip-box')
    await userEvent.hover(buttons[0])
    const popover = document.getElementById(buttons[0].getAttribute('aria-labelledby')!)!
    await vi.waitFor(() => expect(popover.classList).toContain('bottom'))
    expect(popover.classList).toContain('tooltip-vertical')
  })

  it('비활성화면 보이지 않는다', async () => {
    const { $ } = await render(Host, '<krds-tooltip disabled content="설명">버튼</krds-tooltip>')
    $('button').dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(isVisible($('.krds-tooltip-popover'))).toBe(false)
  })

  it('접근성 위반이 없다', async () => {
    const { el, $$ } = await render(Host, tooltips())
    await userEvent.hover($$('button')[0])
    await expectNoA11yViolations(el)
  })
})
