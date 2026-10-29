import { Component } from '@angular/core'
import { KrdsBadge, KrdsStructuredItem, KrdsStructuredList } from '@krds.ui/angular'

@Component({
  selector: 'demo-structured-list-simple-badge',
  imports: [KrdsBadge, KrdsStructuredItem, KrdsStructuredList],
  template: `
    <ul krdsStructuredList>
      <li krdsStructuredItem>
        <div class="card-top">
          <span krdsBadge type="bg-light" color="success">성공</span>
        </div>
        <div class="card-body">
          <div class="c-text">
            <p class="c-tit"><span class="span">간단한 제목</span></p>
          </div>
        </div>
      </li>
    </ul>
  `
})
export default class StructuredListSimpleBadge {}
