import { Component } from '@angular/core'
import { KrdsMasthead } from '@krds.ui/angular'

@Component({
  selector: 'demo-masthead-basic',
  imports: [KrdsMasthead],
  template: `<div krdsMasthead>이 누리집은 대한민국 공식 전자정부 누리집입니다.</div>`
})
export default class MastheadBasic {}
