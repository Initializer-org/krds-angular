import { Component, contentChild, input } from '@angular/core'
import { KrdsControl } from '../control/control'

/** 토글 스위치 크기 */
export type KrdsToggleSwitchSize = 'medium' | 'large'

/**
 * KRDS 토글 스위치. 안에 넣은 `<input type="checkbox" krdsControl>` 뒤에 스위치 모양 label을 붙여 연결한다.
 * 켜짐 상태·disabled는 기본 input에 그대로 쓴다 (`[(ngModel)]`, `formControlName` 포함)
 *
 * @example <krds-toggle-switch><input type="checkbox" krdsControl [(ngModel)]="alarm" />알림</krds-toggle-switch>
 */
@Component({
  selector: 'krds-toggle-switch',
  host: {
    '[class]': "'krds-form-toggle-switch ' + size()"
  },
  template: `
    <ng-content select="[krdsControl]" />
    <label [for]="control().id()">
      <span class="switch-toggle"><i></i></span>
      <ng-content />
    </label>
  `
})
export class KrdsToggleSwitch {
  /** 크기 */
  readonly size = input<KrdsToggleSwitchSize>('medium')

  protected readonly control = contentChild.required(KrdsControl)
}
