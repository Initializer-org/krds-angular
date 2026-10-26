# 텍스트 입력 필드 Text input

텍스트 입력 필드는 사용자가 키보드로 글자, 숫자, 기호 등이 조합된 한 줄의 짧은 텍스트를 입력하는 경우에 사용하는 요소이다.

## 기본

기본 `<input>`에 `krdsInput`을 붙이고 [폼 그룹](/components/form-group)(`<krds-form-group>`)으로 감싸 레이블과 도움말을 붙입니다. `type`, `placeholder`, `maxlength`, `required`, `readonly`, `disabled`는 기본 속성 그대로 쓰고, 값은 `[(ngModel)]`, `formControlName`, `[formField]`로 받습니다.

<div class="demo vp-raw"><AngularDemo name="input/Basic" /></div>

<<< ./demos/input/Basic.ts

## 상태

폼 그룹의 `state`를 `error`·`success`·`information`으로 지정하면 도움말이 그 상태의 메시지 스타일로 바뀝니다. `error`일 때는 입력 필드 테두리도 에러 색으로 바뀌고 입력 요소에 `aria-invalid="true"`가 붙습니다.

<div class="demo vp-raw"><AngularDemo name="input/States" /></div>

<<< ./demos/input/States.ts

## 사이즈

`size`로 `small`·`medium`·`large`·`xlarge` 중 하나를 고릅니다. 지정하지 않으면 `large` 크기입니다.

<div class="demo vp-raw"><AngularDemo name="input/Sizes" /></div>

<<< ./demos/input/Sizes.ts

## 로딩

폼 그룹에 `loading`을 지정하면 입력 필드 안에 스피너가 표시됩니다.

<div class="demo vp-raw"><AngularDemo name="input/Loading" /></div>

<<< ./demos/input/Loading.ts

## 아이콘 버튼

폼 그룹에 `withButton`을 지정하고 입력 요소 뒤에 버튼을 넣으면 입력 필드 안쪽에 버튼이 배치됩니다. 보이는 텍스트가 없으므로 `sr-only` 텍스트로 버튼 이름을 제공합니다. 비밀번호 보기 전환이나 내용 삭제 같은 버튼 동작은 컴포넌트가 처리하지 않으므로 직접 구현합니다. 버튼이 여러 개면 `<div class="btn-group">`으로 묶습니다.

내용 삭제 버튼은 `btn-delete-input` 클래스를 붙이고 폼 그룹에 `deleteButton`을 지정하면 값이 있을 때만 보입니다. 값이 비었는지를 CSS(`:placeholder-shown`)로 판단하므로 입력 요소에 `placeholder`가 있어야 합니다. 버튼을 누르면 버튼이 사라지므로 초점을 입력 필드로 옮겨 줍니다.

<div class="demo vp-raw"><AngularDemo name="input/IconButtons" /></div>

<<< ./demos/input/IconButtons.ts

## API

## KrdsInput

<ComponentApi name="KrdsInput" />

## KrdsFormGroup

<ComponentApi name="KrdsFormGroup" />
