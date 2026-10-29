# 토글 스위치 Toggle switch

토글은 상호 배타적인 두 가지 상태를 전환하는 데 사용되는 요소이다.

## 기본

`<krds-toggle-switch>` 안에 기본 `<input type="checkbox">`를 `krdsControl`과 함께 넣고, 그 뒤에 스위치 이름을 씁니다. 컴포넌트가 input 바로 뒤에 스위치 모양 label을 만들어 연결합니다. 켜짐 상태와 `disabled`는 기본 input 그대로라 `[(ngModel)]`로 `boolean` 값을 연결하고, reactive forms와 Signal Forms도 그대로 씁니다.

<div class="demo vp-raw"><AngularDemo name="toggle-switch/Basic" /></div>

<<< ./demos/toggle-switch/Basic.ts

## 크기

<div class="demo vp-raw"><AngularDemo name="toggle-switch/Sizes" /></div>

<<< ./demos/toggle-switch/Sizes.ts

## API

## KrdsToggleSwitch

<ComponentApi name="KrdsToggleSwitch" />

## KrdsControl

<ComponentApi name="KrdsControl" />
