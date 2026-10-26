import { Component, computed, signal } from '@angular/core'
import { FormField, email, form, required } from '@angular/forms/signals'
import { KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-form-group-validation',
  imports: [FormField, KrdsFormGroup, KrdsInput],
  template: `
    <krds-form-group label="이메일" [hint]="hint()" [state]="showError() ? 'error' : 'default'">
      <input krdsInput type="email" placeholder="example@korea.kr" [formField]="signupForm.email" />
    </krds-form-group>
  `
})
export default class FormGroupValidation {
  readonly model = signal({ email: '' })
  readonly signupForm = form(this.model, path => {
    required(path.email, { message: '이메일을 입력해 주세요' })
    email(path.email, { message: '이메일 형식이 올바르지 않습니다' })
  })
  // 입력 필드를 한 번 떠난 뒤(touched)부터 오류를 보여 준다
  readonly showError = computed(() => this.signupForm.email().touched() && this.signupForm.email().invalid())
  readonly hint = computed(() =>
    this.showError() ? this.signupForm.email().errors()[0].message : '알림을 받을 이메일 주소를 입력해 주세요'
  )
}
