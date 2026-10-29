# 패널 Panel

패널은 본문 콘텐츠의 섹션이나 일부 요소에 대한 개념/용어 설명, 옵션의 구성, 이용 방법 등과 관련된 정보나 도움말, 따라하기 콘텐츠를 제공하는 사이드 패널이다.

## 기본

`[(open)]`으로 펼침 상태를 주고받습니다. 도움말 버튼으로 열고 접어두기 버튼으로 닫으며, 패널 안에 초점이 있었다면 닫을 때 도움말 버튼으로 돌려줍니다. 도움말 버튼과 패널이 화면 오른쪽에 고정(`position: fixed`)되므로 예제를 별도 화면(iframe)에 띄웁니다. 예제는 1024px 폭 화면을 축소해 보여 줍니다. 1024px 미만 화면에서는 패널이 화면 폭에서 3rem을 뺀 너비로 열리고 뒤 배경이 어두워집니다.

<DemoFrame src="/frame/panel/basic" title="패널 기본 예제" :height="480" :width="1024" />

<<< ./demos/panel/Basic.ts

공식 배너(`#krds-masthead`)와 헤더(`#krds-header .header-in`)가 보이면 그 높이만큼 도움말 버튼과 패널 내용을 내려 헤더에 가려지지 않게 합니다. 선택자가 다르면 `headerTopSelector`, `headerInnerSelector`로 지정합니다.

## 도움 패널

패널 안에 `<krds-tabs>`를 넣고, 탭마다 `<ng-template krdsTabPanel="탭 id">`로 도움 탭과 따라하기 탭의 내용을 넣습니다.

<DemoFrame src="/frame/panel/help" title="도움 패널 예제" :height="560" :width="1024" />

<<< ./demos/panel/Help.ts

## 따라하기 패널

`<krds-tabs>`의 `[(selected)]`를 `tutorial`로 지정해 따라하기 탭이 먼저 보이게 합니다.

<DemoFrame src="/frame/panel/tutorial" title="따라하기 패널 예제" :height="560" :width="1024" />

<<< ./demos/panel/Tutorial.ts

## API

## KrdsPanel

<ComponentApi name="KrdsPanel" />

## KrdsTabs

<ComponentApi name="KrdsTabs" />

## KrdsTabPanel

<ComponentApi name="KrdsTabPanel" />
