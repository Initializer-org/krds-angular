import { Component } from '@angular/core'
import { expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsSkipLink } from './skip-link'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsSkipLink], template: '<div krdsSkipLink><a href="#main">본문</a></div>' })
class Host {}

describe('KrdsSkipLink', () => {
  it('KRDS 구조(#krds-skip-link > a), 초점 전에는 숨기고 첫 Tab에 화면에 보인다', async () => {
    const { $, $$, el } = await render(
      Host,
      `
        <div krdsSkipLink><a href="#main-content">본문 바로가기</a><a href="#gnb">주메뉴 바로가기</a></div>
        <nav id="gnb" aria-label="주메뉴">메뉴</nav>
        <main id="main-content"><h2>주요 콘텐츠</h2></main>
      `
    )
    const [first, second] = $$<HTMLAnchorElement>('#krds-skip-link > a')
    expect($('[krdsSkipLink]').id).toBe('krds-skip-link')
    expect(first.getAttribute('href')).toBe('#main-content')
    expect(first.getBoundingClientRect().height).toBeLessThanOrEqual(1)

    document.body.focus()
    await user.tab()
    expect(document.activeElement).toBe(first)
    await vi.waitFor(() => expect(first.getBoundingClientRect().height).toBeGreaterThan(1))
    await user.tab()
    expect(document.activeElement).toBe(second)
    await expectNoA11yViolations(el)
  })
})
