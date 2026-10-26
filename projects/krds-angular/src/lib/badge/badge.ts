import { Directive, booleanAttribute, computed, input } from '@angular/core'

/** 배지 형태 */
export type KrdsBadgeType = 'outline' | 'bg' | 'bg-light'

/** 배지 색 */
export type KrdsBadgeColor = 'primary' | 'secondary' | 'gray' | 'point' | 'danger' | 'warning' | 'success' | 'information' | 'disabled'

/** 배지 크기 */
export type KrdsBadgeSize = 'small' | 'medium' | 'large'

/**
 * KRDS 배지. 기본 요소(보통 `<span>`)에 KRDS 클래스만 붙인다
 *
 * @example <span krdsBadge type="bg" color="danger" size="small">마감</span>
 */
@Directive({
  selector: '[krdsBadge]',
  host: { '[class]': 'classes()' }
})
export class KrdsBadge {
  /** 형태 */
  readonly type = input<KrdsBadgeType>('outline')
  /** 색 */
  readonly color = input<KrdsBadgeColor>('primary')
  /** 크기 */
  readonly size = input<KrdsBadgeSize>('large')
  /** 숫자 배지 */
  readonly number = input(false, { transform: booleanAttribute })

  protected readonly classes = computed(() =>
    ['krds-badge', `${this.type()}-${this.color()}`, this.size(), this.number() && 'number'].filter(Boolean).join(' ')
  )
}
