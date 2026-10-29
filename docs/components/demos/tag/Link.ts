import { Component } from '@angular/core'
import { KrdsExternalLink, KrdsTag, KrdsTagGroup } from '@krds.ui/angular'

@Component({
  selector: 'demo-tag-link',
  imports: [KrdsTag, KrdsTagGroup, KrdsExternalLink],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem">
      @for (size of sizes; track size) {
        <div krdsTagGroup [size]="size">
          <a krdsTag href="#">카테고리</a>
          <a krdsTag krdsExternal href="https://example.com">외부 링크</a>
          <a krdsTag href="#">필터 태그</a>
        </div>
      }
    </div>
  `
})
export default class TagLink {
  readonly sizes = ['large', 'medium', 'small'] as const
}
