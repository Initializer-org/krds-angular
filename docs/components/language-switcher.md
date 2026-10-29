# 언어 변경 Language switcher

언어 변경은 서비스의 콘텐츠를 표시할 언어를 변경하거나 별도의 외국어 서비스로 이동하는 데 사용되는 요소이다. 한국어가 익숙하지 않은 사용자가 콘텐츠 표시 언어를 변경할 수 있는 수단을 발견하지 못한다면 서비스를 이용할 수 없게 되므로, 디지털 정부서비스로 직관적이고 일관된 방식으로 언어 변경을 제공하는 것이 매우 중요하다.

## 기본

버튼 글자는 내용으로 넣고, `languages`에 언어 목록(`code`, 그 언어로 쓴 `name`)을 줍니다. 목록에서 언어를 고르면 `[(language)]`에 언어 코드가 담기고, 목록을 닫은 뒤 초점을 버튼으로 돌려주고 `(closed)`를 보냅니다. 고른 언어는 화면낭독기에 '선택됨'(`aria-current`)으로 알리고, 각 항목에는 그 언어의 `lang`이 붙습니다. `krdsLanguageTop`을 붙인 요소를 넣으면 목록 위에 현재 언어를 표시할 수 있습니다.

목록은 Esc 키·바깥 클릭·초점 이탈로 닫힙니다. 목록 위치는 `dropPosition`(`center` 기본, `left`, `right`)으로 정하고, `center`는 목록이 화면 밖으로 넘치면 좌우를 맞춥니다.

<div class="demo vp-raw"><AngularDemo name="language-switcher/Basic" /></div>

<<< ./demos/language-switcher/Basic.ts

## 외부 페이지 이동

`type="external"`이면 각 언어가 `url`로 새 창에서 이동하는 링크가 됩니다.

<div class="demo vp-raw"><AngularDemo name="language-switcher/External" /></div>

<<< ./demos/language-switcher/External.ts

## 드롭다운

언어 변경과 화면 크기 조정이 쓰는 드롭다운 동작은 `krdsDropdown`으로 따로 쓸 수 있습니다. KRDS 드롭다운 마크업(`.drop-btn` 버튼과 `.drop-menu`)을 감싼 요소에 붙이면 버튼으로 열고 닫고(`aria-expanded`), Esc 키는 닫은 뒤 초점을 버튼으로 돌려주고, 바깥 클릭·초점 이탈로 닫습니다. 열림은 `[(open)]`으로, 메뉴 위치는 `position`으로 정하고, 템플릿 참조(`#menu="krdsDropdown"`)로 `toggle()`·`close()`를 부를 수 있습니다. 헤더 유틸리티 메뉴의 드롭다운도 이것으로 만듭니다.

<div class="demo vp-raw"><AngularDemo name="language-switcher/Dropdown" /></div>

<<< ./demos/language-switcher/Dropdown.ts

## API

## KrdsLanguageSwitcher

<ComponentApi name="KrdsLanguageSwitcher" />

## KrdsLanguageTop

<ComponentApi name="KrdsLanguageTop" />

## KrdsDropdown

<ComponentApi name="KrdsDropdown" />
