import { Component, signal } from '@angular/core'
import {
  KrdsBreadcrumb,
  KrdsButton,
  KrdsDropdown,
  KrdsFooter,
  KrdsFooterBottom,
  KrdsFooterContent,
  KrdsFooterLogo,
  KrdsFooterTop,
  KrdsHeader,
  KrdsHeaderBranding,
  KrdsHeaderUtility,
  KrdsIdentifier,
  KrdsLayout,
  KrdsMainMenu,
  KrdsMasthead,
  KrdsSideNavigation,
  KrdsSkipLink,
  type KrdsMainMenuItem,
  type KrdsSideNavItem
} from '@krds.ui/angular'

const sideItem = (depth4: number): KrdsSideNavItem => ({
  text: '2Depth-menu',
  subItems: [
    {
      text: '3Depth-menu',
      popupTitle: '3Depth-title',
      subItems: Array.from({ length: depth4 }, () => ({ text: '4Depth', href: '#!' }))
    },
    { text: '3Depth-link', href: '#!' },
    { text: '3Depth-link', href: '#!' }
  ]
})

@Component({
  selector: 'demo-layout-basic',
  imports: [
    KrdsBreadcrumb,
    KrdsButton,
    KrdsDropdown,
    KrdsFooter,
    KrdsFooterBottom,
    KrdsFooterContent,
    KrdsFooterLogo,
    KrdsFooterTop,
    KrdsHeader,
    KrdsHeaderBranding,
    KrdsHeaderUtility,
    KrdsIdentifier,
    KrdsLayout,
    KrdsMainMenu,
    KrdsMasthead,
    KrdsSideNavigation,
    KrdsSkipLink
  ],
  template: `
    <div krdsLayout>
      <div krdsSkipLink><a href="#container">본문 바로가기</a></div>
      <div krdsMasthead>이 누리집은 대한민국 공식 전자정부 누리집입니다.</div>
      <header krdsHeader>
        <div krdsHeaderUtility>
          <ul class="utility-list">
            <li>
              <a href="#!" class="krds-btn small text" target="_blank" title="새 창 열기">
                메뉴명 <i class="svg-icon ico-go" aria-hidden="true"></i>
              </a>
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
              [attr.aria-expanded]="menuOpen()"
              (click)="menuOpen.set(true)"
            >
              전체메뉴
            </button>
          </div>
        </div>
        <krds-main-menu [items]="menu" />
        <krds-main-menu krdsHeaderMobile variant="mobile" [items]="menu" [(open)]="menuOpen" />
      </header>
      <main id="container">
        <div class="inner in-between">
          <nav krdsSideNavigation heading="1Depth-title" [(items)]="sideMenu"></nav>
          <div class="contents">
            <nav krdsBreadcrumb [items]="[{ text: '홈' }, { text: '컴포넌트' }]"></nav>
            <div class="page-title-wrap">
              <h1 class="h-tit">page title</h1>
            </div>
          </div>
        </div>
      </main>
      <footer krdsFooter>
        <div krdsFooterTop>
          @for (site of [1, 2, 3, 4]; track site) {
            <button type="button" class="link" title="관련 사이트 레이어">related_site</button>
          }
        </div>
        <div krdsFooterLogo><span class="sr-only">KRDS - Korea Design System</span></div>
        <div krdsFooterContent>
          <div class="f-info">
            <p class="info-addr">(26464) 강원특별자치도 원주시 건강로 32(반곡동) 국민건강보험공단</p>
            <ul class="info-cs">
              <li><strong class="strong">대표전화 1577-1000</strong><span class="span">(유료, 평일 09시~18시)</span></li>
              <li><strong class="strong">해외이용 82-33-811-2001</strong><span class="span">(유료, 평일 09시~18시)</span></li>
            </ul>
          </div>
          <div class="f-link">
            <div class="link-go">
              <button krdsButton text size="medium">찾아오시는 길 <i class="svg-icon ico-angle right" aria-hidden="true"></i></button>
              <button krdsButton text size="medium">이용안내 <i class="svg-icon ico-angle right" aria-hidden="true"></i></button>
              <button krdsButton text size="medium">직원검색 <i class="svg-icon ico-angle right" aria-hidden="true"></i></button>
            </div>
            <div class="link-sns">
              @for (item of sns; track item.icon) {
                <a href="#!" class="krds-btn xlarge icon border" target="_blank" title="새 창 열기">
                  <span class="sr-only">{{ item.name }}</span>
                  <i class="svg-icon" [class]="item.icon" aria-hidden="true"></i>
                </a>
              }
            </div>
          </div>
        </div>
        <div krdsFooterBottom>
          <div class="f-btm-text">
            <div class="f-menu">
              <a href="#!" class="point">개인정보처리방침</a>
              <a href="#!">저작권 정책</a>
              <a href="#!">웹 접근성 품질인증 마크 획득</a>
            </div>
            <p class="f-copy">© 2023 National Health Insurance Service. All rights reserved.</p>
          </div>
          <div krdsIdentifier>이 누리집은 보건복지부 누리집입니다.</div>
        </div>
      </footer>
    </div>
  `
})
export default class LayoutBasic {
  readonly menu: KrdsMainMenuItem[] = [
    { text: '1Depth', subItems: [{ text: '2Depth-menu', items: [{ text: '3Depth-menu', href: '#!' }] }] },
    { text: '1Depth', subItems: [{ text: '2Depth-menu', items: [{ text: '3Depth-menu', href: '#!' }] }] },
    { text: '링크(anchor)', href: '#!' }
  ]
  readonly menuOpen = signal(false)
  readonly sideMenu = signal([sideItem(5), sideItem(3), sideItem(3)])
  readonly sns = [
    { name: '인스타그램', icon: 'ico-instagram' },
    { name: '유튜브', icon: 'ico-youtube' },
    { name: 'X', icon: 'ico-sns-x' },
    { name: '페이스북', icon: 'ico-facebook' },
    { name: '블로그', icon: 'ico-blog' }
  ]
}
