import { Component, DestroyRef, booleanAttribute, computed, inject, input, output, signal } from '@angular/core'

/** 음성 지원 버튼 크기 */
export type KrdsTtsSize = 'xsmall' | 'small' | 'medium'

/** 음성 지원 아이콘 */
export type KrdsTtsIcon = 'volume' | 'play'

/**
 * KRDS 음성 지원. 기본 `<button>`에 붙여, 누르면 text를 한국어 음성으로 읽고(SpeechSynthesis) 다시 누르면 멈춘다.
 * label이 없으면 aria-label로 이름을 준다
 *
 * @example <button krdsTts text="신청 방법을 안내합니다." label="듣기"></button>
 */
@Component({
  selector: 'button[krdsTts]',
  host: {
    type: 'button',
    '[class]': 'classes()',
    '[disabled]': 'disabled()',
    '(click)': 'toggle()'
  },
  template: `
    <span class="krds-tts-icon" aria-hidden="true"><i class="svg-icon" [class]="icon()"></i></span>
    @if (label()) {
      <span class="krds-tts-text">{{ label() }}</span>
    }
  `
})
export class KrdsTts {
  /** 읽을 글 */
  readonly text = input.required<string>()
  /** 화면에 보이는 버튼 글자 */
  readonly label = input<string>()
  /** 크기 */
  readonly size = input<KrdsTtsSize>('medium')
  /** 아이콘 */
  readonly iconType = input<KrdsTtsIcon>('volume', { alias: 'icon' })
  /** 비활성화 (기본 disabled도 그대로 쓸 수 있음) */
  readonly disabled = input(false, { transform: booleanAttribute })

  /** 읽기 시작했을 때 */
  readonly play = output<string>()
  /** 눌러서 멈췄을 때 */
  readonly pause = output<void>()
  /** 끝까지 읽었을 때 */
  readonly end = output<void>()
  /** 읽지 못했을 때 (SpeechSynthesis 미지원 포함) */
  readonly error = output<Error>()

  protected readonly playing = signal(false)

  protected readonly classes = computed(() =>
    ['krds-tts', this.size(), this.playing() ? 'pause' : this.iconType() === 'play' && 'play'].filter(Boolean).join(' ')
  )
  protected readonly icon = computed(() => (this.playing() ? 'ico-stop' : this.iconType() === 'play' ? 'ico-play' : 'ico-volume'))

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stop())
  }

  private stop() {
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
    this.playing.set(false)
  }

  protected toggle() {
    if (this.disabled()) return
    if (this.playing()) {
      this.stop()
      this.pause.emit()
      return
    }
    const synth = typeof window === 'undefined' ? undefined : window.speechSynthesis
    if (!synth) {
      this.error.emit(new Error('SpeechSynthesis API is not supported'))
      return
    }
    synth.cancel()
    const utterance = new SpeechSynthesisUtterance(this.text())
    utterance.lang = 'ko-KR'
    utterance.onstart = () => this.playing.set(true)
    utterance.onend = () => {
      this.playing.set(false)
      this.end.emit()
    }
    utterance.onerror = event => {
      this.playing.set(false)
      if (event.error !== 'canceled' && event.error !== 'interrupted') this.error.emit(new Error(event.error))
    }
    synth.speak(utterance)
    this.play.emit(this.text())
  }
}
