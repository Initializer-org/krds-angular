import { Directive, booleanAttribute, computed, input } from '@angular/core'

/** 링크 크기 (링크는 small, medium, large만 지원) */
export type KrdsLinkSize = 'small' | 'medium' | 'large'

/**
 * KRDS 링크. 기본 `<a>`에 KRDS 클래스만 붙이므로 href·target·title·rel은 기본 속성 그대로 쓴다.
 * 새 창 링크는 `title="새 창 열림"`으로 그 사실을 알린다
 *
 * @example <a krdsLink href="https://www.krds.go.kr" target="_blank" title="새 창 열림" size="small">KRDS</a>
 */
@Directive({
  selector: 'a[krdsLink]',
  host: {
    class: 'krds-btn',
    '[class]': 'classes()'
  }
})
export class KrdsLink {
  /** 링크 크기 */
  readonly size = input<KrdsLinkSize>()
  /** link 클래스 적용 여부 */
  readonly link = input(true, { transform: booleanAttribute })
  /** 본문 텍스트 컬러 링크 */
  readonly basic = input(false, { transform: booleanAttribute })
  /** Pure 링크 여부 (가상클래스 상태 시 컬러 유지) */
  readonly pure = input(false, { transform: booleanAttribute })

  protected readonly classes = computed(() =>
    [this.size(), this.link() && 'link', this.basic() && 'basic', this.pure() && 'pure'].filter(Boolean).join(' ')
  )
}
