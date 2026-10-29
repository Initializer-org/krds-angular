# 스피너 Spinner

스피너는 화면이나 요소의 다양한 처리 상태를 시각적으로 표시한 것으로 화면 전체나 일부 요소에 접근하기 위해 일정 시간 동안 대기해야 함을 사용자에게 안내한다.

## 기본

스피너는 부모 요소의 너비와 높이를 채우고 가운데에 표시됩니다. `role="status"`와 화면낭독기용 "로딩 중" 텍스트가 함께 렌더링됩니다.

<div class="demo vp-raw"><AngularDemo name="spinner/Basic" /></div>

<<< ./demos/spinner/Basic.ts

## 라벨 포함

`label`로 스피너 옆에 안내 문구를 표시합니다.

<div class="demo vp-raw"><AngularDemo name="spinner/WithLabel" /></div>

<<< ./demos/spinner/WithLabel.ts

## 입력 필드 로딩

[폼 그룹](/components/form-group)(`<krds-form-group>`)에 `loading`을 주면 입력 필드와 스피너를 `.form-spinner`로 감싸 스피너를 입력 필드 오른쪽 안에 표시합니다.

<div class="demo vp-raw"><AngularDemo name="spinner/InputLoading" /></div>

<<< ./demos/spinner/InputLoading.ts

## API

## KrdsSpinner

<ComponentApi name="KrdsSpinner" />
