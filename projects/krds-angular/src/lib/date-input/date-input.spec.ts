import { Component, signal } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { userEvent } from 'vitest/browser'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsFormGroup } from '../form-group/form-group'
import { KrdsInput } from '../input/input'
import { KrdsDateInput } from './date-input'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsDateInput, KrdsInput, KrdsFormGroup, FormsModule, ReactiveFormsModule],
  template: '<krds-date-input><input krdsInput aria-label="날짜" /></krds-date-input>'
})
class Host {
  readonly date = signal('')
  readonly control = new FormControl('')
}

const pad = (n: number) => String(n).padStart(2, '0')

async function renderDateInput(template = '<input krdsInput placeholder="YYYY.MM.DD" [(ngModel)]="date" />', attrs = '') {
  // 원본처럼 위로 열리도록 위쪽 공간을 둔다
  const result = await render(
    Host,
    `
      <div style="padding-top: 600px">
        <krds-form-group label="날짜 선택" hint="도움말">
          <krds-date-input ${attrs}>${template}</krds-date-input>
        </krds-form-group>
      </div>
    `
  )
  const { $, el, click, stable } = result
  const buttonByText = (text: string) => [...el.querySelectorAll('button')].find(button => button.textContent?.trim() === text)!
  const cell = (date: string) => $(`td[data-date="${date}"]`)
  return {
    ...result,
    input: $<HTMLInputElement>('input'),
    toggle: $<HTMLButtonElement>('.form-btn-datepicker'),
    wrap: $('.calendar-wrap'),
    caption: () => $('caption').textContent?.trim(),
    cell,
    pick: (date: string) => click(cell(date).querySelector('button')!),
    press: (text: string) => click(buttonByText(text)),
    escape: async () => {
      document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await stable()
    }
  }
}

