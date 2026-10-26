# 메인 메뉴 Main menu

메인 메뉴는 서비스 전체의 구조를 보여주고 주요 화면으로 이동할 수 있게 하는 메뉴이다. 일반적으로 헤더 영역에 위치하며, 데스크탑에서는 메가 메뉴 형태로, 모바일에서는 드로어 형태로 제공된다.

`variant`로 두 형태를 전환합니다(기본 `pc`). 같은 `items`를 PC와 모바일에 함께 쓸 수 있습니다. PC 메가 메뉴는 원본 KRDS처럼 패널을 열면 페이지 전체에 배경 딤(`backdrop`)을 깝니다. 메뉴가 딤 위에 보이려면 헤더(`#krds-header`, `header[krdsHeader]`) 안에 두어야 하며, 헤더 밖에서 쓰면 `[backdrop]="false"`로 끕니다.

메뉴 항목을 누르면 `(itemClick)`으로 항목과 클릭 이벤트를 보냅니다. 라우터로 이동하려면 `event.preventDefault()`로 기본 이동을 막고 라우터로 옮깁니다. PC 패널 안의 링크를 누르면 패널을 닫고 초점을 1단계 메뉴 버튼으로 돌려주므로, 페이지를 새로 읽지 않는 이동에서도 패널이 남지 않습니다.

## PC 메가 메뉴

PC 메가 메뉴는 1024px 이상 화면에서만 표시됩니다. 미리보기는 헤더 밖에 두므로 `[backdrop]="false"`로 배경 딤을 끄고, PC 레이아웃 그대로 보이도록 1024px 폭으로 표시합니다(가로 스크롤). 헤더 안에서 쓰는 예는 [헤더 문서](/components/header)를 참고하세요.

`subItems`가 있는 1단계는 패널을 여는 버튼이 되고, 패널은 링크가 아닌 첫 2단계를 연 채로 보입니다. 2단계의 `items`는 마지막 뎁스 링크 목록이고, `description`이 있으면 설명형 목록으로, `layout: 'between'`이면 배너를 오른쪽에 둡니다. `banner: true`인 패널에는 `<ng-template krdsMainMenuBanner>`로 넣은 배너를 그리며, 템플릿 컨텍스트로 1단계 항목(`let-item`)과 2단계 항목(`let-subItem="subItem"`)을 받습니다. 패널이 열리거나 닫히면 `(menuToggle)`로 1단계 순서와 열림 상태를 보냅니다.

키보드로는 방향키로 같은 단계의 메뉴 버튼 사이를, Home·End로 처음·마지막 1단계 메뉴로 초점을 옮깁니다. Esc를 누르면 패널을 닫고 1단계 메뉴 버튼으로 초점을 돌려주며, 메뉴 밖을 누르거나 초점이 메뉴 밖으로 나가도 닫힙니다.

<div class="demo vp-raw" style="overflow-x: auto"><div style="min-width: 1024px; height: 480px"><AngularDemo name="main-menu/PcMegaMenu" /></div></div>

<<< ./demos/main-menu/PcMegaMenu.ts

## PC 2depth 없는 메뉴

2depth 목록 없이 마지막 뎁스 링크만 나열하는 경우 1단계에 `subItems` 대신 `items`만 지정하면 `single-list` 레이아웃으로 렌더링됩니다. 한 페이지에 메뉴가 여럿이면 `label`(기본 '메인 메뉴')로 이름을 구분합니다.

<div class="demo vp-raw" style="overflow-x: auto"><div style="min-width: 1024px; height: 300px"><AngularDemo name="main-menu/SingleList" /></div></div>

<<< ./demos/main-menu/SingleList.ts

## 모바일 드로어 메뉴

모바일 드로어는 `[(open)]`으로 제어합니다. 외부 트리거 버튼에 `aria-controls`로 `mobileId`(기본 `mobile-nav`)를 연결하고 `aria-expanded`를 함께 관리합니다. 1단계는 탭으로, 누르면 해당 패널 위치로 스크롤합니다. 2단계의 `items`는 펼침 3단계로(`expanded`로 처음 펼침), 3단계의 `items`는 전체 화면 4단계 패널로 렌더링됩니다. 드로어 위쪽 영역은 `krdsMainMenuHeader` 속성을, 아래쪽 영역은 `krdsMainMenuBottom`을 붙인 요소로 넣습니다.

드로어가 열리면 드로어로 초점을 옮기고 Tab 초점을 드로어 안에 가둡니다. 닫기 버튼이나 Esc로 닫으면 드로어를 연 요소로 초점을 돌려줍니다. 4단계 패널은 열면 이전화면 버튼으로 초점을 옮기고, 이전화면·닫기 버튼이나 Esc로 4단계만 닫으면 패널을 연 링크로 초점을 돌려줍니다.

드로어는 화면 전체를 덮는 고정 위치 요소이고 1024px 이상 화면에서는 표시되지 않으므로, 예제를 별도 화면(iframe)에 띄웁니다.

<DemoFrame src="/frame/main-menu/mobile" title="메인 메뉴 모바일 드로어 예제" :height="640" />

<<< ./demos/main-menu/Mobile.ts

## API

## KrdsMainMenu

<ComponentApi name="KrdsMainMenu" />

## KrdsMainMenuBanner

<ComponentApi name="KrdsMainMenuBanner" />

## KrdsMainMenuBottom

<ComponentApi name="KrdsMainMenuBottom" />
