import { Component, signal } from '@angular/core'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsStep, KrdsStepIndicator } from './step-indicator'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsStepIndicator, KrdsStep],
  template: '<ol krdsStepIndicator><li krdsStep step="1단계">약관 동의</li></ol>'
})
class Host {
  readonly current = signal<number | null>(0)
  readonly steps = signal(['약관 동의', '정보 입력'])
  readonly loggedIn = signal(false)
}

const statuses = (el: Element) =>
  [...el.querySelectorAll('.krds-step-wrap > li')].map(li => `${li.className}:${li.querySelector('.step-tit')?.textContent}`)

describe('KrdsStepIndicator', () => {
  it('KRDS 마크업: 단계 번호·제목, 현재 단계 앞은 완료, 뒤는 대기, 현재 단계에만 현재단계 안내', async () => {
    const { el, $, $$ } = await render(
      Host,
      `
        <ol krdsStepIndicator [current]="1">
          <li krdsStep step="1단계">약관 동의</li>
          <li krdsStep step="2단계">정보 입력</li>
          <li krdsStep step="3단계">신청 완료</li>
        </ol>
      `
    )
    expect($('ol').className).toBe('krds-step-wrap')
    expect(statuses(el)).toEqual(['done:약관 동의', 'active:정보 입력', 'pending:신청 완료'])
    const [done, active] = $$('li')
    expect(active.querySelector('i.step')?.textContent).toBe('2단계')
    expect(active.querySelector('.sr-only')?.textContent).toBe('현재단계')
    expect(done.querySelector('.sr-only')).toBeNull()
    // 단계 제목은 내용으로 받아 기본 툴팁(title)이 생기지 않는다
    expect(active.hasAttribute('title')).toBe(false)
  })

  it('status로 상태를 직접 정할 수 있다', async () => {
    const { el } = await render(
      Host,
      `
        <ol krdsStepIndicator>
          <li krdsStep step="1" status="done">a</li>
          <li krdsStep step="2" status="active">b</li>
          <li krdsStep step="3" status="">c</li>
        </ol>
      `
    )
    expect(statuses(el)).toEqual(['done:a', 'active:b', 'pending:c'])
  })

  it('현재 단계 변경·단계 추가와 순서 변경을 반영', async () => {
    const { host, el, stable } = await render(
      Host,
      `
        <ol krdsStepIndicator [current]="current()">
          @for (title of steps(); track title; let i = $index) {
            <li krdsStep [step]="i + 1 + '단계'">{{ title }}</li>
          }
        </ol>
      `
    )
    host.current.set(1)
    await stable()
    expect(statuses(el)).toEqual(['done:약관 동의', 'active:정보 입력'])

    host.steps.update(steps => [...steps, '서류 첨부', '신청 완료'])
    await stable()
    expect(statuses(el)).toEqual(['done:약관 동의', 'active:정보 입력', 'pending:서류 첨부', 'pending:신청 완료'])

    host.steps.update(steps => ['본인 확인', ...steps])
    await stable()
    expect(statuses(el)).toEqual(['done:본인 확인', 'active:약관 동의', 'pending:정보 입력', 'pending:서류 첨부', 'pending:신청 완료'])
  })

  it('@if 단계와 @for 단계를 섞어도 실제 순서대로', async () => {
    const { host, el, stable } = await render(
      Host,
      `
        <ol krdsStepIndicator>
          @if (!loggedIn()) {
            <li krdsStep step="1단계">로그인</li>
          }
          @for (title of loggedIn() ? ['신청서 작성', '제출'] : ['약관 동의', '신청서 작성', '제출']; track $index) {
            <li krdsStep [step]="$index">{{ title }}</li>
          }
        </ol>
      `
    )
    host.loggedIn.set(true)
    await stable()
    expect(statuses(el)).toEqual(['active:신청서 작성', 'pending:제출'])
    host.loggedIn.set(false)
    await stable()
    expect(statuses(el)).toEqual(['active:로그인', 'pending:약관 동의', 'pending:신청서 작성', 'pending:제출'])
  })

  it('current가 숫자가 아니면 첫 단계가 현재 단계, 단계가 아닌 li는 순서에서 뺀다', async () => {
    const { host, el, stable } = await render(
      Host,
      `
        <ol krdsStepIndicator [current]="current()">
          <li class="sr-only">총 2단계</li>
          <li krdsStep step="1">a</li>
          <li krdsStep step="2">b</li>
        </ol>
      `
    )
    host.current.set(null)
    await stable()
    expect(statuses(el).slice(1)).toEqual(['active:a', 'pending:b'])
    host.current.set(Number.NaN)
    await stable()
    expect(statuses(el).slice(1)).toEqual(['active:a', 'pending:b'])
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      `
        <ol krdsStepIndicator [current]="2">
          <li krdsStep step="1단계">유의 사항 확인</li>
          <li krdsStep step="2단계">신청인 정보</li>
          <li krdsStep step="3단계">이사 전 살던 곳</li>
          <li krdsStep step="4단계">이사 온 곳</li>
        </ol>
      `
    )
    await expectNoA11yViolations(el)
  })
})
