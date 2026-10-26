import { Component } from '@angular/core'

@Component({
  selector: 'demo-icon-gallery',
  template: `
    <ul style="display: flex; flex-wrap: wrap; gap: 1.6rem; list-style: none; padding: 0">
      @for (icon of icons; track icon) {
        <li style="display: flex; flex-direction: column; align-items: center; gap: 0.4rem; width: 8rem">
          <i class="svg-icon" [class]="icon" aria-hidden="true"></i>
          <code style="font-size: 1.2rem">{{ icon }}</code>
        </li>
      }
    </ul>
  `
})
export default class IconGallery {
  readonly icons = [
    'ico-angle',
    'ico-calendar',
    'ico-call',
    'ico-del',
    'ico-email',
    'ico-faq',
    'ico-file',
    'ico-filter',
    'ico-global',
    'ico-go',
    'ico-help',
    'ico-like'
  ]
}
