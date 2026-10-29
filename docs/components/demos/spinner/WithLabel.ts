import { Component } from '@angular/core'
import { KrdsSpinner } from '@krds.ui/angular'

@Component({
  selector: 'demo-spinner-with-label',
  imports: [KrdsSpinner],
  template: `
    <div style="position: relative; height: 200px">
      <krds-spinner label="Loading data.." />
    </div>
  `
})
export default class SpinnerWithLabel {}
