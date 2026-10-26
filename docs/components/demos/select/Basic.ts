import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsFormGroup, KrdsSelect } from '@krds.ui/angular'

@Component({
  selector: 'demo-select-basic',
  imports: [KrdsFormGroup, KrdsSelect, FormsModule],
  template: `
    <div style="max-width: 400px">
      <krds-form-group label="거주 지역" hint="현재 거주하고 있는 지역을 선택해 주세요">
        <select krdsSelect [(ngModel)]="region">
          <option value="" disabled>선택</option>
          @for (option of options; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </krds-form-group>
    </div>
  `
})
export default class SelectBasic {
  readonly region = signal('')
  readonly options = [
    { value: 'seoul', label: '서울특별시' },
    { value: 'busan', label: '부산광역시' },
    { value: 'daegu', label: '대구광역시' },
    { value: 'incheon', label: '인천광역시' },
    { value: 'gwangju', label: '광주광역시' },
    { value: 'daejeon', label: '대전광역시' },
    { value: 'ulsan', label: '울산광역시' },
    { value: 'sejong', label: '세종특별자치시' }
  ]
}
