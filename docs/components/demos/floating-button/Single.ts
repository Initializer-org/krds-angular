import { Component, signal } from '@angular/core'
import { KrdsFloatingButton } from '@krds.ui/angular'

@Component({
  selector: 'demo-floating-button-single',
  imports: [KrdsFloatingButton],
  template: `
    <p>오른쪽 아래 버튼을 눌러 보세요. 누른 횟수: {{ count() }}</p>
    <krds-floating-button label="채팅 상담" icon="ico-faq" (click)="count.set(count() + 1)" />
  `
})
export default class FloatingButtonSingle {
  readonly count = signal(0)
}
