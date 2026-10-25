import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import axe from 'axe-core'
import { KrdsControl } from '../control/control'
import { KrdsCheckArea, KrdsCheckbox, KrdsRadio } from './checkbox'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsCheckbox, KrdsRadio, KrdsCheckArea, KrdsControl, FormsModule, ReactiveFormsModule],
  template: '<krds-checkbox><input type="checkbox" krdsControl />기본</krds-checkbox>'
})
class Host {
  agree = false
  method = 'sms'
  readonly control = new FormControl({ value: true, disabled: true })
}

async function render(template: string) {
  TestBed.overrideTemplate(Host, template)
  const fixture = TestBed.createComponent(Host)
  await fixture.whenStable()
  const el = fixture.nativeElement as HTMLElement
  const $ = <T extends Element = HTMLElement>(selector: string) => el.querySelector(selector) as T
  const $$ = <T extends Element = HTMLElement>(selector: string) => [...el.querySelectorAll<T & Element>(selector)] as T[]
  return { fixture, el, host: fixture.componentInstance, $, $$ }
}

describe('KrdsCheckbox', () => {
  it('input 바로 뒤에 label을 붙여 자동 id로 연결하고, 레이블 클릭이 ngModel을 바꾼다', async () => {
    const { fixture, host, $ } = await render(
      '<krds-checkbox><input type="checkbox" krdsControl [(ngModel)]="agree" />개인정보 수집에 동의합니다</krds-checkbox>'
    )
    const root = $('krds-checkbox')
    const input = $<HTMLInputElement>('input')
    const label = $<HTMLLabelElement>('label')
    expect([...root.classList].sort()).toEqual(['krds-form-check', 'medium'])
    expect(input.nextElementSibling).toBe(label)
    expect(input.id).toMatch(/^krds-control-\d+$/)
    expect(label.htmlFor).toBe(input.id)
    expect(label.textContent?.trim()).toBe('개인정보 수집에 동의합니다')

    label.click()
    await fixture.whenStable()
    expect(input.checked).toBe(true)
    expect(host.agree).toBe(true)
  })

  it('직접 준 id를 그대로 쓰고, ngModel 값을 화면에 반영한다', async () => {
    const { fixture, host, $ } = await render(
      '<krds-checkbox><input type="checkbox" id="agree" krdsControl [(ngModel)]="agree" />동의</krds-checkbox>'
    )
    expect($('input').id).toBe('agree')
    expect($<HTMLLabelElement>('label').htmlFor).toBe('agree')

    host.agree = true
    fixture.changeDetectorRef.markForCheck()
    await fixture.whenStable()
    expect($<HTMLInputElement>('input').checked).toBe(true)
  })

  it('reactive forms의 값·disabled가 기본 input에 그대로 반영된다', async () => {
    const { $ } = await render('<krds-checkbox><input type="checkbox" krdsControl [formControl]="control" />비활성화</krds-checkbox>')
    const input = $<HTMLInputElement>('input')
    expect(input.checked).toBe(true)
    expect(input.disabled).toBe(true)
  })

  it('크기·chip·부가 설명', async () => {
    const { $$ } = await render(`
      <krds-checkbox size="large" description="부가적인 설명이 들어갑니다."><input type="checkbox" krdsControl />설명</krds-checkbox>
      <krds-checkbox chip description="chip에는 표시하지 않음"><input type="checkbox" krdsControl />Chip</krds-checkbox>
    `)
    const [large, chip] = $$('krds-checkbox')
    expect([...large.classList].sort()).toEqual(['krds-form-check', 'large'])
    expect(large.querySelector('.krds-form-check-cnt .krds-form-check-p')?.textContent).toBe('부가적인 설명이 들어갑니다.')
    expect([...chip.classList].sort()).toEqual(['krds-form-chip', 'medium'])
    expect(chip.querySelector('.krds-form-check-cnt')).toBeNull()
  })

  it('라디오: 같은 name과 ngModel로 묶고, 선택한 value가 모델이 된다', async () => {
    const { fixture, host, $$ } = await render(`
      <fieldset krdsCheckArea column>
        <legend>수신 방법</legend>
        <krds-radio><input type="radio" krdsControl name="method" value="sms" [(ngModel)]="method" />문자</krds-radio>
        <krds-radio><input type="radio" krdsControl name="method" value="email" [(ngModel)]="method" />이메일</krds-radio>
      </fieldset>
    `)
    const [sms, email] = $$<HTMLInputElement>('input')
    expect(sms.checked).toBe(true)

    $$<HTMLLabelElement>('label')[1].click()
    await fixture.whenStable()
    expect(email.checked).toBe(true)
    expect(host.method).toBe('email')
  })

  it('CheckArea: 기본은 가로, column이면 세로', async () => {
    const { $$ } = await render('<div krdsCheckArea></div><div krdsCheckArea column></div>')
    const [row, column] = $$('.krds-check-area')
    expect(row.classList).not.toContain('chk-column')
    expect(column.classList).toContain('chk-column')
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(`
      <div krdsCheckArea>
        <krds-checkbox><input type="checkbox" krdsControl />기본</krds-checkbox>
        <krds-checkbox><input type="checkbox" krdsControl checked disabled />선택된 비활성화</krds-checkbox>
        <krds-checkbox chip><input type="checkbox" krdsControl />Chip</krds-checkbox>
      </div>
      <fieldset krdsCheckArea column>
        <legend>수신 방법</legend>
        <krds-radio description="부가 설명"><input type="radio" krdsControl name="m" value="a" />문자</krds-radio>
        <krds-radio size="large"><input type="radio" krdsControl name="m" value="b" />이메일</krds-radio>
      </fieldset>
    `)
    expect((await axe.run(el)).violations).toEqual([])
  })
})
