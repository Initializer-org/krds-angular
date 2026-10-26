import { Component } from '@angular/core'
import { KrdsCriticalAlerts } from '@krds.ui/angular'

@Component({
  selector: 'demo-critical-alerts-basic',
  imports: [KrdsCriticalAlerts],
  template: ` <krds-critical-alerts type="danger" message="긴급 공지 내용 표시" linkHref="#" linkText="자세히 보기" /> `
})
export default class CriticalAlertsBasic {}
