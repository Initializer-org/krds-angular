import { Component } from '@angular/core'
import { KrdsResize } from '@krds.ui/angular'

@Component({
  selector: 'demo-resize-basic',
  imports: [KrdsResize],
  template: `
    <div style="height: 400px; padding: 20px">
      <krds-resize />
    </div>
  `
})
export default class ResizeBasic {}
