# 페이지네이션 Pagination

페이지네이션은 많은 양의 콘텐츠를 탐색하기 쉽도록 여러 화면에 나누고, 분할된 화면을 탐색하는 데 사용되는 요소이다.

## 기본

`<nav>`에 `krdsPagination`을 붙이고 `[(page)]`로 현재 페이지를, `max`로 마지막 페이지를 지정합니다. `label`(기본 '페이지 내비게이션')로 이름 붙인 내비게이션 영역(`nav`)이라, 한 페이지에 내비게이션이 여럿이어도 화면낭독기가 구분합니다. 처음과 마지막 페이지는 늘 보이고, 페이지를 모두 보일 수 없으면 현재 페이지 주변의 `pageRange`개만 보인 채 나머지를 생략 표시로 줄입니다. 페이지 링크를 눌러도 주소는 바뀌지 않고 `page`만 바뀝니다.

<div class="demo vp-raw"><AngularDemo name="pagination/Basic" /></div>

<<< ./demos/pagination/Basic.ts

## API

## KrdsPagination

<ComponentApi name="KrdsPagination" />
