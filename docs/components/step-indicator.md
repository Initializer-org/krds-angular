# 단계 표시기 Step indicator

단계 표시기는 서비스 이용을 위해 사용자가 거쳐야 하는 일련의 단계를 시각화하여 표현한 것으로 진행 상태에 대한 피드백을 사용자에게 전달한다.

## 기본

`<ol krdsStepIndicator>` 안에 단계마다 `<li krdsStep>`을 넣고, 단계 번호는 `step`, 단계 제목은 내용으로 씁니다. `current`에 현재 단계의 위치(0부터)를 주면 그보다 앞의 단계는 완료(`done`), 뒤의 단계는 대기(`pending`)로 표시하고, 현재 단계에는 화면낭독기용 "현재단계"를 붙입니다. 단계를 `@if`·`@for`로 넣고 빼도 실제 순서대로 표시합니다.

단계 표시기는 진행 상태만 보여 주므로 단계를 눌러 이동하지 않습니다. 이전·다음 버튼 등에서 `current`를 바꿔 단계를 옮깁니다.

<div class="demo vp-raw"><AngularDemo name="step-indicator/Basic" /></div>

<<< ./demos/step-indicator/Basic.ts

## 상태 지정

`krdsStep`의 `status`로 단계의 상태를 직접 정합니다. `status`는 `current`로 정한 상태보다 우선합니다.

<div class="demo vp-raw"><AngularDemo name="step-indicator/ForcedStatus" /></div>

<<< ./demos/step-indicator/ForcedStatus.ts

## 페이지 타이틀과 함께

<div class="demo vp-raw"><AngularDemo name="step-indicator/WithPageTitle" /></div>

<<< ./demos/step-indicator/WithPageTitle.ts

## API

## KrdsStepIndicator

<ComponentApi name="KrdsStepIndicator" />

## KrdsStep

<ComponentApi name="KrdsStep" />
