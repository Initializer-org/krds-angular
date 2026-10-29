import { Component, signal } from '@angular/core'
import { KrdsPanel } from '@krds.ui/angular'

@Component({
  selector: 'demo-panel-basic',
  imports: [KrdsPanel],
  template: `<krds-panel [(open)]="open" />`
})
export default class PanelBasic {
  readonly open = signal(false)
}
