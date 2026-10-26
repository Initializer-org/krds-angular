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

| 분류             | 컴포넌트                                                                                      | 상태 |
| ---------------- | --------------------------------------------------------------------------------------------- | ---- |
| 액션             | 링크 `a[krdsLink]`, 버튼 `button[krdsButton]`, 플로팅 버튼 `<krds-floating-button>`           | 완료 |
| 선택             | 라디오 버튼, 체크박스, 셀렉트, 태그, 토글 스위치                                              | 예정 |
| 입력             | 날짜 입력 필드, 텍스트 영역, 텍스트 입력 필드, 파일 업로드                                    | 예정 |
| 피드백           | 단계 표시기, 스피너                                                                           | 예정 |
| 레이아웃 및 표현 | 구조화 목록, 긴급 공지, 디스클로저, 모달, 배지, 아코디언, 이미지, 캐러셀, 탭, 표, 텍스트 목록 | 예정 |
| 탐색             | 건너뛰기 링크, 메인 메뉴, 브레드크럼, 사이드 메뉴, 콘텐츠 내 탐색, 페이지네이션               | 예정 |
| 아이덴티티       | 공식 배너, 운영기관 식별자, 헤더, 푸터                                                        | 예정 |
| 도움             | 패널, 맥락적 도움말, 코치마크, 툴팁, 음성 지원                                                | 예정 |
| 설정             | 언어 변경, 화면 크기 조정                                                                     | 예정 |
| 콘텐츠           | 접근 가능한 미디어, 숨긴 콘텐츠                                                               | 예정 |
| 모바일           | 범위슬라이드, 수량 토글, 토스트, 스낵바, 탭바, 스플래시 스크린                                | 예정 |
| 부가 컴포넌트    | 폼 그룹, 아이콘, 레이아웃                                                                     | 예정 |

## 개발

```bash
pnpm install
pnpm test     # 단위 테스트와 axe-core 접근성 검사 (Vitest, jsdom)
pnpm build    # dist/krds-angular에 패키지 생성
pnpm lint
pnpm format
```

## 라이선스

MIT © [Initializer Team](https://github.com/Initializer-org)
