import { Component, signal } from '@angular/core'
import {
  KrdsAccordion,
  KrdsAccordionItem,
  KrdsBadge,
  KrdsBreadcrumb,
  KrdsButton,
  KrdsFooter,
  KrdsFooterBottom,
  KrdsFooterContent,
  KrdsHeader,
  KrdsHeaderBranding,
  KrdsHeaderUtility,
  KrdsIdentifier,
  KrdsLayout,
  KrdsMainMenu,
  KrdsMasthead,
  KrdsPagination,
  KrdsSideNavigation,
  KrdsSkipLink,
  KrdsStep,
  KrdsStepIndicator,
  KrdsTable,
  KrdsTabs,
  KrdsTabPanel,
  KrdsTooltip,
  type KrdsMainMenuItem,
  type KrdsSideNavItem,
  type KrdsTableColumn
} from '@krds.ui/angular'
import { componentGroups } from '../../../.vitepress/component-groups'
import ApplicationForm from './ApplicationForm'

const sections = [
  { id: 'pg-form', title: '입력·선택' },
  { id: 'pg-feedback', title: '피드백' },
  { id: 'pg-help', title: '도움' },
  { id: 'pg-content', title: '레이아웃 및 표현' },
  { id: 'pg-navigation', title: '탐색·액션' }
]
interface RecordRow {
  title: string
  date: string
  status: string
}

