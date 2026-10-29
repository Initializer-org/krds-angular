import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsFormGroup, KrdsSelect } from '@krds.ui/angular'

@Component({
  selector: 'demo-select-sizes',
  imports: [KrdsFormGroup, KrdsSelect, FormsModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 400px">
      <krds-form-group label="Large">
        <select krdsSelect size="large" [(ngModel)]="large">
          @for (option of options; track option) {
            <option [value]="option">{{ option }}</option>
          }
        </select>
      </krds-form-group>
      <krds-form-group label="Medium">
        <select krdsSelect size="medium" [(ngModel)]="medium">
          @for (option of options; track option) {
            <option [value]="option">{{ option }}</option>
          }
        </select>
      </krds-form-group>
      <krds-form-group label="Small">
        <select krdsSelect size="small" [(ngModel)]="small">
          @for (option of options; track option) {
            <option [value]="option">{{ option }}</option>
          }
        </select>
      </krds-form-group>
    </div>
  `
})
export default class SelectSizes {
  readonly options = ['large', 'medium', 'small']
  readonly large = signal('large')
  readonly medium = signal('medium')
  readonly small = signal('small')
}
