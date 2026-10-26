import { Component } from '@angular/core'
import { KrdsButton } from '@krds.ui/angular'

@Component({
  selector: 'demo-button-sizes',
  imports: [KrdsButton],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap">
      <button krdsButton size="xsmall">x-small 버튼</button>
      <button krdsButton size="small">small 버튼</button>
      <button krdsButton size="medium">medium 버튼</button>
      <button krdsButton size="large">large 버튼</button>
      <button krdsButton size="xlarge">x-large 버튼</button>
    </div>
  `
})
export default class ButtonSizes {}
