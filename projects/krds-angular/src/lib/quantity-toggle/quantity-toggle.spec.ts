import { Component, signal } from '@angular/core'
import { form, FormField } from '@angular/forms/signals'
import { classesOf, expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsQuantityToggle } from './quantity-toggle'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsQuantityToggle, FormField], template: '<krds-quantity-toggle label="a" />' })
class Host {
  readonly count = signal(1)
  readonly changes: number[] = []
  readonly model = signal({ people: 2 })
  readonly booking = form(this.model)
}

describe('KrdsQuantityToggle', () => {
  it('버튼으로 증감하고 끝값에서 버튼 비활성화, 누른 뒤 초점은 수량 값', async () => {
    const { host, $, $$ } = await render(
      Host,
      '<krds-quantity-toggle label="인원" [min]="1" [max]="3" [(value)]="count" (valueChange)="changes.push($event)" />'
    )
    const [minus, plus] = $$<HTMLButtonElement>('.btn-quantity')
    const spin = $('[role="spinbutton"]')
    expect(classesOf($('krds-quantity-toggle'))).toEqual(['krds-quantity-toggle'])
    expect(document.getElementById(spin.getAttribute('aria-labelledby')!)?.textContent).toBe('인원')
    expect([spin.getAttribute('aria-valuenow'), spin.getAttribute('aria-valuemin'), spin.getAttribute('aria-valuemax')]).toEqual([
      '1',
      '1',
      '3'
    ])
    expect(minus.disabled).toBe(true)
    expect(minus.tabIndex).toBe(-1)
    expect(minus.querySelector('.sr-only')?.textContent).toBe('인원 감소')

    await user.click(plus)
    await user.click(plus)
    expect(host.count()).toBe(3)
    expect(spin.textContent?.trim()).toBe('3')
    expect(plus.disabled).toBe(true)
    expect(document.activeElement).toBe(spin)
    expect(host.changes).toEqual([2, 3])
    await expectNoA11yViolations($('krds-quantity-toggle'))
  })

  it('키보드: ↑/↓ 1씩, Home/End 최솟값/최댓값, 범위 밖으로는 안 바뀜', async () => {
    const { host, $ } = await render(Host, '<krds-quantity-toggle label="인원" [min]="1" [max]="5" [(value)]="count" />')
    $('[role="spinbutton"]').focus()
    await user.keyboard('{ArrowUp}')
    expect(host.count()).toBe(2)
    await user.keyboard('{End}')
    expect(host.count()).toBe(5)
    await user.keyboard('{ArrowUp}')
    expect(host.count()).toBe(5)
    await user.keyboard('{Home}')
    expect(host.count()).toBe(1)
    await user.keyboard('{ArrowDown}')
    expect(host.count()).toBe(1)
  })

  it('세로형은 + 버튼이 위, 레이블 숨김, 비활성화면 버튼·키보드 모두 막힘', async () => {
    const { host, $, $$ } = await render(
      Host,
      '<krds-quantity-toggle label="수량" vertical hideLabel [(value)]="count" /><krds-quantity-toggle label="고정" disabled [(value)]="count" />'
    )
    const [vertical, disabled] = $$('krds-quantity-toggle')
    expect(vertical.classList).toContain('vertical')
    expect(vertical.querySelector('.quantity-control > :first-child .sr-only')?.textContent).toBe('수량 증가')
    expect(vertical.querySelector('span[id]')?.className).toBe('sr-only')
    expect(disabled.classList).toContain('disabled')
    const spin = disabled.querySelector<HTMLElement>('[role="spinbutton"]')!
    expect(spin.tabIndex).toBe(-1)
    expect(spin.getAttribute('aria-disabled')).toBe('true')
    expect([...disabled.querySelectorAll<HTMLButtonElement>('button')].every(button => button.disabled)).toBe(true)
    spin.focus()
    await user.keyboard('{ArrowUp}')
    expect(host.count()).toBe(1)
    expect($('krds-quantity-toggle')).toBeTruthy()
  })

  it('Signal Forms([formField])로 값을 주고받는다', async () => {
    const { host, $, $$ } = await render(Host, '<krds-quantity-toggle label="인원" [formField]="booking.people" />')
    expect($('[role="spinbutton"]').textContent?.trim()).toBe('2')
    await user.click($$('.btn-quantity')[1])
    expect(host.model().people).toBe(3)
  })
})
