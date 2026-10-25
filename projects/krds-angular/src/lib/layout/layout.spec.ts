import { Component } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsHeader, KrdsHeaderBranding } from '../header/header'
import { KrdsMasthead } from '../masthead/masthead'
import { KrdsSkipLink } from '../skip-link/skip-link'
import { KrdsLayout, type KrdsLayoutScroll, type KrdsLayoutSize } from './layout'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsLayout, KrdsSkipLink, KrdsMasthead, KrdsHeader, KrdsHeaderBranding], template: '<div krdsLayout></div>' })
class Host {
  readonly scrolls: KrdsLayoutScroll[] = []
  readonly sizes: KrdsLayoutSize[] = []
}

const scrollTo = async (y: number) => {
  window.scrollTo({ top: y, behavior: 'instant' })
  await vi.waitFor(() => expect(Math.round(window.scrollY)).toBe(y))
  await new Promise(requestAnimationFrame)
}

const page = `
  <div krdsLayout class="custom-layout" (scrolled)="scrolls.push($event)" (resized)="sizes.push($event)">
    <div krdsSkipLink><a href="#container">본문 바로가기</a></div>
    <div krdsMasthead>이 누리집은 대한민국 공식 전자정부 누리집입니다.</div>
    <header krdsHeader>
      <div krdsHeaderBranding><h2 class="logo"><a href="#!"><span class="sr-only">KRDS</span></a></h2></div>
    </header>
    <main id="container"><div style="height: 3000px"><h1>본문</h1></div></main>
  </div>
`

describe('KrdsLayout', () => {
  afterEach(() => window.scrollTo({ top: 0, behavior: 'instant' }))

  it('.g-wrap, 본문 아래로 스크롤하면 방향 클래스, 본문 위로 돌아오면 지움, 스크롤·크기 이벤트', async () => {
    const { host, $, stable } = await render(Host, page)
    const wrap = $('[krdsLayout]')
    expect(wrap.id).toBe('wrap')
    expect(classesOf(wrap)).toEqual(['custom-layout', 'g-wrap'])
    await vi.waitFor(() => expect(host.sizes.length).toBeGreaterThan(0))
    const top = $('#container').offsetTop

    await scrollTo(top + 300)
    await stable()
    expect(wrap.classList).toContain('scroll-down')
    expect(host.scrolls.at(-1)).toMatchObject({ direction: 'down' })

    await scrollTo(top + 200)
    await stable()
    expect(wrap.classList).toContain('scroll-up')
    expect(wrap.classList).not.toContain('scroll-down')

    await scrollTo(0)
    await stable()
    expect(wrap.classList).not.toContain('scroll-up')
    expect(host.scrolls.at(-1)).toMatchObject({ scrollY: 0, direction: null })
  })

  it('scrollDetection을 끄면 방향 클래스를 붙이지 않는다', async () => {
    const { $, stable } = await render(
      Host,
      '<div krdsLayout [scrollDetection]="false"><main id="container"><div style="height: 3000px">본문</div></main></div>'
    )
    await scrollTo($('#container').offsetTop + 300)
    await stable()
    expect($('[krdsLayout]').classList).not.toContain('scroll-down')
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(Host, page)
    await expectNoA11yViolations(el)
  })
})
