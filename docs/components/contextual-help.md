# 맥락적 도움말 Contextual help

컴포넌트 주변에 배치되어 해당 컴포넌트의 상태나 관련된 상세 정보를 제공하는 컴포넌트이다. 맥락적 도움말은 정보 아이콘이나 도움 아이콘 버튼을 통해 사용자가 요청하는 경우에만 화면에 표시된다.

## 기본

`heading`으로 도움말 제목을 주고, 설명과 링크는 요소 안에 넣습니다. 아이콘 버튼을 누르면 도움말이 열리고 그 안의 첫 번째 링크나 버튼으로 포커스가 이동합니다. 닫기 버튼, Esc 키, 바깥 클릭, 아이콘 버튼을 다시 누르는 것으로 닫고, 닫기 버튼과 Esc 키로 닫으면 포커스가 아이콘 버튼으로 돌아옵니다. 도움말은 제목으로 이름 붙인 대화 상자(`role="dialog"`)라 화면낭독기가 제목과 함께 읽고, 아이콘 버튼은 `aria-expanded`로 열림 상태를 알립니다. 도움말 하나를 열면 열려 있던 다른 도움말은 닫힙니다.

<div class="demo vp-raw"><AngularDemo name="contextual-help/Basic" /></div>

<<< ./demos/contextual-help/Basic.ts

## 위치

`position`으로 도움말이 열리는 위치를 지정합니다. 기본값은 `top left`입니다. 768px 이하 화면에서는 도움말을 화면 폭에 맞춰 펼칩니다.

<div class="demo vp-raw"><AngularDemo name="contextual-help/Positions" /></div>

<<< ./demos/contextual-help/Positions.ts

## 도움말 아이콘

`helpIcon`을 지정하면 정보 아이콘 대신 도움(물음표) 아이콘을 표시합니다.

<div class="demo vp-raw"><AngularDemo name="contextual-help/HelpIcon" /></div>

<<< ./demos/contextual-help/HelpIcon.ts

## API

## KrdsContextualHelp

<ComponentApi name="KrdsContextualHelp" />
