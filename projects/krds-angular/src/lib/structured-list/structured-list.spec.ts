import { Component } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsBadge } from '../badge/badge'
import { KrdsStructuredItem, KrdsStructuredList } from './structured-list'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsStructuredList, KrdsStructuredItem, KrdsBadge],
  template: '<ul krdsStructuredList><li krdsStructuredItem></li></ul>'
})
class Host {}

const item = `
  <li krdsStructuredItem>
    <div class="card-top"><span krdsBadge type="bg-light">뱃지</span></div>
    <div class="card-body"><a href="#!" class="c-text"><p class="c-tit">타이틀 영역</p><p class="c-txt">설명</p></a></div>
    <div class="card-btm"><span class="tag">태그</span></div>
  </li>
`

describe('KrdsStructuredList', () => {
  it('목록·항목 KRDS 마크업 (.in 안에 영역), 기본은 전체 폭', async () => {
    const { $, $$ } = await render(Host, `<ul krdsStructuredList>${item}${item}</ul><ul krdsStructuredList [full]="false">${item}</ul>`)
    const [full, half] = $$('ul')
    expect(classesOf(full)).toEqual(['krds-structured-list', 'type-full'])
    expect(classesOf(half)).toEqual(['krds-structured-list'])
    expect(full.querySelectorAll(':scope > li.structured-item > .in > .card-top')).toHaveLength(2)
    expect($('.in > .card-body .c-tit').textContent).toBe('타이틀 영역')
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(Host, `<ul krdsStructuredList>${item}</ul>`)
    await expectNoA11yViolations(el)
  })
})
