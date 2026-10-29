import { Component, signal } from '@angular/core'
import { KrdsButton, KrdsMainMenu, KrdsMainMenuBottom, type KrdsMainMenuItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-main-menu-mobile',
  imports: [KrdsButton, KrdsMainMenu, KrdsMainMenuBottom],
  template: `
    <button krdsButton size="medium" aria-controls="mobile-nav" [attr.aria-expanded]="open()" (click)="open.set(true)">
      전체메뉴 열기
    </button>
    <krds-main-menu variant="mobile" [items]="items" [(open)]="open">
      <div krdsMainMenuHeader class="gnb-login">
        <button krdsButton size="large" text>로그인을 해주세요</button>
      </div>
      <div krdsMainMenuBottom>
        <a href="#" class="krds-btn small text">개인정보처리방침</a>
      </div>
    </krds-main-menu>
  `
})
export default class MainMenuMobile {
  readonly items: KrdsMainMenuItem[] = [
    {
      text: '정보서비스',
      subItems: [
        { text: '민원신청', href: '#' },
        { text: '생활지원', href: '#', selected: true },
        {
          text: '고용정보',
          items: [
            { text: '채용 공고', href: '#' },
            {
              text: '직업 훈련',
              href: '#',
              panelTitle: '직업 훈련',
              items: [
                { text: '국비 지원 과정', href: '#' },
                { text: '재직자 과정', href: '#' },
                { text: '온라인 과정', href: '#' }
              ]
            },
            { text: '고용 통계', href: '#' }
          ]
        }
      ]
    },
    {
      text: '정책정보',
      subItems: [
        { text: '정책자료', href: '#' },
        { text: '통계정보', href: '#' }
      ]
    },
    {
      text: '알림소식',
      subItems: [
        { text: '공지사항', href: '#' },
        { text: '보도자료', href: '#' }
      ]
    },
    {
      text: '기관소개',
      subItems: [
        { text: '인사말', href: '#' },
        { text: '조직도', href: '#' }
      ]
    }
  ]
  readonly open = signal(false)
}
