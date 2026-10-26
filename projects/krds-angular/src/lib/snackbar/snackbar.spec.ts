import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsSnackbar, KrdsSnackbarService } from './snackbar'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsSnackbar], template: '<krds-snackbar />' })
class Host {}

const button = (root: Element, text: string) =>
  [...root.querySelectorAll<HTMLButtonElement>('button')].find(b => b.textContent?.trim() === text)!

describe('KrdsSnackbar', () => {
  afterEach(() => TestBed.inject(KrdsSnackbarService).hide())

  it('제목·본문·아이콘·작업 버튼·닫기 버튼을 그리고, 작업 버튼은 닫은 뒤 onAction을 부른다', async () => {
    const { $ } = await render(Host, '<krds-snackbar />')
    const status = $('krds-snackbar')
    expect(status.getAttribute('role')).toBe('status')
    const onAction = vi.fn()
    TestBed.inject(KrdsSnackbarService).show({
      title: '삭제 완료',
      message: '항목을 삭제했습니다.',
      icon: 'ico-success-fill',
      action: '되돌리기',
      onAction
    })
    await vi.waitFor(() => expect(status.querySelector('.snackbar-title')?.textContent).toBe('삭제 완료'))
    expect(status.classList).toContain('active')
    expect(status.querySelector('.snackbar-text')?.textContent).toBe('항목을 삭제했습니다.')
    expect(status.querySelector('.snackbar-icon')?.classList).toContain('ico-success-fill')
    expect(status.querySelector('.snackbar-close .sr-only')?.textContent).toBe('닫기')
    await expectNoA11yViolations(status)

    await user.click(button(status, '되돌리기'))
    expect(onAction).toHaveBeenCalledOnce()
    expect(status.querySelector('.snackbar-in')).toBeNull()
  })

  it('아이콘·본문·작업 버튼은 줄 때만 그리고, 닫기 버튼과 hide()로 닫는다, duration이면 자동으로 닫힌다', async () => {
    const { $, stable } = await render(Host, '<krds-snackbar />')
    const status = $('krds-snackbar')
    const snackbar = TestBed.inject(KrdsSnackbarService)
    snackbar.show({ title: '저장 완료' })
    await vi.waitFor(() => expect(status.querySelector('.snackbar-title')).toBeTruthy())
    expect(status.querySelector('.snackbar-icon, .snackbar-text, .snackbar-action')).toBeNull()
    await user.click(status.querySelector('.snackbar-close')!)
    expect(status.querySelector('.snackbar-in')).toBeNull()

    snackbar.show({ title: '다시' })
    await stable()
    snackbar.hide()
    await stable()
    expect(status.querySelector('.snackbar-in')).toBeNull()

    snackbar.show({ title: '자동', duration: 300 })
    await vi.waitFor(() => expect(status.querySelector('.snackbar-title')).toBeTruthy())
    await vi.waitFor(() => expect(status.querySelector('.snackbar-in')).toBeNull(), { timeout: 2000 })
  })

  it('onAction 안에서 다시 show()한 스낵바는 남는다 (다시 시도 → 결과 알림)', async () => {
    const { $ } = await render(Host, '<krds-snackbar />')
    const status = $('krds-snackbar')
    const snackbar = TestBed.inject(KrdsSnackbarService)
    snackbar.show({ title: '전송 실패', action: '다시 시도', onAction: () => snackbar.show({ title: '전송 완료' }) })
    await vi.waitFor(() => expect(button(status, '다시 시도')).toBeTruthy())
    await user.click(button(status, '다시 시도'))
    await vi.waitFor(() => expect(status.querySelector('.snackbar-title')?.textContent).toBe('전송 완료'))
  })

  it('버튼으로 닫으면 초점을 스낵바로 들어오기 전 요소로 돌려준다', async () => {
    const { $ } = await render(Host, '<button type="button" class="before">이전 요소</button><krds-snackbar />')
    const status = $('krds-snackbar')
    TestBed.inject(KrdsSnackbarService).show({ title: '알림' })
    await vi.waitFor(() => expect(status.querySelector('.snackbar-close')).toBeTruthy())
    $('.before').focus()
    await user.keyboard('{Tab}')
    expect(document.activeElement).toBe(status.querySelector('.snackbar-close'))
    await user.keyboard('{Enter}')
    await vi.waitFor(() => expect(document.activeElement).toBe($('.before')))
  })
})
