import { Component } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsTts } from './tts'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsTts], template: '<button krdsTts text="a" label="듣기"></button>' })
class Host {
  readonly events: string[] = []
}

/** 헤드리스 브라우저의 음성 합성 대신, 읽기 시작·끝·오류를 직접 일으키는 가짜 */
function fakeSpeech() {
  let current: SpeechSynthesisUtterance | null = null
  const speak = vi.spyOn(window.speechSynthesis, 'speak').mockImplementation(utterance => {
    current = utterance
    utterance.onstart?.(new Event('start') as SpeechSynthesisEvent)
  })
  const cancel = vi.spyOn(window.speechSynthesis, 'cancel').mockImplementation(() => undefined)
  return {
    speak,
    cancel,
    end: () => current?.onend?.(new Event('end') as SpeechSynthesisEvent),
    fail: (error: string) => current?.onerror?.({ error } as SpeechSynthesisErrorEvent),
    restore: () => vi.restoreAllMocks()
  }
}

const template = `<button krdsTts text="신청 방법을 안내합니다." label="듣기" (play)="events.push('play:' + $event)" (pause)="events.push('pause')" (end)="events.push('end')" (error)="events.push('error:' + $event.message)"></button>`

describe('KrdsTts', () => {
  it('누르면 한국어로 읽고 멈춤 아이콘, 다시 누르면 멈춤, 끝까지 읽으면 원래대로', async () => {
    const speech = fakeSpeech()
    try {
      const { host, $, click } = await render(Host, template)
      const button = $<HTMLButtonElement>('button')
      expect(button.type).toBe('button')
      expect(classesOf(button)).toEqual(['krds-tts', 'medium'])
      expect(button.querySelector('.krds-tts-text')?.textContent).toBe('듣기')
      expect(button.querySelector('i')?.classList).toContain('ico-volume')

      await click(button)
      expect(speech.speak).toHaveBeenCalledOnce()
      expect(speech.speak.mock.calls[0][0].lang).toBe('ko-KR')
      expect(speech.speak.mock.calls[0][0].text).toBe('신청 방법을 안내합니다.')
      expect(button.classList).toContain('pause')
      expect(button.querySelector('i')?.classList).toContain('ico-stop')

      await click(button)
      expect(button.classList).not.toContain('pause')

      await click(button)
      speech.end()
      await new Promise(requestAnimationFrame)
      expect(button.classList).not.toContain('pause')
      speech.fail('interrupted')
      speech.fail('synthesis-failed')
      expect(host.events).toEqual([
        'play:신청 방법을 안내합니다.',
        'pause',
        'play:신청 방법을 안내합니다.',
        'end',
        'error:synthesis-failed'
      ])
    } finally {
      speech.restore()
    }
  })

  it('아이콘·크기, 비활성화면 읽지 않는다', async () => {
    const speech = fakeSpeech()
    try {
      const { $$, click } = await render(
        Host,
        '<button krdsTts text="a" icon="play" size="small" aria-label="듣기"></button><button krdsTts text="b" label="듣기" [disabled]="true"></button>'
      )
      const [play, disabled] = $$<HTMLButtonElement>('button')
      expect(classesOf(play)).toEqual(['krds-tts', 'play', 'small'])
      expect(play.querySelector('i')?.classList).toContain('ico-play')
      expect(disabled.disabled).toBe(true)
      await click(disabled)
      expect(speech.speak).not.toHaveBeenCalled()
    } finally {
      speech.restore()
    }
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      '<button krdsTts text="a" label="듣기"></button><button krdsTts text="b" icon="play" aria-label="듣기"></button><button krdsTts text="c" size="xsmall" label="듣기"></button>'
    )
    await expectNoA11yViolations(el)
  })
})
