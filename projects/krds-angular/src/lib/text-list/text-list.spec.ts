import { Component } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsTextList } from './text-list'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsTextList], template: '<ul krdsTextList><li>항목</li></ul>' })
class Host {}

describe('KrdsTextList', () => {
  it('기본 ul·ol에 KRDS 클래스, 기본 스타일은 dash', async () => {
    const { $$ } = await render(Host, '<ul krdsTextList><li>가</li></ul><ol krdsTextList variant="decimal"><li>나</li></ol>')
    const [ul, ol] = $$('ul, ol')
    expect(classesOf(ul)).toEqual(['dash', 'krds-info-list'])
    expect(ol.tagName).toBe('OL')
    expect(classesOf(ol)).toEqual(['decimal', 'krds-info-list'])
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      '<ul krdsTextList variant="hollow"><li>가</li></ul><ol krdsTextList variant="ordered"><li>나</li></ol>'
    )
    await expectNoA11yViolations(el)
  })
})
