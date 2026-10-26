import { Component } from '@angular/core'
import { KrdsMainMenu, type KrdsMainMenuItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-main-menu-single-list',
  imports: [KrdsMainMenu],
  template: '<krds-main-menu label="주요 메뉴" [items]="items" [backdrop]="false" />'
})
export default class MainMenuSingleList {
  readonly items: KrdsMainMenuItem[] = [
    {
      text: '알림소식',
      title: '알림소식',
      layout: 'between',
      items: [
        { text: '공지사항', href: '#' },
        { text: '보도자료', href: '#' },
        { text: '행사안내', href: '#' },
        { text: '채용정보', href: '#' },
        { text: '입찰공고', href: '#' },
        { text: '고시공고', href: '#' }
      ]
    },
    { text: '기관소개', href: '#' }
  ]
}
