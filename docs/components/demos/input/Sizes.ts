import { Component } from '@angular/core'
import { KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-input-sizes',
  imports: [KrdsFormGroup, KrdsInput],
  template: `
    <div class="fieldset">
      <krds-form-group label="small" hint="도움말">
        <input krdsInput placeholder="플레이스홀더" size="small" />
      </krds-form-group>
      <krds-form-group label="medium" hint="도움말">
        <input krdsInput placeholder="플레이스홀더" size="medium" />
      </krds-form-group>
      <krds-form-group label="large (기본)" hint="도움말">
        <input krdsInput placeholder="플레이스홀더" size="large" />
      </krds-form-group>
      <krds-form-group label="xlarge" hint="도움말">
        <input krdsInput placeholder="플레이스홀더" size="xlarge" />
      </krds-form-group>
    </div>
  `
})
export default class InputSizes {}
