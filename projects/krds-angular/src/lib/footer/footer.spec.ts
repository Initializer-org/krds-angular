import { Component } from '@angular/core'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsFooter, KrdsFooterBottom, KrdsFooterContent, KrdsFooterLogo, KrdsFooterTop } from './footer'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsFooter, KrdsFooterTop, KrdsFooterLogo, KrdsFooterContent, KrdsFooterBottom],
  template: '<footer krdsFooter></footer>'
})
class Host {}

const template = `
  <footer krdsFooter>
    <div krdsFooterTop><button type="button" class="link">관련 사이트</button></div>
    <div krdsFooterLogo><span class="sr-only">KRDS - Korea Design System</span></div>
    <div krdsFooterContent>
      <div class="f-info"><p class="info-addr">(26464) 강원특별자치도 원주시 건강로 32</p></div>
    </div>
    <div krdsFooterBottom>
      <div class="f-btm-text"><div class="f-menu"><a href="#!" class="point">개인정보처리방침</a></div></div>
    </div>
  </footer>
`

describe('KrdsFooter', () => {
  it('contentinfo 랜드마크(#krds-footer)에 영역을 KRDS 구조로 배치', async () => {
    const { $ } = await render(Host, template)
    const footer = $('footer')
    expect(footer.id).toBe('krds-footer')
    expect(footer.querySelector(':scope > .foot-quick > .inner > button.link')).toBeTruthy()
    expect([...footer.querySelector(':scope > .inner')!.children].map(child => child.className)).toEqual(['f-logo', 'f-cnt', 'f-btm'])
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(Host, template)
    await expectNoA11yViolations(el)
  })
})
