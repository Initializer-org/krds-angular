import { Component } from '@angular/core'
import { KrdsLayout } from '@krds.ui/angular'

@Component({
  selector: 'demo-layout-scroll-disabled',
  imports: [KrdsLayout],
  template: `
    <div krdsLayout [scrollDetection]="false">
      <main id="container" style="height: 200px; padding: 2rem">
        <p>스크롤 감지가 비활성화된 레이아웃</p>
      </main>
    </div>
  `
})
export default class LayoutScrollDisabled {}
