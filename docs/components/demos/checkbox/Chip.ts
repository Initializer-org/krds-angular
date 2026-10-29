import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsCheckArea, KrdsCheckbox, KrdsControl } from '@krds.ui/angular'

@Component({
  selector: 'demo-checkbox-chip',
  imports: [KrdsCheckbox, KrdsCheckArea, KrdsControl, FormsModule],
  template: `
    <div krdsCheckArea>
      <krds-checkbox chip><input type="checkbox" krdsControl [(ngModel)]="checked1" />Chip 체크박스 1</krds-checkbox>
      <krds-checkbox chip><input type="checkbox" krdsControl [(ngModel)]="checked2" />Chip 체크박스 2 (선택됨)</krds-checkbox>
      <krds-checkbox chip><input type="checkbox" krdsControl [(ngModel)]="checked3" disabled />Chip 체크박스 3</krds-checkbox>
    </div>
  `
})
export default class CheckboxChip {
  readonly checked1 = signal(false)
  readonly checked2 = signal(true)
  readonly checked3 = signal(false)
}
