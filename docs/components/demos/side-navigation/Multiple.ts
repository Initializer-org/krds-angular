import { Component, signal } from '@angular/core'
import { KrdsSideNavigation, type KrdsSideNavItem } from '@krds.ui/angular'

const createItems = (): KrdsSideNavItem[] =>
  [true, false, false].map(expanded => ({
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
  }))

@Component({
  selector: 'demo-side-navigation-multiple',
  imports: [KrdsSideNavigation],
  template: `
    <div style="display: flex; gap: 2rem">
      <nav krdsSideNavigation heading="1Depth-title" aria-label="첫 번째 사이드 메뉴" style="flex: 1" [(items)]="first"></nav>
      <nav krdsSideNavigation heading="1Depth-title" aria-label="두 번째 사이드 메뉴" style="flex: 1" [(items)]="second"></nav>
    </div>
  `
})
export default class SideNavigationMultiple {
  readonly first = signal(createItems())
  readonly second = signal(createItems())
}
