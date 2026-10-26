import { Component, Directive, computed, contentChildren, inject, input, numberAttribute } from '@angular/core'

/** 단계 상태 */
export type KrdsStepStatus = 'done' | 'active' | 'pending'

/**
 * 단계 표시기의 단계. 단계 제목은 내용으로 넣는다 (title 속성은 기본 툴팁이 되므로 쓰지 않음)
 */
@Component({
  selector: 'li[krdsStep]',
  host: { '[class]': 'state()' },
  template: `
    <span>
      @if (state() === 'active') {
        <em class="sr-only">현재단계</em>
      }
      <i class="step">{{ step() }}</i>
      <span class="step-tit"><ng-content /></span>
    </span>
  `
})
export class KrdsStep {
  /** 단계 번호 (예: '1단계') */
  readonly step = input.required<string | number>()
  /** 상태를 직접 정함 (지정하지 않으면 단계 표시기 안의 순서로 정함) */
  readonly status = input<KrdsStepStatus | ''>()

  private readonly indicator = inject(KrdsStepIndicator, { optional: true })

  protected readonly state = computed(() => this.status() || this.indicator?.statusOf(this) || 'pending')
}

/**
 * KRDS 단계 표시기. 진행 상태를 보여 주기만 한다 (KRDS 원본처럼 단계를 눌러 이동하지 않음).
 * 안에 든 `<li krdsStep>`의 실제 순서로 현재 단계 앞은 완료, 뒤는 대기로 표시하므로 단계를 @if·@for로 바꿔도 맞게 표시된다
 *
 * @example
 * <ol krdsStepIndicator [current]="1">
 *   <li krdsStep step="1단계">약관 동의</li>
 *   <li krdsStep step="2단계">정보 입력</li>
 * </ol>
 */
@Directive({
  selector: 'ol[krdsStepIndicator]',
  host: { class: 'krds-step-wrap' }
})
export class KrdsStepIndicator {
  /** 현재 단계 위치 (0부터, 숫자가 아니면 첫 단계) */
  readonly current = input(0, { transform: (value: unknown) => numberAttribute(value, 0) })

  private readonly steps = contentChildren(KrdsStep)

  /** 단계의 위치에 따른 상태 */
  statusOf(step: KrdsStep): KrdsStepStatus {
    const index = this.steps().indexOf(step)
    const current = this.current()
    // 아직 쿼리에 잡히지 않은 단계(-1)는 대기로 둔다
    return index < 0 || index > current ? 'pending' : index < current ? 'done' : 'active'
  }
}
