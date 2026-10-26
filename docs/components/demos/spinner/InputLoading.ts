import { Component } from '@angular/core'
import { KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-spinner-input-loading',
  imports: [KrdsFormGroup, KrdsInput],
  template: `
    <div style="display: flex; flex-direction: column; gap: 2rem">
      <krds-form-group label="Label" loading>
        <input krdsInput type="text" placeholder="placeholder" />
      </krds-form-group>
      <krds-form-group label="검증 중" loading>
        <input krdsInput type="text" value="입력된 값" placeholder="placeholder" />
      </krds-form-group>
    </div>
  `
})
export default class SpinnerInputLoading {}
