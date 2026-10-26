# 툴팁 Tooltip

툴팁은 요소나 본문 텍스트에 제공되는 짧은 부가 설명이다. 설명이 필요한 대상 또는 별도의 활성화 버튼에 마우스를 올리거나 초점을 이동했을 때 설명 텍스트가 표시된다.

## 기본

`content`로 설명을 주고, 버튼 글자는 요소 안에 넣습니다. `type`으로 트리거 버튼 모양(`default`, `icon`, `button`)을 정합니다. 버튼에 마우스를 올리거나 초점을 주면 툴팁이 버튼 옆에 표시되고, 마우스나 초점이 떠나거나 Esc 키, 창 스크롤, 화면 크기 변경으로 닫힙니다. 버튼이 화면 오른쪽 절반에 있으면 왼쪽에, 아니면 오른쪽에 표시하고, 768px 이하 화면에서는 버튼 위나 아래에 표시합니다.

버튼의 접근 가능한 이름은 버튼 글자와 설명을 합친 것(`aria-labelledby`)이라, 아이콘만 있는 버튼도 설명으로 이름을 얻습니다.

<div class="demo vp-raw"><AngularDemo name="tooltip/Basic" /></div>

<<< ./demos/tooltip/Basic.ts

## 세로 배치 (vertical)

`vertical`을 지정하면 툴팁이 버튼 위나 아래에 표시됩니다.

<div class="demo vp-raw"><AngularDemo name="tooltip/Vertical" /></div>

<<< ./demos/tooltip/Vertical.ts

## 박스형 (box)

`box`를 지정하면 여러 줄 설명에 맞는 박스형 툴팁이 버튼 위나 아래에 표시됩니다.

<div class="demo vp-raw"><AngularDemo name="tooltip/Box" /></div>

<<< ./demos/tooltip/Box.ts

## API

## KrdsTooltip

<ComponentApi name="KrdsTooltip" />
