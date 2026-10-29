import { Component } from '@angular/core'
import { KrdsBadge, KrdsButton, KrdsStructuredItem, KrdsStructuredList } from '@krds.ui/angular'

@Component({
  selector: 'demo-structured-list-basic',
  imports: [KrdsBadge, KrdsButton, KrdsStructuredItem, KrdsStructuredList],
  template: `
    <ul krdsStructuredList>
      <li krdsStructuredItem>
        <div class="card-top">
          <span krdsBadge type="bg-light" color="primary">뱃지</span>
        </div>
        <div class="card-body">
          <a href="#" class="c-text">
            <p class="c-tit"><span class="span">타이틀 영역</span></p>
            <p class="c-txt">
              간단한 설명이 들어가는 영역입니다. 최대 3줄까지 작성합니다. 간단한 설명이 들어가는 영역입니다. 간단한 설명이 들어가는
              영역입니다.
            </p>
            <p class="c-date">
              <strong class="key">신청 기간</strong>
              <span class="value">2023.00.00-2024.00.00</span>
            </p>
          </a>
          <div class="c-btn">
            <button krdsButton variant="secondary" size="medium">신청하기</button>
          </div>
        </div>
        <div class="card-btm">
          <span class="tag">태그</span>
          <span class="tag">태그</span>
        </div>
        <div class="card-btn">
          <button krdsButton variant="tertiary" size="medium" text><i class="svg-icon ico-share" aria-hidden="true"></i> 공유하기</button>
          <button krdsButton variant="tertiary" size="medium" text><i class="svg-icon ico-like" aria-hidden="true"></i> 찜하기</button>
        </div>
      </li>
    </ul>
  `
})
export default class StructuredListBasic {}
