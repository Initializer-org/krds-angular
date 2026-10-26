import {
  Component,
  DestroyRef,
  Directive,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  untracked
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

/**
 * 캐러셀 형태
 * - `visual`: 비주얼 배너형 (이전/다음 버튼이 슬라이드 좌우에 겹침)
 * - `banner`: 배너형 (인디케이터 안에 페이지네이션·재생 제어·내비게이션)
 */
export type KrdsCarouselVariant = 'visual' | 'banner'

/** 페이지네이션 표시 방식 */
export type KrdsCarouselPagination = 'bullets' | 'fraction' | 'none'

/**
 * 캐러셀의 슬라이드. 현재 슬라이드가 아니면 보조기기·초점에서 뺀다 (aria-hidden, inert)
 */
@Directive({
  selector: 'li[krdsSlide]',
  host: {
    class: 'swiper-slide',
    style: 'flex: 0 0 100%; width: 100%',
    'aria-roledescription': 'slide',
    '[class.swiper-slide-active]': 'active()',
    '[attr.aria-label]': 'position()',
    '[attr.aria-hidden]': "active() ? null : 'true'",
    '[inert]': '!active()'
  }
})
export class KrdsSlide {
  private readonly carousel = inject(KrdsCarousel)

  protected readonly active = computed(() => this.carousel.indexOf(this) === this.carousel.current())
  protected readonly position = computed(() => `${this.carousel.indexOf(this) + 1} / ${this.carousel.total()}`)
}

let nextId = 0

/**
 * KRDS 캐러셀. 슬라이드는 `<li krdsSlide>`로 넣는다. 현재 위치는 `[(active)]`(0부터)로 주고받고,
 * 자동 재생은 마우스를 올리거나 안에 초점이 있으면 멈춘다. 모션 최소화 설정이면 이동 효과를 없앤다
 *
 * @example
 * <krds-carousel label="주요 서비스 안내" moreHref="/services">
 *   @for (item of banners; track item.id) {
 *     <li krdsSlide><div class="in">...</div></li>
 *   }
 * </krds-carousel>
 */
@Component({
  selector: 'krds-carousel',
  host: {
    style: 'position: relative',
    role: 'region',
    'aria-roledescription': 'carousel',
    '[class]': "variant() === 'banner' ? 'krds-carousel main-d-ban-swiper' : 'krds-carousel vb-swiper'",
    '[attr.aria-label]': 'label()',
    '(mouseenter)': 'hoverPaused.set(pauseOnHover())',
    '(mouseleave)': 'hoverPaused.set(false)',
    '(focusin)': 'focusPaused.set(true)',
    '(focusout)': 'onFocusout($event)'
  },
  template: `
    <div class="swiper" style="position: relative; overflow: hidden; width: 100%" [attr.aria-live]="playing() ? 'off' : 'polite'">
      <ul
        class="swiper-wrapper"
        style="display: flex; width: 100%; transition-property: transform; transition-timing-function: ease-out; will-change: transform"
        [id]="wrapperId"
        [style.gap.px]="gap() || null"
        [style.transform]="'translate3d(calc(' + -current() + ' * (100% + ' + gap() + 'px)), 0, 0)'"
        [style.transition-duration.ms]="reducedMotion() ? 0 : speed()"
      >
        <ng-content />
      </ul>
    </div>

    @if (variant() === 'visual' && navigation() && total()) {
      <ng-container *ngTemplateOutlet="nav; context: { $implicit: 'prev', overlay: true }" />
      <ng-container *ngTemplateOutlet="nav; context: { $implicit: 'next', overlay: true }" />
    }

    @if (total() && (paginationType() !== 'none' || autoplay() || moreHref() || (variant() === 'banner' && navigation()))) {
      <div class="swiper-indicator" [class.text-center]="variant() === 'visual'">
        @if (paginationType() === 'fraction') {
          <div class="swiper-pagination swiper-pagination-fraction">
            <span class="swiper-pagination-current">{{ current() + 1 }}</span>
            <span aria-hidden="true">/</span>
            <span class="swiper-pagination-total">{{ total() }}</span>
          </div>
        } @else if (paginationType() === 'bullets') {
          <div class="swiper-pagination">
            @for (slide of slides(); track $index) {
              <button
                type="button"
                class="swiper-pagination-bullet"
                [class.swiper-pagination-bullet-active]="$index === current()"
                [attr.aria-label]="$index + 1 + '번째 슬라이드로 이동'"
                [attr.aria-current]="$index === current() ? 'true' : null"
                [attr.aria-controls]="wrapperId"
                (click)="goTo($index)"
              ></button>
            }
          </div>
        }
        @if (autoplay()) {
          <!-- 원본처럼 현재 상태의 버튼만 보인다 -->
          <div class="swiper-controller">
            <button
              type="button"
              class="swiper-button-play"
              [style.display]="playing() ? 'none' : null"
              [attr.aria-controls]="wrapperId"
              (click)="setPlaying(true)"
            >
              <span class="sr-only">{{ playLabel() }}</span>
            </button>
            <button
              type="button"
              class="swiper-button-stop"
              [style.display]="playing() ? null : 'none'"
              [attr.aria-controls]="wrapperId"
              (click)="setPlaying(false)"
            >
              <span class="sr-only">{{ stopLabel() }}</span>
            </button>
          </div>
        }
        @if (variant() === 'banner') {
          @if (navigation() || moreHref()) {
            <div class="swiper-navigation">
              @if (navigation()) {
                <ng-container *ngTemplateOutlet="nav; context: { $implicit: 'prev' }" />
                <ng-container *ngTemplateOutlet="nav; context: { $implicit: 'next' }" />
              }
              <ng-container *ngTemplateOutlet="more" />
            </div>
          }
        } @else {
          <ng-container *ngTemplateOutlet="more" />
        }
      </div>
    }

    <ng-template #nav let-direction let-overlay="overlay">
      <button
        type="button"
        [class]="'swiper-button-' + direction"
        [class.swiper-button-disabled]="navDisabled(direction)"
        [style]="overlay ? overlayStyle(direction) : null"
        [disabled]="navDisabled(direction)"
        [attr.aria-controls]="wrapperId"
        (click)="goTo(current() + (direction === 'prev' ? -1 : 1))"
      >
        <span class="sr-only">{{ direction === 'prev' ? prevLabel() : nextLabel() }}</span>
      </button>
    </ng-template>

    <ng-template #more>
      @if (moreHref(); as href) {
        <a class="swiper-button-more" [href]="href"
          ><span class="sr-only">{{ moreLabel() }}</span></a
        >
      }
    </ng-template>
  `,
  imports: [NgTemplateOutlet]
})
export class KrdsCarousel {
  /** 형태 */
  readonly variant = input<KrdsCarouselVariant>('visual')
  /** 현재 슬라이드 위치 (0부터) */
  readonly active = model(0)
  /** 처음·끝에서 이어서 순환 */
  readonly loop = input(true, { transform: booleanAttribute })
  /** 자동 재생 (재생·멈춤 버튼 표시) */
  readonly autoplay = input(false, { transform: booleanAttribute })
  /** 자동 재생 간격 (ms) */
  readonly autoplayDelay = input(2500, { transform: numberAttribute })
  /** 마우스를 올리면 자동 재생을 멈춤 */
  readonly pauseOnHover = input(true, { transform: booleanAttribute })
  /** 이동 시간 (ms) */
  readonly speed = input(400, { transform: numberAttribute })
  /** 슬라이드 간격 (px, 기본: 비주얼 0, 배너 16) */
  readonly spaceBetween = input<number>()
  /** 페이지네이션 (기본: 비주얼 bullets, 배너 fraction) */
  readonly pagination = input<KrdsCarouselPagination>()
  /** 이전/다음 버튼 */
  readonly navigation = input(true, { transform: booleanAttribute })
  /** 더 보기 링크 주소 */
  readonly moreHref = input<string>()
  /** 캐러셀 이름 (aria-label) */
  readonly label = input('캐러셀')
  readonly prevLabel = input('이전')
  readonly nextLabel = input('다음')
  readonly playLabel = input('슬라이드 재생')
  readonly stopLabel = input('슬라이드 멈춤')
  readonly moreLabel = input('더 보기')

  /** 자동 재생을 시작했을 때 */
  readonly play = output<void>()
  /** 자동 재생을 멈췄을 때 */
  readonly stop = output<void>()

  protected readonly wrapperId = `krds-carousel-${nextId++}-wrapper`
  protected readonly slides = contentChildren(KrdsSlide)
  readonly total = computed(() => this.slides().length)
  /** 슬라이드 수에 맞춘 현재 위치 */
  readonly current = computed(() => Math.min(Math.max(this.active(), 0), Math.max(this.total() - 1, 0)))
  protected readonly gap = computed(() => this.spaceBetween() ?? (this.variant() === 'banner' ? 16 : 0))
  protected readonly paginationType = computed(() => this.pagination() ?? (this.variant() === 'banner' ? 'fraction' : 'bullets'))

  protected readonly playing = signal(false)
  protected readonly hoverPaused = signal(false)
  protected readonly focusPaused = signal(false)
  protected readonly reducedMotion = signal(false)
  private readonly browser = signal(false)

  constructor() {
    const destroyRef = inject(DestroyRef)
    afterNextRender(() => {
      const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
      if (query) {
        this.reducedMotion.set(query.matches)
        const onChange = (event: MediaQueryListEvent) => this.reducedMotion.set(event.matches)
        query.addEventListener('change', onChange)
        destroyRef.onDestroy(() => query.removeEventListener('change', onChange))
      }
      this.browser.set(true)
    })
    // autoplay 입력을 따라 재생을 시작·멈춘다 (타이머는 브라우저에서만).
    // playing은 추적하지 않아야 사용자가 멈춘 뒤 다시 켜지지 않는다
    effect(() => {
      const autoplay = this.autoplay()
      if (this.browser()) untracked(() => this.setPlaying(autoplay))
    })
    // 재생 중이고 멈춤 조건(마우스·초점)이 없을 때만 타이머를 돈다
    effect(onCleanup => {
      if (!this.playing() || this.hoverPaused() || this.focusPaused()) return
      const timer = setInterval(() => {
        // 순환하지 않으면 마지막 슬라이드에서 재생을 끝낸다
        if (!this.loop() && this.current() >= this.total() - 1) this.setPlaying(false)
        else this.goTo(this.current() + 1)
      }, this.autoplayDelay())
      onCleanup(() => clearInterval(timer))
    })
  }

  /** 슬라이드의 위치 (없으면 -1) */
  indexOf(slide: KrdsSlide) {
    return this.slides().indexOf(slide)
  }

  protected goTo(index: number) {
    const total = this.total()
    if (!total) return
    const next = this.loop() ? ((index % total) + total) % total : Math.min(Math.max(index, 0), total - 1)
    if (next !== this.current()) this.active.set(next)
  }

  protected setPlaying(playing: boolean) {
    if (playing === this.playing()) return
    this.playing.set(playing)
    if (playing) this.play.emit()
    else this.stop.emit()
  }

  protected navDisabled(direction: 'prev' | 'next') {
    return !this.loop() && (direction === 'prev' ? this.current() <= 0 : this.current() >= this.total() - 1)
  }

  protected overlayStyle(direction: 'prev' | 'next') {
    const side = direction === 'prev' ? 'left: 0' : 'right: 0'
    return `position: absolute; top: 50%; ${side}; transform: translateY(-50%); z-index: 10`
  }

  protected onFocusout(event: FocusEvent) {
    const host = event.currentTarget as HTMLElement
    if (!host.contains(event.relatedTarget as Node | null)) this.focusPaused.set(false)
  }
}
