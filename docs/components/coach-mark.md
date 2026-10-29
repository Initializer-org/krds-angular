# 코치마크 Coach mark

코치마크는 사용자에게 새로 도입된 기능을 안내하거나, 여러 단계를 거쳐 수행해야 하는 복잡한 과업을 사용자가 보다 쉽게 완료할 수 있도록 세부 수행 단계별로 고맥락적 도움말을 제공하는 컴포넌트이다.

## 기본

단계마다 안내할 영역을 `<krds-coach-mark>`로 감싸고, 전체 단계(`steps`), 이 코치마크의 단계 번호(`step`, 1부터), 같은 `[(current)]`를 연결합니다. `current`가 `step`과 같은 코치마크에만 말풍선이 표시되며, 다음으로·이전으로 버튼이 `current`를 바꾸고 그만보기 버튼은 `(closed)`를 보냅니다. 첫 단계에는 이전으로, 마지막 단계에는 다음으로 버튼이 없습니다. 다음으로·이전으로를 누르면 새 단계의 말풍선 제목으로 초점이 옮겨 갑니다. 말풍선은 대상 요소 위쪽에 표시되므로 위에 여백을 둡니다.

안내 중인 영역은 KRDS 클래스로 강조합니다. 영역은 코치마크에 `txt-box`, 버튼은 그 버튼에 `coach-btn`을 현재 단계일 때만 붙입니다.

<div class="demo vp-raw"><AngularDemo name="coach-mark/Basic" /></div>

<<< ./demos/coach-mark/Basic.ts

## API

## KrdsCoachMark

<ComponentApi name="KrdsCoachMark" />
