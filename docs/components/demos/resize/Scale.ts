import { Component, signal } from '@angular/core'
import { KrdsResize, type KrdsResizeScale } from '@krds.ui/angular'

@Component({
  selector: 'demo-resize-scale',
  imports: [KrdsResize],
  template: `
    <div style="height: 400px; padding: 20px">
      <krds-resize [(scale)]="scale" />
      <p>선택한 크기: {{ scale() }}</p>
    </div>
  `
})
export default class ResizeScale {
  // '조금 크게'로 시작한다. 고른 값을 저장해 두었다가 다음 방문 때 넘기면 사용자가 고른 크기를 유지할 수 있다
  readonly scale = signal<KrdsResizeScale>('lg')
}
