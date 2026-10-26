import { Component } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsBadge } from './badge'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsBadge], template: '<span krdsBadge>배지</span>' })
class Host {}

describe('KrdsBadge', () => {
  it('형태-색 클래스와 크기, 숫자 배지', async () => {
    const { $$ } = await render(Host, '<span krdsBadge>기본</span><span krdsBadge type="bg" color="danger" size="small" number>3</span>')
    const [plain, number] = $$('span')
    expect(classesOf(plain)).toEqual(['krds-badge', 'large', 'outline-primary'])
    expect(classesOf(number)).toEqual(['bg-danger', 'krds-badge', 'number', 'small'])
  })

  it('접근성 위반이 없다 (KRDS 색 대비 포함)', async () => {
    const types = ['outline', 'bg', 'bg-light']
    const colors = ['primary', 'secondary', 'gray', 'point', 'danger', 'warning', 'success', 'information']
    const badges = types
      .flatMap(type => colors.map(color => `<span krdsBadge type="${type}" color="${color}">${type}-${color}</span>`))
      .join('')
    const { el } = await render(Host, `<p>${badges}</p>`)
    await expectNoA11yViolations(el)
  })
})
