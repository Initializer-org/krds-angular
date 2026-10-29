import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsControl, KrdsToggleSwitch } from '@krds.ui/angular'

@Component({
  selector: 'demo-toggle-switch-sizes',
  imports: [KrdsToggleSwitch, KrdsControl, FormsModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1.5rem">
      <krds-toggle-switch size="medium"
        ><input type="checkbox" krdsControl [(ngModel)]="medium" />Medium 크기 스위치 (기본)</krds-toggle-switch
      >
      <krds-toggle-switch size="large"><input type="checkbox" krdsControl [(ngModel)]="large" />Large 크기 스위치</krds-toggle-switch>
    </div>
  `
})
export default class ToggleSwitchSizes {
  readonly medium = signal(false)
  readonly large = signal(false)
}
