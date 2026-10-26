import { Component } from '@angular/core'
import { KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-input-loading',
  imports: [KrdsFormGroup, KrdsInput],
  template: `
    <div class="fieldset">
      <krds-form-group label="레이블" hint="데이터를 불러오는 중입니다" loading>
        <input krdsInput placeholder="플레이스홀더" />
      </krds-form-group>
      <krds-form-group label="레이블" hint="검증 중입니다" loading>
        <input krdsInput placeholder="플레이스홀더" value="입력된 값" />
      </krds-form-group>
    </div>
  `
})
export default class InputLoading {}
