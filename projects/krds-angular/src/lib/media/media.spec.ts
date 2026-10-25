import { Component } from '@angular/core'
import { classesOf, expectNoA11yViolations, isVisible, render, user } from '../../test/render'
import { KrdsMedia, KrdsMediaTranscript } from './media'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsMedia, KrdsMediaTranscript], template: '<figure krdsMedia heading="a"></figure>' })
class Host {}

describe('KrdsMedia', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  afterEach(() => warn.mockClear())
  const warnings = () => warn.mock.calls.map(([message]) => String(message))

  it('동영상: 제목이 미디어 영역 이름, 자막 트랙, 원고 펼치기', async () => {
    const { $ } = await render(
      Host,
      `
        <figure krdsMedia heading="단계 안내 영상" class="intro">
          <video controls preload="metadata" src="/demo.mp4" poster="/demo.jpg">
            <track kind="captions" src="/demo.ko.vtt" srclang="ko" label="한국어" default />
          </video>
          <div krdsMediaTranscript><p>세 칸이 차례로 채워집니다.</p></div>
        </figure>
      `
    )
    const figure = $('figure')
    expect(classesOf(figure)).toEqual(['intro', 'krds-media'])
    expect(figure.querySelector('figcaption.media-title')?.textContent).toBe('단계 안내 영상')
    expect(figure.querySelector('.media-player > video')?.getAttribute('poster')).toBe('/demo.jpg')
    expect(figure.hasAttribute('title')).toBe(false)

    const toggle = $<HTMLButtonElement>('krds-disclosure button')
    expect(toggle.textContent?.trim()).toBe('원고 보기')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    await user.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    await vi.waitFor(() => expect(isVisible($('[krdsMediaTranscript] p'))).toBe(true))
    expect(warnings()).toEqual([])
    await expectNoA11yViolations(figure)
  })

  it('오디오와 외부 재생기(iframe), 제목 숨김', async () => {
    const { $$ } = await render(
      Host,
      `
        <figure krdsMedia heading="안내 음성"><audio controls src="/demo.m4a"></audio><div krdsMediaTranscript><p>원고</p></div></figure>
        <figure krdsMedia heading="유튜브 안내 영상" hideHeading>
          <iframe src="about:blank" title="유튜브 안내 영상"></iframe>
          <div krdsMediaTranscript><p>원고</p></div>
        </figure>
      `
    )
    const [audio, external] = $$('figure')
    expect(audio.querySelector('.media-player > audio')).toBeTruthy()
    expect(external.querySelector('.media-player > iframe')).toBeTruthy()
    expect(external.querySelector('figcaption')?.className).toBe('sr-only')
    expect(warnings()).toEqual([])
  })

  it('개발 모드 경고: 자막·원고 없음, 자동 재생, 오디오는 원고 필요 (다른 언어 자막만 있어도 경고 안 함)', async () => {
    await render(
      Host,
      `
        <figure krdsMedia heading="대체 정보 없는 영상"><video controls src="/a.mp4"></video></figure>
        <figure krdsMedia heading="영어 자막 영상"><video controls src="/b.mp4"><track src="/b.en.vtt" srclang="en" label="English" /></video></figure>
        <figure krdsMedia heading="자동 재생 영상"><video controls autoplay muted src="/c.mp4"><track kind="captions" src="/c.vtt" srclang="ko" /></video></figure>
        <figure krdsMedia heading="자막만 있는 음성"><audio controls src="/d.m4a"></audio></figure>
      `
    )
    expect(warnings()).toEqual([
      expect.stringContaining(
        '자막(track)이나 원고(krdsMediaTranscript) 중 하나 이상을 제공합니다. 어렵다면 원고를 제공합니다. (heading="대체 정보 없는 영상")'
      ),
      expect.stringContaining('자동 재생하지 않습니다. 사용자가 직접 재생하게 합니다. (heading="자동 재생 영상")'),
      expect.stringContaining(
        '오디오·외부 재생기는 자막을 확인할 수 없으므로 원고(krdsMediaTranscript)를 제공합니다. (heading="자막만 있는 음성")'
      )
    ])
  })
})
