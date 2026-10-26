import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsControl } from '../control/control'
import { KrdsToggleSwitch } from './toggle-switch'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsToggleSwitch, KrdsControl, FormsModule],
  template: '<krds-toggle-switch><input type="checkbox" krdsControl />알림</krds-toggle-switch>'
})
class Host {
  readonly alarm = signal(false)
}

describe('KrdsToggleSwitch', () => {
  it('input 뒤에 스위치 모양 label을 붙여 연결하고, 레이블 클릭이 ngModel을 바꾼다', async () => {
    const { host, $, click } = await render(
      Host,
      '<krds-toggle-switch size="large"><input type="checkbox" krdsControl [(ngModel)]="alarm" />알림 받기</krds-toggle-switch>'
    )
    const input = $<HTMLInputElement>('input')
    const label = $<HTMLLabelElement>('label')
    expect(classesOf($('krds-toggle-switch'))).toEqual(['krds-form-toggle-switch', 'large'])
    expect(input.nextElementSibling).toBe(label)
    expect(label.htmlFor).toBe(input.id)
    expect(label.querySelector('.switch-toggle > i')).toBeTruthy()
    expect(label.textContent?.trim()).toBe('알림 받기')

    await click(label)
    expect(host.alarm()).toBe(true)
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      `
      <krds-toggle-switch><input type="checkbox" krdsControl />기본</krds-toggle-switch>
      <krds-toggle-switch><input type="checkbox" krdsControl checked disabled />비활성화</krds-toggle-switch>
    `
    )
    await expectNoA11yViolations(el)
  })
})
