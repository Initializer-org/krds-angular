import { Component } from '@angular/core'
import { KrdsButton } from '@krds.ui/angular'

@Component({
  selector: 'demo-button-hierarchy',
  imports: [KrdsButton],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap">
      <button krdsButton variant="primary">버튼 : primary</button>
      <button krdsButton variant="secondary">버튼 : secondary</button>
      <button krdsButton variant="tertiary">버튼 : tertiary</button>
    </div>
  `
})
export default class ButtonHierarchy {}
