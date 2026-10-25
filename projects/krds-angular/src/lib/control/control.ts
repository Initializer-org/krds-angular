import { Directive, input } from '@angular/core'

let nextId = 0

/**
 * KRDS 폼 컴포넌트(체크박스·라디오·토글 스위치 등)에 넣는 기본 입력 요소 표시.
 * 감싸는 컴포넌트가 이 요소의 id로 label을 연결하고, 입력 요소 자체는 기본 동작(ngModel·폼 검증 포함) 그대로 쓴다
 *
 * @example <krds-checkbox><input type="checkbox" krdsControl [(ngModel)]="agree" />동의합니다</krds-checkbox>
 */
@Directive({
  selector: '[krdsControl]',
  host: { '[id]': 'id()' }
})
export class KrdsControl {
  /** 요소 id (없으면 자동 생성) */
  readonly id = input(`krds-control-${nextId++}`)
}
