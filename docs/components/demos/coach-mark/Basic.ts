import { Component, signal } from '@angular/core'
import { KrdsButton, KrdsCoachMark, KrdsFormGroup, KrdsInput, type KrdsCoachMarkStep } from '@krds.ui/angular'

@Component({
  selector: 'demo-coach-mark-basic',
  imports: [KrdsButton, KrdsCoachMark, KrdsFormGroup, KrdsInput],
  template: `
    <button krdsButton variant="tertiary" size="xsmall" (click)="current.set(1)">코치마크 보기</button>
    <div style="display: flex; flex-direction: column; gap: 40px; padding: 150px 40px 40px">
      <krds-coach-mark
        [steps]="steps"
        [step]="1"
        [(current)]="current"
        [class.txt-box]="current() === 1"
        style="max-width: 500px"
        (closed)="current.set(null)"
      >
        <div style="display: flex; flex-direction: column; gap: 20px">
          <h3>1. 이전 살던 곳 작성</h3>
          <krds-form-group label="이전 살던 곳">
            <div style="display: flex; gap: 8px; width: 100%">
              <input krdsInput style="width: 100%" />
              <button krdsButton variant="secondary">주소 조회</button>
            </div>
          </krds-form-group>
        </div>
      </krds-coach-mark>
      <div style="border-top: 1px solid lightgray"></div>
      <krds-coach-mark
        [steps]="steps"
        [step]="2"
        [(current)]="current"
        [class.txt-box]="current() === 2"
        style="max-width: 500px"
        (closed)="current.set(null)"
      >
        <div style="display: flex; flex-direction: column; gap: 20px">
          <h3>2. 현재 사는 곳 작성</h3>
          <krds-form-group label="현재 사는 곳">
            <div style="display: flex; gap: 8px; width: 100%">
              <input krdsInput style="width: 100%" />
              <button krdsButton variant="secondary">주소 조회</button>
            </div>
          </krds-form-group>
        </div>
      </krds-coach-mark>
      <div style="border-top: 1px solid lightgray"></div>
      <krds-coach-mark
        [steps]="steps"
        [step]="3"
        [(current)]="current"
        style="display: flex; justify-content: flex-end"
        (closed)="current.set(null)"
      >
        <button krdsButton [class.coach-btn]="current() === 3">주소 이전 신청 완료</button>
      </krds-coach-mark>
    </div>
  `
})
export default class CoachMarkBasic {
  readonly current = signal<number | null>(null)
  readonly steps: KrdsCoachMarkStep[] = [
    { id: 1, title: '첫번째 단계', description: '첫번째 단계의 내용임' },
    { id: 2, title: '두번째 단계', description: '두번째 단계의 내용임' },
    { id: 3, title: '세번째 단계', description: '세번째 단계의 내용임' }
  ]
}
