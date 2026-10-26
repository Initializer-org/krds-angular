import { Component, signal } from '@angular/core'
import { KrdsButton, KrdsModal, KrdsModalFooter } from '@krds.ui/angular'

@Component({
  selector: 'demo-modal-no-backdrop',
  imports: [KrdsButton, KrdsModal, KrdsModalFooter],
  template: `
    <button krdsButton size="large" variant="secondary" (click)="open.set(true)">배경 없는 모달 열기</button>
    <krds-modal heading="배경 없는 모달" [backdrop]="false" [(open)]="open">
      <p>배경 딤 처리 없이 모달만 표시됩니다.</p>
      <div krdsModalFooter>
        <button krdsButton size="medium" (click)="open.set(false)">확인</button>
      </div>
    </krds-modal>
  `
})
export default class ModalNoBackdrop {
  readonly open = signal(false)
}
