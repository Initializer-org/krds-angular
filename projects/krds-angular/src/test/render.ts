import type { Type } from '@angular/core'
import { type ComponentFixture, TestBed } from '@angular/core/testing'
import axe from 'axe-core'
import { userEvent } from 'vitest/browser'

/** 마지막으로 렌더한 화면 (user가 입력 뒤 화면 갱신을 기다릴 대상) */
let current: ComponentFixture<unknown> | undefined

/**
 * 테스트용 호스트 컴포넌트의 템플릿을 바꿔 렌더하고, 자주 쓰는 조회·조작 함수를 돌려준다
 *
 * @example const { $, click } = await render(Host, '<button krdsButton>확인</button>')
 */
export async function render<T>(host: Type<T>, template: string) {
  TestBed.overrideTemplate(host, template)
  const fixture = TestBed.createComponent(host)
  current = fixture
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

/** 화면에 보이는지 (display·visibility까지 확인) */
export const isVisible = (el: Element | null | undefined) => !!el?.checkVisibility({ visibilityProperty: true })

/** aria-controls로 연결된 요소 */
export const controlledBy = (el: Element) => document.getElementById(el.getAttribute('aria-controls') ?? '')

/** 입력을 보낸 뒤 화면 갱신을 기다린다 (zoneless 변경 감지는 다음 프레임에 예약되므로 바로 확인하면 갱신 전일 수 있다) */
async function settle(action: Promise<unknown>) {
  await action
  await current?.whenStable()
}

/**
 * 실제 브라우저 입력(vitest/browser의 userEvent)을 보내고 화면 갱신까지 기다린다
 *
 * @example await user.click(button); await user.keyboard('{Escape}')
 */
export const user = {
  click: (element: Element) => settle(userEvent.click(element)),
  hover: (element: Element) => settle(userEvent.hover(element)),
  unhover: (element: Element) => settle(userEvent.unhover(element)),
  keyboard: (text: string) => settle(userEvent.keyboard(text)),
  tab: () => settle(userEvent.tab())
}
