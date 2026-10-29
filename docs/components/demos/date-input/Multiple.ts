import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsDateInput, KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-date-input-multiple',
  imports: [FormsModule, KrdsDateInput, KrdsFormGroup, KrdsInput],
  template: `
    <div class="fieldset">
      <krds-form-group label="시작일">
        <krds-date-input>
          <input krdsInput placeholder="YYYY.MM.DD" [(ngModel)]="start" />
        </krds-date-input>
      </krds-form-group>
      <krds-form-group label="종료일">
        <krds-date-input>
          <input krdsInput placeholder="YYYY.MM.DD" [(ngModel)]="end" />
        </krds-date-input>
      </krds-form-group>
    </div>
  `
})
export default class DateInputMultiple {
  readonly start = signal('')
  readonly end = signal('')
}
