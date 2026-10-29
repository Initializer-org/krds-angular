# 콘텐츠 내 탐색 In-page navigation

콘텐츠 내 탐색은 사용자가 본문의 구조를 훑어보고 원하는 콘텐츠로 빠르게 이동할 수 있도록 하는 탐색 수단이다. 화면을 스크롤 할 때 특정 위치에 고정되어 콘텐츠의 목차 역할을 하는 동시에 사용자가 페이지 내 탐색에서 특정 항목을 클릭하면 연결된 섹션으로 스크롤 된다.

## 기본

`items`로 같은 페이지 섹션의 `#id`와 문구를 줍니다. 위쪽 머리 문구는 `caption`(기본 '이 페이지의 구성'), 페이지 제목은 `heading`으로 주고, 아래쪽 버튼 영역은 `krdsInPageAction`을 붙인 요소로 넣습니다. 목록은 `caption`(없으면 `heading`)으로 이름 붙인 내비게이션 영역(`nav`)입니다.

`#id` 항목을 누르면 고정 헤더(`headerTopSelector`, `headerInnerSelector`) 높이만큼 비켜 해당 섹션으로 부드럽게 스크롤하고, 키보드(Enter·Space)로 고르면 그 섹션의 제목으로 초점을 옮겨 이어서 읽게 합니다. `autoActive`(기본 켬)면 창 스크롤 위치에 따라 현재 섹션 항목을 `aria-current`로 표시하고, 끄면 항목의 `active`를 그대로 표시합니다. 누른 항목은 `(itemClick)`으로 받습니다.

화면에 고정되고 창 스크롤에 맞춰 현재 섹션을 표시하므로 예제를 별도 화면(iframe)에 띄웁니다. 768px 이상 화면에서는 본문 오른쪽에 고정되고 그보다 좁으면 본문 위에 표시됩니다. 이 예제는 800px 폭 화면을 축소해 보여 줍니다. KRDS 레이아웃(`#container.krds-in-page-navigation-type > .inner.in-between > .contents`) 안에 배치해야 합니다.

<DemoFrame src="/frame/in-page-navigation/basic" title="콘텐츠 내 탐색 기본 예제" :height="620" :width="800" />

<<< ./demos/in-page-navigation/Basic.ts

## API

## KrdsInPageNavigation

<ComponentApi name="KrdsInPageNavigation" />

## KrdsInPageAction

<ComponentApi name="KrdsInPageAction" />
