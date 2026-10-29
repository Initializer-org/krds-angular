import { Component } from '@angular/core'
import { KrdsBreadcrumb, type KrdsBreadcrumbItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-breadcrumb-basic',
  imports: [KrdsBreadcrumb],
  template: '<nav krdsBreadcrumb [items]="items" (itemClick)="$event.event.preventDefault()"></nav>'
})
export default class BreadcrumbBasic {
  readonly items: KrdsBreadcrumbItem[] = [{ text: '홈', href: '#' }, { text: '서비스 신청', href: '#' }, { text: '서비스 신청2' }]
}
