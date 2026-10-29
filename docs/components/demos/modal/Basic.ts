import { Component, signal } from '@angular/core'
import { KrdsButton, KrdsModal, KrdsModalFooter } from '@krds.ui/angular'

@Component({
  selector: 'demo-modal-basic',
  imports: [KrdsButton, KrdsModal, KrdsModalFooter],
  template: `
    <button krdsButton size="large" variant="secondary" (click)="open.set(true)">모달 열기</button>
    <krds-modal heading="모달 제목" [(open)]="open">
      <p>대화 상자는 사용자에게 작업에 대해 알리고 중요한 정보를 포함하거나 결정이 필요하거나 여러 작업을 포함할 수 있습니다.</p>
      <div krdsModalFooter>
        <button krdsButton size="medium" variant="tertiary" (click)="open.set(false)">아니요</button>
        <button krdsButton size="medium" (click)="open.set(false)">예</button>
      </div>
    </krds-modal>
  `
})
export default class ModalBasic {
  readonly open = signal(false)
}
