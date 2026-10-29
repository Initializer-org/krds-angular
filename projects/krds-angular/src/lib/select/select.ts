import { Directive, booleanAttribute, computed, input } from '@angular/core'
import { KrdsControl } from '../control/control'

/** 셀렉트 크기 (KRDS 셀렉트 스타일에 있는 small·medium·large) */
export type KrdsSelectSize = 'small' | 'medium' | 'large'

/** 셀렉트 입력 상태 */
export type KrdsSelectState = 'default' | 'error' | 'success' | 'information'

/**
 * KRDS 셀렉트. 기본 `<select>`에 KRDS 클래스만 붙이므로 option·선택 값·disabled는 기본 요소 그대로 쓴다.
 * 선택 전 안내 문구는 `<option value="" disabled>선택</option>`으로 넣고, 이름은 label(보이는 레이블이 없으면 aria-label)로 준다.
 * `krdsControl`을 함께 적용하므로 폼 그룹 안에서는 label·도움말이 자동으로 연결된다
 *
 * @example
 * <krds-form-group label="지역">
 *   <select krdsSelect [(ngModel)]="region">
 *     <option value="" disabled>선택</option>
 *     <option value="seoul">서울</option>
 *   </select>
 * </krds-form-group>
 */
@Directive({
  selector: 'select[krdsSelect]',
  hostDirectives: [{ directive: KrdsControl, inputs: ['id'] }],
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
