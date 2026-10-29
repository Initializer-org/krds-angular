import { Component } from '@angular/core'
import { KrdsBadge } from '@krds.ui/angular'

@Component({
  selector: 'demo-badge-number-badge',
  imports: [KrdsBadge],
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center">
      <span krdsBadge type="bg" color="primary" number>1234</span>
      <span krdsBadge type="bg" color="point" number>1234</span>
    </div>
  `
})
export default class BadgeNumberBadge {}
