import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import axe from 'axe-core'
import { KrdsButton, type KrdsButtonVariant } from './button'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsButton], template: '<button krdsButton></button>' })
class Host {
  readonly variant = signal<KrdsButtonVariant>('secondary')
}

async function render(template: string) {
  TestBed.overrideTemplate(Host, template)
  const fixture = TestBed.createComponent(Host)
  await fixture.whenStable()
  return { fixture, button: fixture.nativeElement.querySelector('button') as HTMLButtonElement }
}

const classesOf = (el: Element) => [...el.classList].sort()

describe('KrdsButton', () => {
  it('기본은 krds-btn primary이고 사용자 class를 유지한다', async () => {
    const { button } = await render('<button krdsButton class="custom">확인</button>')
    expect(classesOf(button)).toEqual(['custom', 'krds-btn', 'primary'])
  })

  it('크기와 불리언 속성을 클래스로 붙인다', async () => {
    const { button } = await render('<button krdsButton size="large" text pure>확인</button>')
    expect(classesOf(button)).toEqual(['krds-btn', 'large', 'primary', 'pure', 'text'])
  })

  it('아이콘 버튼에는 변형 클래스를 붙이지 않는다', async () => {
    const { button } = await render('<button krdsButton icon border aria-label="닫기"></button>')
    expect(classesOf(button)).toEqual(['border', 'icon', 'krds-btn'])
  })

  it('입력이 바뀌면 클래스도 바뀐다', async () => {
    const { fixture, button } = await render('<button krdsButton [variant]="variant()">확인</button>')
    expect(button.classList).toContain('secondary')

    fixture.componentInstance.variant.set('tertiary')
    await fixture.whenStable()
    expect(classesOf(button)).toEqual(['krds-btn', 'tertiary'])
  })

  it('접근성 위반이 없다', async () => {
    const { fixture } = await render(`
      <button krdsButton>기본</button>
      <button krdsButton variant="secondary" disabled>비활성</button>
      <button krdsButton icon border aria-label="닫기"></button>
    `)
    const { violations } = await axe.run(fixture.nativeElement)
    expect(violations).toEqual([])
  })
})
