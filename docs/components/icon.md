# 아이콘 Icon

KRDS SVG 아이콘은 별도 컴포넌트 없이 KRDS CSS 클래스로 표시한다. svg-icon 클래스와 아이콘 클래스명(ico-\*)을 함께 지정하며, 실제 그래픽은 스타일 시트의 svg-icon 마스크로 렌더링된다.

## 기본

`<i>` 요소에 `svg-icon`과 아이콘 클래스(`ico-help` 등)를 붙입니다. Angular 컴포넌트나 디렉티브 없이 KRDS 스타일시트만으로 그려집니다. 아이콘에는 대체 텍스트가 없으므로 `aria-hidden="true"`로 화면낭독기에서 숨기고, 아이콘만으로 의미를 전달할 때는 `sr-only` 텍스트를 함께 제공합니다.

<div class="demo vp-raw"><AngularDemo name="icon/Basic" /></div>

<<< ./demos/icon/Basic.ts

## 아이콘 목록

아이콘을 값으로 바꿔 쓸 때는 `class="svg-icon" [class]="icon"`처럼 고정 클래스와 바인딩을 함께 씁니다.

<div class="demo vp-raw"><AngularDemo name="icon/Gallery" /></div>

<<< ./demos/icon/Gallery.ts
