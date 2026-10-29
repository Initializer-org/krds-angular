import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsDateInput, KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-date-input-events-and-holidays',
  imports: [FormsModule, KrdsDateInput, KrdsFormGroup, KrdsInput],
  template: `
    <krds-form-group label="날짜 선택">
      <krds-date-input [initialYear]="2025" [initialMonth]="5" [holidays]="['2025.05.05', '2025.05.06']" [eventDates]="['2025.05.15']">
        <input krdsInput placeholder="YYYY.MM.DD" [(ngModel)]="date" />
      </krds-date-input>
    </krds-form-group>
  `
})
export default class DateInputEventsAndHolidays {
  readonly date = signal('')
}
