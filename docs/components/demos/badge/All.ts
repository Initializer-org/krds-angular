import { Component } from '@angular/core'
import { KrdsBadge, type KrdsBadgeColor, type KrdsBadgeSize, type KrdsBadgeType } from '@krds.ui/angular'

@Component({
  selector: 'demo-badge-all',
  imports: [KrdsBadge],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem">
      @for (row of rows; track row.type) {
        <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center">
          @for (color of colors; track color) {
            <span krdsBadge [type]="row.type" [color]="color" [size]="row.size">label</span>
          }
        </div>
      }
    </div>
  `
})
export default class BadgeAll {
  readonly rows: { type: KrdsBadgeType; size: KrdsBadgeSize }[] = [
    { type: 'outline', size: 'large' },
    { type: 'bg', size: 'medium' },
    { type: 'bg-light', size: 'small' }
  ]
  readonly colors: KrdsBadgeColor[] = ['primary', 'secondary', 'gray', 'point', 'danger', 'warning', 'success', 'information']
}
