import { Component, signal } from '@angular/core'
import { form, FormField } from '@angular/forms/signals'
import { classesOf, expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsRangeSlider } from './range-slider'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsRangeSlider, FormField], template: '<krds-range-slider label="a" />' })
class Host {
  readonly size = signal(16)
  readonly changes: number[] = []
  readonly px = (value: number) => `${value}px`
  readonly model = signal({ volume: 30 })
  readonly settings = form(this.model)
}

describe('KrdsRangeSlider', () => {
  it('레이블, 키보드로 값 변경, 값 글자는 화면과 aria-valuetext에, 채움 비율·눈금', async () => {
    const { host, $, $$ } = await render(
      Host,
      '<krds-range-slider label="글자 크기" [min]="12" [max]="24" [step]="2" [valueText]="px" [(value)]="size" (valueCommit)="changes.push($event)" />'
    )
    const root = $('krds-range-slider')
    const input = $<HTMLInputElement>('input[type="range"]')
    expect(classesOf(root)).toEqual(['krds-range-slider', 'value-handle'])
    expect($<HTMLLabelElement>('label').htmlFor).toBe(input.id)
    expect(input.value).toBe('16')
    expect(input.getAttribute('aria-valuetext')).toBe('16px')
    expect($('.range-value').textContent).toBe('16px')
    expect($$('.range-limits span').map(span => span.textContent)).toEqual(['12px', '24px'])
    expect(root.style.getPropertyValue('--krds-range-slider--percent')).toBe(String(4 / 12))
    expect($$('.range-tick')).toHaveLength(5)

    input.focus()
    await user.keyboard('{ArrowRight}')
    expect(host.size()).toBe(18)
    expect(input.getAttribute('aria-valuetext')).toBe('18px')
    expect($('.range-value').textContent).toBe('18px')
    await user.keyboard('{End}')
    expect(host.size()).toBe(24)
    expect(host.changes).toEqual([18, 24])
    await expectNoA11yViolations(root)
  })

  it('선택 값을 슬라이더 끝에, 단계가 많으면 눈금 없음, 레이블 숨김', async () => {
    const { $, $$ } = await render(Host, '<krds-range-slider label="음량" hideLabel valuePosition="end" [value]="40" />')
    expect(classesOf($('krds-range-slider'))).toEqual(['krds-range-slider', 'value-end'])
    expect($('.range-body > .range-value').textContent).toBe('40')
    expect($('input').hasAttribute('aria-valuetext')).toBe(false)
    expect($$('.range-tick')).toHaveLength(0)
    expect($('label').className).toBe('sr-only')
  })

  it('Signal Forms([formField])로 값을 주고받는다', async () => {
    const { host, $ } = await render(Host, '<krds-range-slider label="음량" [formField]="settings.volume" />')
    const input = $<HTMLInputElement>('input')
    expect(input.value).toBe('30')
    input.focus()
    await user.keyboard('{ArrowRight}')
    expect(host.model().volume).toBe(31)
  })
})
