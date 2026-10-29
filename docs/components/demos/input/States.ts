import { Component } from '@angular/core'
import { KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-input-states',
  imports: [KrdsFormGroup, KrdsInput],
  template: `
    <div class="fieldset">
      <krds-form-group label="레이블" hint="에러 메시지" state="error">
        <input krdsInput placeholder="플레이스홀더" value="에러" />
      </krds-form-group>
      <krds-form-group label="레이블" hint="성공 메시지" state="success">
        <input krdsInput placeholder="플레이스홀더" value="성공" />
      </krds-form-group>
      <krds-form-group label="레이블" hint="정보 메시지" state="information">
        <input krdsInput placeholder="플레이스홀더" value="정보" />
      </krds-form-group>
    </div>
  `
})
export default class InputStates {}
