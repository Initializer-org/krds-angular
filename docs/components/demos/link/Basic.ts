import { Component } from '@angular/core'
import { KrdsLink } from '@krds.ui/angular'

@Component({
  selector: 'demo-link-basic',
  imports: [KrdsLink],
  template: `
    <a krdsLink href="https://www.krds.go.kr/" size="small" target="_blank" title="새 창 열림">
      <span class="underline">기본 링크</span> <i class="svg-icon ico-go" aria-hidden="true"></i>
    </a>
  `
})
export default class LinkBasic {}
