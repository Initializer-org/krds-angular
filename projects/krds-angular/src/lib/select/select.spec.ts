import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsSelect } from './select'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsSelect, FormsModule], template: '<select krdsSelect title="선택"></select>' })
class Host {
  readonly region = signal('')
}

describe('KrdsSelect', () => {
  it('기본은 krds-form-select medium이고 ngModel이 선택 값을 받는다', async () => {
    const { host, $, stable } = await render(
      Host,
      `
      <select krdsSelect title="지역 선택" class="custom" [(ngModel)]="region">
        <option value="" disabled>선택</option>
        <option value="seoul">서울</option>
        <option value="busan">부산</option>
      </select>
    `
    )
    const select = $<HTMLSelectElement>('select')
    expect(classesOf(select)).toEqual(['custom', 'krds-form-select', 'medium'])

    select.value = 'busan'
    select.dispatchEvent(new Event('change'))
    await stable()
    expect(host.region()).toBe('busan')
  })

  it('크기·입력 상태·정렬 스타일', async () => {
    const { el } = await render(
      Host,
      `
      <select krdsSelect title="a" size="large" state="error"></select>
      <select krdsSelect title="b" sort></select>
    `
    )
    const [error, sort] = el.querySelectorAll('select')
    expect(classesOf(error)).toEqual(['is-error', 'krds-form-select', 'large'])
    expect(classesOf(sort)).toEqual(['krds-form-select-sort', 'medium'])
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      `
      <label for="region">지역</label>
      <select id="region" krdsSelect><option value="seoul">서울</option></select>
      <select krdsSelect aria-label="정렬 기준" sort><option>최신순</option></select>
      <label for="type">신청 유형</label>
      <select id="type" krdsSelect state="error" disabled><option>선택</option></select>
    `
    )
    await expectNoA11yViolations(el)
  })
})
