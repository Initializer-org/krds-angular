import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsControl, KrdsToggleSwitch } from '@krds.ui/angular'

@Component({
  selector: 'demo-toggle-switch-basic',
  imports: [KrdsToggleSwitch, KrdsControl, FormsModule],
  template: `
    <krds-toggle-switch><input type="checkbox" krdsControl [(ngModel)]="checked" />switch : default</krds-toggle-switch>
    <p style="margin-top: 1rem">현재 상태: {{ checked() ? '켜짐' : '꺼짐' }}</p>
  `
})
export default class ToggleSwitchBasic {
  readonly checked = signal(false)
}
