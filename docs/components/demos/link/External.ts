import { Component } from '@angular/core'
import { KrdsExternalLink, KrdsLink } from '@krds.ui/angular'

@Component({
  selector: 'demo-link-external',
  imports: [KrdsExternalLink, KrdsLink],
  template: `
    <a krdsLink krdsExternal href="https://www.gov.kr/" size="small">
      <span class="underline">정부24</span> <i class="svg-icon ico-go" aria-hidden="true"></i>
    </a>
  `
})
export default class LinkExternal {}
