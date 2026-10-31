---
layout: home
title: KRDS Angular (@krds.ui/angular)
titleTemplate: 대한민국 정부 디자인 시스템 Angular 컴포넌트 라이브러리
description: 'Initializer Team의 @krds.ui/angular 문서입니다. Angular 20·21·22에서 쓰는 KRDS 컴포넌트의 설치, standalone 사용법, 폼 연동과 API를 안내합니다.'

hero:
  name: KRDS Angular
  text: 대한민국 정부 디자인 시스템을 Angular로
  tagline: 민원 신청부터 본인 인증까지, 공공서비스에 필요한 화면을 KRDS 기준으로 구성하세요. 폼·내비게이션·안내 요소를 조합하고, 기존 Angular 폼의 데이터 연결과 유효성 검사를 함께 사용할 수 있습니다.
  actions:
    - theme: brand
      text: 시작하기
      link: /guide/getting-started
    - theme: alt
      text: 컴포넌트 보기
      link: /components/
    - theme: alt
      text: GitHub
      link: https://github.com/Initializer-org/krds-angular

features:
  - title: 최신 Angular 문법
    details: Angular 20 이상의 signal 입력·출력, standalone 컴포넌트, zoneless 변경 감지로 만들었습니다. 버튼·링크처럼 기본 요소에 붙이는 디렉티브는 기본 동작을 그대로 씁니다.
  - title: 폼은 기본 입력 요소 그대로
    details: 입력 필드·체크박스·셀렉트는 기본 요소를 넣고 표시만 붙이므로 ngModel, reactive forms, Signal Forms가 그대로 동작합니다.
  - title: 접근성 자동 검사
    details: 모든 컴포넌트를 실제 브라우저(Chromium)에서 KRDS 스타일을 넣고 axe-core로 검사합니다. 고대비 모드를 지원합니다.
---

## KRDS Angular는 무엇인가요? {#about}

KRDS Angular(`@krds.ui/angular`)는 대한민국 정부 디자인 시스템의 마크업과 스타일을 Angular로 구현한 커뮤니티 라이브러리입니다. Initializer Team이 유지보수하며, 정부가 배포하는 공식 Angular 패키지는 아닙니다. Angular 20·21·22를 지원하고 MIT 라이선스로 배포됩니다.

```sh
npm install @krds.ui/angular
```

[npm: @krds.ui/angular](https://www.npmjs.com/package/@krds.ui/angular) · [소스: Initializer-org/krds-angular](https://github.com/Initializer-org/krds-angular) · [패키지 이름 구분하기](/guide/faq#package-names)

[설치와 스타일 설정](/guide/getting-started), [컴포넌트별 예제와 API](/components/), [자주 묻는 질문](/guide/faq)에서 적용 방법을 확인하세요.

[플레이그라운드](/playground)에서 공공서비스 화면으로 조합한 컴포넌트를 직접 사용해 보세요.

## 컴포넌트 미리보기

공공 서비스 화면을 KRDS Angular 컴포넌트로 조합한 예시입니다. 직접 입력하고 선택해 보세요. 상단 화면 모드 버튼으로 "선명하게 (어두운 배경)" 모드도 확인할 수 있습니다.

<AngularDemo name="home/Showcase" />
