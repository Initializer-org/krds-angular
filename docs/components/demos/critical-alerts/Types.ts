import { Component } from '@angular/core'
import { KrdsCriticalAlerts } from '@krds.ui/angular'

@Component({
  selector: 'demo-critical-alerts-types',
  imports: [KrdsCriticalAlerts],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem">
      <krds-critical-alerts type="danger" message="긴급 공지 내용 표시" linkHref="#" />
      <krds-critical-alerts type="ok" message="안전 공지 내용 표시" linkHref="#" />
      <krds-critical-alerts type="info" message="안내 공지 내용 표시" />
    </div>
  `
})
export default class CriticalAlertsTypes {}
