import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsDateInput, KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-date-input-basic',
  imports: [FormsModule, KrdsDateInput, KrdsFormGroup, KrdsInput],
  template: `
    <krds-form-group label="날짜 선택" hint="도움말">
      <krds-date-input>
        <input krdsInput placeholder="YYYY.MM.DD" [(ngModel)]="date" />
      </krds-date-input>
    </krds-form-group>
  `
})
export default class DateInputBasic {
  readonly date = signal('')
}
