import { Component } from '@angular/core'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsFigure, KrdsImage } from './image'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsImage, KrdsFigure], template: '<img krdsImage src="data:," alt="a" />' })
class Host {}

const src = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='

describe('KrdsImage', () => {
  it('KRDS 클래스와 기본 지연 로딩, 설명이 있으면 figure', async () => {
    const { $, $$ } = await render(
      Host,
      `
        <img krdsImage src="${src}" alt="정부서울청사 정문" />
        <figure krdsFigure><img krdsImage loading="eager" src="${src}" alt="세종청사 전경" /><figcaption>정부세종청사</figcaption></figure>
      `
    )
    const [plain, eager] = $$<HTMLImageElement>('img')
    expect(plain.className).toBe('krds-image')
    expect(plain.getAttribute('loading')).toBe('lazy')
    expect(eager.getAttribute('loading')).toBe('eager')
    expect($('figure').className).toBe('krds-figure')
  })

  it('개발 모드: 역할을 되풀이하거나 설명과 같은 대체 텍스트를 경고', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    await render(
      Host,
      `
        <img krdsImage src="${src}" alt="청사 사진" />
        <figure krdsFigure><img krdsImage src="${src}" alt="정부세종청사" /><figcaption>정부세종청사</figcaption></figure>
        <img krdsImage src="${src}" alt="정부서울청사 정문" />
      `
    )
    expect(warn.mock.calls.map(([message]) => String(message))).toEqual([
      expect.stringContaining('역할과 겹치는 말'),
      expect.stringContaining('옆 설명(figcaption)과 같게')
    ])
    warn.mockRestore()
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      `<figure krdsFigure><img krdsImage src="${src}" alt="세종청사 전경" /><figcaption>정부세종청사</figcaption></figure>`
    )
    await expectNoA11yViolations(el)
  })
})
