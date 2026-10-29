# 모달 Modal

모달은 대화창의 한 종류로 기본 창에 종속된 요소이다. 기본 창과 겹쳐져 가장 상단에 표시되며, 이때 기본 창은 비활성 상태로 전환되어 상호작용이 불가능하므로 사용자는 모달에서의 단일한 과업 또는 메시지에 집중할 수 있다.

## 기본

`[(open)]`으로 열림 상태를 제어하고, 대화 상자의 이름이 되는 제목은 `heading`으로 줍니다. 아래쪽 버튼은 `<div krdsModalFooter>`로 감싸 넣습니다. 모달은 다른 요소의 쌓임 순서에 가리지 않도록 `body` 끝으로 옮겨 그립니다.

열리면 모달 안으로 초점이 이동하고 Tab 키 초점이 모달 안에서 순환하며, 배경 페이지는 스크롤되지 않습니다. Esc 키, 배경 클릭, 닫기(X) 버튼으로 닫을 수 있고, 닫히면 모달을 연 버튼으로 초점이 돌아갑니다.

<div class="demo vp-raw"><AngularDemo name="modal/Basic" /></div>

<<< ./demos/modal/Basic.ts

## 사이즈

`size`로 `small`, `medium`(기본), `large` 중 하나를 고릅니다.

<div class="demo vp-raw"><AngularDemo name="modal/Sizes" /></div>

<<< ./demos/modal/Sizes.ts

## 배경 없음

`[backdrop]="false"`면 배경을 어둡게 하지 않습니다.

<div class="demo vp-raw"><AngularDemo name="modal/NoBackdrop" /></div>

<<< ./demos/modal/NoBackdrop.ts

## 풀팝업

`full`을 주면 화면 전체를 덮는 풀팝업으로 표시됩니다.

<div class="demo vp-raw"><AngularDemo name="modal/Full" /></div>

<<< ./demos/modal/Full.ts

## 바텀시트

`bottomSheet`를 주면 화면 아래에서 올라오는 바텀시트로 표시됩니다. KRDS는 바텀시트를 모바일 화면에서 쓰도록 안내합니다.

<div class="demo vp-raw"><AngularDemo name="modal/BottomSheet" /></div>

<<< ./demos/modal/BottomSheet.ts

## Persistent

중요한 결정을 받아야 할 때 `persistent`를 주면 배경 클릭과 Esc 키로 닫히지 않고, 닫기(X) 버튼과 직접 둔 버튼으로만 닫힙니다.

<div class="demo vp-raw"><AngularDemo name="modal/Persistent" /></div>

<<< ./demos/modal/Persistent.ts

## API

## KrdsModal

<ComponentApi name="KrdsModal" />

## KrdsModalFooter

<ComponentApi name="KrdsModalFooter" />
