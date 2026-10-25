import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { FormField, disabled, form, required } from '@angular/forms/signals'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsButton } from '../button/button'
import { KrdsInput } from '../input/input'
import { KrdsSelect } from '../select/select'
import { KrdsFormGroup } from './form-group'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsFormGroup, KrdsInput, KrdsSelect, KrdsButton, FormsModule, FormField],
  template: '<krds-form-group label="이름"><input krdsInput [(ngModel)]="name" /><button krdsButton>확인</button></krds-form-group>'
})
class Host {
  readonly name = signal('')
  readonly locked = signal(false)
  readonly model = signal({ email: 'a@example.go.kr' })
  readonly signupForm = form(this.model, path => {
    required(path.email)
    disabled(path.email, () => this.locked())
  })
}

const typeInto = (input: HTMLInputElement, value: string) => {
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('KrdsFormGroup', () => {
  it('레이블·입력 영역·도움말을 KRDS 마크업으로 묶고 label·도움말을 입력 필드에 연결한다', async () => {
    const { $ } = await render(
      Host,
      '<krds-form-group label="이름" hint="실명을 입력하세요"><input krdsInput size="large" /></krds-form-group>'
    )
    const input = $<HTMLInputElement>('input')
    const hint = $('p')
    expect(classesOf($('krds-form-group'))).toEqual(['form-group'])
    expect($<HTMLLabelElement>('.form-tit > label').htmlFor).toBe(input.id)
    expect(input.closest('.form-conts')).toBe($('krds-form-group > .form-conts'))
    expect(classesOf(input)).toEqual(['krds-input', 'large'])
    expect(hint.className).toBe('form-hint')
    expect(input.getAttribute('aria-describedby')).toBe(hint.id)
    expect(input.hasAttribute('aria-invalid')).toBe(false)
  })

  it('오류 상태: 입력 영역에 is-error, 도움말은 오류 문구, aria-invalid, KRDS 오류 테두리', async () => {
    const { $ } = await render(
      Host,
      '<krds-form-group label="이메일" hint="형식이 올바르지 않습니다" state="error"><input krdsInput /></krds-form-group>'
    )
    const input = $<HTMLInputElement>('input')
    expect(classesOf($('.form-conts'))).toEqual(['form-conts', 'is-error'])
    expect($('p').className).toBe('form-hint-invalid')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(getComputedStyle(input).borderTopWidth).toBe('2px')
  })

  it('성공 상태와 도움말·레이블이 없을 때', async () => {
    const { $, $$ } = await render(
      Host,
      `
        <krds-form-group hint="사용할 수 있습니다" state="success"><input krdsInput id="nickname" /></krds-form-group>
        <krds-form-group><input krdsInput /></krds-form-group>
      `
    )
    const [success, bare] = $$<HTMLInputElement>('input')
    expect(success.id).toBe('nickname')
    expect($('p').className).toBe('form-hint-success')
    expect(success.hasAttribute('aria-invalid')).toBe(false)
    expect(bare.hasAttribute('aria-describedby')).toBe(false)
    expect($$('.form-tit')).toHaveLength(0)
  })

  it('셀렉트·텍스트 영역도 같은 방식으로 연결한다', async () => {
    const { $$ } = await render(
      Host,
      `
        <krds-form-group label="지역"><select krdsSelect><option>서울</option></select></krds-form-group>
        <krds-form-group label="내용" hint="500자 이내"><textarea krdsInput></textarea></krds-form-group>
      `
    )
    const [selectLabel, textareaLabel] = $$<HTMLLabelElement>('label')
    const select = $$('select')[0]
    const textarea = $$('textarea')[0]
    expect(selectLabel.htmlFor).toBe(select.id)
    expect(textareaLabel.htmlFor).toBe(textarea.id)
    expect(classesOf(textarea)).toEqual(['krds-input'])
    expect(textarea.getAttribute('aria-describedby')).toBe($$('p')[0].id)
  })

  it('입력 필드 안 버튼과 값이 있을 때만 보이는 내용 삭제 버튼', async () => {
    const { $, stable } = await render(
      Host,
      `
        <krds-form-group label="검색어" withButton deleteButton>
          <input krdsInput placeholder="검색어 입력" [(ngModel)]="name" />
          <button krdsButton icon pure class="btn-delete-input" (click)="name.set('')"><span class="sr-only">내용 삭제</span></button>
        </krds-form-group>
      `
    )
    const conts = $('.form-conts')
    const deleteButton = $('.btn-delete-input')
    expect(classesOf(conts)).toEqual(['btn-ico-wrap', 'form-conts'])
    expect(conts.dataset['delete']).toBe('true')
    expect(getComputedStyle(deleteButton).display).toBe('none')

    typeInto($('input'), '정책')
    await stable()
    expect(getComputedStyle(deleteButton).display).toBe('flex')
  })

  it('로딩: 입력 필드와 스피너를 form-spinner로 묶고, 아닐 때는 구조를 그대로 둔다', async () => {
    const { $, $$ } = await render(
      Host,
      `
        <krds-form-group label="주소" hint="불러오는 중입니다" loading><input krdsInput /></krds-form-group>
        <krds-form-group label="이름"><input krdsInput /></krds-form-group>
      `
    )
    const [loading, idle] = $$('.form-conts > div')
    expect(loading.className).toBe('form-spinner')
    expect(loading.querySelector('input + krds-spinner[role="status"]')).toBeTruthy()
    expect(getComputedStyle(loading.querySelector('.krds-spinner')!).position).toBe('absolute')
    expect(idle.className).toBe('')
    expect(getComputedStyle(idle).display).toBe('contents')
    expect($$('krds-spinner')).toHaveLength(1)
    expect($('input').getAttribute('aria-describedby')).toBe($('p').id)
  })

  it('ngModel이 입력 값을 받는다', async () => {
    const { host, $, stable } = await render(Host, '<krds-form-group label="이름"><input krdsInput [(ngModel)]="name" /></krds-form-group>')
    typeInto($('input'), '홍길동')
    await stable()
    expect(host.name()).toBe('홍길동')
  })

  it('Signal Forms([formField])의 값·비활성화가 기본 입력 필드에 그대로 반영된다', async () => {
    const { host, $, stable } = await render(
      Host,
      '<krds-form-group label="이메일"><input krdsInput type="email" [formField]="signupForm.email" /></krds-form-group>'
    )
    const input = $<HTMLInputElement>('input')
    expect(input.value).toBe('a@example.go.kr')
    expect($<HTMLLabelElement>('label').htmlFor).toBe(input.id)

    typeInto(input, 'b@example.go.kr')
    await stable()
    expect(host.model().email).toBe('b@example.go.kr')

    host.locked.set(true)
    await stable()
    expect(input.disabled).toBe(true)
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      `
        <krds-form-group label="이름" hint="도움말"><input krdsInput /></krds-form-group>
        <krds-form-group label="이메일" hint="형식이 올바르지 않습니다" state="error"><input krdsInput type="email" /></krds-form-group>
        <krds-form-group label="지역"><select krdsSelect><option>서울</option></select></krds-form-group>
        <krds-form-group label="비활성화"><input krdsInput disabled value="disabled" /></krds-form-group>
      `
    )
    await expectNoA11yViolations(el)
  })
})
