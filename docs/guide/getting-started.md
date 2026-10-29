---
title: KRDS Angular 설치와 시작하기
description: '@krds.ui/angular 설치, Angular 20·21·22 요구사항, 스타일 설정, standalone 컴포넌트와 폼 연동 방법을 안내합니다.'
---

# KRDS Angular 설치와 시작하기

KRDS Angular는 [KRDS(대한민국 정부 디자인 시스템)](https://www.krds.go.kr/html/site/index.html)를 Angular로 구현한 컴포넌트 라이브러리입니다. [KRDS Vue](https://krds.initializer.org)와 같은 KRDS 스타일을 씁니다.

Initializer Team이 유지보수하는 커뮤니티 라이브러리이며, 정부가 배포하는 공식 Angular 패키지는 아닙니다. npm의 [`@krds.ui/angular`](https://www.npmjs.com/package/@krds.ui/angular) 패키지로 설치합니다.

## 설치

```bash
pnpm add @krds.ui/angular
```

## 스타일

`angular.json`의 `styles`에 스타일시트를 추가합니다. KRDS 글꼴(Pretendard GOV)과 아이콘 이미지가 스타일시트 옆에 함께 들어 있어 따로 복사할 자산이 없습니다.

```json
"styles": ["@krds.ui/angular/style.css"]
```

스타일시트는 KRDS 전체 CSS라 압축 전 약 620kB(전송 약 45kB)입니다. `ng new`의 기본 번들 예산(`initial` 경고 500kB)에서 경고가 나오면 `angular.json`의 `budgets`에서 `maximumWarning`을 `1mb`로 올리세요.

## 컴포넌트 import

필요한 컴포넌트·디렉티브를 standalone 컴포넌트의 `imports`에 넣습니다.

```ts
import { Component } from '@angular/core'
import { KrdsButton, KrdsFormGroup, KrdsInput } from '@krds.ui/angular'

@Component({
  selector: 'app-apply-form',
  imports: [KrdsButton, KrdsFormGroup, KrdsInput],
  template: `
    <krds-form-group label="신청인 이름">
      <input krdsInput placeholder="홍길동" />
    </krds-form-group>
    <button krdsButton>신청하기</button>
  `
})
export class ApplyForm {}
```

## 작성 방식

- **기본 요소에 붙이는 디렉티브**: 버튼(`button[krdsButton]`), 링크(`a[krdsLink]`)처럼 기본 요소에 KRDS 클래스만 더하면 되는 것은 디렉티브입니다. `type`, `disabled`, `href` 같은 기본 속성과 동작이 그대로입니다.
- **마크업이 필요한 컴포넌트**: 모달(`<krds-modal>`), 탭(`<krds-tabs>`)처럼 KRDS 마크업을 만들어야 하는 것은 컴포넌트입니다.
- **폼은 기본 입력 요소 그대로**: 텍스트 입력 필드·텍스트 영역은 `krdsInput`, 셀렉트는 `krdsSelect`, 체크박스·라디오·토글 스위치 안의 input은 `krdsControl`로 표시합니다. 감싸는 컴포넌트가 KRDS 마크업과 label·도움말 연결(`aria-describedby`, 오류 상태의 `aria-invalid`)을 맡고, 값과 검증은 기본 요소 그대로라 `[(ngModel)]`, reactive forms, Signal Forms(`[formField]`)가 그대로 동작합니다.
- **아이콘과 버튼 묶음**: 따로 컴포넌트 없이 KRDS 클래스를 그대로 씁니다. `<i class="svg-icon ico-help" aria-hidden="true"></i>`, `<div class="btn-group">`

```html
<krds-form-group label="이메일" hint="이메일 형식이 올바르지 않습니다" state="error">
  <input krdsInput type="email" [formField]="signupForm.email" />
</krds-form-group>

<krds-checkbox description="부가 설명">
  <input type="checkbox" krdsControl [(ngModel)]="agree" />
  개인정보 수집에 동의합니다
</krds-checkbox>
```

## 고대비 모드

KRDS 고대비 모드는 `<html>`의 `data-krds-mode="high-contrast"`로 켭니다. 이 문서 사이트는 상단의 화면 모드 버튼("선명하게 (어두운 배경)")에 연결해 두었습니다.

## 요구사항

- Angular 20·21·22 (`^20.0.0 || ^21.0.0 || ^22.0.0`). Signal Forms(`[formField]`)는 Angular 21부터 있습니다.
- zone.js 없이(zoneless) 동작합니다. zone.js를 쓰는 애플리케이션에서도 그대로 쓸 수 있습니다.

패키지 선택, 폼 연동, 접근성 검증 범위는 [자주 묻는 질문](/guide/faq)에서 확인할 수 있습니다.
