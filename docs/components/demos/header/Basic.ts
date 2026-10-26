import { Component, signal } from '@angular/core'
import {
  KrdsDropdown,
  KrdsExternalLink,
  KrdsHeader,
  KrdsHeaderBranding,
  KrdsHeaderUtility,
  KrdsMainMenu,
  type KrdsMainMenuItem
} from '@krds.ui/angular'

@Component({
  selector: 'demo-header-basic',
  imports: [KrdsHeader, KrdsHeaderUtility, KrdsHeaderBranding, KrdsMainMenu, KrdsDropdown, KrdsExternalLink],
  template: `
    <header krdsHeader>
      <div krdsHeaderUtility>
        <ul class="utility-list">
          <li>
            <a href="#!" class="krds-btn small text" krdsExternal>메뉴명 <i class="svg-icon ico-go" aria-hidden="true"></i></a>
          </li>
          <li>
            <div krdsDropdown>
              <button type="button" class="krds-btn small text drop-btn">
                메뉴명 <i class="svg-icon ico-toggle" aria-hidden="true"></i>
              </button>
              <div class="drop-menu">
                <div class="drop-in">
                  <ul class="drop-list">
                    <li><a href="#!" class="item-link">메뉴명</a></li>
                    <li><a href="#!" class="item-link">메뉴명</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div krdsHeaderBranding>
        <h2 class="logo">
          <a href="#!"><span class="sr-only">KRDS - Korea Design System</span></a>
        </h2>
        <div class="header-actions">
          <button type="button" class="btn-navi sch" title="통합검색 레이어">통합검색</button>
          <a href="#!" class="btn-navi login">로그인</a>
          <button type="button" class="btn-navi join">회원가입</button>
          <button
            type="button"
            class="btn-navi all"
            aria-controls="mobile-nav"
            [attr.aria-expanded]="mobileOpen()"
            (click)="mobileOpen.set(true)"
          >
            전체메뉴
          </button>
        </div>
      </div>

      <krds-main-menu [items]="menuItems" />
      <krds-main-menu krdsHeaderMobile variant="mobile" [items]="menuItems" [(open)]="mobileOpen" />
    </header>
  `
})
export default class HeaderBasic {
  readonly menuItems: KrdsMainMenuItem[] = [
    {
      text: '1Depth',
      subItems: [
        {
          text: '2Depth-menu',
          items: [
            { text: '3Depth-menu', href: '#!' },
            { text: '3Depth-menu', href: '#!' }
          ]
        },
        {
          text: '2Depth-menu',
          items: [
            { text: '3Depth-menu', href: '#!' },
            { text: '3Depth-menu', href: '#!' }
          ]
        }
      ]
    },
    {
      text: '1Depth',
      subItems: [
        {
          text: '2Depth-menu',
          items: [
            { text: '3Depth-menu', href: '#!' },
            { text: '3Depth-menu', href: '#!' }
          ]
        }
      ]
    },
    { text: '링크(anchor)', href: '#!' }
  ]
  readonly mobileOpen = signal(false)
}
