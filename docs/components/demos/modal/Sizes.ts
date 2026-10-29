import { Component, signal } from '@angular/core'
import { KrdsButton, KrdsModal, KrdsModalFooter, type KrdsModalSize } from '@krds.ui/angular'

@Component({
  selector: 'demo-modal-sizes',
  imports: [KrdsButton, KrdsModal, KrdsModalFooter],
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 1rem">
      @for (option of sizes; track option.size) {
        <button krdsButton size="large" variant="secondary" (click)="show(option.size)">{{ option.label }} 모달 열기</button>
      }
    </div>
    <krds-modal [heading]="current().label + ' 모달'" [size]="current().size" [(open)]="open">
      <p>{{ current().text }} 크기의 모달입니다.</p>
      <div krdsModalFooter>
        <button krdsButton size="medium" (click)="open.set(false)">확인</button>
      </div>
    </krds-modal>
  `
})
export default class ModalSizes {
  readonly sizes: { size: KrdsModalSize; label: string; text: string }[] = [
    { size: 'small', label: 'Small', text: '작은' },
    { size: 'medium', label: 'Medium', text: '기본' },
    { size: 'large', label: 'Large', text: '큰' }
  ]
  readonly current = signal(this.sizes[0])
  readonly open = signal(false)

  show(size: KrdsModalSize) {
    this.current.set(this.sizes.find(option => option.size === size)!)
    this.open.set(true)
  }
}
