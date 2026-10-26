import { Component } from '@angular/core'
import { KrdsIdentifier } from '@krds.ui/angular'

@Component({
  selector: 'demo-identifier-basic',
  imports: [KrdsIdentifier],
  template: `<div krdsIdentifier>이 누리집은 보건복지부 누리집입니다.</div>`
})
export default class IdentifierBasic {}
