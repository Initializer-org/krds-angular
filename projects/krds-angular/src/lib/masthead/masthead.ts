import { Component, input } from '@angular/core'

/**
 * KRDS 공식 배너. 페이지 맨 위에 대한민국 공식 전자정부 누리집임을 알린다 (KRDS CSS가 id #krds-masthead로 스타일을 줌)
 *
 * @example <div krdsMasthead>이 누리집은 대한민국 공식 전자정부 누리집입니다.</div>
 */
@Component({
  selector: '[krdsMasthead]',
  host: { '[id]': 'id()' },
  template: `
    <div class="toggle-wrap">
      <div class="toggle-head">
        <div class="inner">
          <span class="nuri-txt"><ng-content /></span>
        </div>
      </div>
    </div>
  `
})
export class KrdsMasthead {
  /** id (KRDS CSS 기준 krds-masthead) */
  readonly id = input('krds-masthead')
}
