# 헤더 Header

헤더는 웹사이트의 상단 헤더 영역을 구성하는 컴포넌트이다.
유틸리티 메뉴, 브랜딩 영역, 네비게이션 메뉴를 내용으로 넣어 유연하게 구성할 수 있다.
네비게이션 자리에는 KrdsMainMenu 등 완성된 메뉴 컴포넌트를 그대로 넣는다.

## 기본

기본 `<header>`(banner 랜드마크)에 `krdsHeader`를 붙이고, 안에 넣은 요소를 KRDS 헤더 구조로 배치합니다. `krdsHeaderUtility`를 붙인 요소에는 유틸리티 메뉴를, `krdsHeaderBranding`을 붙인 요소에는 로고와 주요 버튼을 KRDS 헤더 마크업 그대로 넣습니다. PC 메인 메뉴(`<krds-main-menu>`)는 그냥 넣고, 모바일 드로어(`<krds-main-menu variant="mobile">`)에는 `krdsHeaderMobile` 속성을 붙입니다. 유틸리티 메뉴의 드롭다운은 `krdsDropdown`을 KRDS 드롭다운 마크업에 붙여 엽니다(언어 변경 문서의 드롭다운 참고).

헤더는 화면 상단에 고정(sticky)되고 메인 메뉴를 열면 화면 전체에 배경 딤이 깔리므로 예제를 별도 화면(iframe)에 띄웁니다. 예제는 1024px 폭 화면을 축소해 PC 레이아웃으로 보여 줍니다.

<DemoFrame src="/frame/header/basic" title="헤더 기본 예제" :height="480" :width="1024" />

<<< ./demos/header/Basic.ts

## 모바일

1024px 미만 화면에서는 유틸리티 메뉴와 PC 메인 메뉴가 숨겨지고 전체메뉴 버튼이 표시됩니다. 전체메뉴 버튼의 `aria-controls`를 모바일 드로어 id(`KrdsMainMenu`의 `mobileId`, 기본값 `mobile-nav`)에 연결하고 `[(open)]`으로 드로어를 엽니다. 드로어는 열리면 초점을 안으로 옮기고, 닫히면 연 버튼으로 돌려줍니다. 아래는 같은 예제를 문서 폭(1024px 미만) 그대로 띄운 것으로, 전체메뉴 버튼으로 드로어를 확인할 수 있습니다.

<DemoFrame src="/frame/header/basic" title="헤더 모바일 예제" :height="640" />

## API

## KrdsHeader

<ComponentApi name="KrdsHeader" />

## KrdsHeaderUtility

<ComponentApi name="KrdsHeaderUtility" />

## KrdsHeaderBranding

<ComponentApi name="KrdsHeaderBranding" />

## KrdsMainMenu

<ComponentApi name="KrdsMainMenu" />
