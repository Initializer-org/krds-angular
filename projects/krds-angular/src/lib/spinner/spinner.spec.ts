import { Component } from '@angular/core'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsSpinner } from './spinner'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsSpinner], template: '<krds-spinner />' })
class Host {}

describe('KrdsSpinner', () => {
  it('화면낭독기에 로딩 중을 알리고, label이 있으면 화면에도 보인다', async () => {
    const { $$ } = await render(Host, '<krds-spinner /><krds-spinner label="불러오는 중입니다" />')
    const [plain, labeled] = $$('krds-spinner')
    expect(plain.className).toBe('krds-spinner')
    expect(plain.getAttribute('role')).toBe('status')
    expect(plain.textContent?.trim()).toBe('로딩 중')
    expect(labeled.querySelector('span:not(.sr-only)')?.textContent).toBe('불러오는 중입니다')
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(Host, '<krds-spinner label="불러오는 중입니다" />')
    await expectNoA11yViolations(el)
  })
})
