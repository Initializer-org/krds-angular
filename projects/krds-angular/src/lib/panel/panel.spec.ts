import { Component, signal } from '@angular/core'
import { expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsTabPanel, KrdsTabs } from '../tabs/tabs'
import { KrdsPanel } from './panel'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsPanel, KrdsTabs, KrdsTabPanel], template: '<krds-panel />' })
class Host {
  readonly open = signal(false)
  readonly tabs = [
    { id: 'help', label: '도움' },
    { id: 'tutorial', label: '따라하기' }
  ]
}

describe('KrdsPanel', () => {
  afterEach(() => document.documentElement.style.removeProperty('--krds-help-panel--button-bottom'))

  it('도움말 버튼으로 열고 접어두기로 닫으면 도움말 버튼으로 초점, [(open)]', async () => {
    const { host, $ } = await render(
      Host,
      `
        <krds-panel [(open)]="open">
          <krds-tabs [tabs]="tabs">
            <ng-template krdsTabPanel="help"><p>도움 내용</p></ng-template>
            <ng-template krdsTabPanel="tutorial"><p>따라하기 내용</p></ng-template>
          </krds-tabs>
        </krds-panel>
      `
    )
    expect($('krds-panel').className).toBe('inner help-panel-flexible')
    const expand = $<HTMLButtonElement>('.btn-help-panel.expand')
    const panel = $('.krds-help-panel')
    expect(panel.classList).not.toContain('expand')

    await user.click(expand)
    expect(host.open()).toBe(true)
    expect(panel.classList).toContain('expand')
    expect($('.help-conts-area krds-tabs')).toBeTruthy()

    const fold = $<HTMLButtonElement>('.btn-help-panel.fold')
    await vi.waitFor(() => expect(getComputedStyle(fold).visibility).toBe('visible'))
    await user.click(fold)
    expect(host.open()).toBe(false)
    expect(panel.classList).not.toContain('expand')
    expect(document.activeElement).toBe(expand)
  })

  it('공식 배너·헤더가 보이면 그 높이만큼 내리고, 헤더가 숨으면 원위치, 버튼 아래쪽 끝을 알린다', async () => {
    const { $ } = await render(
      Host,
      `
        <div id="wrap" class="g-wrap">
          <div id="krds-masthead" style="height: 40px"></div>
          <div id="krds-header"><div class="header-in" style="height: 100px"></div></div>
          <krds-panel />
          <div style="height: 3000px"></div>
        </div>
      `
    )
    const offset = () => $('krds-panel').style.getPropertyValue('--krds-help-panel--header-offset')
    await vi.waitFor(() => expect(offset()).toBe('140px'))
    await vi.waitFor(() => expect(getComputedStyle($('.help-panel-wrap')).paddingTop).toBe('140px'))
    const expand = $('.btn-help-panel.expand')
    const bottom = () => parseFloat(document.documentElement.style.getPropertyValue('--krds-help-panel--button-bottom'))
    await vi.waitFor(() => expect(bottom()).toBe(parseFloat(getComputedStyle(expand).top) + 140 + expand.offsetHeight))

    $('#wrap').classList.add('scroll-down')
    window.scrollTo({ top: 500, behavior: 'instant' })
    await vi.waitFor(() => expect(offset()).toBe('0px'))
    window.scrollTo({ top: 0, behavior: 'instant' })
  })

  it('접근성 위반이 없다', async () => {
    const { el, $ } = await render(Host, '<krds-panel [(open)]="open"><p>도움 내용</p></krds-panel>')
    await user.click($('.btn-help-panel.expand'))
    // 투명도 전환 중에는 글자가 흐리게 계산되므로 다 나타난 뒤 검사한다
    await vi.waitFor(() => expect(getComputedStyle($('.krds-help-panel')).opacity).toBe('1'))
    await expectNoA11yViolations(el)
  })
})
