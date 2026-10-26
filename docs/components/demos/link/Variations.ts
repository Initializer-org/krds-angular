import { Component } from '@angular/core'
import { KrdsLink } from '@krds.ui/angular'

@Component({
  selector: 'demo-link-variations',
  imports: [KrdsLink],
  template: `
    <div style="display: flex; flex-direction: column; gap: 20px">
      <a krdsLink href="#!" size="medium" pure>
        <span class="underline">가상클래스 상태 시 컬러 유지</span>
      </a>
      <a krdsLink href="#!" size="large" basic target="_blank" title="새 창 열림">
        <span class="underline">본문 텍스트 컬러 링크</span> <i class="svg-icon ico-go" aria-hidden="true"></i>
      </a>
      <a krdsLink href="#!" size="large" basic>
        <span class="underline hidden-underline">가상클래스 상태 시 밑줄</span>
      </a>
      <a krdsLink href="#!" size="large" basic>
        <span>밑줄 없음</span>
      </a>
    </div>
  `
})
export default class LinkVariations {}
