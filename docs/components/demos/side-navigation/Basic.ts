import { Component, signal } from '@angular/core'
import { KrdsSideNavigation, type KrdsSideNavItem } from '@krds.ui/angular'

const menu = (expanded: boolean): KrdsSideNavItem => ({
  text: '2Depth-menu',
  expanded,
  subItems: [
    {
      text: '3Depth-menu',
      popupTitle: '3Depth-title',
      subItems: [
        { text: '4Depth', href: '#' },
        { text: '4Depth', href: '#' },
        { text: '4Depth', href: '#' }
      ]
    },
    { text: '3Depth-link', href: '#' },
    { text: '3Depth-link', href: '#' }
  ]
})

@Component({
  selector: 'demo-side-navigation-basic',
  imports: [KrdsSideNavigation],
  template: ` <nav krdsSideNavigation heading="1Depth-title" aria-label="사이드 메뉴" [(items)]="items"></nav> `
})
export default class SideNavigationBasic {
  readonly items = signal([menu(true), menu(false), menu(false)])
}
