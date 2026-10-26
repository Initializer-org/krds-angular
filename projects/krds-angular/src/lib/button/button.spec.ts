import { Component, signal } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsButton, type KrdsButtonVariant } from './button'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsButton], template: '<button krdsButton></button>' })
class Host {
  readonly variant = signal<KrdsButtonVariant>('secondary')
}

describe('KrdsButton', () => {
  it('기본은 krds-btn primary이고 사용자 class를 유지한다', async () => {
    const button = (await render(Host, '<button krdsButton class="custom">확인</button>')).$('button')
    expect(classesOf(button)).toEqual(['custom', 'krds-btn', 'primary'])
  })

  it('크기와 불리언 속성을 클래스로 붙인다', async () => {
    const button = (await render(Host, '<button krdsButton size="large" text pure>확인</button>')).$('button')
    expect(classesOf(button)).toEqual(['krds-btn', 'large', 'primary', 'pure', 'text'])
  })

  it('아이콘 버튼에는 변형 클래스를 붙이지 않는다', async () => {
    const button = (await render(Host, '<button krdsButton icon border aria-label="닫기"></button>')).$('button')
    expect(classesOf(button)).toEqual(['border', 'icon', 'krds-btn'])
  })

  it('입력이 바뀌면 클래스도 바뀐다', async () => {
    const { host, $, stable } = await render(Host, '<button krdsButton [variant]="variant()">확인</button>')
    const button = $('button')
    expect(button.classList).toContain('secondary')

    host.variant.set('tertiary')
    await stable()
    expect(classesOf(button)).toEqual(['krds-btn', 'tertiary'])
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      `
      <button krdsButton>기본</button>
      <button krdsButton variant="secondary" disabled>비활성</button>
      <button krdsButton icon border aria-label="닫기"></button>
    `
    )
    await expectNoA11yViolations(el)
  })
})
