import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import axe from 'axe-core'
import { KrdsControl } from '../control/control'
import { KrdsToggleSwitch } from './toggle-switch'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsToggleSwitch, KrdsControl, FormsModule],
  template: '<krds-toggle-switch><input type="checkbox" krdsControl />알림</krds-toggle-switch>'
})
class Host {
  alarm = false
}

async function render(template: string) {
  TestBed.overrideTemplate(Host, template)
  const fixture = TestBed.createComponent(Host)
  await fixture.whenStable()
  const el = fixture.nativeElement as HTMLElement
  const $ = <T extends Element = HTMLElement>(selector: string) => el.querySelector(selector) as T
  return { fixture, el, host: fixture.componentInstance, $ }
}

describe('KrdsToggleSwitch', () => {
  it('input 뒤에 스위치 모양 label을 붙여 연결하고, 레이블 클릭이 ngModel을 바꾼다', async () => {
    const { fixture, host, $ } = await render(
      '<krds-toggle-switch size="large"><input type="checkbox" krdsControl [(ngModel)]="alarm" />알림 받기</krds-toggle-switch>'
    )
    const input = $<HTMLInputElement>('input')
    const label = $<HTMLLabelElement>('label')
    expect([...$('krds-toggle-switch').classList].sort()).toEqual(['krds-form-toggle-switch', 'large'])
    expect(input.nextElementSibling).toBe(label)
    expect(label.htmlFor).toBe(input.id)
    expect(label.querySelector('.switch-toggle > i')).toBeTruthy()
    expect(label.textContent?.trim()).toBe('알림 받기')

    label.click()
    await fixture.whenStable()
    expect(host.alarm).toBe(true)
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(`
      <krds-toggle-switch><input type="checkbox" krdsControl />기본</krds-toggle-switch>
      <krds-toggle-switch><input type="checkbox" krdsControl checked disabled />비활성화</krds-toggle-switch>
    `)
    expect((await axe.run(el)).violations).toEqual([])
  })
})
