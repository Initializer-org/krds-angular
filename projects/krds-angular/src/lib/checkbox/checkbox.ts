import { Component, Directive, booleanAttribute, contentChild, input } from '@angular/core'
import { KrdsControl } from '../control/control'

/** 체크박스·라디오 버튼 크기 */
export type KrdsCheckboxSize = 'medium' | 'large'

/**
 * KRDS 체크박스·라디오 버튼. 안에 넣은 `<input krdsControl>` 뒤에 label을 붙여 연결한다.
 * 선택 상태·name·value·disabled는 기본 input에 그대로 쓴다 (`[(ngModel)]`, `formControlName` 포함)
 *
 * @example
 * <krds-checkbox description="부가 설명">
 *   <input type="checkbox" krdsControl [(ngModel)]="agree" />
 *   개인정보 수집에 동의합니다
 * </krds-checkbox>
 * <krds-radio><input type="radio" krdsControl name="method" value="email" [(ngModel)]="method" />이메일</krds-radio>
 */
@Component({
  selector: 'krds-checkbox, krds-radio',
  host: {
    '[class]': "(chip() ? 'krds-form-chip ' : 'krds-form-check ') + size()"
  },
  template: `
    <ng-content select="[krdsControl]" />
    <label [for]="control().id()"><ng-content /></label>
    @if (description() && !chip()) {
      <div class="krds-form-check-cnt">
        <p class="krds-form-check-p">{{ description() }}</p>
      </div>
    }
  `
})
export class KrdsCheckbox {
  /** 크기 */
  readonly size = input<KrdsCheckboxSize>('medium')
  /** Chip 스타일 */
  readonly chip = input(false, { transform: booleanAttribute })
  /** 레이블 아래 부가 설명 (Chip 스타일에서는 표시하지 않음) */
  readonly description = input<string>()

  protected readonly control = contentChild.required(KrdsControl)
}

/** 라디오 버튼 (마크업이 체크박스와 같아 같은 컴포넌트) */
export const KrdsRadio = KrdsCheckbox

/**
 * 체크박스·라디오 버튼 묶음. 기본은 가로, `column`이면 세로로 배치한다
 *
 * @example <fieldset krdsCheckArea column><legend>수신 방법</legend>...</fieldset>
 */
@Directive({
  selector: '[krdsCheckArea]',
  host: {
    class: 'krds-check-area',
    '[class.chk-column]': 'column()'
  }
})
export class KrdsCheckArea {
  /** 세로(컬럼) 배치 */
  readonly column = input(false, { transform: booleanAttribute })
}
