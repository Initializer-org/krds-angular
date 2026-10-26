import { Component } from '@angular/core'
import { KrdsTag, KrdsTagGroup } from '@krds.ui/angular'

@Component({
  selector: 'demo-tag-basic',
  imports: [KrdsTag, KrdsTagGroup],
  template: `
    <div krdsTagGroup>
      <krds-tag>버튼</krds-tag>
    </div>
  `
})
export default class TagBasic {}
