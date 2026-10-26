import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsFormGroup } from '../form-group/form-group'
import { KrdsInput } from '../input/input'
import { KrdsTextarea } from './textarea'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsTextarea, KrdsInput, KrdsFormGroup, FormsModule],
  template: '<krds-textarea><textarea krdsInput aria-label="내용"></textarea></krds-textarea>'
})
class Host {
  readonly content = signal('안녕하세요')
}

describe('KrdsTextarea', () => {
  it('textarea와 글자 수를 textarea-wrap으로 묶고, 값이 바뀌면 글자 수도 바뀐다', async () => {
    const { $, stable } = await render(
      Host,
      `
        <krds-form-group label="문의 내용">
          <krds-textarea [count]="content().length" [max]="500">
            <textarea krdsInput maxlength="500" [(ngModel)]="content"></textarea>
          </krds-textarea>
        </krds-form-group>
      `
    )
    const textarea = $<HTMLTextAreaElement>('textarea')
    expect($('krds-textarea').className).toBe('textarea-wrap')
    expect(textarea.parentElement?.tagName).toBe('KRDS-TEXTAREA')
    expect($('.textarea-count .count-now').textContent).toBe('5')
    expect($('.textarea-count .count-total').textContent).toBe('/500')

    textarea.value = '안녕'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
    await stable()
    expect($('.count-now').textContent).toBe('2')
  })

  it('count가 없으면 글자 수를 표시하지 않고, max가 없으면 현재 글자 수만', async () => {
    const { $, $$ } = await render(
      Host,
      `
        <krds-textarea><textarea krdsInput aria-label="a"></textarea></krds-textarea>
        <krds-textarea [count]="3"><textarea krdsInput aria-label="b"></textarea></krds-textarea>
      `
    )
    expect($$('.textarea-count')).toHaveLength(1)
    expect($('.count-total').textContent).toBe('')
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      `
        <krds-form-group label="문의 내용" hint="500자 이내">
          <krds-textarea [count]="content().length" [max]="500"><textarea krdsInput [(ngModel)]="content"></textarea></krds-textarea>
        </krds-form-group>
      `
    )
    await expectNoA11yViolations(el)
  })
})
