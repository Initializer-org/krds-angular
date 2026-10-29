import { Component, signal } from '@angular/core'
import { classesOf, expectNoA11yViolations, isVisible, render, user } from '../../test/render'
import { KrdsLanguageSwitcher, KrdsLanguageTop } from './language-switcher'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsLanguageSwitcher, KrdsLanguageTop], template: '<krds-language-switcher [languages]="languages" />' })
class Host {
  readonly languages = [
    { code: 'ko', name: '한국어', url: 'https://example.com/ko' },
    { code: 'en', name: 'English (영어)', url: 'https://example.com/en' },
    { code: 'ja', name: '日本語 (일본어)', url: 'https://example.com/ja' }
  ]
  readonly language = signal('ko')
  closed = 0
}

const template = `
  <div style="padding: 50px 200px">
    <krds-language-switcher [languages]="languages" [(language)]="language" (closed)="closed = closed + 1">
      언어변경
      <div krdsLanguageTop><p class="current-laguage"><span>현재 언어</span> <strong>{{ language() }}</strong></p></div>
    </krds-language-switcher>
  </div>
`

describe('KrdsLanguageSwitcher', () => {
  it('언어를 고르면 [(language)]를 바꾸고 닫은 뒤 버튼으로 초점, 현재 언어는 aria-current, Esc로 닫힘', async () => {
    const { host, $, $$ } = await render(Host, template)
    const root = $('krds-language-switcher')
    expect(classesOf(root)).toEqual(['krds-drop-wrap', 'krds-language'])
    const button = $<HTMLButtonElement>('.drop-btn')
    expect(button.textContent?.trim()).toBe('언어변경')
    expect($('.drop-menu .drop-in > .drop-top .current-laguage')).toBeTruthy()

    await user.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    const links = $$<HTMLAnchorElement>('.drop-list a')
    expect(links.map(a => a.lang)).toEqual(['ko', 'en', 'ja'])
    expect(links[0].getAttribute('aria-current')).toBe('true')
    expect(links[0].hasAttribute('aria-selected')).toBe(false)
    expect(links[0].querySelector('.sr-only')?.textContent).toBe('선택됨')
    await expectNoA11yViolations(root)

    await user.click(links[1])
    expect(host.language()).toBe('en')
    expect(host.closed).toBe(1)
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(button)
    expect(links[1].classList).toContain('active')

    await user.click(button)
    await user.keyboard('{Escape}')
    expect(isVisible($('.drop-menu'))).toBe(false)
  })

  it('버튼 글자와 아이콘 사이를 띄우고, 아이콘은 화면낭독기에서 숨긴다', async () => {
    const { $ } = await render(Host, '<krds-language-switcher [languages]="languages">Language</krds-language-switcher>')
    const button = $('.drop-btn')
    expect(button.textContent).toBe(' Language ')
    expect([...button.querySelectorAll('i')].every(icon => icon.getAttribute('aria-hidden') === 'true')).toBe(true)
  })

  it('external: 언어별 누리집으로 가는 새 창 링크', async () => {
    const { $, $$ } = await render(
      Host,
      '<krds-language-switcher type="external" dropPosition="left" [languages]="languages">Language</krds-language-switcher>'
    )
    expect($('krds-language-switcher').classList).toContain('drop-left')
    await user.click($('.drop-btn'))
    const links = $$<HTMLAnchorElement>('.drop-list a')
    expect(links.map(a => a.getAttribute('href'))).toEqual(['https://example.com/ko', 'https://example.com/en', 'https://example.com/ja'])
    expect(links[0].target).toBe('_blank')
    expect(links[0].title).toBe('새 창 열림')
    await expectNoA11yViolations($('krds-language-switcher'))
  })
})
