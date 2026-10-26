import { Component } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsLink } from './link'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsLink], template: '<a krdsLink href="#!">링크</a>' })
class Host {}

describe('KrdsLink', () => {
  it('기본은 krds-btn link이고 기본 속성과 사용자 class를 유지한다', async () => {
    const link = (
      await render(Host, '<a krdsLink href="https://www.krds.go.kr/" target="_blank" title="새 창 열림" class="custom">KRDS</a>')
    ).$<HTMLAnchorElement>('a')
    expect(classesOf(link)).toEqual(['custom', 'krds-btn', 'link'])
    expect(link.getAttribute('href')).toBe('https://www.krds.go.kr/')
    expect(link.target).toBe('_blank')
    expect(link.title).toBe('새 창 열림')
  })

  it('크기와 basic·pure를 클래스로 붙인다', async () => {
    const link = (await render(Host, '<a krdsLink href="#!" size="large" basic pure>본문 링크</a>')).$<HTMLAnchorElement>('a')
    expect(classesOf(link)).toEqual(['basic', 'krds-btn', 'large', 'link', 'pure'])
  })

  it('[link]="false"면 link 클래스를 뺀다', async () => {
    const link = (await render(Host, '<a krdsLink href="#!" [link]="false">링크</a>')).$<HTMLAnchorElement>('a')
    expect(classesOf(link)).toEqual(['krds-btn'])
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      `
      <a krdsLink href="https://www.krds.go.kr/" size="small" target="_blank" title="새 창 열림">
        <span class="underline">기본 링크</span> <i class="svg-icon ico-go"></i>
      </a>
      <a krdsLink href="#!" size="medium" pure><span class="underline">가상클래스 상태 시 컬러 유지</span></a>
      <a krdsLink href="#!" size="large" basic><span>밑줄 없음</span></a>
    `
    )
    await expectNoA11yViolations(el)
  })
})
