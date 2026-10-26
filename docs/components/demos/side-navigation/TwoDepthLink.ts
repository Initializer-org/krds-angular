import { Component, signal } from '@angular/core'
import { KrdsSideNavigation, type KrdsSideNavClick, type KrdsSideNavItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-side-navigation-two-depth-link',
  imports: [KrdsSideNavigation],
  template: `
    <nav
      krdsSideNavigation
      heading="1Depth-title"
      aria-label="링크가 있는 사이드 메뉴"
      [(items)]="items"
      (itemClick)="onItemClick($event)"
    ></nav>
    <p>누른 링크: {{ clicked() || '없음' }}</p>
  `
})
export default class SideNavigationTwoDepthLink {
  readonly items = signal<KrdsSideNavItem[]>([
    { text: '2Depth-link', href: '#lnb-link' },
    { text: '2Depth-action' },
    {
      text: '2Depth-menu',
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
    }
  ])
  readonly clicked = signal('')

  onItemClick({ item, event }: KrdsSideNavClick) {
    // 라우터로 이동하거나 다른 동작을 할 때는 기본 이동을 막는다
    event.preventDefault()
    this.clicked.set(item.text)
  }
}
