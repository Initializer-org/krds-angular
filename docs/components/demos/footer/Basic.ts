import { Component } from '@angular/core'
import {
  KrdsButton,
  KrdsExternalLink,
  KrdsFooter,
  KrdsFooterBottom,
  KrdsFooterContent,
  KrdsFooterLogo,
  KrdsFooterTop,
  KrdsIdentifier
} from '@krds.ui/angular'

@Component({
  selector: 'demo-footer-basic',
  imports: [KrdsFooter, KrdsFooterTop, KrdsFooterLogo, KrdsFooterContent, KrdsFooterBottom, KrdsIdentifier, KrdsButton, KrdsExternalLink],
  template: `
    <footer krdsFooter>
      <div krdsFooterTop>
        <button type="button" class="link" title="관련 사이트 레이어">related_site</button>
        <button type="button" class="link" title="관련 사이트 레이어">related_site</button>
        <button type="button" class="link" title="관련 사이트 레이어">related_site</button>
        <button type="button" class="link" title="관련 사이트 레이어">related_site</button>
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
            @for (sns of snsLinks; track sns.icon) {
              <a href="#!" class="krds-btn xlarge icon border" krdsExternal>
                <span class="sr-only">{{ sns.label }}</span>
                <i class="svg-icon" [class]="sns.icon" aria-hidden="true"></i>
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
  `
})
export default class FooterBasic {
  readonly snsLinks = [
    { label: '인스타그램', icon: 'ico-instagram' },
    { label: '유튜브', icon: 'ico-youtube' },
    { label: 'X', icon: 'ico-sns-x' },
    { label: '페이스북', icon: 'ico-facebook' },
    { label: '블로그', icon: 'ico-blog' }
  ]
}
