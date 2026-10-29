import { Component } from '@angular/core'
import { KrdsSpinner } from '@krds.ui/angular'

@Component({
  selector: 'demo-spinner-basic',
  imports: [KrdsSpinner],
  template: `
    <div style="position: relative; height: 200px">
      <krds-spinner />
    </div>
  `
})
export default class SpinnerBasic {}
