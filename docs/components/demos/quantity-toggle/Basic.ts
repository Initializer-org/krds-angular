import { Component, signal } from '@angular/core'
import { KrdsQuantityToggle } from '@krds.ui/angular'

@Component({
  selector: 'demo-quantity-toggle-basic',
  imports: [KrdsQuantityToggle],
  template: ` <krds-quantity-toggle label="관람 인원" [min]="1" [max]="4" [(value)]="count" /> `
})
export default class QuantityToggleBasic {
  readonly count = signal(1)
}
