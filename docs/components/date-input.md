# 날짜 입력 필드 Date input

날짜 입력 필드는 사용자가 특정 날짜 또는 기간을 입력하거나 선택하는 데 사용되는 요소이다.

## 기본

`<krds-date-input>` 안에 `<input krdsInput>`을 넣으면 입력 필드 옆에 달력 버튼과 달력이 붙습니다. [폼 그룹](/components/form-group)으로 감싸 레이블과 도움말을 연결합니다. 직접 입력은 기본 input 그대로이고, 달력에서 고른 날짜는 input에 넣은 뒤 `input` 이벤트로 알리므로 `[(ngModel)]`·`formControlName`·`[formField]`가 그대로 값을 받습니다. 달력 버튼 크기는 입력 필드의 `size`를 따릅니다(지정하지 않으면 `medium`).

달력 버튼을 누르면 달력이 열리고 초점이 달력으로 이동합니다. 원본 KRDS처럼 입력 필드 위쪽에 여는 것이 기본이고, 화면에서 위쪽 공간이 달력 높이보다 좁고 아래쪽이 더 넓으면 아래쪽에 엽니다. 날짜를 고른 뒤 **확인**을 누르면 `YYYY.MM.DD` 형식으로 입력되고, 두 날짜를 차례로 고르면 `YYYY.MM.DD ~ YYYY.MM.DD` 기간으로 입력됩니다. <kbd>Esc</kbd>나 **취소**, 달력 바깥 클릭으로 닫힙니다. <kbd>Esc</kbd>·**취소**·**확인**으로 닫으면 초점이 달력 버튼으로 돌아오고, 바깥을 누르면 누른 곳으로 간 초점을 그대로 둡니다. 연·월 목록을 <kbd>Esc</kbd>로 닫으면 초점이 연·월 버튼으로 돌아옵니다.

<div class="demo vp-raw"><AngularDemo name="date-input/Basic" /></div>

<<< ./demos/date-input/Basic.ts

## 비활성화

입력 요소를 비활성화하면 입력과 달력 열기가 모두 막힙니다. 달력 버튼은 입력 요소의 `disabled`를 따르므로 `disabled` 속성, reactive forms의 `disable()`, Signal Forms의 `disabled()` 어느 쪽으로 바꿔도 됩니다. 아래 예제는 reactive forms로 비활성화합니다.

<div class="demo vp-raw"><AngularDemo name="date-input/Disabled" /></div>

<<< ./demos/date-input/Disabled.ts

## 읽기 전용

입력 요소에 `readonly`를 주면 직접 입력은 막히지만 달력 버튼은 그대로 사용할 수 있습니다.

<div class="demo vp-raw"><AngularDemo name="date-input/Readonly" /></div>

<<< ./demos/date-input/Readonly.ts

## 일정·휴일 표시

`initialYear`·`initialMonth`로 달력을 처음 열 때 보여 줄 달을 정합니다. `holidays`의 날짜는 일요일처럼 휴일로, `eventDates`의 날짜는 일정이 있는 날로 표시됩니다. 날짜는 `YYYY.MM.DD` 형식으로 지정합니다.

<div class="demo vp-raw"><AngularDemo name="date-input/EventsAndHolidays" /></div>

<<< ./demos/date-input/EventsAndHolidays.ts

## 여러 개 배치

달력을 열면 열려 있던 다른 달력은 닫힙니다.

<div class="demo vp-raw"><AngularDemo name="date-input/Multiple" /></div>

<<< ./demos/date-input/Multiple.ts

::: warning
달력은 원본 KRDS처럼 입력 필드 바로 뒤에 렌더되므로, `overflow`로 잘리는 컨테이너(스크롤 영역, 표 등) 안에서는 달력이 잘립니다. 이런 곳에는 달력이 들어갈 공간을 두고 배치합니다.
:::

## API

## KrdsDateInput

<ComponentApi name="KrdsDateInput" />
