import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import axe from 'axe-core'
import { KrdsSelect } from './select'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsSelect, FormsModule], template: '<select krdsSelect title="선택"></select>' })
class Host {
  region = ''
}

async function render(template: string) {
  TestBed.overrideTemplate(Host, template)
  const fixture = TestBed.createComponent(Host)
  await fixture.whenStable()
  const el = fixture.nativeElement as HTMLElement
  return { fixture, el, host: fixture.componentInstance, select: el.querySelector('select') as HTMLSelectElement }
}

// ngModel이 붙이는 ng-pristine 등 폼 상태 클래스는 빼고 비교한다
const classesOf = (el: Element) => [...el.classList].filter(name => !name.startsWith('ng-')).sort()

describe('KrdsSelect', () => {
  it('기본은 krds-form-select medium이고 ngModel이 선택 값을 받는다', async () => {
    const { fixture, host, select } = await render(`
      <select krdsSelect title="지역 선택" class="custom" [(ngModel)]="region">
        <option value="" disabled>선택</option>
        <option value="seoul">서울</option>
        <option value="busan">부산</option>
      </select>
    `)
    expect(classesOf(select)).toEqual(['custom', 'krds-form-select', 'medium'])

    select.value = 'busan'
    select.dispatchEvent(new Event('change'))
    await fixture.whenStable()
    expect(host.region).toBe('busan')
  })

  it('크기·입력 상태·정렬 스타일', async () => {
    const { el } = await render(`
      <select krdsSelect title="a" size="large" state="error"></select>
      <select krdsSelect title="b" sort></select>
    `)
    const [error, sort] = el.querySelectorAll('select')
    expect(classesOf(error)).toEqual(['is-error', 'krds-form-select', 'large'])
    expect(classesOf(sort)).toEqual(['krds-form-select-sort', 'medium'])
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(`
      <label for="region">지역</label>
      <select id="region" krdsSelect><option value="seoul">서울</option></select>
      <select krdsSelect aria-label="정렬 기준" sort><option>최신순</option></select>
      <label for="type">신청 유형</label>
      <select id="type" krdsSelect state="error" disabled><option>선택</option></select>
    `)
    expect((await axe.run(el)).violations).toEqual([])
  })
})
