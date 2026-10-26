import { Component } from '@angular/core'
import { KrdsStep, KrdsStepIndicator } from '@krds.ui/angular'

@Component({
  selector: 'demo-step-indicator-forced-status',
  imports: [KrdsStepIndicator, KrdsStep],
  template: `
    <ol krdsStepIndicator>
      <li krdsStep step="1단계" status="done">약관 동의</li>
      <li krdsStep step="2단계" status="active">정보 입력</li>
      <li krdsStep step="3단계" status="pending">신청 완료</li>
    </ol>
  `
})
export default class StepIndicatorForcedStatus {}
