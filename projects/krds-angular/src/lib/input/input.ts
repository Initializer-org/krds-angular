import { Directive, InjectionToken, computed, inject, input } from '@angular/core'
import { KrdsControl } from '../control/control'

/** 입력 필드 크기 (KRDS 실제 규격) */
export type KrdsInputSize = 'small' | 'medium' | 'large' | 'xlarge'

/** 감싸는 컴포넌트가 입력 요소에 더 붙일 클래스 (날짜 입력 필드의 'datepicker cal' 등) */
export const KRDS_INPUT_CLASS = new InjectionToken<string>('KRDS_INPUT_CLASS')

/**
 * KRDS 텍스트 입력 필드·텍스트 영역. 기본 `<input>`·`<textarea>`에 KRDS 클래스만 붙이므로
 * 값·type·placeholder·maxlength·required·disabled는 기본 요소 그대로 쓴다 (`[(ngModel)]`, `formControlName` 포함).
 * `krdsControl`을 함께 적용하므로 폼 그룹 안에서는 label·도움말이 자동으로 연결된다
 *
 * @example
 * <krds-form-group label="이름" hint="실명을 입력하세요">
 *   <input krdsInput [(ngModel)]="name" />
 * </krds-form-group>
 */
@Directive({
  selector: 'input[krdsInput], textarea[krdsInput]',
  hostDirectives: [{ directive: KrdsControl, inputs: ['id'] }],
  host: {
    '[class]': 'classes()'
  }
})
export class KrdsInput {
  /** 크기 */
  readonly size = input<KrdsInputSize>()

  private readonly extraClass = inject(KRDS_INPUT_CLASS, { optional: true })

  protected readonly classes = computed(() => ['krds-input', this.extraClass, this.size()].filter(Boolean).join(' '))
}
