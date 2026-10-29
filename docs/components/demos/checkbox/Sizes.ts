import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsCheckArea, KrdsCheckbox, KrdsControl } from '@krds.ui/angular'

@Component({
  selector: 'demo-checkbox-sizes',
  imports: [KrdsCheckbox, KrdsCheckArea, KrdsControl, FormsModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1.5rem">
      <div krdsCheckArea>
        <krds-checkbox size="medium"><input type="checkbox" krdsControl [(ngModel)]="medium" />Medium 크기 체크박스</krds-checkbox>
      </div>
      <div krdsCheckArea>
        <krds-checkbox size="large"><input type="checkbox" krdsControl [(ngModel)]="large" />Large 크기 체크박스</krds-checkbox>
      </div>
    </div>
  `
})
export default class CheckboxSizes {
  readonly medium = signal(false)
  readonly large = signal(false)
}
