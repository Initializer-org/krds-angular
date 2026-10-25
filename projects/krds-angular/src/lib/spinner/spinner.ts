import { Component, input } from '@angular/core'

/**
 * KRDS 스피너. 화면낭독기에는 '로딩 중'을 알리고(role="status"), label이 있으면 화면에도 보인다
 *
 * @example <krds-spinner label="불러오는 중입니다" />
 */
@Component({
  selector: 'krds-spinner',
  host: { class: 'krds-spinner', role: 'status' },
  template: `
    <span class="sr-only">로딩 중</span>
    @if (label()) {
      <span>{{ label() }}</span>
    }
  `
})
export class KrdsSpinner {
  /** 화면에 보이는 안내 문구 */
  readonly label = input<string>()
}
