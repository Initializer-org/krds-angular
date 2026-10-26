import { Component, Injectable, PLATFORM_ID, afterNextRender, computed, inject, signal } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

/** 토스트 유형 (기본 노출 시간을 정함) */
export type KrdsToastType = 'info' | 'warning'

/** 토스트 옵션 */
export interface KrdsToastOptions {
  /** 유형 (info 3초, warning 4초) */
  type?: KrdsToastType
  /** 노출 시간(ms). 0이면 자동으로 닫지 않는다 */
  duration?: number
}

/** 유형별 기본 노출 시간(ms). KRDS 가이드: 정보형 2~3초, 주의·경고형 3~4초 */
const DEFAULT_DURATION: Record<KrdsToastType, number> = { info: 3000, warning: 4000 }

/**
 * 어디서든 토스트를 띄우는 서비스. 앱에 `<krds-toast />`를 한 번 두고 쓴다 (서버 렌더링에서는 띄우지 않음)
 *
 * @example
 * private readonly toast = inject(KrdsToastService)
 * save() { this.toast.info('저장되었습니다.') }
 */
@Injectable({ providedIn: 'root' })
export class KrdsToastService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID))
  private readonly state = signal<{ id: number; message: string } | null>(null)
  private seq = 0
  private timer?: ReturnType<typeof setTimeout>

  /** 지금 띄운 토스트 (show()마다 id가 바뀜) */
  readonly current = this.state.asReadonly()

  /** 토스트 표시 (떠 있으면 메시지를 바꾸고 노출 시간을 다시 센다) */
  show(message: string, options: KrdsToastOptions = {}) {
    if (!this.browser) return
    const duration = options.duration ?? DEFAULT_DURATION[options.type ?? 'info']
    clearTimeout(this.timer)
    this.state.set({ id: ++this.seq, message })
    // 2^31ms 이상(Infinity 포함)은 setTimeout이 바로 실행하므로 닫지 않음으로 본다
    if (duration > 0 && duration < 2 ** 31) this.timer = setTimeout(() => this.hide(), duration)
  }

  /** 정보형 토스트 (3초): 인증·저장·업로드 완료 등 */
  info(message: string, duration?: number) {
    this.show(message, { type: 'info', duration })
  }

  /** 주의·경고형 토스트 (4초): 인증·저장·업로드 실패 등 */
  warning(message: string, duration?: number) {
    this.show(message, { type: 'warning', duration })
  }

  /** 토스트 닫기 */
  hide() {
    clearTimeout(this.timer)
    this.state.set(null)
  }
}

/**
 * KRDS 토스트 영역. 화면낭독기가 읽는 role="status" 영역은 늘 두고, KrdsToastService로 띄운 메시지를 넣는다
 *
 * @example <krds-toast />
 */
@Component({
  selector: 'krds-toast',
  host: {
    class: 'krds-toast',
    role: 'status',
    '[class.active]': 'shown()'
  },
  template: `
    <!-- show()마다 바뀌는 id로 새로 그려 같은 메시지도 다시 읽고 등장 효과도 다시 나온다 -->
    @for (toast of shown() ? [service.current()!] : []; track toast.id) {
      <p class="toast-text">{{ toast.message }}</p>
    }
  `
})
export class KrdsToast {
  protected readonly service = inject(KrdsToastService)
  // 빈 영역을 먼저 문서에 넣고 다음 task부터 내용을 넣는다 (처음 그리기 전에 띄운 메시지도 화면낭독기가 읽게)
  private readonly ready = signal(false)
  protected readonly shown = computed(() => this.ready() && !!this.service.current())

  constructor() {
    afterNextRender(() => setTimeout(() => this.ready.set(true)))
  }
}
