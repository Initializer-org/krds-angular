import { Component, input, model } from '@angular/core'

let nextId = 0

/**
 * KRDS 디스클로저. 버튼으로 내용을 펼치고 접는다. 접힌 내용은 inert로 초점과 화면낭독기에서 뺀다
 *
 * @example <krds-disclosure label="신청 자격 자세히 보기" [(expanded)]="open">만 19세 이상...</krds-disclosure>
 */
@Component({
  selector: 'krds-disclosure',
  host: {
    class: 'krds-disclosure conts-expand-area',
    '[class.active]': 'expanded()'
  },
  template: `
    <button
      type="button"
      class="btn-conts-expand"
      [attr.aria-expanded]="expanded()"
      [attr.aria-controls]="contentId"
      (click)="expanded.set(!expanded())"
    >
      {{ label() }}
    </button>
    <div class="expand-wrap" [id]="contentId" [inert]="!expanded()">
      <div class="expand-in"><ng-content /></div>
    </div>
  `
})
export class KrdsDisclosure {
  /** 펼침 버튼 문구 (title 속성은 기본 툴팁이 되므로 label로 받음) */
  readonly label = input.required<string>()
  /** 펼침 여부 */
  readonly expanded = model(false)

  protected readonly contentId = `krds-disclosure-${nextId++}`
}
