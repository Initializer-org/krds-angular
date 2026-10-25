import { Component, Directive, ElementRef, afterNextRender, booleanAttribute, contentChild, inject, input, isDevMode } from '@angular/core'
import { KrdsDisclosure } from '../disclosure/disclosure'

/** 원고(설명적 원고): 화면과 소리의 정보를 글로 옮긴 내용 (`<div krdsMediaTranscript>`, '원고 보기'로 펼침) */
@Directive({ selector: '[krdsMediaTranscript]' })
export class KrdsMediaTranscript {}

/**
 * KRDS 접근 가능한 미디어. 기본 `<figure>`에 붙여 제목·재생기·원고를 묶는다.
 * 재생기는 기본 `<video controls>`·`<audio controls>`(자막 track 포함)나 외부 재생기(유튜브 iframe 등)를 그대로 넣는다.
 * 개발 모드에서는 자막·원고가 모두 없거나(오디오·외부 재생기는 원고가 없으면) 자동 재생이면 경고한다
 *
 * @example
 * <figure krdsMedia heading="민원 신청 안내 영상">
 *   <video controls preload="metadata" src="/guide.mp4">
 *     <track kind="captions" src="/guide.ko.vtt" srclang="ko" label="한국어" default />
 *   </video>
 *   <div krdsMediaTranscript><p>민원 신청은 세 단계로 진행됩니다.</p></div>
 * </figure>
 */
@Component({
  selector: 'figure[krdsMedia]',
  imports: [KrdsDisclosure],
  host: { class: 'krds-media' },
  template: `
    <figcaption [class]="hideHeading() ? 'sr-only' : 'media-title'">{{ heading() }}</figcaption>
    <div class="media-player"><ng-content /></div>
    @if (transcript()) {
      <krds-disclosure label="원고 보기"><ng-content select="[krdsMediaTranscript]" /></krds-disclosure>
    }
  `
})
export class KrdsMedia {
  /** 미디어 제목 (화면낭독기가 미디어 영역 이름으로 읽음, title 속성은 기본 툴팁이 되므로 heading으로 받음) */
  readonly heading = input.required<string>()
  /** 제목을 화면에서 숨김 (화면낭독기는 읽음) */
  readonly hideHeading = input(false, { transform: booleanAttribute })

  protected readonly transcript = contentChild(KrdsMediaTranscript)

  constructor() {
    if (!isDevMode()) return
    const figure = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
    afterNextRender(() => {
      const media = figure.querySelector<HTMLMediaElement>('.media-player video, .media-player audio')
      const title = this.heading()
      // 오디오·외부 재생기는 자막이 화면에 보이지 않아(또는 확인할 수 없어) 원고만 대체 정보가 된다
      const captioned =
        media instanceof HTMLVideoElement &&
        [...media.querySelectorAll('track')].some(track => ['captions', 'subtitles'].includes(track.kind))
      if (!this.transcript() && !captioned) {
        // oxlint-disable-next-line no-console -- 개발 모드 접근성 경고
        console.warn(
          media instanceof HTMLVideoElement
            ? `krdsMedia: 자막(track)이나 원고(krdsMediaTranscript) 중 하나 이상을 제공합니다. 어렵다면 원고를 제공합니다. (heading="${title}")`
            : `krdsMedia: 오디오·외부 재생기는 자막을 확인할 수 없으므로 원고(krdsMediaTranscript)를 제공합니다. (heading="${title}")`
        )
      }
      if (media?.autoplay) {
        // oxlint-disable-next-line no-console -- 개발 모드 접근성 경고
        console.warn(`krdsMedia: 미디어를 자동 재생하지 않습니다. 사용자가 직접 재생하게 합니다. (heading="${title}")`)
      }
    })
  }
}