describe('KrdsDateInput', () => {
  it('입력 필드에 datepicker 클래스, 옆에 달력 버튼, 바깥 틀은 calendar-conts', async () => {
    const { $, input, toggle } = await renderDateInput('<input krdsInput size="large" />')
    expect(classesOf($('krds-date-input'))).toEqual(['calendar-conts', 'form-conts'])
    expect(classesOf(input)).toEqual(['cal', 'datepicker', 'krds-input', 'large'])
    expect(input.parentElement?.className).toBe('calendar-input')
    expect(classesOf(toggle)).toEqual(['form-btn-datepicker', 'icon', 'krds-btn', 'large'])
    expect($<HTMLLabelElement>('label').htmlFor).toBe(input.id)
  })

  it('달력 열기·닫기, 연/월 목록, 기간·단일·오늘 선택, 취소, 키보드, 바깥 클릭', async () => {
    const { host, $, el, input, toggle, wrap, caption, cell, pick, press, click, stable, escape } = await renderDateInput()
    const now = new Date()
    const year = now.getFullYear()
    const open = async () => {
      await click(toggle)
      // 열린 뒤 달력 영역으로 초점 이동
      await vi.waitFor(() => expect(document.activeElement).toBe(wrap))
    }

    // 직접 입력은 기본 input 그대로
    input.value = '2025.03.10'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await stable()
    expect(host.date()).toBe('2025.03.10')

    // 열기: aria-expanded·표시 상태
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(getComputedStyle(wrap).display).toBe('none')
    await open()
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect($('.krds-calendar-area').classList).toContain('active')
    expect(getComputedStyle(wrap).display).not.toBe('none')

    // 선택 없이 확인하면 닫히지 않음
    await press('확인')
    expect(toggle.getAttribute('aria-expanded')).toBe('true')

    // 연/월 목록은 하나만 열리고, Esc는 목록만 닫고 초점을 연/월 버튼으로
    const yearButton = $('.btn-cal-switch.year')
    const monthButton = $('.btn-cal-switch.month')
    await click(yearButton)
    expect(yearButton.getAttribute('aria-expanded')).toBe('true')
    await click(monthButton)
    expect(yearButton.getAttribute('aria-expanded')).toBe('false')
    expect(monthButton.getAttribute('aria-expanded')).toBe('true')
    ;($('.calendar-mon-wrap button') as HTMLElement).focus()
    await escape()
    expect(monthButton.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(monthButton)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')

    // 처음엔 이번 달, 이전 달로 1월까지, 연도 경계 넘기
    expect(caption()).toBe(`${year}년 ${pad(now.getMonth() + 1)}월`)
    for (let i = 0; i < now.getMonth(); i++) await press('이전 달')
    expect(caption()).toBe(`${year}년 01월`)
    expect(yearButton.textContent?.trim()).toBe(`${year}년`)
    expect(monthButton.textContent?.trim()).toBe('01월')
    await press('이전 달')
    expect(caption()).toBe(`${year - 1}년 12월`)
    await press('다음 달')
    await press('다음 달')
    expect(caption()).toBe(`${year}년 02월`)
    expect(cell(`${year}.02.01`).classList).not.toContain('old')
    expect(cell(`${year}.03.01`).classList).toContain('new')

    // 첫 클릭은 시작일, 앞 날짜를 고르면 시작일을 다시 정하고, 다음 클릭으로 기간 완성
    await pick(`${year}.02.12`)
    expect(classesOf(cell(`${year}.02.12`))).toEqual(expect.arrayContaining(['period', 'start']))
    expect(cell(`${year}.02.12`).querySelector('button')?.getAttribute('aria-pressed')).toBe('true')
    await pick(`${year}.02.10`)
    expect(cell(`${year}.02.12`).classList).not.toContain('period')
    await pick(`${year}.02.12`)
    expect(classesOf(cell(`${year}.02.10`))).toEqual(expect.arrayContaining(['period', 'start']))
    expect(cell(`${year}.02.11`).classList).toContain('period')
    expect(classesOf(cell(`${year}.02.12`))).toEqual(expect.arrayContaining(['period', 'end']))
    expect(cell(`${year}.02.13`).classList).not.toContain('period')
    expect(cell(`${year}.02.13`).querySelector('button')?.getAttribute('aria-pressed')).toBe('false')

    // 확인: 기간 문자열을 input에 넣어 ngModel로 알리고, 닫고 초점을 달력 버튼으로
    await press('확인')
    expect(input.value).toBe(`${year}.02.10 ~ ${year}.02.12`)
    expect(host.date()).toBe(`${year}.02.10 ~ ${year}.02.12`)
    expect(getComputedStyle(wrap).display).toBe('none')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle)

    // 같은 날짜를 두 번 고르면 단일 날짜
    await open()
    await pick(`${year}.02.20`)
    await pick(`${year}.02.20`)
    expect(classesOf(cell(`${year}.02.20`))).toEqual(expect.arrayContaining(['period', 'start', 'end']))
    await press('확인')
    expect(host.date()).toBe(`${year}.02.20`)

    // 오늘
    const today = `${year}.${pad(now.getMonth() + 1)}.${pad(now.getDate())}`
    await open()
    await press('오늘')
    await press('확인')
    expect(host.date()).toBe(today)

    // 취소: 값 유지, 닫고 초점 복귀
    await open()
    await pick(`${year}.02.05`)
    await press('취소')
    expect(host.date()).toBe(today)
    expect(document.activeElement).toBe(toggle)

    // 달력 버튼을 다시 누르면 닫힘
    await open()
    await click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle)

    // 키보드: Enter로 열고 Tab으로 이전 달 버튼, Enter로 이동, Esc로 닫고 초점 복귀
    toggle.focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(document.activeElement).toBe(wrap))
    await userEvent.keyboard('{Tab}')
    expect(document.activeElement).toBe($('.btn-cal-move.prev'))
    const before = caption()
    await userEvent.keyboard('{Enter}')
    await stable()
    expect(caption()).not.toBe(before)
    await userEvent.keyboard('{Escape}')
    await stable()
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle)

    // 입력창 클릭은 유지, 바깥 클릭은 닫고 초점을 빼앗지 않음
    await open()
    await click(input)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    await click(el.querySelector('.form-hint')!)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).not.toBe(toggle)
    await expectNoA11yViolations(el)
  })

  it('비활성화: 기본 input의 disabled(reactive forms 포함)를 따라 달력 버튼도 비활성화', async () => {
    const { host, toggle, stable } = await renderDateInput('<input krdsInput [formControl]="control" />')
    await vi.waitFor(() => expect(toggle.disabled).toBe(false))

    host.control.disable()
    await stable()
    await vi.waitFor(() => expect(toggle.disabled).toBe(true))

    host.control.enable()
    await vi.waitFor(() => expect(toggle.disabled).toBe(false))
  })

  it('시작 연·월, 휴일·일정 표시, 연도 목록으로 이동', async () => {
    const { $, $$, caption, cell, click } = await renderDateInput(
      '<input krdsInput aria-label="날짜" />',
      `[initialYear]="2025" [initialMonth]="3" [holidays]="['2025.03.03']" [eventDates]="['2025.03.14']"`
    )
    await click($('.form-btn-datepicker'))
    expect(caption()).toBe('2025년 03월')
    expect(cell('2025.03.02').classList).toContain('day-off') // 일요일
    expect(cell('2025.03.03').classList).toContain('day-off')
    expect(cell('2025.03.14').classList).toContain('day-event')
    expect(cell('2025.03.04').classList).not.toContain('day-off')

    const yearButton = $('.btn-cal-switch.year')
    await click(yearButton)
    const option = $$('.calendar-year-wrap button').find(button => button.textContent?.trim() === `${new Date().getFullYear() - 1}년`)!
    await click(option)
    expect(caption()).toBe(`${new Date().getFullYear() - 1}년 03월`)
    expect(yearButton.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(yearButton)
  })

  it('여러 개 배치: 다른 달력을 열면 기존 달력은 닫힘', async () => {
    const { $$, click } = await render(
      Host,
      `
        <krds-date-input><input krdsInput aria-label="시작일" /></krds-date-input>
        <krds-date-input><input krdsInput aria-label="종료일" /></krds-date-input>
      `
    )
    const [first, second] = $$<HTMLButtonElement>('.form-btn-datepicker')
    await click(first)
    expect(first.getAttribute('aria-expanded')).toBe('true')
    await click(second)
    expect(first.getAttribute('aria-expanded')).toBe('false')
    expect(second.getAttribute('aria-expanded')).toBe('true')
  })

  it('달력 방향: 위쪽 공간이 모자라면 아래로, 충분하면 원본처럼 위로', async () => {
    const { $, $$, click } = await render(
      Host,
      `
        <krds-date-input><input krdsInput aria-label="위" /></krds-date-input>
        <div style="height: 700px"></div>
        <krds-date-input><input krdsInput aria-label="아래" /></krds-date-input>
      `
    )
    const [top, bottom] = $$<HTMLButtonElement>('.form-btn-datepicker')
    await click(top)
    await vi.waitFor(() => expect($('.calendar-wrap').classList).not.toContain('bottom'))
    await click(bottom)
    await vi.waitFor(() => expect($$('.calendar-wrap')[1].classList).toContain('bottom'))
  })
})
