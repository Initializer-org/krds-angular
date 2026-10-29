import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsDateInput, KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-date-input-readonly',
  imports: [FormsModule, KrdsDateInput, KrdsFormGroup, KrdsInput],
  template: `
    <krds-form-group label="날짜 선택">
      <krds-date-input>
        <input krdsInput readonly [(ngModel)]="date" />
      </krds-date-input>
    </krds-form-group>
  `
})
export default class DateInputReadonly {
  readonly date = signal('2025.03.10')
}
