import { Component, signal } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsDisclosure } from './disclosure'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsDisclosure], template: '<krds-disclosure label="더 보기">내용</krds-disclosure>' })
class Host {
  readonly open = signal(false)
}

describe('KrdsDisclosure', () => {
  it('버튼으로 펼치고 접고, 접힌 내용은 inert, [(expanded)]', async () => {
    const { host, $, click, stable } = await render(
      Host,
      '<krds-disclosure label="신청 자격 자세히 보기" [(expanded)]="open"><a href="#!">자격 안내</a></krds-disclosure>'
    )
    const root = $('krds-disclosure')
    const button = $('button')
    const wrap = $('.expand-wrap')
    expect(classesOf(root)).toEqual(['conts-expand-area', 'krds-disclosure'])
    expect(button.textContent?.trim()).toBe('신청 자격 자세히 보기')
    expect(button.getAttribute('aria-controls')).toBe(wrap.id)
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(wrap.inert).toBe(true)
    expect($('.expand-wrap > .expand-in > a')).toBeTruthy()

    await click(button)
    expect(host.open()).toBe(true)
    expect(root.classList).toContain('active')
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(wrap.inert).toBe(false)

    host.open.set(false)
    await stable()
    expect(root.classList).not.toContain('active')
    // 펼침 문구를 title로 받지 않아 기본 툴팁이 생기지 않는다
    expect(root.hasAttribute('title')).toBe(false)
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      '<krds-disclosure label="접힘">내용</krds-disclosure><krds-disclosure label="펼침" [expanded]="true">내용</krds-disclosure>'
    )
    await expectNoA11yViolations(el)
  })
})
