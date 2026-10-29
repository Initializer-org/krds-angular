import { Component } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { KrdsDateInput, KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-date-input-disabled',
  imports: [ReactiveFormsModule, KrdsDateInput, KrdsFormGroup, KrdsInput],
  template: `
    <krds-form-group label="날짜 선택">
      <krds-date-input>
        <input krdsInput [formControl]="date" />
      </krds-date-input>
    </krds-form-group>
  `
})
export default class DateInputDisabled {
  readonly date = new FormControl({ value: '2025.03.10', disabled: true })
}
