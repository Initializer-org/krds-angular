import { Component } from '@angular/core'
import { page } from 'vitest/browser'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsCriticalAlerts } from './critical-alerts'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsCriticalAlerts], template: '<krds-critical-alerts message="공지" />' })
class Host {
  clicks = 0
}

describe('KrdsCriticalAlerts', () => {
  it('종류별 배지 문구와 문구, 자세히 보기 링크 (클릭은 기본 click으로)', async () => {
    const { host, $$, click } = await render(
      Host,
      `
        <krds-critical-alerts type="danger" message="폭우로 일부 도로가 통제됩니다." linkHref="/notice/1" (click)="clicks = clicks + 1" />
        <krds-critical-alerts type="ok" message="통제가 해제되었습니다." />
        <krds-critical-alerts message="점검 안내" linkText="공지 보기" linkHref="/notice/2" />
      `
    )
    const [danger, ok, info] = $$('krds-critical-alerts')
    expect(danger.querySelector('ul.krds-critical-alerts > li > .critical-ban')).toBeTruthy()
    expect(danger.querySelector('.critical-badge')?.className).toBe('critical-badge danger')
    expect(danger.querySelector('.critical-badge')?.textContent).toBe('긴급')
    expect(danger.querySelector('.critical-txt')?.textContent).toBe('폭우로 일부 도로가 통제됩니다.')
    expect(ok.querySelector('.critical-badge')?.textContent).toBe('안전')
    expect(ok.querySelector('a')).toBeNull()
    expect(info.querySelector('.critical-badge')?.textContent).toBe('안내')
    expect(info.querySelector('a .m-hide')?.textContent).toBe('공지 보기')

    const link = danger.querySelector('a')!
    link.addEventListener('click', event => event.preventDefault())
    expect(link.getAttribute('href')).toBe('/notice/1')
    await click(link)
    expect(host.clicks).toBe(1)
  })

  it('모바일 폭에서 링크 문구가 숨겨져도 링크 이름이 남는다', async () => {
    await page.viewport(414, 896)
    try {
      const { $, el } = await render(Host, '<krds-critical-alerts type="danger" message="긴급 공지" linkHref="#!" />')
      expect(getComputedStyle($('.m-hide')).display).toBe('none')
      expect($('a').getAttribute('aria-label')).toBe('자세히 보기')
      await expectNoA11yViolations(el)
    } finally {
      await page.viewport(1200, 900)
    }
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      `
        <krds-critical-alerts type="danger" message="긴급 공지" linkHref="#!" />
        <krds-critical-alerts type="ok" message="안전 공지" />
        <krds-critical-alerts type="info" message="안내 공지" />
      `
    )
    await expectNoA11yViolations(el)
  })
})
