import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsCheckArea, KrdsControl, KrdsRadio } from '@krds.ui/angular'

@Component({
  selector: 'demo-radio-basic',
  imports: [KrdsRadio, KrdsCheckArea, KrdsControl, FormsModule],
  template: `
    <div style="display: flex; flex-direction: column; gap: 2rem">
      <fieldset krdsCheckArea>
        <legend>라디오 버튼 상태</legend>
        <krds-radio><input type="radio" krdsControl name="radio-basic" value="option1" [(ngModel)]="selected" />기본</krds-radio>
        <krds-radio><input type="radio" krdsControl name="radio-basic" value="option2" [(ngModel)]="selected" />선택됨</krds-radio>
        <krds-radio
          ><input type="radio" krdsControl name="radio-basic" value="option3" [(ngModel)]="selected" disabled />비활성화</krds-radio
        >
        <krds-radio>
          <input type="radio" krdsControl name="radio-basic-disabled" value="option4" [(ngModel)]="disabledSelected" disabled />
          선택된 비활성화
        </krds-radio>
      </fieldset>

      <fieldset krdsCheckArea column>
        <legend>부가 설명이 있는 라디오 버튼</legend>
        <krds-radio description="부가적인 설명이 들어갑니다.">
          <input type="radio" krdsControl name="radio-basic-description" value="option1" [(ngModel)]="withDescription" />
          라디오버튼
        </krds-radio>
        <krds-radio description="부가적인 설명이 들어갑니다.">
          <input type="radio" krdsControl name="radio-basic-description" value="option2" [(ngModel)]="withDescription" />
          라디오버튼
        </krds-radio>
      </fieldset>
    </div>
  `
})
export default class RadioBasic {
  readonly selected = signal('option2')
  readonly disabledSelected = signal('option4')
  readonly withDescription = signal('option1')
}
