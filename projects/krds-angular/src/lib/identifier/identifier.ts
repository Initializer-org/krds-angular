import { Component, input } from '@angular/core'

/**
 * KRDS 운영기관 식별자. 누리집을 운영하는 기관을 알린다
 *
 * @example <div krdsIdentifier>이 누리집은 보건복지부 누리집입니다.</div>
 */
@Component({
  selector: '[krdsIdentifier]',
  host: { class: 'krds-identifier' },
  template: `
    <span class="logo"
      ><span class="sr-only">{{ logoLabel() }}</span></span
    >
    <span class="ban-txt"><ng-content /></span>
  `
})
export class KrdsIdentifier {
  /** 로고 이름 (화면낭독기) */
  readonly logoLabel = input('KRDS - Korea Design System')
}
