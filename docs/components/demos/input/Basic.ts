import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-input-basic',
  imports: [FormsModule, KrdsFormGroup, KrdsInput],
  template: `
    <div class="fieldset">
      <krds-form-group label="레이블" hint="도움말">
        <input krdsInput placeholder="플레이스홀더" [(ngModel)]="name" />
      </krds-form-group>
      <krds-form-group label="레이블" hint="도움말">
        <input krdsInput placeholder="플레이스홀더" value="readonly" readonly />
      </krds-form-group>
      <krds-form-group label="레이블" hint="도움말">
        <input krdsInput placeholder="플레이스홀더" value="disabled" disabled />
      </krds-form-group>
    </div>
  `
})
export default class InputBasic {
  readonly name = signal('')
}
