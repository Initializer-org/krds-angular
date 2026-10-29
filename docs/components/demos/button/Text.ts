import { Component } from '@angular/core'
import { KrdsButton } from '@krds.ui/angular'

@Component({
  selector: 'demo-button-text',
  imports: [KrdsButton],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap">
      <button krdsButton size="small" text>텍스트 버튼</button>
      <button krdsButton size="small" text>주민등록표초본 <i class="svg-icon ico-angle right" aria-hidden="true"></i></button>
      <button krdsButton size="medium" text>검색 <i class="svg-icon ico-sch" aria-hidden="true"></i></button>
      <button krdsButton text>파일다운로드 <i class="svg-icon ico-down" aria-hidden="true"></i></button>
      <button krdsButton text disabled>필터 <i class="svg-icon ico-filter" aria-hidden="true"></i></button>
    </div>
  `
})
export default class ButtonText {}
