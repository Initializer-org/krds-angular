import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsToast, KrdsToastService } from './toast'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsToast], template: '<krds-toast />' })
class Host {}

describe('KrdsToast', () => {
  it('role=status 영역은 늘 있고, 띄우면 메시지를 넣고 노출 시간 뒤 비운다', async () => {
    const { $ } = await render(Host, '<krds-toast />')
    const status = $('krds-toast')
    expect(status.getAttribute('role')).toBe('status')
    expect(status.textContent?.trim()).toBe('')

    // 등장 효과(0.4초)가 끝난 뒤에도 떠 있어야 접근성 검사가 내용을 본다
    TestBed.inject(KrdsToastService).show('저장되었습니다.', { duration: 1000 })
    await vi.waitFor(() => expect(status.querySelector('.toast-text')?.textContent).toBe('저장되었습니다.'))
    expect(status.classList).toContain('active')
    // 등장 효과 중에는 배경·글자색이 섞여 계산되므로 끝난 뒤 검사한다
    await vi.waitFor(() => expect(status.getAnimations({ subtree: true })).toHaveLength(0))
    await expectNoA11yViolations(status)
    await vi.waitFor(() => expect(status.textContent?.trim()).toBe(''), { timeout: 2000 })
    expect(status.classList).not.toContain('active')
  })

  it('기본 노출 시간은 info 3초, warning 4초, 0이면 닫지 않고, 다시 띄우면 시간을 다시 세고, hide()로 바로 닫는다', async () => {
    vi.useFakeTimers()
    try {
      const toast = TestBed.inject(KrdsToastService)
      const message = () => toast.current()?.message
      toast.show('정보')
      await vi.advanceTimersByTimeAsync(2999)
      expect(message()).toBe('정보')
      await vi.advanceTimersByTimeAsync(1)
      expect(message()).toBeUndefined()

      toast.warning('경고')
      await vi.advanceTimersByTimeAsync(3999)
      expect(message()).toBe('경고')
      await vi.advanceTimersByTimeAsync(1)
      expect(message()).toBeUndefined()

      toast.show('첫 번째')
      await vi.advanceTimersByTimeAsync(2000)
      toast.show('두 번째')
      await vi.advanceTimersByTimeAsync(2000)
      expect(message()).toBe('두 번째')
      await vi.advanceTimersByTimeAsync(1000)
      expect(message()).toBeUndefined()

      toast.info('고정', 0)
      await vi.advanceTimersByTimeAsync(60000)
      expect(message()).toBe('고정')
      toast.hide()
      expect(message()).toBeUndefined()
    } finally {
      vi.useRealTimers()
    }
  })

  it('같은 메시지를 다시 띄우면 새로 그린다 (화면낭독기가 다시 읽음)', async () => {
    const { $ } = await render(Host, '<krds-toast />')
    const toast = TestBed.inject(KrdsToastService)
    toast.show('저장되었습니다.')
    await vi.waitFor(() => expect($('.toast-text')).toBeTruthy())
    const first = $('.toast-text')
    toast.show('저장되었습니다.')
    await vi.waitFor(() => expect($('.toast-text')).not.toBe(first))
    toast.hide()
  })
})
