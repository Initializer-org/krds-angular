# 이미지 Image

이미지는 콘텐츠 양식 중 하나로 단일 이미지 또는 이미지 시퀀스로 표현될 수 있다. 이미지를 적절하게 사용하게 되면 사용자는 텍스트보다 효과적으로 정보를 인지할 수 있으며, 텍스트로 표현하기 어려운 정보를 전달할 수 있다.

## 기본

기본 `<img>`에 `krdsImage`를 붙입니다. `alt`(대체 텍스트)는 반드시 쓰고, 이미지가 전하는 정보를 구체적이고 간결하게 씁니다. 기본으로 `loading="lazy"`가 붙어 화면에 가까워질 때 불러오며, 화면 위쪽의 중요한 이미지는 `loading="eager"`로 바로 불러옵니다. `src`·`width`·`height` 등 나머지 속성은 기본 `<img>` 그대로 쓰고, 화면 폭보다 크면 비율을 유지한 채 줄어듭니다.

<div class="demo vp-raw"><AngularDemo name="image/Basic" /></div>

<<< ./demos/image/Basic.ts

## 설명

이미지 아래에 설명을 붙이려면 `<figure krdsFigure>`로 감싸고 `<figcaption>`에 설명을 씁니다. 출처 링크처럼 마크업이 필요하면 `<figcaption>` 안에 그대로 넣습니다. 촬영자·출처 정보는 대체 텍스트가 아니라 설명에 넣습니다.

<div class="demo vp-raw"><AngularDemo name="image/Caption" /></div>

<<< ./demos/image/Caption.ts

## 장식 이미지

정보 없이 꾸밈용인 이미지는 `alt=""`로 비워 화면낭독기가 건너뛰게 합니다.

<div class="demo vp-raw"><AngularDemo name="image/Decorative" /></div>

<<< ./demos/image/Decorative.ts

## 접근성

- 앱이 개발 모드일 때 KRDS 이미지 접근성 가이드에 어긋나는 대체 텍스트를 콘솔에 경고합니다(`isDevMode()`, 배포 빌드에서는 출력하지 않음).
  - `'로고 이미지'`, `'강아지 사진'`처럼 끝에 이미지·사진·그림·그래픽 등 역할과 겹치는 말을 붙인 경우
  - 대체 텍스트가 같은 `<figure>`의 `<figcaption>`과 같은 경우
- 컴포넌트는 내용이 적절한지까지 확인하지 못합니다. 이미지와 인접한 글과 같은 내용, 이미지에 없는 정보는 넣지 않습니다.
- 글자를 이미지로 만들지 말고 마크업 텍스트로 제공합니다.
- `alt`를 빠뜨린 경우는 컴포넌트가 잡지 않습니다. `krdsImage`를 붙이지 않은 `<img>`까지 함께 검사하려면 angular-eslint의 [`template/alt-text` 규칙](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/alt-text.md)을 씁니다.

## API

## KrdsImage

<ComponentApi name="KrdsImage" />

## KrdsFigure

<ComponentApi name="KrdsFigure" />
