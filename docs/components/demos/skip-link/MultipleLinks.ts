import { Component } from '@angular/core'
import { KrdsSkipLink } from '@krds.ui/angular'

@Component({
  selector: 'demo-skip-link-multiple-links',
  imports: [KrdsSkipLink],
  template: `
    <div krdsSkipLink>
      <a href="#main-content">본문 바로가기</a>
      <a href="#gnb">메인메뉴 바로가기</a>
    </div>
    <nav id="gnb" aria-label="메인메뉴" style="padding: 20px; border: 1px dashed #ccc">메인메뉴 영역</nav>
    <div id="main-content" style="margin-top: 20px; padding: 20px; background: #f5f5f5">
      <h2>주요 콘텐츠 영역</h2>
    </div>
  `
})
export default class SkipLinkMultipleLinks {}
