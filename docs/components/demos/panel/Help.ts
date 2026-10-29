import { Component, signal } from '@angular/core'
import { KrdsButton, KrdsDisclosure, KrdsExternalLink, KrdsPanel, KrdsTabPanel, KrdsTabs, type KrdsTabItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-panel-help',
  imports: [KrdsPanel, KrdsTabs, KrdsTabPanel, KrdsDisclosure, KrdsExternalLink, KrdsButton],
  template: `
    <krds-panel [(open)]="open">
      <krds-tabs [tabs]="tabs">
        <ng-template krdsTabPanel="help">
          <h3 class="sr-only">도움</h3>
          <div class="help-conts-area-inner">
            <div class="conts-area help-conts">
              <div class="conts-wrap">
                <h4 class="help-title">
                  전자문서지갑
                  <span class="krds-btn medium icon">
                    <span class="sr-only">도움말</span>
                    <i class="svg-icon ico-help" aria-hidden="true"></i>
                  </span>
                </h4>
                <div class="conts-desc">
                  <p>
                    전자문서지갑에서는 전자증명서 출력기능을 제공하지 않으며, 스마트폰 화면을 캡쳐하여 사용할 수 없습니다. 다만, 발급받은
                    전자증명서를 열람용으로 다운로드할 수는 있습니다.
                  </p>
                </div>
                <ul class="link-list">
                  <li>
                    <a href="#" krdsExternal class="krds-btn xsmall link basic">
                      안드로이드 애플리케이션 다운로드
                      <i class="svg-icon ico-go" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" krdsExternal class="krds-btn xsmall link basic">
                      iOS애플리케이션 다운로드
                      <i class="svg-icon ico-go" aria-hidden="true"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="conts-area related-service">
              <div class="conts-wrap">
                <h4 class="help-title">관련서비스/민원</h4>
                <ul class="link-list">
                  <li>
                    <a href="#" class="krds-btn xsmall link basic">
                      영문 주민등록표등본
                      <i class="svg-icon ico-angle right" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="krds-btn xsmall link basic">
                      영문 주민등록표초본
                      <i class="svg-icon ico-angle right" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#" class="krds-btn xsmall link basic">
                      주민등록표등본
                      <i class="svg-icon ico-angle right" aria-hidden="true"></i>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="conts-wrap">
                <h4 class="help-title">기타 문의/도움말</h4>
                <ul class="link-list">
                  <li>
                    <a href="#" class="krds-btn xsmall link basic">
                      <i class="svg-icon ico-call" aria-hidden="true"></i>
                      민원신청 관련 문의 전화 번호 찾기
                    </a>
                  </li>
                  <li>
                    <a href="#" class="krds-btn xsmall link basic">
                      <i class="svg-icon ico-faq" aria-hidden="true"></i>
                      자주 묻는 질문 확인하기
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ng-template>
        <ng-template krdsTabPanel="tutorial">
          <h3 class="sr-only">따라하기</h3>
          <div class="help-conts-area-inner">
            <div class="conts-area">
              <h4 class="help-title">
                <a href="#" title="이전으로 돌아가기">이사 전 살던 곳 정보 입력하기</a>
              </h4>
              <ul class="coach-help-process">
                <li>
                  <h4 class="tit current">Task 1: 이사 전에 살던 곳 주소 확인</h4>
                  <krds-disclosure label="전체 2단계">
                    <ul class="krds-info-list decimal">
                      <li>단계1 : 주소조회</li>
                      <li>단계2 : 조회 결과 확인</li>
                    </ul>
                  </krds-disclosure>
                </li>
                <li>
                  <h4 class="tit">Task 2: 이사 갈 가족 구성원 선택하기</h4>
                  <krds-disclosure label="전체 1단계">
                    <ul class="krds-info-list decimal">
                      <li>단계1 : 주소조회</li>
                    </ul>
                  </krds-disclosure>
                </li>
              </ul>
            </div>
            <div class="help-panel-action">
              <button krdsButton variant="secondary" size="medium" class="coach-btn-stop">그만 따라하기</button>
            </div>
          </div>
        </ng-template>
      </krds-tabs>
    </krds-panel>
  `
})
export default class PanelHelp {
  readonly open = signal(false)
  readonly tabs: KrdsTabItem[] = [
    { id: 'help', label: '도움' },
    { id: 'tutorial', label: '따라하기' }
  ]
}
