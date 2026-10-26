import { Component } from '@angular/core'
import { KrdsStep, KrdsStepIndicator } from '@krds.ui/angular'

@Component({
  selector: 'demo-step-indicator-with-page-title',
  imports: [KrdsStepIndicator, KrdsStep],
  template: `
    <div class="page-title-wrap between">
      <h2 class="h-tit">타이틀</h2>
      <ol krdsStepIndicator [current]="2">
        <li krdsStep step="1단계">유의 사항 확인</li>
        <li krdsStep step="2단계">신청인 정보</li>
        <li krdsStep step="3단계">이사 전 살던 곳</li>
        <li krdsStep step="4단계">이사 온 곳</li>
      </ol>
    </div>
  `
})
export default class StepIndicatorWithPageTitle {}
