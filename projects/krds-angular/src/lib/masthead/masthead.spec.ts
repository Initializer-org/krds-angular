import { Component } from '@angular/core'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsIdentifier } from '../identifier/identifier'
import { KrdsMasthead } from './masthead'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsMasthead, KrdsIdentifier], template: '<div krdsMasthead>배너</div>' })
class Host {}

describe('KrdsMasthead·KrdsIdentifier', () => {
  it('공식 배너: #krds-masthead 안 KRDS 구조에 문구', async () => {
    const { $ } = await render(Host, '<div krdsMasthead>이 누리집은 대한민국 공식 전자정부 누리집입니다.</div>')
    expect($('[krdsMasthead]').id).toBe('krds-masthead')
    expect($('#krds-masthead > .toggle-wrap > .toggle-head > .inner > .nuri-txt').textContent).toBe(
      '이 누리집은 대한민국 공식 전자정부 누리집입니다.'
    )
  })

  it('운영기관 식별자: 로고 이름과 문구', async () => {
    const { $ } = await render(Host, '<div krdsIdentifier logoLabel="보건복지부">이 누리집은 보건복지부 누리집입니다.</div>')
    const root = $('[krdsIdentifier]')
    expect(root.className).toBe('krds-identifier')
    expect(root.querySelector('.logo .sr-only')?.textContent).toBe('보건복지부')
    expect(root.querySelector('.ban-txt')?.textContent).toBe('이 누리집은 보건복지부 누리집입니다.')
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      '<div krdsMasthead>이 누리집은 대한민국 공식 전자정부 누리집입니다.</div><div krdsIdentifier>이 누리집은 보건복지부 누리집입니다.</div>'
    )
    await expectNoA11yViolations(el)
  })
})
