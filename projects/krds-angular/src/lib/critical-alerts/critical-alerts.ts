import { Component, computed, input } from '@angular/core'

/** 긴급 공지 종류 */
export type KrdsCriticalAlertType = 'danger' | 'ok' | 'info'

const BADGE_TEXT: Record<KrdsCriticalAlertType, string> = { danger: '긴급', ok: '안전', info: '안내' }

/**
 * KRDS 긴급 공지. 종류 배지(긴급·안전·안내), 문구, 자세히 보기 링크를 보여 준다 (링크 클릭은 기본 click으로 받음)
 *
 * @example <krds-critical-alerts type="danger" message="폭우로 일부 지역 도로가 통제됩니다." linkHref="/notice/1" />
 */
@Component({
  selector: 'krds-critical-alerts',
  template: `
    <ul class="krds-critical-alerts">
      <li>
        <div class="critical-ban">
          <span class="critical-badge" [class]="type()">{{ badgeText() }}</span>
          <p class="critical-txt">{{ message() }}</p>
          @if (linkHref(); as href) {
            <!-- 문구가 모바일에서 숨겨져도(m-hide) 링크 이름이 남도록 aria-label로 준다 -->
            <a class="krds-btn medium link basic" [href]="href" [attr.aria-label]="linkText()">
              <span class="m-hide">{{ linkText() }}</span>
              <i class="svg-icon ico-angle right"></i>
            </a>
          }
        </div>
      </li>
    </ul>
  `
})
export class KrdsCriticalAlerts {
  /** 종류 */
  readonly type = input<KrdsCriticalAlertType>('info')
  /** 공지 문구 */
  readonly message = input.required<string>()
  /** 자세히 보기 링크 주소 */
  readonly linkHref = input<string>()
  /** 자세히 보기 링크 문구 (모바일에서는 숨김) */
  readonly linkText = input('자세히 보기')

  protected readonly badgeText = computed(() => BADGE_TEXT[this.type()])
}
