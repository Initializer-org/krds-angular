# 셀렉트 Select

셀렉트는 사용자에게 여러 개의 옵션 목록을 팝업으로 제공하여 그 중 한 개의 값을 선택할 수 있도록 하는 경우에 사용한다.

## 기본

기본 `<select>`에 `krdsSelect`를 붙입니다. 옵션·선택 값·`disabled`·`required`는 기본 요소 그대로라 `<option>`을 직접 넣고 `[(ngModel)]`, reactive forms, Signal Forms로 값을 연결합니다. 선택 전 안내 문구는 `<option value="" disabled>선택</option>`으로 넣습니다.

폼 그룹(`<krds-form-group>`) 안에 넣으면 `label`이 셀렉트에 연결되고, `hint`는 `aria-describedby`로 연결됩니다.

<div class="demo vp-raw"><AngularDemo name="select/Basic" /></div>

<<< ./demos/select/Basic.ts

## 사이즈

`size`로 크기를 정합니다.

<div class="demo vp-raw"><AngularDemo name="select/Sizes" /></div>

<<< ./demos/select/Sizes.ts

## 정렬 스타일

`sort`를 주면 목록의 정렬 기준처럼 보이는, 레이블 없이 쓰는 셀렉트가 됩니다. 보이는 레이블이 없으므로 `aria-label`로 이름을 줍니다.

<div class="demo vp-raw"><AngularDemo name="select/Sort" /></div>

<<< ./demos/select/Sort.ts

## 에러 상태

폼 그룹의 `state="error"`는 셀렉트에 오류 테두리와 `aria-invalid="true"`를 붙이고, `hint`를 오류 문구로 표시합니다. 폼 그룹 없이 테두리만 바꾸려면 셀렉트의 `state`를 씁니다 (이때 `aria-invalid`는 직접 붙입니다).

<div class="demo vp-raw"><AngularDemo name="select/Error" /></div>

<<< ./demos/select/Error.ts

## API

## KrdsSelect

<ComponentApi name="KrdsSelect" />
