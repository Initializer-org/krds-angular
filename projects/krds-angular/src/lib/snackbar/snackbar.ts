import {
  Component,
  DOCUMENT,
  ElementRef,
  Injectable,
  PLATFORM_ID,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  signal,
  untracked
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

/** 스낵바 옵션 */
export interface KrdsSnackbarOptions {
  /** 제목 */
  title: string
  /** 본문 */
  message?: string
  /** 아이콘 클래스 (예: 'ico-success-fill') */
  icon?: string
  /** 작업 버튼 이름 (되돌리기·다시 시도 등 1개) */
  action?: string
  /** 작업 버튼을 눌렀을 때. 스낵바를 닫은 뒤 부르므로 안에서 다시 show()할 수 있다 */
  onAction?: () => void
  /** 노출 시간(ms). 기본 0으로 닫기 버튼을 누를 때까지 둔다 */
  duration?: number
}

/**
 * 어디서든 스낵바를 띄우는 서비스. 앱에 `<krds-snackbar />`를 한 번 두고 쓴다 (서버 렌더링에서는 띄우지 않음)
 *
 * @example this.snackbar.show({ title: '삭제 완료', message: '항목을 삭제했습니다.', action: '되돌리기', onAction: () => this.restore() })
 */
@Injectable({ providedIn: 'root' })
export class KrdsSnackbarService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID))
  private readonly state = signal<{ id: number; options: KrdsSnackbarOptions } | null>(null)
  private seq = 0
  private timer?: ReturnType<typeof setTimeout>

  /** 지금 띄운 스낵바 (show()마다 id가 바뀜) */
  readonly current = this.state.asReadonly()

  /** 스낵바 표시 (이미 떠 있으면 내용을 바꾼다. 한 페이지에 하나만 둔다) */
  show(options: KrdsSnackbarOptions) {
    if (!this.browser) return
    const duration = options.duration ?? 0
    clearTimeout(this.timer)
    this.state.set({ id: ++this.seq, options })
    if (duration > 0 && duration < 2 ** 31) this.timer = setTimeout(() => this.hide(), duration)
  }

  /** 스낵바 닫기 */
  hide() {
    clearTimeout(this.timer)
    this.state.set(null)
  }
}

/**
 * KRDS 스낵바 영역. role="status" 영역은 늘 두고 KrdsSnackbarService로 띄운 내용을 넣는다.
 * 버튼으로 닫으면 초점을 스낵바로 들어오기 전 요소로 돌려준다
 *
 * @example <krds-snackbar />
 */
@Component({
  selector: 'krds-snackbar',
  host: {
    class: 'krds-snackbar',
    role: 'status',
    '[class.active]': 'shown()',
    '(focusin)': 'onFocusin($event)'
  },
  template: `
    @if (shown() && service.current(); as snackbar) {
      <div class="snackbar-in">
        @if (snackbar.options.icon) {
          <i class="svg-icon snackbar-icon" [class]="snackbar.options.icon" aria-hidden="true"></i>
        }
        <!-- show()마다 바뀌는 id로 새로 그려 같은 내용도 다시 읽는다 -->
        @for (body of [snackbar]; track body.id) {
          <div class="snackbar-body">
            <strong class="snackbar-title">{{ body.options.title }}</strong>
            @if (body.options.message) {
              <p class="snackbar-text">{{ body.options.message }}</p>
            }
          </div>
        }
        @if (snackbar.options.action) {
          <!-- 가이드의 텍스트 버튼: KRDS 버튼의 link 스타일 -->
          <button type="button" class="krds-btn medium link snackbar-action" (click)="act(snackbar.options)">
            {{ snackbar.options.action }}
          </button>
        }
        <button type="button" class="krds-btn small icon snackbar-close" (click)="service.hide()">
          <span class="sr-only">닫기</span>
          <i class="svg-icon ico-popup-close" aria-hidden="true"></i>
        </button>
      </div>
    }
  `
})
export class KrdsSnackbar {
  protected readonly service = inject(KrdsSnackbarService)
  private readonly ready = signal(false)
  protected readonly shown = computed(() => this.ready() && !!this.service.current())
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly document = inject(DOCUMENT)
  private returnFocus: HTMLElement | null = null
  private hadFocus = false

  constructor() {
    afterNextRender(() => setTimeout(() => this.ready.set(true)))
    // 닫히면서 초점이 있던 버튼이 사라지면 body로 빠지므로, 스낵바로 들어오기 전 요소로 초점을 돌려준다
    afterRenderEffect(() => {
      const shown = this.shown()
      untracked(() => {
        if (shown) return
        if (this.hadFocus) this.returnFocus?.focus()
        this.hadFocus = false
      })
    })
  }

  protected onFocusin(event: FocusEvent) {
    const from = event.relatedTarget as HTMLElement | null
    if (!this.host.contains(from)) this.returnFocus = from
    this.hadFocus = true
  }

  /** 먼저 닫고 부른다: onAction 안에서 다시 show()한 스낵바(다시 시도 → 결과)가 남는다 */
  protected act(options: KrdsSnackbarOptions) {
    this.hadFocus = this.host.contains(this.document.activeElement)
    this.service.hide()
    options.onAction?.()
  }
}
