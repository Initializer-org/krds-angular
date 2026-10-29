# 텍스트 영역 Textarea

텍스트 영역은 사용자가 키보드로 글자, 숫자, 기호 등이 조합된 여러 줄의 텍스트를 입력하는 경우에 사용하는 요소이다.

## 기본

기본 `<textarea>`에 `krdsInput`을 붙입니다. [텍스트 입력 필드](/components/input)와 같은 디렉티브라 [폼 그룹](/components/form-group) 안에서 레이블·도움말이 연결되고, 값은 `[(ngModel)]`, `formControlName`, `[formField]`로 받습니다.

글자 수를 표시하려면 `<krds-textarea>`로 감싸고 현재 글자 수를 `count`로 넘깁니다. `max`를 주면 최대 글자 수도 함께 표시됩니다. `max`는 표시만 하므로 입력 제한은 `maxlength`로 겁니다. 글자 수 표시가 필요 없으면 `<krds-textarea>` 없이 `<textarea krdsInput>`만 씁니다.

KRDS 스타일은 텍스트 영역의 크기 조절을 막아 둡니다(`resize: none`). 사용자가 높이를 조절하게 하려면 `style="resize: vertical"`처럼 직접 지정합니다.

<div class="demo vp-raw"><AngularDemo name="textarea/Basic" /></div>

<<< ./demos/textarea/Basic.ts

## API

## KrdsTextarea

<ComponentApi name="KrdsTextarea" />

## KrdsInput

<ComponentApi name="KrdsInput" />
