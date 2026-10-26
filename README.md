# KRDS Angular

[KRDS(대한민국 정부 디자인 시스템)](https://www.krds.go.kr/html/site/index.html)를 Angular로 구현한 컴포넌트 라이브러리입니다. Vue 버전인 [@krds.ui/vue](https://github.com/Initializer-org/krds-vue)와 같은 KRDS 스타일을 씁니다.

> 초기 개발 단계입니다. 아직 npm에 배포하지 않았고, 컴포넌트는 KRDS 공식 분류 순서대로 하나씩 옮기는 중입니다(아래 [컴포넌트](#컴포넌트) 표). 스타일시트에는 KRDS 컴포넌트 CSS가 모두 들어 있어서, 아직 없는 컴포넌트도 KRDS 원본 마크업과 클래스로 바로 쓸 수 있습니다.

## 빠른 시작

```bash
pnpm add @krds.ui/angular
```

`angular.json`의 `styles`에 스타일시트를 추가합니다.

```json
"styles": ["@krds.ui/angular/style.css"]
```

```ts
import { Component } from '@angular/core'
import { KrdsButton } from '@krds.ui/angular'

@Component({
  selector: 'app-root',
  imports: [KrdsButton],
  template: `<button krdsButton variant="secondary" size="large">확인</button>`
})
export class App {}
```

Angular `^22.2.0`이 필요합니다.

스타일시트는 KRDS 전체 CSS라 압축 전 약 620kB(전송 약 45kB)입니다. `ng new`의 기본 번들 예산(`initial` 경고 500kB)에서 경고가 나오면 `angular.json`의 `budgets`에서 `maximumWarning`을 `1mb`로 올리세요.

## 컴포넌트

[KRDS 공식 컴포넌트 목록](https://www.krds.go.kr/html/site/component/component_summary.html)의 분류 단위로 옮깁니다. 분류와 순서는 [krds-vue 문서](https://krds.initializer.org/components/)와 같습니다.

- [x] 액션: 링크 `a[krdsLink]`, 버튼 `button[krdsButton]`, 플로팅 버튼 `<krds-floating-button>`
- [x] 선택: 라디오 버튼 `<krds-radio>`, 체크박스 `<krds-checkbox>`, 셀렉트 `select[krdsSelect]`, 태그 `<krds-tag>`·`a[krdsTag]`, 토글 스위치 `<krds-toggle-switch>`, 묶음 `[krdsCheckArea]`·`[krdsTagGroup]`
- [x] 입력: 날짜 입력 필드 `<krds-date-input>`, 텍스트 영역 `textarea[krdsInput]`·글자 수 `<krds-textarea>`, 텍스트 입력 필드 `input[krdsInput]`, 파일 업로드 `<krds-file-upload>`, 폼 그룹 `<krds-form-group>` (부가 컴포넌트에서 앞당김)
- [x] 피드백: 단계 표시기 `ol[krdsStepIndicator]`·`li[krdsStep]`, 스피너 `<krds-spinner>` (입력 필드 로딩은 폼 그룹 `loading`)
- [x] 레이아웃 및 표현: 구조화 목록 `ul[krdsStructuredList]`, 긴급 공지 `<krds-critical-alerts>`, 디스클로저 `<krds-disclosure>`, 모달 `<krds-modal>`, 배지 `[krdsBadge]`, 아코디언 `[krdsAccordion]`·`<krds-accordion-item>`, 이미지 `img[krdsImage]`·`figure[krdsFigure]`, 캐러셀 `<krds-carousel>`·`li[krdsSlide]`, 탭 `<krds-tabs>`, 표 `<krds-table>`, 텍스트 목록 `[krdsTextList]`
- [x] 탐색: 건너뛰기 링크 `[krdsSkipLink]`, 메인 메뉴 `<krds-main-menu>`(PC·모바일), 브레드크럼 `nav[krdsBreadcrumb]`, 사이드 메뉴 `nav[krdsSideNavigation]`, 콘텐츠 내 탐색 `<krds-in-page-navigation>`, 페이지네이션 `nav[krdsPagination]`, 새 창 링크 `a[krdsExternal]`
- [ ] 아이덴티티: 공식 배너, 운영기관 식별자, 헤더, 푸터
- [ ] 도움: 패널, 맥락적 도움말, 코치마크, 툴팁, 음성 지원
- [ ] 설정: 언어 변경, 화면 크기 조정
- [ ] 콘텐츠: 접근 가능한 미디어, 숨긴 콘텐츠
- [ ] 모바일: 범위슬라이드, 수량 토글, 토스트, 스낵바, 탭바, 스플래시 스크린
- [ ] 부가 컴포넌트: 아이콘, 레이아웃

폼 컴포넌트는 기본 입력 요소를 그대로 씁니다. 텍스트 입력 필드·텍스트 영역은 `krdsInput`, 셀렉트는 `krdsSelect`, 체크박스·라디오·토글 스위치 안의 input은 `krdsControl`로 표시하면, 감싸는 컴포넌트가 KRDS 마크업과 label·도움말 연결(`aria-describedby`, 오류 상태의 `aria-invalid`)을 맡습니다. 값과 검증은 기본 요소 그대로라 `[(ngModel)]`, reactive forms, Signal Forms(`[formField]`), `required` 같은 기본 속성이 그대로 동작합니다.

```html
<krds-form-group label="이메일" hint="이메일 형식이 올바르지 않습니다" state="error">
  <input krdsInput type="email" [formField]="signupForm.email" />
</krds-form-group>

<krds-checkbox description="부가 설명">
  <input type="checkbox" krdsControl [(ngModel)]="agree" />
  개인정보 수집에 동의합니다
</krds-checkbox>
```

## 개발

```bash
pnpm install
pnpm test     # 실제 브라우저(Chromium)에서 단위 테스트와 axe-core 접근성 검사 (처음 한 번 pnpm exec playwright install chromium)
pnpm build    # dist/krds-angular에 패키지 생성
pnpm lint
pnpm format
```

## 라이선스

MIT © [Initializer Team](https://github.com/Initializer-org)
