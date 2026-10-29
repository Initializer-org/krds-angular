import { Component } from '@angular/core'
import { KrdsBadge } from '@krds.ui/angular'

@Component({
  selector: 'demo-badge-basic',
  imports: [KrdsBadge],
  template: ` <span krdsBadge>label</span> `
})
export default class BadgeBasic {}
