# 캐러셀 Carousel

캐러셀은 하나의 영역에서 여러 개의 콘텐츠를 순차적으로 번갈아 보여주는 컴포넌트이다. 한정된 공간에 여러 콘텐츠를 노출할 수 있으나 첫 번째 슬라이드 외에는 주목도가 크게 떨어지므로, 중요한 정보는 캐러셀에만 담지 않는 것이 좋다. 자동 재생 시에는 사용자가 즉시 정지할 수 있도록 재생/정지 버튼을 함께 노출한다.

## 기본 (비주얼 배너형)

슬라이드는 `<krds-carousel>` 안에 `<li krdsSlide>`로 한 장씩 넣고, 캐러셀의 이름은 `label`(`aria-label`)로 줍니다. 현재 슬라이드가 아닌 슬라이드는 화면낭독기와 초점 이동에서 빠집니다(`aria-hidden`, `inert`). 현재 위치는 `[(active)]`(0부터)로 주고받을 수 있고, `moreHref`를 주면 더 보기 링크가 붙습니다. 모션 최소화 설정을 켠 사용자에게는 이동 효과를 없앱니다.

<div class="demo vp-raw"><AngularDemo name="carousel/Basic" /></div>

<<< ./demos/carousel/Basic.ts

## 배너형

배너형(`variant="banner"`)은 인디케이터 안에 분수형 페이지네이션과 이전/다음·더 보기 버튼을 배치합니다.

<div class="demo vp-raw"><AngularDemo name="carousel/Banner" /></div>

<<< ./demos/carousel/Banner.ts

## 자동 재생

`autoplay`를 주면 `autoplayDelay`(ms) 간격으로 넘어갑니다. 자동 재생 중에는 정지 버튼이 노출되며, 정지하면 재생 버튼으로 바뀝니다. 마우스 오버나 키보드 포커스가 캐러셀 안에 있는 동안에는 자동 재생이 멈춥니다. 재생·정지 버튼을 누르면 `(play)`·`(stop)`이 발생합니다.

<div class="demo vp-raw"><AngularDemo name="carousel/Autoplay" /></div>

<<< ./demos/carousel/Autoplay.ts

## 순환 없음

`[loop]="false"`로 순환을 끄면 처음과 마지막 슬라이드에서 이전/다음 버튼이 비활성화됩니다.

<div class="demo vp-raw"><AngularDemo name="carousel/NoLoop" /></div>

<<< ./demos/carousel/NoLoop.ts

## 분수형 페이지네이션

페이지네이션 방식은 형태와 무관하게 `pagination`(`bullets`·`fraction`·`none`)으로 바꿀 수 있습니다. 기본은 비주얼 배너형이 `bullets`, 배너형이 `fraction`입니다.

<div class="demo vp-raw"><AngularDemo name="carousel/Fraction" /></div>

<<< ./demos/carousel/Fraction.ts

## API

## KrdsCarousel

<ComponentApi name="KrdsCarousel" />

## KrdsSlide

<ComponentApi name="KrdsSlide" />
