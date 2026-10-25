import { Directive, booleanAttribute, computed, input } from '@angular/core'

/** 버튼 크기 (KRDS 실제 규격) */
export type KrdsButtonSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

/** 버튼 변형 */
export type KrdsButtonVariant = 'primary' | 'secondary' | 'tertiary'

/**
 * KRDS 버튼. 기본 `<button>`에 KRDS 클래스만 붙이므로 type·disabled·폼 제출·접근성은 기본 버튼 동작 그대로다
 *
 * @example <button krdsButton variant="secondary" size="large">확인</button>
 */
@Directive({
  selector: 'button[krdsButton]',
  host: {
    class: 'krds-btn',
    '[class]': 'classes()'
  }
})
export class KrdsButton {
  /** 버튼 변형 */
  readonly variant = input<KrdsButtonVariant>('primary')
  /** 버튼 크기 */
  readonly size = input<KrdsButtonSize>()
  /** 아이콘 전용 버튼 */
  readonly icon = input(false, { transform: booleanAttribute })
  /** 테두리 스타일 (아이콘 버튼용) */
  readonly border = input(false, { transform: booleanAttribute })
  /** Pure 버튼 여부 (가상클래스 상태 시 컬러 유지) */
  readonly pure = input(false, { transform: booleanAttribute })
  /** 텍스트 버튼 스타일 */
  readonly text = input(false, { transform: booleanAttribute })

  protected readonly classes = computed(() =>
    [
      this.icon() && 'icon',
      this.border() && 'border',
      this.pure() && 'pure',
      this.text() && 'text',
      !this.icon() && this.variant(),
      this.size()
    ]
      .filter(Boolean)
      .join(' ')
  )
}
