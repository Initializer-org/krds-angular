import { Component, computed, signal } from '@angular/core'
import { KrdsTabBar, type KrdsTabBarClick } from '@krds.ui/angular'

@Component({
  selector: 'demo-tab-bar-basic',
  imports: [KrdsTabBar],
  template: ` <nav krdsTabBar [items]="items()" (itemClick)="go($event)"></nav> `
})
export default class TabBarBasic {
  readonly menu = [
    { text: '홈', icon: 'ico-bread-home', href: '#home' },
    { text: '내정보', icon: 'ico-my', href: '#my' },
    { text: '즐겨찾기', icon: 'ico-scrap', href: '#bookmark' },
    { text: '전체', icon: 'ico-all' }
  ]
  readonly current = signal('홈')
  readonly items = computed(() => this.menu.map(item => ({ ...item, selected: item.text === this.current() })))

  // 라우터를 쓴다면 selected는 현재 경로로 정하고, 링크 이동은 router.navigateByUrl()로 처리한다
  go({ item, event }: KrdsTabBarClick) {
    event.preventDefault()
    this.current.set(item.text)
  }
}
