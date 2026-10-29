# 디스클로저 Disclosure

디스클로저는 특정한 정보/컨트롤/섹션에 관련된 부가적인 정보를 표시하거나 숨기는 데 사용되는 요소이다. 디스클로저 하위 콘텐츠 섹션은 기본으로 축소된 상태로 제공되며 사용자가 요청하는 경우에 확장되어 자세한 정보가 표시된다. 이는 사용자의 인지적 부담을 감소시키고 정보를 빠르게 훑어보는 데 도움이 된다.

## 기본

`label`로 펼침 버튼 문구를 주고, 펼침 상태는 `[(expanded)]`로 주고받습니다. 버튼은 `aria-expanded`·`aria-controls`로 콘텐츠 영역과 연결되고, 접혀 있는 동안 콘텐츠 영역은 `inert`로 초점과 보조기기 대상에서 제외됩니다.

<div class="demo vp-raw"><AngularDemo name="disclosure/Basic" /></div>

<<< ./demos/disclosure/Basic.ts

## API

## KrdsDisclosure

<ComponentApi name="KrdsDisclosure" />
