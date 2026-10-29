# 폼 그룹 Form group

`<krds-form-group>`은 입력 요소 하나와 그 레이블·도움말을 묶는 `.form-group` 영역입니다. 안에 넣은 입력 요소(`krdsInput`·`krdsSelect`·`krdsControl`)에 레이블과 도움말을 자동으로 연결합니다. [텍스트 입력 필드](/components/input), [텍스트 영역](/components/textarea), [셀렉트](/components/select), [날짜 입력 필드](/components/date-input) 등과 함께 씁니다.

## 기본

`label`은 입력 필드 위의 레이블(`.form-tit` 안의 `<label>`), `hint`는 입력 필드 아래의 도움말(`<p>`)이 됩니다. 레이블의 `for`는 안에 넣은 입력 요소의 `id`로, 도움말은 입력 요소의 `aria-describedby`로 연결됩니다. 입력 요소의 `id`는 자동으로 만들어지고, 직접 정하려면 입력 요소에 `id`를 줍니다.

입력 요소는 기본 요소 그대로라 값과 검증은 `[(ngModel)]`, reactive forms(`formControlName`), Signal Forms(`[formField]`)로 다룹니다.

<div class="demo vp-raw"><AngularDemo name="form-group/Basic" /></div>

<<< ./demos/form-group/Basic.ts

::: tip
폼 그룹은 입력 요소 하나를 위한 묶음입니다. [체크박스](/components/checkbox)·[라디오 버튼](/components/radio) 여러 개는 `<fieldset krdsCheckArea>`와 `<legend>`로 묶습니다.
:::

## 도움말 유형

`state`를 `error`·`success`·`information`으로 지정하면 도움말이 각각 에러·성공·정보 메시지 스타일로 표시됩니다(기본값 `default`). `error`일 때는 입력 필드 테두리도 에러 색으로 바뀌고 입력 요소에 `aria-invalid="true"`가 붙습니다.

<div class="demo vp-raw"><AngularDemo name="form-group/HintTypes" /></div>

<<< ./demos/form-group/HintTypes.ts

## 검증 결과 보여 주기

폼 그룹은 검증하지 않습니다. 폼 라이브러리의 검증 결과로 `state`와 `hint`를 정합니다. 아래 예제는 Signal Forms로 검증하고, 입력 필드를 한 번 떠난 뒤부터 오류 메시지를 보여 줍니다.

<div class="demo vp-raw"><AngularDemo name="form-group/Validation" /></div>

<<< ./demos/form-group/Validation.ts

## 입력 필드 안 버튼과 로딩

`withButton`·`deleteButton`으로 입력 필드 안에 버튼을 두고, `loading`으로 스피너를 표시합니다. 예제는 [텍스트 입력 필드](/components/input)에 있습니다.

## API

## KrdsFormGroup

<ComponentApi name="KrdsFormGroup" />
