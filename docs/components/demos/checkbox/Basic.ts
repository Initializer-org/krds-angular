import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsCheckArea, KrdsCheckbox, KrdsControl } from '@krds.ui/angular'

@Component({
  selector: 'demo-checkbox-basic',
  imports: [KrdsCheckbox, KrdsCheckArea, KrdsControl, FormsModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 2rem">
      <div krdsCheckArea>
        <krds-checkbox><input type="checkbox" krdsControl [(ngModel)]="basic" />기본</krds-checkbox>
        <krds-checkbox><input type="checkbox" krdsControl [(ngModel)]="selected" />선택됨</krds-checkbox>
        <krds-checkbox><input type="checkbox" krdsControl [(ngModel)]="disabled" disabled />비활성화</krds-checkbox>
        <krds-checkbox><input type="checkbox" krdsControl [(ngModel)]="disabledSelected" disabled />선택된 비활성화</krds-checkbox>
      </div>

      <div krdsCheckArea column>
        <krds-checkbox description="부가적인 설명이 들어갑니다.">
          <input type="checkbox" krdsControl [(ngModel)]="description1" />
          체크박스
        </krds-checkbox>
        <krds-checkbox description="부가적인 설명이 들어갑니다.">
          <input type="checkbox" krdsControl [(ngModel)]="description2" />
          체크박스
        </krds-checkbox>
      </div>
    </div>
  `
})
export default class CheckboxBasic {
  readonly basic = signal(false)
  readonly selected = signal(true)
  readonly disabled = signal(false)
  readonly disabledSelected = signal(true)
  readonly description1 = signal(false)
  readonly description2 = signal(false)
}
