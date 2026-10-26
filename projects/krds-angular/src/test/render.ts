import type { Type } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import axe from 'axe-core'

/**
 * 테스트용 호스트 컴포넌트의 템플릿을 바꿔 렌더하고, 자주 쓰는 조회·조작 함수를 돌려준다
 *
 * @example const { $, click } = await render(Host, '<button krdsButton>확인</button>')
 */
export async function render<T>(host: Type<T>, template: string) {
  TestBed.overrideTemplate(host, template)
  const fixture = TestBed.createComponent(host)
  await fixture.whenStable()
  const el = fixture.nativeElement as HTMLElement
  return {
    fixture,
    el,
    host: fixture.componentInstance,
    $: <E extends Element = HTMLElement>(selector: string) => el.querySelector(selector) as E,
    $$: <E extends Element = HTMLElement>(selector: string) => [...el.querySelectorAll(selector)] as E[],
    /** 화면 갱신을 기다린다 */
    stable: () => fixture.whenStable(),
    /** 클릭하고 화면 갱신을 기다린다 */
    click: async (target: Element) => {
      ;(target as HTMLElement).click()
      await fixture.whenStable()
    }
  }
}

/** 클래스 목록 (ngModel이 붙이는 ng-pristine 등 폼 상태 클래스는 뺀다) */
export const classesOf = (el: Element) => [...el.classList].filter(name => !name.startsWith('ng-')).sort()

/** axe-core 접근성 검사에서 위반이 없는지 확인한다 */
export async function expectNoA11yViolations(el: Element) {
  const { violations } = await axe.run(el)
  expect(violations).toEqual([])
}