/** Vue·React와 같은 공공서비스 흐름을 Angular 컴포넌트로 구성한다. */
@Component({
  selector: 'demo-playground',
  imports: [
    ApplicationForm,
    KrdsAccordion,
    KrdsAccordionItem,
    KrdsBadge,
    KrdsBreadcrumb,
    KrdsButton,
    KrdsFooter,
    KrdsFooterBottom,
    KrdsFooterContent,
    KrdsHeader,
    KrdsHeaderBranding,
    KrdsHeaderUtility,
    KrdsIdentifier,
    KrdsLayout,
    KrdsMainMenu,
    KrdsMasthead,
    KrdsPagination,
    KrdsSideNavigation,
    KrdsSkipLink,
    KrdsStep,
    KrdsStepIndicator,
    KrdsTable,
    KrdsTabs,
    KrdsTabPanel,
    KrdsTooltip
  ],
  template: `
    <div krdsLayout class="krds-playground vp-raw">
      <div krdsSkipLink><a href="#container">본문 바로가기</a></div>
      <div krdsMasthead role="region" aria-label="예시 누리집 안내">이 누리집은 KRDS Angular 컴포넌트로 만든 예시 누리집입니다.</div>
      <header krdsHeader>
        <div krdsHeaderUtility>
          <ul class="utility-list">
            <li><a href="/" class="krds-btn small text">KRDS Angular 문서로 돌아가기</a></li>
          </ul>
        </div>
        <div krdsHeaderBranding>
          <h2 class="logo">
            <a class="pg-brand" href="/playground"><img src="/logo.svg" alt="" width="48" height="48" /><span>KRDS Angular</span></a>
          </h2>
          <div class="header-actions">
            <a href="/components/" class="btn-navi sch">컴포넌트 찾기</a
            ><button
              type="button"
              class="btn-navi all"
              aria-controls="mobile-nav"
              [attr.aria-expanded]="menuOpen()"
              (click)="menuOpen.set(true)"
            >
              전체메뉴
            </button>
          </div>
        </div>
        <krds-main-menu [items]="menu" /><krds-main-menu krdsHeaderMobile variant="mobile" [items]="menu" [(open)]="menuOpen" />
      </header>
      <main id="container" tabindex="-1">
        <div class="inner in-between">
          <nav krdsSideNavigation heading="플레이그라운드" aria-label="플레이그라운드 구성" [(items)]="sideMenu"></nav>
          <div class="contents">
            <nav krdsBreadcrumb [items]="[{ text: '홈', href: '/' }, { text: '플레이그라운드' }]"></nav>
            <h1 class="pg-title">컴포넌트 플레이그라운드</h1>
            <p class="pg-intro">
              KRDS Angular 컴포넌트를 실제 공공 누리집처럼 조합했습니다. 메뉴, 입력, 도움말과 모달을 직접 조작해 보세요.
            </p>
            <div class="pg-notice">
              <strong>체험용 화면입니다.</strong> 입력한 정보는 서버로 전송하지 않습니다. 설치 패키지는
              <code>&#64;krds.ui/angular</code>입니다.
            </div>
            <nav class="pg-links" aria-label="이 페이지의 구성">
              @for (section of sections; track section.id) {
                <a [href]="'#' + section.id">{{ section.title }}</a>
              }
            </nav>
            <section id="pg-form" class="pg-part" aria-labelledby="pg-form-title">
              <h2 id="pg-form-title">입력·선택</h2>
              <pg-application-form />
            </section>
            <section id="pg-feedback" class="pg-part" aria-labelledby="pg-feedback-title">
              <h2 id="pg-feedback-title">피드백</h2>
              <p class="pg-hint">이전·다음 단계 버튼으로 단계 표시기의 상태를 바꿔 보세요.</p>
              <ol krdsStepIndicator [current]="step()">
                <li krdsStep step="1단계">신청</li>
                <li krdsStep step="2단계">서류 검토</li>
                <li krdsStep step="3단계">처리</li>
                <li krdsStep step="4단계">완료</li>
              </ol>
              <div class="pg-links">
                <button krdsButton variant="tertiary" [disabled]="step() === 0" (click)="step.set(step() - 1)">이전 단계</button
                ><button krdsButton [disabled]="step() === 3" (click)="step.set(step() + 1)">다음 단계</button>
              </div>
              <p role="status">현재 단계: {{ step() + 1 }} / 4</p>
              <div class="pg-row pg-section">
                <span krdsBadge type="bg-light" color="information">처리 중</span><span krdsBadge type="bg-light" color="success">완료</span
                ><span krdsBadge type="bg-light" color="gray">접수</span>
              </div>
            </section>
            <section id="pg-help" class="pg-part" aria-labelledby="pg-help-title">
              <h2 id="pg-help-title">도움</h2>
              <krds-tooltip content="예시 화면에서는 본인 인증이나 실제 민원 신청을 진행하지 않습니다.">본인 인증 안내</krds-tooltip>
              <div class="pg-section">
                <h3>자주 묻는 질문</h3>
                <div krdsAccordion headingLevel="4" [(open)]="faqOpen">
                  <krds-accordion-item value="demo" label="실제 민원을 신청할 수 있나요?"
                    >컴포넌트 동작을 확인하는 체험용 화면입니다. 입력한 정보는 저장하거나 전송하지 않습니다.</krds-accordion-item
                  >
                  <krds-accordion-item value="package" label="어떤 패키지를 설치하나요?"
                    ><code>npm install &#64;krds.ui/angular</code>로 설치합니다.
                    <a href="/guide/getting-started">설치와 스타일 설정 보기</a></krds-accordion-item
                  >
                </div>
              </div>
            </section>
            <section id="pg-content" class="pg-part" aria-labelledby="pg-content-title">
              <h2 id="pg-content-title">레이아웃 및 표현</h2>
              <krds-tabs [tabs]="tabs">
                <ng-template krdsTabPanel="overview"
                  ><p>KRDS의 폼, 안내, 탐색 요소를 조합해 일관된 공공서비스 화면을 구성할 수 있습니다.</p></ng-template
                >
                <ng-template krdsTabPanel="process"
                  ><ol class="krds-info-list ordered">
                    <li>신청 내용을 입력합니다.</li>
                    <li>입력 오류를 확인하고 수정합니다.</li>
                    <li>확인 모달에서 예시 신청 결과를 확인합니다.</li>
                  </ol></ng-template
                >
              </krds-tabs>
            </section>
            <section id="pg-navigation" class="pg-part" aria-labelledby="pg-navigation-title">
              <h2 id="pg-navigation-title">탐색·액션</h2>
              <p class="pg-hint">페이지를 바꾸면 아래 표의 예시 민원 내역도 바뀝니다.</p>
              <div class="pg-table">
                <krds-table
                  caption="예시 민원 처리 현황"
                  tableClass="col data"
                  [columns]="columns"
                  [rows]="records.slice((page() - 1) * 2, page() * 2)"
                />
              </div>
              <nav krdsPagination [max]="3" [(page)]="page"></nav>
              <p role="status" class="pg-hint">현재 페이지: {{ page() }} / 3</p>
              <button krdsButton variant="tertiary" (click)="backToContent()">본문 처음으로</button>
            </section>
          </div>
        </div>
      </main>
      <footer krdsFooter>
        <div krdsFooterContent>
          <div class="f-info">
            <p class="pg-footer-logo"><img src="/logo.svg" alt="" />KRDS Angular</p>
            <p>Initializer Team · &#64;krds.ui/angular · MIT 라이선스</p>
          </div>
          <div class="f-link">
            <div class="link-go">
              <a href="https://github.com/Initializer-org/krds-angular" class="krds-btn medium text">GitHub</a
              ><a href="https://www.npmjs.com/package/@krds.ui/angular" class="krds-btn medium text">npm 패키지</a>
            </div>
          </div>
        </div>
        <div krdsFooterBottom>
          <div class="f-btm-text">
            <div class="f-menu"><a href="/">KRDS Angular 문서</a><a href="/guide/getting-started">시작하기</a></div>
            <p class="f-copy">© 2026 Initializer Team.</p>
          </div>
          <div krdsIdentifier>이 누리집은 KRDS Angular 예시 누리집입니다.</div>
        </div>
      </footer>
    </div>
  `
})
export default class Playground {
  readonly sections = sections
  readonly menuOpen = signal(false)
  readonly step = signal(0)
  readonly page = signal(1)
  readonly faqOpen = signal<string | null>(null)
  readonly tabs = [
    { id: 'overview', label: '서비스 개요' },
    { id: 'process', label: '이용 절차' }
  ]
  readonly sideMenu = signal<KrdsSideNavItem[]>(sections.map(({ id, title }) => ({ text: title, href: '#' + id })))
  readonly menu: KrdsMainMenuItem[] = [
    {
      text: '시작하기',
      items: [
        { text: '설치와 사용법', href: '/guide/getting-started' },
        { text: '컴포넌트 목록', href: '/components/' },
        { text: '자주 묻는 질문', href: '/guide/faq' }
      ]
    },
    {
      text: '컴포넌트',
      subItems: componentGroups.map(group => ({
        text: group.text,
        items: group.pages.map(([text, slug]) => ({ text, href: '/components/' + slug }))
      }))
    },
    { text: 'npm 패키지', href: 'https://www.npmjs.com/package/@krds.ui/angular', external: true }
  ]
  readonly columns: KrdsTableColumn<RecordRow>[] = [
    { name: 'title', label: '민원명', field: 'title' },
    { name: 'date', label: '신청일', field: 'date' },
    { name: 'status', label: '상태', field: 'status' }
  ]
  readonly records: RecordRow[] = [
    { title: '주민등록표 등본 발급', date: '2026.10.02', status: '완료' },
    { title: '전입신고', date: '2026.10.05', status: '처리 중' },
    { title: '여권 재발급', date: '2026.10.07', status: '접수' },
    { title: '건축물대장 열람', date: '2026.10.09', status: '완료' },
    { title: '지방세 납세증명', date: '2026.10.11', status: '처리 중' },
    { title: '가족관계증명서 발급', date: '2026.10.13', status: '접수' }
  ]
  backToContent() {
    document.getElementById('container')?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
