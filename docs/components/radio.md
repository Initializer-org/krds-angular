# 라디오 버튼 Radio button

라디오 버튼은 사용자가 여러 개의 옵션 중 하나만 선택할 수 있도록 하는 경우에 사용한다. 즉, 라디오 버튼 옵션의 선택은 상호배타적이므로 한 개의 옵션을 선택하면 다른 옵션은 자동으로 선택 해제된다.

## 기본

`<krds-radio>` 안에 기본 `<input type="radio">`를 `krdsControl`과 함께 넣고, 그 뒤에 레이블 문구를 씁니다. 컴포넌트가 input 바로 뒤에 label을 만들어 input의 id로 연결합니다 (id를 주지 않으면 자동으로 만듭니다). 선택 상태·`name`·`value`·`disabled`는 기본 input 그대로라 `[(ngModel)]`, reactive forms, Signal Forms를 그대로 씁니다. 같은 그룹의 라디오는 같은 `name`과 모델을 쓰고, 선택한 라디오의 `value`가 모델 값이 됩니다.

`description`으로 레이블 아래에 부가 설명을 넣습니다. 묶음은 `krdsCheckArea`로 감싸 가로로 배치하고, `column`을 주면 세로로 배치합니다. 한 질문에 대한 라디오 묶음은 `<fieldset krdsCheckArea>`와 `<legend>`로 묶어 화면낭독기에 질문을 알립니다 (KRDS 스타일에서 `legend`는 화면에 보이지 않습니다).

<div class="demo vp-raw"><AngularDemo name="radio/Basic" /></div>

<<< ./demos/radio/Basic.ts

## API

## KrdsRadio

`KrdsRadio`는 `KrdsCheckbox`와 같은 컴포넌트입니다 (마크업이 같아 선택자 `krds-radio`를 함께 씁니다).

<ComponentApi name="KrdsCheckbox" />

## KrdsCheckArea

<ComponentApi name="KrdsCheckArea" />

## KrdsControl

<ComponentApi name="KrdsControl" />
