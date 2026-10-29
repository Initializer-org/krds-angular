# 텍스트 목록 Text list

텍스트 목록은 계층 구조가 있는 텍스트 블록을 읽기 쉽게 구성한 것이다.

## 기본 (대시)

기본 `<ul>`·`<ol>`에 `krdsTextList`를 붙이고, `variant`로 글머리 스타일(`dash` 기본, `hollow`, `decimal`, `ordered`)을 정합니다. 항목(`<li>`) 안에 `krdsTextList` 목록을 넣어 3단계까지 중첩합니다.

<div class="demo vp-raw"><AngularDemo name="text-list/Basic" /></div>

<<< ./demos/text-list/Basic.ts

## 순서 있는 목록

`variant="ordered"`는 번호를 자동으로 붙이지 않으므로 항목마다 `<span class="num">`으로 번호를 직접 씁니다.

<div class="demo vp-raw"><AngularDemo name="text-list/Ordered" /></div>

<<< ./demos/text-list/Ordered.ts

## API

## KrdsTextList

<ComponentApi name="KrdsTextList" />
