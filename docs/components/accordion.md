# 아코디언 Accordion

아코디언은 한 페이지에서 관련 있는 여러 콘텐츠 섹션을 확인할 수 있도록 하는 컴포넌트로 콘텐츠 섹션의 헤더 목록이 수직으로 쌓여 있는 형태로 표현된다. 일반적으로 헤더 목록은 컨트롤 요소로 활용되며 사용자는 필요에 따라 헤더를 선택하여 하위 콘텐츠 섹션을 표시하거나 숨길 수 있다.

## 기본

`<div krdsAccordion>` 안에 `krds-accordion-item`을 둡니다. 제목은 `label`, 본문은 항목의 내용으로 넣습니다. 한 번에 한 항목만 펼쳐지고, 펼친 항목을 다시 누르면 접힙니다. 펼친 항목의 `value`는 `[(open)]`으로 주고받으며, 모두 접히면 `null`입니다.

`value`를 주지 않으면 자동으로 만듭니다. 머리글 버튼과 본문 영역의 id도 자동으로 만들어 `aria-controls`·`aria-labelledby`로 연결하므로 따로 id를 주지 않아도 됩니다.

항목 제목은 기본으로 `h5`입니다. 페이지의 제목 구조에 맞춰 `headingLevel`(2~6)로 바로 위 제목보다 한 단계 아래 수준을 줍니다. 예제는 이 문서의 `h2` 아래에 있어 `headingLevel="3"`을 줬습니다.

<div class="demo vp-raw"><AngularDemo name="accordion/Basic" /></div>

<<< ./demos/accordion/Basic.ts

## 라인

`typeLine`을 지정하면 라인형으로 표시됩니다. 제목은 `label` 속성 대신 `krdsAccordionLabel`을 붙인 요소로도 넣을 수 있습니다(강조 등 서식이 필요한 제목).

<div class="demo vp-raw"><AngularDemo name="accordion/Line" /></div>

<<< ./demos/accordion/Line.ts

## API

## KrdsAccordion

<ComponentApi name="KrdsAccordion" />

## KrdsAccordionItem

<ComponentApi name="KrdsAccordionItem" />
