import { Component } from '@angular/core'
import { KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-form-group-hint-types',
  imports: [KrdsFormGroup, KrdsInput],
  template: `
    <div class="fieldset">
      <krds-form-group label="레이블" hint="도움말">
        <input krdsInput placeholder="플레이스홀더" />
      </krds-form-group>
      <krds-form-group label="레이블" hint="에러 메시지" state="error">
        <input krdsInput value="에러" />
      </krds-form-group>
      <krds-form-group label="레이블" hint="성공 메시지" state="success">
        <input krdsInput value="성공" />
      </krds-form-group>
      <krds-form-group label="레이블" hint="정보 메시지" state="information">
        <input krdsInput value="정보" />
      </krds-form-group>
    </div>
  `
})
export default class FormGroupHintTypes {}
