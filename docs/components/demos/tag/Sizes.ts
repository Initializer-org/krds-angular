import { Component } from '@angular/core'
import { KrdsTag, KrdsTagGroup } from '@krds.ui/angular'

@Component({
  selector: 'demo-tag-sizes',
  imports: [KrdsTag, KrdsTagGroup],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1rem">
      @for (size of sizes; track size) {
        <div krdsTagGroup [size]="size">
          <krds-tag>태그</krds-tag>
          <krds-tag>태그</krds-tag>
          <krds-tag>태그</krds-tag>
        </div>
      }
    </div>
  `
})
export default class TagSizes {
  readonly sizes = ['large', 'medium', 'small'] as const
}
