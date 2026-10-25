import { Directive, booleanAttribute, computed, input } from '@angular/core'

/** 셀렉트 크기 (KRDS 실제 규격) */
export type KrdsSelectSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

/** 셀렉트 입력 상태 */
export type KrdsSelectState = 'default' | 'error' | 'success' | 'information'

/**
 * KRDS 셀렉트. 기본 `<select>`에 KRDS 클래스만 붙이므로 option·선택 값·disabled는 기본 요소 그대로 쓴다.
 * 선택 전 안내 문구는 `<option value="" disabled>선택</option>`으로 넣고, 이름은 label(보이는 레이블이 없으면 aria-label)로 준다
 *
 * @example
 * <label for="region">지역</label>
 * <select id="region" krdsSelect [(ngModel)]="region">
 *   <option value="" disabled>선택</option>
 *   <option value="seoul">서울</option>
 * </select>
 */
@Directive({
  selector: 'select[krdsSelect]',
  host: {
    '[class]': 'classes()'
  }
})
export class KrdsSelect {
  /** 크기 */
  readonly size = input<KrdsSelectSize>('medium')
  /** 입력 상태 */
  readonly state = input<KrdsSelectState>('default')
  /** 정렬 스타일 (목록 정렬 기준 선택용) */
  readonly sort = input(false, { transform: booleanAttribute })

  protected readonly classes = computed(() =>
    [this.sort() ? 'krds-form-select-sort' : 'krds-form-select', this.size(), this.state() !== 'default' && `is-${this.state()}`]
      .filter(Boolean)
      .join(' ')
  )
}
