import { Component } from '@angular/core'
import { KrdsDropdown } from '@krds.ui/angular'

@Component({
  selector: 'demo-language-switcher-dropdown',
  imports: [KrdsDropdown],
  template: `
    <div style="height: 240px; padding: 50px">
      <div krdsDropdown #menu="krdsDropdown">
        <button type="button" class="krds-btn small text drop-btn">고객센터 <i class="svg-icon ico-toggle" aria-hidden="true"></i></button>
        <div class="drop-menu">
          <div class="drop-in">
            <ul class="drop-list">
              <li><a href="#!" class="item-link" (click)="menu.close(true)">자주 묻는 질문</a></li>
              <li><a href="#!" class="item-link" (click)="menu.close(true)">1:1 문의</a></li>
              <li><a href="#!" class="item-link" (click)="menu.close(true)">공지사항</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export default class LanguageSwitcherDropdown {}
