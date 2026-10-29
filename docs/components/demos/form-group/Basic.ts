import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-form-group-basic',
  imports: [FormsModule, KrdsFormGroup, KrdsInput],
  template: `
    <krds-form-group label="이메일" hint="알림을 받을 이메일 주소를 입력해 주세요">
      <input krdsInput type="email" placeholder="example@korea.kr" [(ngModel)]="email" />
    </krds-form-group>
  `
})
export default class FormGroupBasic {
  readonly email = signal('')
}
