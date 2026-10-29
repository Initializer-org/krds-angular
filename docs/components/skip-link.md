# 건너뛰기 링크 Skip link

건너뛰기 링크는 웹사이트에서 웹 페이지의 주요 콘텐츠 섹션의 탐색을 도와주는 페이지 내부 링크이다. 키보드나 가상 초점을 이용하여 콘텐츠를 탐색하는 사용자는 건너뛰기 링크를 이용하여 대부분의 페이지에서 반복되는 콘텐츠 영역을 건너뛰고 주요 콘텐츠로 빠르게 이동할 수 있다.

## 기본

페이지 최상단의 요소에 `krdsSkipLink`를 붙이고, 그 안에 기본 `<a>`로 링크를 넣습니다. `href`는 같은 페이지 대상의 `#id`로 씁니다. KRDS CSS가 `#krds-skip-link`로 스타일을 주므로 디렉티브는 이 `id`만 붙입니다. 링크는 포커스를 받기 전까지 화면에서 숨겨져 있다가, 포커스를 받으면 화면 맨 위에 고정되어 표시되므로 예제를 별도 화면(iframe)에 띄웁니다. 미리보기 안으로 Tab 키를 눌러 포커스를 옮겨 확인하세요.

<DemoFrame src="/frame/skip-link/basic" title="건너뛰기 링크 기본 예제" :height="340" />

<<< ./demos/skip-link/Basic.ts

## 여러 링크

여러 링크는 하나의 묶음(`#krds-skip-link`) 안에 `<a>`를 이어서 넣습니다. 묶음을 여러 개 두면 `id`가 중복되므로 한 페이지에 하나만 둡니다.

<DemoFrame src="/frame/skip-link/multiple-links" title="건너뛰기 링크 여러 링크 예제" :height="240" />

<<< ./demos/skip-link/MultipleLinks.ts

## API

## KrdsSkipLink

<ComponentApi name="KrdsSkipLink" />
