import { Component } from '@angular/core'
import { KrdsStep, KrdsStepIndicator } from '@krds.ui/angular'

@Component({
  selector: 'demo-step-indicator-basic',
  imports: [KrdsStepIndicator, KrdsStep],
  template: `
    <ol krdsStepIndicator [current]="3">
      <li krdsStep step="1단계">단계 레이블</li>
      <li krdsStep step="2단계">단계 레이블</li>
      <li krdsStep step="3단계">단계 레이블</li>
      <li krdsStep step="4단계">단계 레이블</li>
      <li krdsStep step="5단계">단계 레이블</li>
    </ol>
  `
})
export default class StepIndicatorBasic {}
