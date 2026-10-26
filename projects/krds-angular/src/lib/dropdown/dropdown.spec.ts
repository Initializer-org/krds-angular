import { Component } from '@angular/core'
import { expectNoA11yViolations, isVisible, render, user } from '../../test/render'
import { KrdsDropdown } from './dropdown'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsDropdown], template: '<div krdsDropdown></div>' })
class Host {}

const dropdown = (attrs = '') => `
  <div style="padding: 100px">
    <div krdsDropdown ${attrs}>
      <button type="button" class="krds-btn small text drop-btn">메뉴명 <i class="svg-icon ico-toggle"></i></button>
      <div class="drop-menu">
        <div class="drop-in">
          <ul class="drop-list">
            <li><a href="#!" class="item-link">첫 메뉴</a></li>
            <li><a href="#!" class="item-link">둘째 메뉴</a></li>
          </ul>
        </div>
      </div>
    </div>
    <button type="button" class="outside">바깥</button>
  </div>
`

describe('KrdsDropdown', () => {
  it('KRDS 마크업에 붙이면 버튼으로 열고 닫고, Esc는 버튼으로 초점, 바깥 클릭·초점 이탈로 닫힘', async () => {
    const { $, $$ } = await render(Host, dropdown())
    const wrap = $('[krdsDropdown]')
    const button = $<HTMLButtonElement>('.drop-btn')
    const menu = $('.drop-menu')
    expect(wrap.classList).toContain('krds-drop-wrap')
    await vi.waitFor(() => expect(button.getAttribute('aria-expanded')).toBe('false'))
    expect(isVisible(menu)).toBe(false)

    await user.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.classList).toContain('active')
    expect(wrap.classList).toContain('active')
    expect(isVisible(menu)).toBe(true)

    // 초점을 받은 항목을 위로 (초점 테두리가 가리지 않게)
    const [first, second] = $$('.item-link')
    second.focus()
    expect([first.style.zIndex, second.style.zIndex]).toEqual(['0', '1'])

    await user.keyboard('{Escape}')
    expect(isVisible(menu)).toBe(false)
    expect(document.activeElement).toBe(button)

    await user.click(button)
    await user.click($('.outside'))
    expect(button.getAttribute('aria-expanded')).toBe('false')

    await user.click(button)
    first.focus()
    $('.outside').focus()
    await vi.waitFor(() => expect(button.getAttribute('aria-expanded')).toBe('false'))
  })

  it('위치를 정하거나, 화면 밖으로 넘치면 맞춘다', async () => {
    const { $, $$ } = await render(
      Host,
      `
        <div krdsDropdown position="right"><button type="button" class="drop-btn">a</button><div class="drop-menu"></div></div>
        <div style="position: absolute; left: 0; top: 300px">
          <div krdsDropdown><button type="button" class="krds-btn small text drop-btn">왼쪽 끝</button><div class="drop-menu"><div class="drop-in">메뉴가 왼쪽으로 넘칩니다</div></div></div>
        </div>
      `
    )
    expect($$('[krdsDropdown]')[0].classList).toContain('drop-right')
    const edge = $$('[krdsDropdown]')[1]
    expect(edge.classList).not.toContain('drop-left')
    await user.click(edge.querySelector('.drop-btn')!)
    await vi.waitFor(() => expect(edge.classList).toContain('drop-left'))
    expect($('.drop-btn')).toBeTruthy()
  })

  it('접근성 위반이 없다 (열림)', async () => {
    const { el, $ } = await render(Host, dropdown())
    await user.click($('.drop-btn'))
    await expectNoA11yViolations(el)
  })
})
