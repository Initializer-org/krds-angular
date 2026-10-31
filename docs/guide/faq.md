---
title: KRDS Angular 자주 묻는 질문
description: 'KRDS Angular의 설치 패키지명, Angular 20·21·22 지원, standalone 사용법, 폼 연동, 스타일과 접근성 검증 범위를 설명합니다.'
---

# KRDS Angular 자주 묻는 질문

KRDS Angular는 Initializer Team이 유지보수하는 `@krds.ui/angular`입니다. 대한민국 정부 디자인 시스템의 마크업과 스타일을 Angular 컴포넌트·디렉티브로 구현한 커뮤니티 라이브러리입니다.

## 정부가 배포하는 공식 Angular 패키지인가요? {#official-package}

아닙니다. 이 프로젝트는 [KRDS 공식 가이드](https://www.krds.go.kr/html/site/index.html)를 따르지만, Initializer Team이 별도로 유지보수합니다. 구현 소스와 변경 이력은 [krds-angular 저장소](https://github.com/Initializer-org/krds-angular)에서 확인할 수 있습니다.

## krds-angular·krds-uiux와 어떤 차이가 있나요? {#package-names}

이 문서의 Angular 라이브러리는 [`@krds.ui/angular`](https://www.npmjs.com/package/@krds.ui/angular)이며 설치 명령은 `npm install @krds.ui/angular`입니다. `Initializer-org/krds-angular`는 GitHub 저장소 이름이고 npm 설치 이름은 `@krds.ui/angular`입니다. [`krds-uiux`](https://github.com/KRDS-uiux/krds-uiux)는 KRDS 공식 HTML Component Kit으로, 이 Angular 컴포넌트·디렉티브 라이브러리와 별개의 패키지입니다.

## Vue·React·Angular 중 어떤 패키지를 선택하나요? {#framework-packages}

Initializer Team의 KRDS 라이브러리는 프레임워크별로 별도 배포됩니다. 프로젝트에 사용하는 프레임워크에 맞는 패키지를 선택하세요.

| 프레임워크 | npm 패키지 | 설치 명령 | 문서 |
| --- | --- | --- | --- |
| Vue | [`@krds.ui/vue`](https://www.npmjs.com/package/@krds.ui/vue) | `npm install @krds.ui/vue` | [KRDS Vue](https://krds.initializer.org/guide/getting-started) |
| React | [`@krds.ui/react`](https://www.npmjs.com/package/@krds.ui/react) | `npm install @krds.ui/react` | [KRDS React](https://react.krds.initializer.org/guide/getting-started) |
| Angular | [`@krds.ui/angular`](https://www.npmjs.com/package/@krds.ui/angular) | `npm install @krds.ui/angular` | [KRDS Angular](https://angular.krds.initializer.org/guide/getting-started) |

세 패키지는 각각의 프레임워크 API를 사용합니다. 설치 이름과 import 경로도 선택한 패키지에 맞춰야 합니다.

## npm에서 설치할 수 있나요? 어떤 Angular 버전을 지원하나요? {#installation}

[`@krds.ui/angular`](https://www.npmjs.com/package/@krds.ui/angular)은 npm에서 설치할 수 있습니다. `npm install @krds.ui/angular` 또는 `pnpm add @krds.ui/angular`를 실행하세요. `@angular/core`와 `@angular/common`의 지원 범위는 `^20.0.0 || ^21.0.0 || ^22.0.0`입니다. 설치와 스타일 설정은 [시작하기](/guide/getting-started)에 정리되어 있습니다.

## standalone 컴포넌트와 zone.js 없는 앱에서 사용할 수 있나요? {#standalone}

사용할 수 있습니다. 필요한 컴포넌트·디렉티브를 standalone 컴포넌트의 `imports`에 넣습니다. zone.js 없이 동작하며 zone.js를 쓰는 애플리케이션에서도 사용할 수 있습니다.

```ts
import { Component } from '@angular/core'
import { KrdsButton } from '@krds.ui/angular'

@Component({
  selector: 'app-submit-button',
  imports: [KrdsButton],
  template: '<button krdsButton type="submit">신청하기</button>'
})
export class SubmitButton {}
```

## Reactive Forms와 Signal Forms를 지원하나요? {#forms}

기본 입력 요소에 `krdsInput`, `krdsSelect`, `krdsControl` 디렉티브를 붙이는 방식이므로 `[(ngModel)]`과 reactive forms를 사용할 수 있습니다. Signal Forms의 `[formField]`는 Angular 21 이상에서 사용합니다. 사용하는 방식에 맞게 Angular의 폼 모듈·디렉티브도 import해야 합니다. [폼 작성 방식](/guide/getting-started#작성-방식)에서 예제를 확인하세요.

## 스타일과 글꼴은 어떻게 적용하나요? {#styles}

`angular.json`의 `styles` 배열에 `"@krds.ui/angular/style.css"`를 추가합니다. Pretendard GOV 글꼴과 아이콘 이미지가 패키지에 함께 포함되어 있어 따로 복사할 필요가 없습니다. 전체 설정은 [스타일 안내](/guide/getting-started#스타일)를 참고하세요.

## 웹 접근성 인증을 받은 라이브러리인가요? {#accessibility}

자동 검사를 웹 접근성 인증으로 보아서는 안 됩니다. 컴포넌트 테스트와 문서 예제는 Chromium에서 axe-core 검사를 실행하지만, 실제 서비스의 레이블, 키보드 이동, 화면낭독기 흐름과 콘텐츠는 별도로 검증해야 합니다. 검사 구성은 [CI 워크플로](https://github.com/Initializer-org/krds-angular/blob/main/.github/workflows/ci.yml)에서 확인할 수 있습니다.

## 라이선스와 버그 제보 경로는 어디인가요? {#license-and-support}

코드는 [MIT 라이선스](https://github.com/Initializer-org/krds-angular/blob/main/LICENSE)로 배포됩니다. 버그는 재현 코드와 Angular 버전을 포함해 [GitHub Issues](https://github.com/Initializer-org/krds-angular/issues)에 제보할 수 있습니다. 입력·출력 API와 사용 예제는 [컴포넌트 목록](/components/)에서 찾을 수 있습니다.
