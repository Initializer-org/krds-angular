import { Component, signal } from '@angular/core'
import { KrdsQuantityToggle } from '@krds.ui/angular'

@Component({
  selector: 'demo-quantity-toggle-vertical',
  imports: [KrdsQuantityToggle],
  template: ` <krds-quantity-toggle label="증명서 발급 수" [max]="5" vertical [(value)]="count" /> `
})
export default class QuantityToggleVertical {
  readonly count = signal(0)
}
