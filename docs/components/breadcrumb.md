# 브레드크럼 Breadcrumb

브레드크럼은 탐색 계층 구조를 표시하여 사용자가 현재 위치를 파악하고 계층 구조의 수준을 이동할 수 있게 해준다. 브레드크럼을 통해 사용자는 탐색 중인 화면의 상위 수준 화면으로 이동할 수 있다.

## 기본

`<nav>`에 `krdsBreadcrumb`를 붙이고 `items`로 경로를 줍니다. 첫 항목은 홈 아이콘과 함께 표시되고(`showHomeIcon`), 마지막 항목은 현재 페이지(`aria-current="page"`)로 표시됩니다. 내비게이션 이름은 `label`(기본 '현재 경로')로 바꿉니다.

항목을 누르면 `(itemClick)`으로 항목과 클릭 이벤트를 보냅니다. 라우터로 이동하려면 `event.preventDefault()`로 기본 이동을 막고 라우터로 옮깁니다.

<div class="demo vp-raw"><AngularDemo name="breadcrumb/Basic" /></div>

<<< ./demos/breadcrumb/Basic.ts

## API

## KrdsBreadcrumb

<ComponentApi name="KrdsBreadcrumb" />
