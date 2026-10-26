import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsButton, KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'demo-input-icon-buttons',
  imports: [FormsModule, KrdsButton, KrdsFormGroup, KrdsInput],
  template: `
    <div class="fieldset">
      <!-- 비밀번호 보기 버튼 -->
      <krds-form-group label="비밀번호" withButton>
        <input
          krdsInput
          [type]="showPassword() ? 'text' : 'password'"
          placeholder="8-12자의 영문자, 숫자, 특수문자 조합"
          [(ngModel)]="password"
        />
        <button krdsButton type="button" size="medium" icon (click)="showPassword.set(!showPassword())">
          <span class="sr-only">{{ showPassword() ? '입력한 비밀번호 가리기' : '입력한 비밀번호 보기' }}</span>
          <i class="svg-icon" [class]="showPassword() ? 'ico-pw-visible-on' : 'ico-pw-visible'" aria-hidden="true"></i>
        </button>
      </krds-form-group>

      <!-- 내용 삭제 버튼 (값이 있을 때만 보임) -->
      <krds-form-group label="검색어" withButton deleteButton>
        <input #keywordInput krdsInput placeholder="내용을 입력하세요" [(ngModel)]="keyword" />
        <button krdsButton type="button" size="medium" icon pure class="btn-delete-input" (click)="keyword.set(''); keywordInput.focus()">
          <span class="sr-only">내용 삭제</span>
          <i class="svg-icon ico-delete-fill" aria-hidden="true"></i>
        </button>
      </krds-form-group>

      <!-- 버튼 여러 개 -->
      <krds-form-group label="비밀번호 확인" withButton deleteButton>
        <input
          #confirmInput
          krdsInput
          [type]="showConfirm() ? 'text' : 'password'"
          placeholder="8-12자의 영문자, 숫자, 특수문자 조합"
          [(ngModel)]="confirm"
        />
        <div class="btn-group">
          <button krdsButton type="button" size="medium" icon pure class="btn-delete-input" (click)="confirm.set(''); confirmInput.focus()">
            <span class="sr-only">내용 삭제</span>
            <i class="svg-icon ico-delete-fill" aria-hidden="true"></i>
          </button>
          <button krdsButton type="button" size="medium" icon (click)="showConfirm.set(!showConfirm())">
            <span class="sr-only">{{ showConfirm() ? '입력한 비밀번호 가리기' : '입력한 비밀번호 보기' }}</span>
            <i class="svg-icon" [class]="showConfirm() ? 'ico-pw-visible-on' : 'ico-pw-visible'" aria-hidden="true"></i>
          </button>
        </div>
      </krds-form-group>
    </div>
  `
})
export default class InputIconButtons {
  readonly password = signal('1234567890')
  readonly showPassword = signal(false)
  readonly keyword = signal('')
  readonly confirm = signal('1234567890')
  readonly showConfirm = signal(false)
}
