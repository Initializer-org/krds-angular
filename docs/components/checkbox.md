# 체크박스 Checkbox

체크박스는 사용자가 여러 개의 옵션 중 한 개 이상의 값을 선택할 수 있도록 하는 경우에 사용한다. 즉, 체크박스 옵션의 선택은 상호배타적이므로 한 개의 옵션을 선택하는 것은 다른 옵션의 선택에 영향을 미치지 않는다.

## 기본

`<krds-checkbox>` 안에 기본 `<input type="checkbox">`를 `krdsControl`과 함께 넣고, 그 뒤에 레이블 문구를 씁니다. 컴포넌트가 input 바로 뒤에 label을 만들어 input의 id로 연결합니다 (id를 주지 않으면 자동으로 만듭니다). 선택 상태와 `disabled`는 기본 input 그대로라 `[(ngModel)]`로 `boolean` 값을 연결하고, reactive forms(`formControlName`)와 Signal Forms도 그대로 씁니다.

`description`으로 레이블 아래에 부가 설명을 넣습니다. 묶음은 `krdsCheckArea`로 감싸 가로로 배치하고, `column`을 주면 세로로 배치합니다. 한 질문에 대한 체크박스 여러 개는 `<fieldset krdsCheckArea>`와 `<legend>`로 묶습니다.

<div class="demo vp-raw"><AngularDemo name="checkbox/Basic" /></div>

<<< ./demos/checkbox/Basic.ts

## 사이즈

<div class="demo vp-raw"><AngularDemo name="checkbox/Sizes" /></div>

<<< ./demos/checkbox/Sizes.ts

## Chip

`chip`을 주면 칩 모양으로 표시됩니다. 칩 스타일에서는 `description`을 표시하지 않습니다.

<div class="demo vp-raw"><AngularDemo name="checkbox/Chip" /></div>

<<< ./demos/checkbox/Chip.ts

## API

## KrdsCheckbox

<ComponentApi name="KrdsCheckbox" />

## KrdsCheckArea

<ComponentApi name="KrdsCheckArea" />

## KrdsControl

<ComponentApi name="KrdsControl" />
