import { Component, signal } from '@angular/core'
import { classesOf, expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsResize, type KrdsResizeScale } from './resize'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsResize], template: '<krds-resize />' })
class Host {
  readonly scale = signal<KrdsResizeScale | undefined>(undefined)
  closed = 0
}

describe('KrdsResize', () => {
  afterEach(() => (document.body.style.zoom = ''))

  it('고르면 화면을 확대하고 [(scale)]를 바꾼 뒤 닫고 버튼으로 초점, 초기화', async () => {
    const { host, $, $$, stable } = await render(
      Host,
      '<div style="padding: 50px 200px"><krds-resize [(scale)]="scale" (closed)="closed = closed + 1" /></div>'
    )
    const root = $('krds-resize')
    expect(classesOf(root)).toEqual(['krds-drop-wrap', 'krds-resize'])
    expect(root.dataset['adjust']).toBe('scale')
    // 넘기거나 고르기 전에는 화면을 바꾸지 않고 '보통'으로 표시
    expect(document.body.style.zoom).toBe('')
    const button = $<HTMLButtonElement>('.drop-btn')
    await user.click(button)
    const items = $$<HTMLButtonElement>('.drop-list .item-link')
    expect(items.map(item => item.textContent?.trim())).toEqual(['작게', '보통', '조금 크게', '크게', '가장 크게'])
    expect(items[1].classList).toContain('active')
    expect(items[1].getAttribute('aria-pressed')).toBe('true')
    await expectNoA11yViolations(root)

    await user.click(items[3])
    expect(host.scale()).toBe('xlg')
    expect(document.body.style.zoom).toBe('1.3')
    expect(host.closed).toBe(1)
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(button)

    await user.click(button)
    await user.click($('.drop-bottom button'))
    expect(host.scale()).toBe('md')
    expect(document.body.style.zoom).toBe('1')

    host.scale.set('sm')
    await stable()
    expect(document.body.style.zoom).toBe('0.9')
  })
})
