# 표 Table

표는 데이터를 하나 이상의 행과 열로 조직화하여 표현하는 형식으로 사용자가 빠르게 많은 양의 정보를 확인하고 비교할 수 있도록 도와준다. 기본적으로 대화형 요소가 아니기 때문에 열 제목에 데이터를 정렬하기 위한 컨트롤 요소가 포함된 상황 외에 행 전체나 데이터 셀이 대화형으로 작동하지 않는다.

## 기본 테이블

`columns`로 열을, `rows`로 행 데이터를 정의합니다. 열의 `field`는 행의 속성 이름이나 행에서 값을 만드는 함수입니다. 각 행의 첫 번째 셀은 행 제목(`th scope="row"`)으로 렌더되고, `headerStyle`의 `width`는 `colgroup`의 열 너비로도 쓰입니다. KRDS 표 스타일은 `<table>`에 `data` 클래스가 있을 때 적용되므로 원본 KRDS 마크업처럼 `tableClass="col data"`를 지정합니다. `caption`은 화면에 보이지 않고 화면낭독기로 읽히므로 표의 구성을 설명하는 문장으로 씁니다.

<div class="demo vp-raw"><AngularDemo name="table/Basic" /></div>

<<< ./demos/table/Basic.ts

## 행 클릭

`clickable`을 줄 때만 행이 초점을 받고(`tabindex="0"`) 클릭이나 Enter·Space 키로 선택되며, `(rowClick)`으로 행과 순서(`{ row, index }`)를 받습니다. 셀 안의 링크·버튼·폼 요소(`label` 포함)를 누른 것은 행 선택으로 보지 않습니다. `clickable`이 없으면 행은 대화형으로 동작하지 않습니다.

<div class="demo vp-raw"><AngularDemo name="table/RowClick" /></div>

<<< ./demos/table/RowClick.ts

## 스타일 & 클래스 기능

열마다 헤더 셀에는 `headerStyle`·`headerClasses`를, 바디 셀에는 `style`·`classes`를 지정합니다. 바디 셀의 `style`·`classes`는 행 데이터를 받는 함수로도 줄 수 있습니다. `align`을 지정하면 헤더와 바디 셀에 `text-<align>` 클래스가 붙습니다. 클래스의 스타일은 앱의 CSS에서 정의합니다.

<div class="demo vp-raw"><AngularDemo name="table/StyleAndClass" /></div>

<<< ./demos/table/StyleAndClass.ts

## 셀 템플릿

배지·버튼·체크박스처럼 글자가 아닌 내용은 열 이름(`name`)을 준 템플릿으로 그립니다. `<ng-template krdsCell="열 이름">`은 본문 셀 내용을 바꾸고 `let-row`(행), `let-value="value"`(`field`로 꺼낸 값), `let-column="column"`, `let-index="index"`를 받습니다. `<ng-template krdsHeader="열 이름">`은 헤더 셀 내용을 바꿔 화면에 숨긴 열 제목 등에 씁니다. 셀 태그(첫 열은 `th scope="row"`)와 `style`·`classes`는 그대로 유지되고, 템플릿으로만 그리는 열은 `field`를 생략합니다. 버튼처럼 같은 이름이 행마다 반복되면 숨김 텍스트로 어느 행의 버튼인지 알려 줍니다.

템플릿 안의 `row`는 `object`, `value`는 `unknown` 타입이므로 행의 속성을 쓰려면 예제의 `titleOf`처럼 행 타입으로 바꿔 씁니다.

<div class="demo vp-raw"><AngularDemo name="table/CellTemplate" /></div>

<<< ./demos/table/CellTemplate.ts

## 빈 데이터 (기본)

`rows`가 비어 있으면 모든 열을 합친 셀에 "데이터가 없습니다."를 표시합니다.

<div class="demo vp-raw"><AngularDemo name="table/NoData" /></div>

<<< ./demos/table/NoData.ts

## 빈 데이터 (커스텀 템플릿)

`<ng-template krdsNoData>`로 빈 상태 내용을 바꿉니다.

<div class="demo vp-raw"><AngularDemo name="table/NoDataTemplate" /></div>

<<< ./demos/table/NoDataTemplate.ts

## API

## KrdsTable

<ComponentApi name="KrdsTable" />

## KrdsTableCell

<ComponentApi name="KrdsTableCell" />

템플릿에서 받는 변수입니다.

| 템플릿 변수           | 타입              | 설명                 |
| --------------------- | ----------------- | -------------------- |
| `let-row`             | `object`          | 행                   |
| `let-value="value"`   | `unknown`         | `field`로 꺼낸 셀 값 |
| `let-column="column"` | `KrdsTableColumn` | 열                   |
| `let-index="index"`   | `number`          | 행 순서 (0부터)      |

## KrdsTableHeader

<ComponentApi name="KrdsTableHeader" />

`let-column`으로 열(`KrdsTableColumn`)을 받습니다.

## KrdsTableNoData

<ComponentApi name="KrdsTableNoData" />
