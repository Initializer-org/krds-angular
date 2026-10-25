import { Component, computed, input, model, output } from '@angular/core'

/** 코치마크 단계 */
export interface KrdsCoachMarkStep {
  id: number
  title: string
  description: string
}

/**
 * KRDS 코치마크. 화면의 한 단계 옆에 두고, 현재 단계(`[(current)]`)가 이 코치마크의 단계(`step`)이면 안내 말풍선을 보인다.
 * 말풍선의 이전으로·다음으로가 current를 바꾸고, 그만보기는 `(closed)`로 알린다
 *
 * @example
 * <krds-coach-mark [steps]="steps" [step]="1" [(current)]="current" (closed)="current.set(null)">
 *   <div class="coach-box">안내할 영역</div>
 * </krds-coach-mark>
 */
@Component({
  selector: 'krds-coach-mark',
  host: { class: 'krds-coach-mark' },
  template: `
    @if (current() === step() && stepData(); as data) {
      <div class="coach-balloon">
        <h5 class="sr-only">따라하기 가이드</h5>
        <h6 class="coach-tit">{{ step() }}단계 : {{ data.title }}</h6>
        <p class="desc">{{ data.description }}</p>
        <div class="coach-controls">
          <div class="num">
            <span class="sr-only">현재 단계</span>
            <strong>{{ step() }}</strong>
            <span class="sr-only">총 단계</span>
            <span>{{ steps().length }}</span>
          </div>
          <div class="btn-wrap">
            <button type="button" class="krds-btn small text" (click)="closed.emit()">그만보기</button>
            @if (step() !== 1) {
              <button type="button" class="krds-btn small text" (click)="current.set(step() - 1)">이전으로</button>
            }
            @if (step() !== steps().length) {
              <button type="button" class="krds-btn small tertiary" (click)="current.set(step() + 1)">다음으로</button>
            }
          </div>
        </div>
      </div>
    }
    <ng-content />
  `
})
export class KrdsCoachMark {
  /** 전체 단계 */
  readonly steps = input.required<KrdsCoachMarkStep[]>()
  /** 이 코치마크가 맡은 단계 번호 (1부터) */
  readonly step = input.required<number>()
  /** 지금 보이는 단계 번호 (없으면 null) */
  readonly current = model<number | null>(null)

  /** 그만보기를 눌렀을 때 */
  readonly closed = output<void>()

  protected readonly stepData = computed(() => this.steps()[this.step() - 1] ?? null)
}
