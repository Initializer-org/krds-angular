import { Component, booleanAttribute, computed, contentChild, input } from '@angular/core'
import { KRDS_FIELD, KrdsControl, type KrdsField } from '../control/control'

/** 입력 상태 (도움말 문구 색과 입력 필드 테두리) */
export type KrdsFormGroupState = 'default' | 'error' | 'success' | 'information'

let nextId = 0

/**
 * KRDS 폼 그룹. 레이블, 입력 영역(.form-conts), 도움말을 묶고, 안에 든 입력 요소(`krdsInput`·`krdsSelect`·`krdsControl`)에
 * label `for`, 도움말 `aria-describedby`, 오류 상태 `aria-invalid`를 자동으로 연결한다.
 * 입력 요소 하나를 위한 묶음이다. 체크박스·라디오 여러 개는 `<fieldset krdsCheckArea>`와 legend로 묶는다
 *
 * @example
 * <krds-form-group label="이메일" hint="이메일 형식이 올바르지 않습니다" state="error">
 *   <input krdsInput type="email" [(ngModel)]="email" />
 * </krds-form-group>
 */
@Component({
  selector: 'krds-form-group',
  host: { class: 'form-group' },
  providers: [{ provide: KRDS_FIELD, useExisting: KrdsFormGroup }],
  template: `
    @if (label()) {
      <div class="form-tit">
        <label [attr.for]="control()?.id()">{{ label() }}</label>
      </div>
    }
    <div
      class="form-conts"
      [class.btn-ico-wrap]="withButton()"
      [class]="state() === 'default' ? '' : 'is-' + state()"
      [attr.data-delete]="deleteButton() ? 'true' : null"
    >
      <ng-content />
    </div>
    @if (hint()) {
      <p [id]="hintId" [class]="hintClass()">{{ hint() }}</p>
    }
  `
})
export class KrdsFormGroup implements KrdsField {
  /** 레이블 */
  readonly label = input<string>()
  /** 도움말 (state에 따라 오류·성공·안내 문구) */
  readonly hint = input<string>()
  /** 입력 상태 */
  readonly state = input<KrdsFormGroupState>('default')
  /** 입력 필드 안에 버튼을 둠 (비밀번호 보기·내용 삭제 등) */
  readonly withButton = input(false, { transform: booleanAttribute })
  /** 값이 있을 때만 내용 삭제 버튼(.btn-delete-input)을 보임 */
  readonly deleteButton = input(false, { transform: booleanAttribute })

  protected readonly control = contentChild(KrdsControl, { descendants: true })
  protected readonly hintId = `krds-form-hint-${nextId++}`
  protected readonly hintClass = computed(() => {
    const state = this.state()
    return state === 'error' ? 'form-hint-invalid' : state === 'default' ? 'form-hint' : `form-hint-${state}`
  })

  readonly describedBy = computed(() => (this.hint() ? this.hintId : null))
  readonly invalid = computed(() => this.state() === 'error')
}
