import { Component } from '@angular/core'
import { KrdsButton } from '@krds.ui/angular'

@Component({
  selector: 'demo-button-icon-only',
  imports: [KrdsButton],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap">
      <button krdsButton icon>
        <span class="sr-only">검색</span>
        <i class="svg-icon ico-sch" aria-hidden="true"></i>
      </button>
      <button krdsButton icon size="medium">
        <span class="sr-only">입력한 비밀번호 보기</span>
        <i class="svg-icon ico-pw-visible" aria-hidden="true"></i>
      </button>
      <button krdsButton icon border size="large">
        <span class="sr-only">새로고침</span>
        <i class="svg-icon ico-refresh" aria-hidden="true"></i>
      </button>
      <button krdsButton icon border size="large" disabled>
        <span class="sr-only">열기</span>
        <i class="svg-icon ico-angle down" aria-hidden="true"></i>
      </button>
    </div>
  `
})
export default class ButtonIconOnly {}
