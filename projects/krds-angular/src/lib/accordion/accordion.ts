import { Component, Directive, booleanAttribute, computed, inject, input, model, numberAttribute } from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

let nextId = 0

/**
 * KRDS 아코디언 묶음. 한 번에 한 항목만 펼치고, 펼친 항목의 value를 `[(open)]`으로 주고받는다
 *
 * @example
 * <div krdsAccordion [(open)]="openItem">
 *   <krds-accordion-item value="fee" label="수수료가 있나요?">수수료는 없습니다.</krds-accordion-item>
 *   <krds-accordion-item value="time" label="처리 기간은?">3일 이내입니다.</krds-accordion-item>
 * </div>
 */
@Directive({
  selector: '[krdsAccordion]',
  host: {
    class: 'krds-accordion',
    '[class.type-line]': 'typeLine()'
  }
})
export class KrdsAccordion {
  /** 펼친 항목의 value (없으면 모두 접힘) */
  readonly open = model<string | null>(null)
  /** 라인 스타일 */
  readonly typeLine = input(false, { transform: booleanAttribute })
  /** 항목 제목의 수준 (2~6). 페이지의 제목 구조에 맞춰, 바로 위 제목보다 한 단계 아래로 둔다 */
  readonly headingLevel = input(5, { transform: numberAttribute })

  /** 펼친 항목을 다시 누르면 접고, 다른 항목을 누르면 그 항목만 펼친다 */
  toggle(value: string) {
    this.open.set(this.open() === value ? null : value)
  }
}

/**
 * 아코디언 항목. 제목은 label로, 풍부한 제목은 `[krdsAccordionLabel]` 요소로 넣는다
 */
@Component({
  selector: 'krds-accordion-item',
  imports: [NgTemplateOutlet],
  host: {
    class: 'accordion-item',
    '[class.active]': 'isOpen()'
  },
  template: `
    <ng-template #button>
      <button
        type="button"
        class="btn-accordion"
        [class.active]="isOpen()"
        [id]="headerId"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="collapseId"
        (click)="accordion?.toggle(value())"
      >
        {{ label() }}<ng-content select="[krdsAccordionLabel]" />
      </button>
    </ng-template>
    <!-- 요소 이름은 바인딩할 수 없어 수준마다 둔다 (KRDS reset이 제목 수준과 관계없이 같은 모양으로 맞춤) -->
    @switch (accordion?.headingLevel()) {
      @case (2) {
        <h2 class="accordion-header"><ng-container [ngTemplateOutlet]="button" /></h2>
      }
      @case (3) {
        <h3 class="accordion-header"><ng-container [ngTemplateOutlet]="button" /></h3>
      }
      @case (4) {
        <h4 class="accordion-header"><ng-container [ngTemplateOutlet]="button" /></h4>
      }
      @case (6) {
        <h6 class="accordion-header"><ng-container [ngTemplateOutlet]="button" /></h6>
      }
      @default {
        <h5 class="accordion-header"><ng-container [ngTemplateOutlet]="button" /></h5>
      }
    }
    <div class="accordion-collapse collapse" role="region" [id]="collapseId" [attr.aria-labelledby]="headerId">
      <div class="accordion-body"><ng-content /></div>
    </div>
  `
})
export class KrdsAccordionItem {
  private readonly uid = nextId++

  /** 항목 값 (없으면 자동 생성) */
  readonly value = input(`krds-accordion-${this.uid}`)
  /** 제목 */
  readonly label = input<string>()

  protected readonly accordion = inject(KrdsAccordion, { optional: true })
  protected readonly headerId = `krds-accordion-header-${this.uid}`
  protected readonly collapseId = `krds-accordion-collapse-${this.uid}`
  protected readonly isOpen = computed(() => this.accordion?.open() === this.value())
}
