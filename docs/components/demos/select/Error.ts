import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsFormGroup, KrdsSelect } from '@krds.ui/angular'

@Component({
  selector: 'demo-select-error',
  imports: [KrdsFormGroup, KrdsSelect, FormsModule],
  template: `
    <div style="max-width: 400px">
      <krds-form-group label="신청 유형" hint="신청 유형을 선택해 주세요" state="error">
        <select krdsSelect [(ngModel)]="type">
          <option value="" disabled>선택</option>
          <option value="item1">항목1</option>
          <option value="item2">항목2</option>
          <option value="item3">항목3</option>
        </select>
      </krds-form-group>
    </div>
  `
})
export default class SelectError {
  readonly type = signal('')
}
