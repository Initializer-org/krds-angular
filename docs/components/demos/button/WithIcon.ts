import { Component } from '@angular/core'
import { KrdsButton } from '@krds.ui/angular'

@Component({
  selector: 'demo-button-with-icon',
  imports: [KrdsButton],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap">
      <button krdsButton size="small">small 버튼 <i class="svg-icon ico-sch" aria-hidden="true"></i></button>
      <button krdsButton size="medium">medium 버튼 <i class="svg-icon ico-sch" aria-hidden="true"></i></button>
      <button krdsButton size="large"><i class="svg-icon ico-sch" aria-hidden="true"></i> large 버튼</button>
    </div>
  `
})
export default class ButtonWithIcon {}
