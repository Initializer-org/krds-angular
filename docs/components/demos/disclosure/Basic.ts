import { Component, signal } from '@angular/core'
import { KrdsDisclosure } from '@krds.ui/angular'

@Component({
  selector: 'demo-disclosure-basic',
  imports: [KrdsDisclosure],
  template: `
    <krds-disclosure label="신청 서비스안내" [(expanded)]="expanded">
      <ul class="krds-info-list dash">
        <li>하나의 아이디로 안전하고 편리하게 여러 전자정부 서비스를 이용할 수 있는 서비스입니다.</li>
        <li>디지털원패스 이용문의 : 1533-3713 (평일9~18시, 공휴일제외)</li>
      </ul>
    </krds-disclosure>
  `
})
export default class DisclosureBasic {
  readonly expanded = signal(false)
}
