import { Component, booleanAttribute, computed, input, model, numberAttribute, output } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

/** 선택 값을 보일 자리: handle은 손잡이 위, end는 슬라이더 끝 */
export type KrdsRangeSliderValuePosition = 'handle' | 'end'

/** 눈금을 그리는 최대 단계 수 (이보다 많으면 눈금 없음) */
const MAX_TICKS = 20

let nextId = 0

/**
 * KRDS 범위슬라이드. 기본 `<input type="range">`(키보드·화면낭독기 지원)를 KRDS 모양으로 그리고 값은 `[(value)]`로 주고받는다.
 * Signal Forms의 `[formField]`로도 연결된다. 화면의 값 글자는 valueText로 바꿀 수 있고 화면낭독기는 aria-valuetext로 같은 글을 읽는다
 *
 * @example <krds-range-slider label="글자 크기" [min]="12" [max]="24" [step]="2" [valueText]="px" [(value)]="size" />
 */
@Component({
  selector: 'krds-range-slider',
  host: {
    '[class]': "'krds-range-slider value-' + valuePosition()",
    '[style.--krds-range-slider--percent]': 'percent()'
  },
  template: `
    <label [for]="inputId()" [class]="hideLabel() ? 'sr-only' : 'range-label'">{{ label() }}</label>
    @if (valuePosition() === 'end') {
      <div class="range-body">
        <ng-container *ngTemplateOutlet="field" />
        <span class="range-value" aria-hidden="true">{{ text(current()) }}</span>
      </div>
    } @else {
      <ng-container *ngTemplateOutlet="field" />
    }

    <ng-template #field>
      <div class="range-field">
        <div class="range-track">
          <span class="range-fill"></span>
          @for (tick of ticks(); track $index) {
            <span class="range-tick" [style.--krds-range-slider--tick]="tick"></span>
          }
        </div>
        @if (valuePosition() === 'handle') {
          <span class="range-value" aria-hidden="true">{{ text(current()) }}</span>
        }
        <input
          class="range-input"
          type="range"
          [id]="inputId()"
          [min]="min()"
          [max]="max()"
          [step]="step()"
          [value]="current()"
          [attr.aria-valuetext]="valueText() ? text(current()) : null"
          (input)="value.set(read($event))"
          (change)="valueCommit.emit(read($event))"
        />
        <div class="range-limits" aria-hidden="true">
          <span>{{ text(min()) }}</span>
          <span>{{ text(max()) }}</span>
        </div>
      </div>
    </ng-template>
  `,
  imports: [NgTemplateOutlet]
})
export class KrdsRangeSlider {
  /** 값 (없으면 min) */
  readonly value = model<number>()
  /** 레이블 */
  readonly label = input.required<string>()
  /** 레이블을 화면에서 숨김 (화면낭독기는 읽음) */
  readonly hideLabel = input(false, { transform: booleanAttribute })
  readonly min = input(0, { transform: numberAttribute })
  readonly max = input(100, { transform: numberAttribute })
  readonly step = input(1, { transform: numberAttribute })
  /** 값을 글자로 (예: v => v + 'px') */
  readonly valueText = input<(value: number) => string>()
  /** 선택 값을 보일 자리 */
  readonly valuePosition = input<KrdsRangeSliderValuePosition>('handle')
  /** input의 id (없으면 자동 생성) */
  readonly id = input<string>()

  /** 값을 확정했을 때 (손을 뗄 때, change는 안쪽 input의 기본 이벤트와 겹쳐 쓰지 않음) */
  readonly valueCommit = output<number>()

  private readonly uid = `krds-range-slider-${nextId++}`
  protected readonly inputId = computed(() => this.id() ?? this.uid)
  protected readonly current = computed(() => this.value() ?? this.min())
  protected readonly percent = computed(() => (this.max() > this.min() ? (this.current() - this.min()) / (this.max() - this.min()) : 0))
  /** 양 끝을 뺀 단계 눈금 위치 (0~1) */
  protected readonly ticks = computed(() => {
    const count = Math.round((this.max() - this.min()) / this.step())
    return count > 1 && count <= MAX_TICKS ? Array.from({ length: count - 1 }, (_, i) => (i + 1) / count) : []
  })

  protected text(value: number) {
    return this.valueText()?.(value) ?? String(value)
  }

  protected read(event: Event) {
    return Number((event.target as HTMLInputElement).value)
  }
}
