import { Component, signal } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsAccordion, KrdsAccordionItem } from './accordion'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsAccordion, KrdsAccordionItem],
  template: '<div krdsAccordion><krds-accordion-item label="a">a</krds-accordion-item></div>'
})
class Host {
  readonly open = signal<string | null>(null)
}

describe('KrdsAccordion', () => {
  it('펼치고 접기: ARIA 연결, 버튼·항목의 active, 한 번에 한 항목, [(open)]', async () => {
    const { host, $, $$, click, stable } = await render(
      Host,
      `
        <div krdsAccordion class="custom" [(open)]="open">
          <krds-accordion-item value="fee" label="수수료가 있나요?">수수료는 없습니다.</krds-accordion-item>
          <krds-accordion-item value="time"><span krdsAccordionLabel>처리 <strong>기간</strong>은?</span>3일 이내입니다.</krds-accordion-item>
        </div>
      `
    )
    expect(classesOf($('[krdsAccordion]'))).toEqual(['custom', 'krds-accordion'])
    const [fee, time] = $$('krds-accordion-item')
    const [feeButton, timeButton] = $$('.accordion-header > button.btn-accordion')
    const panel = $(`#${feeButton.getAttribute('aria-controls')}`)
    expect(panel.getAttribute('role')).toBe('region')
    expect(panel.getAttribute('aria-labelledby')).toBe(feeButton.id)
    expect(panel.querySelector('.accordion-body')?.textContent).toBe('수수료는 없습니다.')
    expect(timeButton.textContent?.trim()).toBe('처리 기간은?')
    expect(feeButton.getAttribute('aria-expanded')).toBe('false')
    // 접힌 내용은 KRDS CSS가 visibility: hidden으로 숨긴다
    expect(getComputedStyle(panel).visibility).toBe('hidden')

    await click(feeButton)
    expect(host.open()).toBe('fee')
    expect(feeButton.getAttribute('aria-expanded')).toBe('true')
    expect(feeButton.classList).toContain('active')
    expect(fee.classList).toContain('active')

    await click(timeButton)
    expect(host.open()).toBe('time')
    expect(fee.classList).not.toContain('active')
    expect(time.classList).toContain('active')

    await click(timeButton)
    expect(host.open()).toBeNull()
    expect(timeButton.classList).not.toContain('active')

    host.open.set('fee')
    await stable()
    expect(feeButton.getAttribute('aria-expanded')).toBe('true')
  })

  it('라인 스타일과 value를 주지 않은 항목', async () => {
    const { $, $$, click } = await render(
      Host,
      '<div krdsAccordion typeLine><krds-accordion-item label="a">A</krds-accordion-item><krds-accordion-item label="b">B</krds-accordion-item></div>'
    )
    expect(classesOf($('[krdsAccordion]'))).toEqual(['krds-accordion', 'type-line'])
    const [a, b] = $$('button')
    await click(b)
    expect(b.getAttribute('aria-expanded')).toBe('true')
    expect(a.getAttribute('aria-expanded')).toBe('false')
  })

  it('제목 수준: 기본 h5, headingLevel로 페이지 제목 구조에 맞춤', async () => {
    const { $, $$, host, stable } = await render(
      Host,
      `
        <div krdsAccordion><krds-accordion-item label="기본">A</krds-accordion-item></div>
        <div krdsAccordion headingLevel="3" [(open)]="open"><krds-accordion-item value="b" label="수준 3">B</krds-accordion-item></div>
      `
    )
    const [first, second] = $$('.accordion-header')
    expect(first.tagName).toBe('H5')
    expect(second.tagName).toBe('H3')
    // 제목 수준이 바뀌어도 버튼과 펼침 연결은 그대로
    const button = second.querySelector<HTMLButtonElement>('button.btn-accordion')!
    expect(button.textContent?.trim()).toBe('수준 3')
    host.open.set('b')
    await stable()
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect($(`#${button.getAttribute('aria-controls')}`).getAttribute('aria-labelledby')).toBe(button.id)
  })

  it('접근성 위반이 없다 (h2 아래 headingLevel 3: 제목 수준을 건너뛰지 않음)', async () => {
    const { el } = await render(
      Host,
      '<h2>자주 묻는 질문</h2><div krdsAccordion headingLevel="3" [open]="\'a\'"><krds-accordion-item value="a" label="질문 1">답 1</krds-accordion-item></div>'
    )
    await expectNoA11yViolations(el)
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      '<div krdsAccordion [open]="\'b\'"><krds-accordion-item value="a" label="질문 1">답 1</krds-accordion-item><krds-accordion-item value="b" label="질문 2">답 2</krds-accordion-item></div>'
    )
    await expectNoA11yViolations(el)
  })
})
