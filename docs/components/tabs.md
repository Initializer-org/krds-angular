# 탭 Tab

탭은 버튼을 눌러 상호배타적인 여러 개의 콘텐츠 섹션을 전환할 수 있는 컴포넌트이다. 탭 버튼 목록과 콘텐츠 패널이 수직으로 쌓여 있는 형태로 표현되며, 사용자는 탭을 선택하여 해당 콘텐츠 섹션을 표시할 수 있다.

## 기본

`tabs`로 탭 목록을 주고, 각 패널 내용은 탭 `id`와 같은 값을 준 `<ng-template krdsTabPanel="탭 id">`에 넣습니다. 처음에는 비활성화되지 않은 첫 번째 탭이 선택되고, 선택된 탭에는 화면낭독기용 "선택됨" 텍스트(`selectedText`)가 붙습니다. 좌우 방향키(←·→)로 탭 버튼 사이에서 초점을 옮길 수 있습니다. 방향키는 비활성 탭을 건너뛰고 끝에서 처음으로 돌아가며, Home·End는 첫·마지막 탭으로 갑니다.

<div class="demo vp-raw"><AngularDemo name="tabs/Basic" /></div>

<<< ./demos/tabs/Basic.ts

## 버튼형

`variant="fill"`은 버튼 모양의 탭입니다.

<div class="demo vp-raw"><AngularDemo name="tabs/Fill" /></div>

<<< ./demos/tabs/Fill.ts

## 풀사이즈

`full`을 주면 탭이 전체 폭을 나눠 가집니다.

<div class="demo vp-raw"><AngularDemo name="tabs/Full" /></div>

<<< ./demos/tabs/Full.ts

## 비활성화

항목에 `disabled: true`를 주면 해당 탭을 선택할 수 없습니다.

<div class="demo vp-raw"><AngularDemo name="tabs/Disabled" /></div>

<<< ./demos/tabs/Disabled.ts

## 외부 제어

`[(selected)]`로 선택된 탭의 `id`를 주고받습니다. 탭이 바뀔 때만 알고 싶으면 `(selectedChange)`를 씁니다.

<div class="demo vp-raw"><AngularDemo name="tabs/Controlled" /></div>

<<< ./demos/tabs/Controlled.ts

## API

## KrdsTabs

<ComponentApi name="KrdsTabs" />

## KrdsTabPanel

<ComponentApi name="KrdsTabPanel" />
