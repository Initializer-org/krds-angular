import { Component, signal } from '@angular/core'
import { expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsButton } from '../button/button'
import { KrdsFloatingButton } from '../floating-button/floating-button'
import { KrdsModal, KrdsModalFooter } from './modal'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsModal, KrdsModalFooter, KrdsButton, KrdsFloatingButton],
  template: '<krds-modal heading="제목">내용</krds-modal>'
})
class Host {
  readonly open = signal(false)
}

const template = (attrs = '') => `
  <button krdsButton class="opener" (click)="open.set(true)">모달 열기</button>
  <krds-modal heading="모달 제목" modalId="modal_sample" [(open)]="open" ${attrs}>
    <p>대화 상자는 사용자에게 작업에 대해 알립니다.</p>
    <div krdsModalFooter>
      <button krdsButton variant="tertiary" class="no" (click)="open.set(false)">아니요</button>
      <button krdsButton class="yes" (click)="open.set(false)">예</button>
    </div>
  </krds-modal>
`

const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]')

describe('KrdsModal', () => {
  afterEach(() => (document.body.style.overflow = ''))

  it('KRDS 마크업을 body 끝에 그리고, 열면 내용으로 초점·배경 스크롤 막기, 닫으면 연 버튼으로 초점', async () => {
    const { $, click, stable } = await render(Host, template())
    const opener = $<HTMLButtonElement>('.opener')
    expect(dialog()).toBeNull()

    opener.focus()
    await click(opener)
    const modal = dialog()!
    expect(modal.closest('krds-modal')?.parentElement).toBe(document.body)
    expect(modal.id).toBe('modal_sample')
    expect(modal.className).toBe('krds-modal fade in shown')
    expect(modal.getAttribute('aria-modal')).toBe('true')
    expect(document.getElementById(modal.getAttribute('aria-labelledby')!)?.textContent).toBe('모달 제목')
    expect(modal.querySelector('.modal-dialog')?.className).toBe('modal-dialog modal-md')
    expect(modal.querySelector('.modal-content > .modal-btn.btn-wrap > .yes')).toBeTruthy()
    expect(modal.querySelector('.modal-back')?.className).toBe('modal-back in')
    expect(document.activeElement).toBe(modal.querySelector('.modal-conts'))
    expect(document.body.style.overflow).toBe('hidden')
    await expectNoA11yViolations(modal)

    await click(modal.querySelector('.btn-close')!)
    expect(dialog()).toBeNull()
    await stable()
    expect(document.activeElement).toBe(opener)
    expect(document.body.style.overflow).toBe('')
  })

  it('Tab 초점을 모달 안에 가둔다', async () => {
    const { $, click } = await render(Host, template())
    await click($('.opener'))
    const modal = dialog()!
    const no = modal.querySelector('.no')
    const close = modal.querySelector('.btn-close')

    // 처음 초점(.modal-conts)에서 Shift+Tab이면 마지막(닫기)으로
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(close)
    // 마지막에서 Tab이면 처음(아니요)으로
    await user.keyboard('{Tab}')
    expect(document.activeElement).toBe(no)
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(close)
  })

  it('Esc·배경 클릭으로 닫히고, persistent면 닫히지 않는다', async () => {
    const { host, $, click, stable } = await render(Host, template())
    await click($('.opener'))
    await user.keyboard('{Escape}')
    await stable()
    expect(host.open()).toBe(false)

    await click($('.opener'))
    await click(document.querySelector('.modal-back')!)
    expect(host.open()).toBe(false)
  })

  it('persistent: 배경 클릭·Esc로 닫히지 않고 닫기 버튼으로 닫힌다', async () => {
    const { host, $, click, stable } = await render(Host, template('persistent'))
    await click($('.opener'))
    await click(document.querySelector('.modal-back')!)
    await user.keyboard('{Escape}')
    await stable()
    expect(host.open()).toBe(true)
    await click(document.querySelector('.btn-close')!)
    expect(host.open()).toBe(false)
  })

  it('크기·풀팝업·바텀시트·배경 없음', async () => {
    const { host, stable } = await render(
      Host,
      `
        <krds-modal heading="작게" size="small" [backdrop]="false" [open]="open()">a</krds-modal>
        <krds-modal heading="크게" size="large" full [open]="open()">b</krds-modal>
        <krds-modal heading="바텀시트" bottomSheet [open]="open()">c</krds-modal>
      `
    )
    host.open.set(true)
    await stable()
    const [small, large, sheet] = document.querySelectorAll<HTMLElement>('[role="dialog"]')
    expect(small.querySelector('.modal-dialog')?.className).toBe('modal-dialog modal-sm')
    expect(small.querySelector('.modal-back')?.className).toBe('modal-back')
    expect(large.querySelector('.modal-dialog')?.className).toBe('modal-dialog modal-lg')
    expect(large.dataset['type']).toBe('full')
    expect(sheet.dataset['type']).toBe('bottom-sheet')
  })

  it('닫힌 모달을 만들어도 body overflow를 덮어쓰지 않는다', async () => {
    document.body.style.overflow = 'hidden'
    const { fixture } = await render(Host, '<krds-modal heading="t">x</krds-modal>')
    expect(document.body.style.overflow).toBe('hidden')
    fixture.destroy()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('열린 채 없어지면 body overflow를 되돌리고 body에 옮긴 요소도 지운다', async () => {
    const { fixture } = await render(Host, '<krds-modal heading="t" [open]="true">x</krds-modal>')
    expect(document.body.style.overflow).toBe('hidden')
    fixture.destroy()
    expect(document.body.style.overflow).toBe('')
    expect(document.querySelector('krds-modal')).toBeNull()
  })

  it('플로팅 버튼 항목에서 연 모달을 닫으면 초점이 확장 버튼으로 돌아온다', async () => {
    const { $, click, stable } = await render(
      Host,
      `
        <krds-floating-button label="상담 메뉴" [items]="[{ label: '문의하기', icon: 'ico-faq' }]" (itemSelect)="open.set(true)" />
        <krds-modal heading="문의하기" [(open)]="open"><p>내용</p></krds-modal>
      `
    )
    const toggle = $('.floating-toggle')
    await click(toggle)
    await click($('button.floating-action'))
    expect(dialog()).toBeTruthy()
    await click(dialog()!.querySelector('.btn-close')!)
    await stable()
    expect(document.activeElement).toBe(toggle)
  })
})
