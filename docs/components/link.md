# 링크 Link

링크는 다른 서비스/애플리케이션, 한 서비스 내의 다른 화면, 한 화면 내의 다른 섹션 등으로 이동하는 데 사용되는 탐색 요소이다.

## 기본

기본 `<a>`에 `krdsLink`를 붙입니다. `href`, `target`, `rel`, `title`은 기본 속성 그대로 씁니다. 새 창으로 열리는 링크는 `title="새 창 열림"`으로 그 사실을 알립니다.

<div class="demo vp-raw"><AngularDemo name="link/Basic" /></div>

<<< ./demos/link/Basic.ts

## 모든 링크 변형

<div class="demo vp-raw"><AngularDemo name="link/Variations" /></div>

<<< ./demos/link/Variations.ts

## 새 창 링크

`krdsExternal`을 붙이면 `target="_blank"`, `rel="noopener noreferrer"`, `title="새 창 열림"`이 함께 붙습니다. 조건에 따라 끄려면 `[krdsExternal]="false"`로 둡니다.

<div class="demo vp-raw"><AngularDemo name="link/External" /></div>

<<< ./demos/link/External.ts

## API

## KrdsLink

<ComponentApi name="KrdsLink" />

## KrdsExternalLink

<ComponentApi name="KrdsExternalLink" />
