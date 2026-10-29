# 사이드 메뉴 Side navigation

사이드 메뉴는 서브 화면 내에서의 이동을 위해 사용하는 메뉴이다. 일반적으로 본문 영역의 좌측에 사이드바 형태로 제공된다. 메인 메뉴보다 훨씬 좁고 깊은 페이지 구조 탐색에 사용되기 때문에 링크의 개수가 많고 복잡하게 표현되기 쉽다.

## 기본

`<nav>`에 `krdsSideNavigation`을 붙이고, 메뉴 제목은 `heading`으로, 메뉴 이름은 `aria-label`로 줍니다. 메뉴 항목 배열은 `[(items)]`로 주고받습니다. 2Depth의 `subItems`는 펼침 목록으로, 3Depth의 `subItems`는 4Depth 팝업으로 렌더링됩니다. 펼침 상태는 각 항목의 `expanded`로, 처음 값을 주면 그대로 펼쳐지고 사용자가 펼치고 접으면 바뀐 배열이 `items`로 돌아옵니다. 2Depth를 접으면 그 안의 팝업도 닫힙니다.

4Depth 팝업을 열면 팝업 제목으로 초점이 옮겨 가고, 제목을 눌러 닫으면 팝업을 연 버튼으로 초점이 돌아옵니다. Tab으로 팝업을 벗어나거나 팝업 밖을 누르면 팝업이 닫히고, 초점은 옮겨 간 곳에 그대로 둡니다.

<div class="demo vp-raw"><AngularDemo name="side-navigation/Basic" /></div>

<<< ./demos/side-navigation/Basic.ts

## 2Depth 링크

`subItems`가 없는 2Depth 항목은 링크로 렌더링됩니다. 링크를 누르면 `(itemClick)`으로 항목과 클릭 이벤트를 보내므로, 라우터로 이동하거나 다른 동작을 하려면 `event.preventDefault()`로 기본 이동을 막습니다. 3Depth·4Depth 링크도 같습니다.

<div class="demo vp-raw"><AngularDemo name="side-navigation/TwoDepthLink" /></div>

<<< ./demos/side-navigation/TwoDepthLink.ts

## 여러 개 배치

한 페이지에 여러 개를 두어도 내부 id는 겹치지 않습니다. `aria-label`로 각 메뉴를 구분합니다.

<div class="demo vp-raw"><AngularDemo name="side-navigation/Multiple" /></div>

<<< ./demos/side-navigation/Multiple.ts

## API

## KrdsSideNavigation

<ComponentApi name="KrdsSideNavigation" />
