import { Directive, InjectionToken, type Signal, inject, input } from '@angular/core'

/** 안쪽 입력 요소에 도움말·오류 상태를 연결하는 부모 (폼 그룹) */
export interface KrdsField {
  /** 도움말 요소 id (없으면 null) */
  readonly describedBy: Signal<string | null>
  /** 오류 상태 여부 */
  readonly invalid: Signal<boolean>
}

export const KRDS_FIELD = new InjectionToken<KrdsField>('KRDS_FIELD')

let nextId = 0

/**
 * KRDS 폼 컴포넌트(체크박스·라디오·토글 스위치·폼 그룹 등)에 넣는 기본 입력 요소 표시.
 * 감싸는 컴포넌트가 이 요소의 id로 label을 연결하고, 입력 요소 자체는 기본 동작(ngModel·폼 검증 포함) 그대로 쓴다.
 * 폼 그룹 안에서는 도움말을 aria-describedby로, 오류 상태를 aria-invalid로 연결한다
 *
 * @example <krds-checkbox><input type="checkbox" krdsControl [(ngModel)]="agree" />동의합니다</krds-checkbox>
 */
@Directive({
  selector: '[krdsControl]',
  host: {
    '[id]': 'id()',
    '[attr.aria-describedby]': 'field?.describedBy()',
    '[attr.aria-invalid]': "field?.invalid() ? 'true' : null"
  }
})
export class KrdsControl {
  /** 요소 id (없으면 자동 생성) */
  readonly id = input(`krds-control-${nextId++}`)

  protected readonly field = inject(KRDS_FIELD, { optional: true })
}
