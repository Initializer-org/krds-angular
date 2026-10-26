# 태그 Tag

태그는 키워드 또는 레이블을 사용하여 콘텐츠를 분류하는 수단이다. 콘텐츠 항목에 직접 관련 분류 체계, 데이터 속성을 표시하거나, 목록에서 특정 분류 체계, 데이터 속성을 가진 항목이 선택되었음을 보여주기 위한 태그 그룹으로 사용된다.

## 기본

`<krds-tag>`는 삭제 버튼이 함께 표시되는 태그이고, 삭제 버튼을 누르면 `(remove)`로 클릭 이벤트를 보냅니다. 태그는 `krdsTagGroup`을 붙인 요소로 감쌉니다.

<div class="demo vp-raw"><AngularDemo name="tag/Basic" /></div>

<<< ./demos/tag/Basic.ts

## 사이즈

크기는 감싸는 `krdsTagGroup`의 `size`로 정합니다.

<div class="demo vp-raw"><AngularDemo name="tag/Sizes" /></div>

<<< ./demos/tag/Sizes.ts

## 링크 태그

기본 `<a>`에 `krdsTag`를 붙이면 삭제 버튼 없이 링크로 이동하는 태그가 됩니다. `href`, `target`, `rel`은 기본 속성 그대로 쓰고, 새 창으로 여는 링크는 [새 창 링크](/components/link#새-창-링크)의 `krdsExternal`을 함께 붙입니다.

<div class="demo vp-raw"><AngularDemo name="tag/Link" /></div>

<<< ./demos/tag/Link.ts

## 태그 삭제

삭제 버튼은 태그를 직접 지우지 않으므로, `(remove)`에서 목록을 갱신해 태그를 지웁니다.

<div class="demo vp-raw"><AngularDemo name="tag/Remove" /></div>

<<< ./demos/tag/Remove.ts

## API

## KrdsTag

<ComponentApi name="KrdsTag" />

## KrdsTagGroup

<ComponentApi name="KrdsTagGroup" />
