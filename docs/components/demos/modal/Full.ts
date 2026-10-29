import { Component, signal } from '@angular/core'
import { KrdsButton, KrdsModal, KrdsModalFooter } from '@krds.ui/angular'

@Component({
  selector: 'demo-modal-full',
  imports: [KrdsButton, KrdsModal, KrdsModalFooter],
  template: `
    <button krdsButton size="large" variant="secondary" (click)="open.set(true)">풀팝업 열기</button>
    <krds-modal heading="풀팝업" full [(open)]="open">
      <p>전체 화면을 차지하는 풀팝업입니다.</p>
      <div krdsModalFooter>
        <button krdsButton size="medium" (click)="open.set(false)">확인</button>
      </div>
    </krds-modal>
  `
})
export default class ModalFull {
  readonly open = signal(false)
}
