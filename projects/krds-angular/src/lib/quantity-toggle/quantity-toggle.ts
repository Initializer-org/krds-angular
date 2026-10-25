import { Component, ElementRef, booleanAttribute, computed, input, model, numberAttribute, viewChild } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

let nextId = 0

/**
 * KRDS 수량 토글. 수량 값은 spinbutton(↑/↓ 1씩, Home/End 최솟값/최댓값)이고, −/+ 버튼은 탭 순서에서 빼고 누르면 초점을 수량 값으로 옮긴다
 * (끝값에서 버튼이 비활성화돼도 초점을 잃지 않고 화면낭독기가 바뀐 값을 읽음). 값은 `[(value)]`(Signal Forms `[formField]` 포함)
 *
 * @example <krds-quantity-toggle label="인원" [min]="1" [max]="9" [(value)]="count" />
 */
@Component({
  selector: 'krds-quantity-toggle',
  host: {
    class: 'krds-quantity-toggle',
    '[class.vertical]': 'vertical()',
    '[class.disabled]': 'disabled()'
  },
  template: `
    <span [id]="labelId" [class]="hideLabel() ? 'sr-only' : 'quantity-label'">{{ label() }}</span>
    <div class="quantity-control">
      <!-- 세로형은 + 버튼이 위 (KRDS 가이드 모범 사례). 읽는 순서도 화면과 같게 DOM 순서를 뒤집는다 -->
      @if (vertical()) {
        <ng-container *ngTemplateOutlet="button; context: { $implicit: 1 }" />
      } @else {
        <ng-container *ngTemplateOutlet="button; context: { $implicit: -1 }" />
      }
      <span
        #spin
        class="quantity-value"
        role="spinbutton"
        [attr.id]="id()"
        [attr.tabindex]="disabled() ? -1 : 0"
        [attr.aria-labelledby]="labelId"
        [attr.aria-valuenow]="current()"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        [attr.aria-disabled]="disabled() || null"
        (keydown)="onKeydown($event)"
      >
        {{ current() }}
      </span>
      @if (vertical()) {
        <ng-container *ngTemplateOutlet="button; context: { $implicit: -1 }" />
      } @else {
        <ng-container *ngTemplateOutlet="button; context: { $implicit: 1 }" />
      }
    </div>

    <ng-template #button let-delta>
      <button
        type="button"
        class="krds-btn tertiary small btn-quantity"
        tabindex="-1"
        [disabled]="disabled() || (delta < 0 ? current() <= min() : current() >= max())"
        (click)="stepBy(delta)"
      >
        <i class="svg-icon" [class]="delta < 0 ? 'ico-minus' : 'ico-plus'" aria-hidden="true"></i>
        <span class="sr-only">{{ label() }} {{ delta < 0 ? '감소' : '증가' }}</span>
      </button>
    </ng-template>
  `,
  imports: [NgTemplateOutlet]
})
export class KrdsQuantityToggle {
  /** 수량 (없으면 min) */
  readonly value = model<number>()
  /** 레이블 */
  readonly label = input.required<string>()
  /** 레이블을 화면에서 숨김 (화면낭독기는 읽음) */
  readonly hideLabel = input(false, { transform: booleanAttribute })
  readonly min = input(0, { transform: numberAttribute })
  readonly max = input(10, { transform: numberAttribute })
  /** 세로형 (+ 버튼이 위) */
  readonly vertical = input(false, { transform: booleanAttribute })
  readonly disabled = input(false, { transform: booleanAttribute })
  /** 수량 값 요소의 id */
  readonly id = input<string>()

  protected readonly labelId = `krds-quantity-label-${nextId++}`
  protected readonly current = computed(() => this.value() ?? this.min())
  private readonly spin = viewChild.required<ElementRef<HTMLElement>>('spin')

  private update(next: number) {
    const value = Math.min(this.max(), Math.max(this.min(), next))
    if (this.disabled() || value === this.current()) return
    this.value.set(value)
  }

  protected stepBy(delta: number) {
    this.update(this.current() + delta)
    this.spin().nativeElement.focus()
  }

  protected onKeydown(event: KeyboardEvent) {
    const next = { ArrowUp: this.current() + 1, ArrowDown: this.current() - 1, Home: this.min(), End: this.max() }[event.key]
    if (next === undefined) return
    event.preventDefault()
    this.update(next)
  }
}
