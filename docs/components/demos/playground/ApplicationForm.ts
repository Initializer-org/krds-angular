import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
  KrdsButton,
  KrdsCheckbox,
  KrdsControl,
  KrdsDateInput,
  KrdsFormGroup,
  KrdsInput,
  KrdsModal,
  KrdsModalFooter,
  KrdsRadio,
  KrdsCheckArea,
  KrdsSelect,
  KrdsTextarea,
  KrdsToggleSwitch
} from '@krds.ui/angular'

const initial = () => ({ name: '', type: '', date: '', content: '', receive: 'online', agree: false, notify: true })
@Component({
  selector: 'pg-application-form',
  imports: [
    FormsModule,
    KrdsButton,
    KrdsCheckbox,
    KrdsControl,
    KrdsDateInput,
    KrdsFormGroup,
    KrdsInput,
    KrdsModal,
    KrdsModalFooter,
    KrdsRadio,
    KrdsCheckArea,
    KrdsSelect,
    KrdsTextarea,
    KrdsToggleSwitch
  ],
  template: `
    <div class="pg-section">
      <h3>민원 신청서</h3>
      <p class="pg-hint">필수 항목을 비운 채 신청하면 오류 상태를 볼 수 있습니다.</p>
      <form class="pg-stack" novalidate (ngSubmit)="submit()">
        <krds-form-group label="이름 (필수)" [hint]="nameError" [state]="nameError ? 'error' : 'default'">
          <input krdsInput id="pg-name" name="name" required placeholder="홍길동" [(ngModel)]="form.name" />
        </krds-form-group>
        <krds-form-group label="신청 유형 (필수)" [hint]="typeError" [state]="typeError ? 'error' : 'default'">
          <select krdsSelect id="pg-type" name="type" required [(ngModel)]="form.type">
            <option value="">선택</option>
            <option value="certificate">증명서 발급</option>
            <option value="report">신고</option>
            <option value="proposal">제안·건의</option>
          </select>
        </krds-form-group>
        <krds-form-group label="희망 처리일"
          ><krds-date-input><input krdsInput name="date" placeholder="YYYY.MM.DD" [(ngModel)]="form.date" /></krds-date-input
        ></krds-form-group>
        <krds-form-group label="신청 내용"
          ><krds-textarea [count]="form.content.length" [max]="500">
            <textarea
              krdsInput
              name="content"
              placeholder="예시 내용을 입력하세요"
              maxlength="500"
              [(ngModel)]="form.content"
            ></textarea></krds-textarea
        ></krds-form-group>
        <fieldset krdsCheckArea>
          <legend class="pg-legend">수령 방법</legend>
          <krds-radio><input krdsControl type="radio" name="receive" value="online" [(ngModel)]="form.receive" />온라인</krds-radio>
          <krds-radio><input krdsControl type="radio" name="receive" value="visit" [(ngModel)]="form.receive" />방문</krds-radio>
        </fieldset>
        <krds-toggle-switch
          ><input krdsControl type="checkbox" name="notify" [(ngModel)]="form.notify" />처리 결과 알림 받기</krds-toggle-switch
        >
        <div>
          <krds-checkbox
            ><input
              krdsControl
              id="pg-agree"
              type="checkbox"
              name="agree"
              required
              [(ngModel)]="form.agree"
              [attr.aria-invalid]="!!agreeError"
              [attr.aria-describedby]="agreeError ? 'pg-agree-error' : null"
            />개인정보 수집·이용 동의 (필수)</krds-checkbox
          >
          @if (agreeError) {
            <p id="pg-agree-error" class="pg-error">{{ agreeError }}</p>
          }
        </div>
        <div class="pg-row">
          <button krdsButton type="button" variant="tertiary" (click)="reset()">초기화</button
          ><button krdsButton type="submit">예시 신청하기</button>
        </div>
      </form>
      <krds-modal heading="예시 신청 완료" [(open)]="open"
        ><p>{{ form.name }}님의 입력을 확인했습니다. 체험용 화면이므로 실제 신청이나 정보 전송은 이루어지지 않았습니다.</p>
        <div krdsModalFooter><button krdsButton type="button" (click)="open.set(false)">닫기</button></div></krds-modal
      >
    </div>
  `
})
export default class ApplicationForm {
  form = initial()
  readonly submitted = signal(false)
  readonly open = signal(false)
  get nameError() {
    return this.submitted() && !this.form.name.trim() ? '이름을 입력해 주세요.' : ''
  }
  get typeError() {
    return this.submitted() && !this.form.type ? '신청 유형을 선택해 주세요.' : ''
  }
  get agreeError() {
    return this.submitted() && !this.form.agree ? '개인정보 수집·이용에 동의해 주세요.' : ''
  }
  submit() {
    this.submitted.set(true)
    const missing = this.nameError ? 'pg-name' : this.typeError ? 'pg-type' : this.agreeError ? 'pg-agree' : ''
    if (missing) document.getElementById(missing)?.focus()
    else this.open.set(true)
  }
  reset() {
    this.form = initial()
    this.submitted.set(false)
  }
}
