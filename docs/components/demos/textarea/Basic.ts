import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsFormGroup, KrdsInput, KrdsTextarea } from '@krds.ui/angular'

@Component({
  selector: 'demo-textarea-basic',
  imports: [FormsModule, KrdsFormGroup, KrdsInput, KrdsTextarea],
  template: `
    <div class="fieldset">
      <krds-form-group label="문의 내용">
        <krds-textarea [count]="content().length" [max]="500">
          <textarea krdsInput placeholder="내용을 입력하세요" maxlength="500" style="resize: vertical" [(ngModel)]="content"></textarea>
        </krds-textarea>
      </krds-form-group>
      <krds-form-group label="비고" hint="글자 수 표시 없이 기본 textarea만 쓸 수도 있습니다">
        <textarea krdsInput placeholder="내용을 입력하세요"></textarea>
      </krds-form-group>
    </div>
  `
})
export default class TextareaBasic {
  readonly content = signal('')
}
