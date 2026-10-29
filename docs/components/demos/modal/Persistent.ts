import { Component, signal } from '@angular/core'
import { KrdsButton, KrdsModal, KrdsModalFooter } from '@krds.ui/angular'

@Component({
  selector: 'demo-modal-persistent',
  imports: [KrdsButton, KrdsModal, KrdsModalFooter],
  template: `
    <button krdsButton size="large" variant="secondary" (click)="open.set(true)">Persistent 모달 열기</button>
    <krds-modal heading="Persistent 모달" persistent [(open)]="open">
      <p>배경을 클릭하거나 Esc 키를 눌러도 닫히지 않습니다. 버튼으로만 닫을 수 있습니다.</p>
      <div krdsModalFooter>
        <button krdsButton size="medium" (click)="open.set(false)">확인</button>
      </div>
    </krds-modal>
  `
})
export default class ModalPersistent {
  readonly open = signal(false)
}
