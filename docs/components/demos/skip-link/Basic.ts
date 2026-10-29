import { Component } from '@angular/core'
import { KrdsSkipLink } from '@krds.ui/angular'

@Component({
  selector: 'demo-skip-link-basic',
  imports: [KrdsSkipLink],
  template: `
    <div krdsSkipLink>
      <a href="#main-content">본문 바로가기</a>
    </div>
    <div id="main-content" style="margin-top: 100px; padding: 20px; background: #f5f5f5">
      <h2>주요 콘텐츠 영역</h2>
      <p>이곳이 건너뛰기 링크의 대상이 되는 주요 콘텐츠 영역입니다.</p>
    </div>
  `
})
export default class SkipLinkBasic {}
