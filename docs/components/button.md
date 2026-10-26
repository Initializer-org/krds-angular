# 버튼 Button

버튼은 어떤 기능이나 동작을 실행하거나 기능을 사용하기 위한 상태로 변경하는 요소이다. 사용자가 서비스를 이용하는 과정에서 어떤 행동이 중요한지에 따라 관련된 버튼이 다양한 스타일로 표현된다.

## 계층

기본 `<button>`에 `krdsButton`을 붙입니다. `type`, `disabled`, 폼 제출은 기본 버튼 그대로 동작합니다. `variant`로 버튼의 중요도를 표현하고, 화면의 주요 행동에는 `primary`를 한 번만 사용합니다.

<div class="demo vp-raw"><AngularDemo name="button/Hierarchy" /></div>

<<< ./demos/button/Hierarchy.ts

## 사이즈

<div class="demo vp-raw"><AngularDemo name="button/Sizes" /></div>

<<< ./demos/button/Sizes.ts

## 아이콘 버튼

텍스트 앞이나 뒤에 아이콘을 둘 수 있습니다. 아이콘 크기는 버튼 크기에 맞춰집니다.

<div class="demo vp-raw"><AngularDemo name="button/WithIcon" /></div>

<<< ./demos/button/WithIcon.ts

## 텍스트 버튼

<div class="demo vp-raw"><AngularDemo name="button/Text" /></div>

<<< ./demos/button/Text.ts

## 아이콘만 있는 버튼

보이는 텍스트가 없으므로 `sr-only` 텍스트로 버튼 이름을 반드시 제공합니다.

<div class="demo vp-raw"><AngularDemo name="button/IconOnly" /></div>

<<< ./demos/button/IconOnly.ts

## 버튼 묶음

여러 버튼을 나란히 둘 때는 KRDS 클래스 `btn-group`으로 감쌉니다. 따로 컴포넌트가 없습니다.

```html
<div class="btn-group">
  <button krdsButton variant="secondary">취소</button>
  <button krdsButton>확인</button>
</div>
```

## API

## KrdsButton

<ComponentApi name="KrdsButton" />
