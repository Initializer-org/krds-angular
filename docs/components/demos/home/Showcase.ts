import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
  KrdsBadge,
  KrdsButton,
  KrdsCheckArea,
  KrdsCheckbox,
  KrdsControl,
  KrdsDateInput,
  KrdsFileUpload,
  KrdsFormGroup,
  KrdsInput,
  KrdsSelect,
  KrdsStep,
  KrdsStepIndicator,
  KrdsTag,
  KrdsTagGroup,
  KrdsToggleSwitch,
  type KrdsBadgeColor
} from '@krds.ui/angular'

/** 홈 "컴포넌트 미리보기": 공공 서비스 화면을 KRDS Angular 컴포넌트로 조합한 예시 (KRDS Vue·React 문서와 같은 화면) */
@Component({
  selector: 'demo-home-showcase',
  imports: [
    FormsModule,
    KrdsBadge,
    KrdsButton,
    KrdsCheckArea,
    KrdsCheckbox,
    KrdsControl,
    KrdsDateInput,
    KrdsFileUpload,
    KrdsFormGroup,
    KrdsInput,
    KrdsSelect,
    KrdsStep,
    KrdsStepIndicator,
    KrdsTag,
    KrdsTagGroup,
    KrdsToggleSwitch
  ],
  template: `
    <div class="showcase vp-raw">
      <div class="showcase-column">
        <section class="showcase-card" aria-labelledby="showcase-apply">
          <h3 id="showcase-apply">주민등록표 등본 발급</h3>
          <p class="showcase-desc">신청 정보를 입력해 주세요.</p>
          <div class="showcase-form">
            <krds-form-group label="신청인 이름">
              <input krdsInput placeholder="홍길동" [(ngModel)]="applicant" />
            </krds-form-group>
            <krds-form-group label="발급 용도">
              <select krdsSelect [(ngModel)]="purpose">
                <option value="" disabled>선택</option>
                @for (option of purposes; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </krds-form-group>
            <krds-form-group label="희망 수령일">
              <krds-date-input>
                <input krdsInput placeholder="YYYY.MM.DD" [(ngModel)]="receiveDate" />
              </krds-date-input>
            </krds-form-group>
            <button krdsButton size="large">신청하기</button>
          </div>
          <p class="showcase-links">
            <a href="/components/input">텍스트 입력 필드</a> · <a href="/components/select">셀렉트</a> ·
            <a href="/components/date-input">날짜 입력 필드</a> · <a href="/components/button">버튼</a>
          </p>
        </section>

        <section class="showcase-card" aria-labelledby="showcase-terms">
          <h3 id="showcase-terms">약관 동의</h3>
          <p class="showcase-desc">서비스 이용을 위해 약관에 동의해 주세요.</p>
          <div krdsCheckArea column>
            <krds-checkbox>
              <input type="checkbox" krdsControl [ngModel]="allAgreed()" (ngModelChange)="agreeAll($event)" />
              전체 동의
            </krds-checkbox>
            <krds-checkbox>
              <input type="checkbox" krdsControl [(ngModel)]="terms.privacy" />
              [필수] 개인정보 수집·이용 동의
            </krds-checkbox>
            <krds-checkbox>
              <input type="checkbox" krdsControl [(ngModel)]="terms.identifier" />
              [필수] 고유식별정보 처리 동의
            </krds-checkbox>
            <krds-checkbox description="신청 처리 결과를 문자로 안내합니다.">
              <input type="checkbox" krdsControl [(ngModel)]="terms.notice" />
              [선택] 처리 결과 알림 수신 동의
            </krds-checkbox>
          </div>
          <p class="showcase-links"><a href="/components/checkbox">체크박스</a></p>
        </section>

        <section class="showcase-card" aria-labelledby="showcase-search">
          <h3 id="showcase-search">통합 검색</h3>
          <input krdsInput aria-label="검색어" placeholder="찾으시는 서비스를 입력하세요" [(ngModel)]="keyword" />
          <p class="showcase-subtitle">많이 찾는 서비스</p>
          <div krdsTagGroup size="small">
            @for (item of popularKeywords; track item) {
              <a krdsTag href="#" (click)="$event.preventDefault(); keyword = item">{{ item }}</a>
            }
          </div>
          <p class="showcase-links"><a href="/components/input">텍스트 입력 필드</a> · <a href="/components/tag">태그</a></p>
        </section>
      </div>

      <div class="showcase-column">
        <section class="showcase-card" aria-labelledby="showcase-progress">
          <div class="showcase-title-row">
            <h3 id="showcase-progress">신청 진행 상황</h3>
            <span krdsBadge type="bg-light" color="information" size="small">처리 중</span>
          </div>
          <p class="showcase-desc">전입신고 · 접수번호 2026-1005-0142</p>
          <ol krdsStepIndicator [current]="1">
            <li krdsStep step="1단계">신청</li>
            <li krdsStep step="2단계">서류 검토</li>
            <li krdsStep step="3단계">처리</li>
            <li krdsStep step="4단계">완료</li>
          </ol>
          <p class="showcase-links"><a href="/components/step-indicator">단계 표시기</a> · <a href="/components/badge">배지</a></p>
        </section>

        <section class="showcase-card" aria-labelledby="showcase-files">
          <h3 id="showcase-files">증빙 서류 첨부</h3>
          <krds-file-upload
            heading="가족관계증명서"
            description="PDF, JPG, PNG · 10MB 이하"
            accept=".pdf,.jpg,.png"
            [maxFileSize]="10 * 1024 * 1024"
          />
          <p class="showcase-links"><a href="/components/file-upload">파일 업로드</a></p>
        </section>
      </div>

      <div class="showcase-column">
        <section class="showcase-card" aria-labelledby="showcase-auth">
          <h3 id="showcase-auth">본인 인증</h3>
          <p class="showcase-desc">본인 확인 방법을 선택해 주세요.</p>
          <div krdsCheckArea column role="radiogroup" aria-labelledby="showcase-auth">
            @for (method of authMethods; track method.value) {
              <krds-radio [description]="method.description">
                <input type="radio" krdsControl name="showcase-auth" [value]="method.value" [(ngModel)]="authMethod" />
                {{ method.label }}
              </krds-radio>
            }
          </div>
          <div class="showcase-actions">
            <button krdsButton variant="secondary" size="medium">취소</button>
            <button krdsButton size="medium">다음</button>
          </div>
          <p class="showcase-links"><a href="/components/radio">라디오 버튼</a> · <a href="/components/button">버튼</a></p>
        </section>

        <section class="showcase-card" aria-labelledby="showcase-notify">
          <h3 id="showcase-notify">알림 설정</h3>
          <p class="showcase-desc">처리 결과를 받을 방법을 선택하세요.</p>
          <div class="showcase-toggles">
            <krds-toggle-switch><input type="checkbox" krdsControl [(ngModel)]="notify.sms" />문자 알림</krds-toggle-switch>
            <krds-toggle-switch><input type="checkbox" krdsControl [(ngModel)]="notify.email" />이메일 알림</krds-toggle-switch>
            <krds-toggle-switch><input type="checkbox" krdsControl [(ngModel)]="notify.night" />야간(21시~08시) 알림</krds-toggle-switch>
          </div>
          <p class="showcase-links"><a href="/components/toggle-switch">토글 스위치</a></p>
        </section>

        <section class="showcase-card" aria-labelledby="showcase-requests">
          <h3 id="showcase-requests">나의 민원 처리 현황</h3>
          <ul class="showcase-requests">
            @for (request of requests; track request.title) {
              <li>
                <div>
                  <strong>{{ request.title }}</strong>
                  <span>{{ request.date }} 신청</span>
                </div>
                <span krdsBadge type="bg-light" [color]="request.color" size="small">{{ request.status }}</span>
              </li>
            }
          </ul>
          <p class="showcase-links"><a href="/components/badge">배지</a></p>
        </section>
      </div>
    </div>
  `
})
export default class HomeShowcase {
  applicant = ''
  purpose = ''
  readonly purposes = [
    { value: 'bank', label: '금융기관 제출용' },
    { value: 'office', label: '관공서 제출용' },
    { value: 'etc', label: '기타' }
  ]
  receiveDate = ''

  readonly terms = { privacy: false, identifier: false, notice: false }
  readonly allAgreed = () => Object.values(this.terms).every(Boolean)
  agreeAll(value: boolean) {
    Object.assign(this.terms, { privacy: value, identifier: value, notice: value })
  }

  keyword = ''
  readonly popularKeywords = ['주민등록등본', '건강보험', '여권 발급', '전입신고']

  readonly authMethods = [
    { value: 'phone', label: '휴대폰 인증', description: '본인 명의 휴대폰으로 인증합니다.' },
    { value: 'certificate', label: '공동인증서', description: '금융·공공기관 인증서로 인증합니다.' },
    { value: 'simple', label: '간편인증', description: '민간 인증서 앱으로 인증합니다.' }
  ]
  authMethod = 'phone'

  readonly notify = { sms: true, email: false, night: false }

  readonly requests: { title: string; date: string; status: string; color: KrdsBadgeColor }[] = [
    { title: '주민등록표 등본 발급', date: '2026.10.02', status: '완료', color: 'success' },
    { title: '전입신고', date: '2026.10.05', status: '처리 중', color: 'information' },
    { title: '여권 재발급', date: '2026.10.07', status: '접수', color: 'gray' }
  ]
}
