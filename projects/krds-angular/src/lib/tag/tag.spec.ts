import { page } from 'vitest/browser'
import { Component } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsTag, KrdsTagGroup } from './tag'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsTag, KrdsTagGroup], template: '<div krdsTagGroup><krds-tag>태그</krds-tag></div>' })
class Host {
  removed: MouseEvent[] = []
}

describe('KrdsTag', () => {
  it('삭제 버튼이 있는 태그, 삭제 버튼을 누르면 remove', async () => {
    const { host, $ } = await render(Host, '<div krdsTagGroup><krds-tag (remove)="removed.push($event)">정책</krds-tag></div>')
    const tag = $('krds-tag')
    expect([...tag.classList]).toEqual(['krds-btn-tag'])
    expect(tag.firstElementChild?.textContent).toBe('정책')
    expect($('button.btn-delete .sr-only').textContent).toBe('삭제')
    // 어느 태그를 지우는지 알 수 있게 "정책 삭제"로 읽힌다
    expect(page.getByRole('button', { name: '정책 삭제' }).query()).toBe($('button.btn-delete'))

    $('button.btn-delete').click()
    expect(host.removed).toHaveLength(1)
    expect(host.removed[0]).toBeInstanceOf(MouseEvent)
  })

  it('링크 태그는 link 클래스를 붙이고 삭제 버튼이 없다', async () => {
    const { $ } = await render(Host, '<div krdsTagGroup><a krdsTag href="/search?q=정책">#정책</a></div>')
    const link = $<HTMLAnchorElement>('a')
    expect(classesOf(link)).toEqual(['krds-btn-tag', 'link'])
    expect(link.getAttribute('href')).toBe('/search?q=정책')
    expect(link.querySelector('button')).toBeNull()
  })

  it('태그 묶음 크기', async () => {
    const { el } = await render(Host, '<div krdsTagGroup></div><div krdsTagGroup size="large"></div>')
    const [medium, large] = el.querySelectorAll('div')
    expect(classesOf(medium)).toEqual(['krds-tag-wrap', 'medium'])
    expect(classesOf(large)).toEqual(['krds-tag-wrap', 'large'])
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      `
      <div krdsTagGroup size="small"><krds-tag>버튼</krds-tag><a krdsTag href="#!">링크</a></div>
      <div krdsTagGroup size="large"><krds-tag>버튼</krds-tag></div>
    `
    )
    await expectNoA11yViolations(el)
  })
})
