# 숨긴 콘텐츠 sr-only

숨긴 콘텐츠는 화면에는 보이지 않지만 스크린 리더로 읽히는 텍스트로, 아이콘만 있는 버튼의 이름이나 시각으로만 전달되는 정보를 보조 기술 사용자에게 알려 준다.

## 기본

요소에 KRDS CSS 클래스 `sr-only`를 붙이면 화면에서는 보이지 않고 스크린 리더로만 읽힙니다. Angular판은 따로 디렉티브 없이 이 클래스를 그대로 씁니다. 아래 예제의 가운데 문장은 화면에 표시되지 않습니다.

<div class="demo vp-raw"><AngularDemo name="sr-only/Basic" /></div>

<<< ./demos/sr-only/Basic.ts

## 사용법

[KRDS 스타일](/guide/getting-started)(`@krds.ui/angular/style.css`)만 불러오면 어디서나 쓸 수 있습니다. 조건에 따라 숨기려면 클래스 바인딩을 씁니다.

| 사용                     | 동작                                    |
| ------------------------ | --------------------------------------- |
| `class="sr-only"`        | 화면에서 숨기고 스크린 리더로 읽힙니다. |
| `[class.sr-only]="조건"` | 조건이 참일 때만 화면에서 숨깁니다.     |

```html
<!-- 아이콘만 보이는 버튼의 이름 -->
<button krdsButton icon><span class="sr-only">검색</span><i class="svg-icon ico-sch" aria-hidden="true"></i></button>

<!-- 좁은 화면에서만 제목을 숨김 -->
<h2 [class.sr-only]="compact()">검색 결과</h2>
```
