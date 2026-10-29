import { Component, signal } from '@angular/core'
import { KrdsButton, KrdsModal, KrdsModalFooter } from '@krds.ui/angular'

@Component({
  selector: 'demo-modal-bottom-sheet',
  imports: [KrdsButton, KrdsModal, KrdsModalFooter],
  template: `
    <button krdsButton size="large" variant="secondary" (click)="open.set(true)">바텀시트 열기</button>
    <krds-modal heading="바텀시트" bottomSheet [(open)]="open">
      <p>하단에서 올라오는 바텀시트입니다.</p>
      <div krdsModalFooter>
        <button krdsButton size="medium" (click)="open.set(false)">확인</button>
      </div>
    </krds-modal>
  `
})
export default class ModalBottomSheet {
  readonly open = signal(false)
}
