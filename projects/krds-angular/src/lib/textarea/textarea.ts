import { Component, input } from '@angular/core'

/**
 * KRDS 텍스트 영역의 글자 수 표시. 안에 `<textarea krdsInput>`을 넣고 현재 글자 수를 `count`로 넘긴다.
 * 글자 수 표시가 없으면 이 묶음 없이 `<textarea krdsInput>`만 쓴다
 *
 * @example
 * <krds-form-group label="문의 내용">
 *   <krds-textarea [count]="content.length" [max]="500">
 *     <textarea krdsInput [(ngModel)]="content" maxlength="500"></textarea>
 *   </krds-textarea>
 * </krds-form-group>
 */
@Component({
  selector: 'krds-textarea',
  host: { class: 'textarea-wrap' },
  template: `
    <ng-content />
    @if (count() !== undefined) {
      <p class="textarea-count">
        <span class="count-now">{{ count() }}</span>
        <span class="count-total">{{ max() ? '/' + max() : '' }}</span>
      </p>
    }
  `
})
export class KrdsTextarea {
  /** 현재 글자 수 (지정하면 글자 수 표시) */
  readonly count = input<number>()
  /** 최대 글자 수 */
  readonly max = input<number>()
}
