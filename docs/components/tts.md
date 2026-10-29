# 음성 지원 TTS

TTS(Text-to-Speech)는 텍스트를 음성으로 변환하여 읽어주는 기능을 제공하는 버튼 컴포넌트이다. Web Speech API를 사용하며, 볼륨 아이콘과 재생 아이콘 두 가지 타입을 지원한다.

## 기본

기본 `<button>`에 `krdsTts`를 붙이고 읽을 글을 `text`로 줍니다. 버튼을 누르면 `text`를 한국어(`ko-KR`)로 읽고, 읽는 동안 정지 아이콘으로 바뀌어 다시 누르면 멈춥니다. 읽기 시작하면 `(play)`, 눌러서 멈추면 `(pause)`, 끝까지 읽으면 `(end)`를 보냅니다. 브라우저가 Web Speech API(`speechSynthesis`)를 지원하지 않거나 읽지 못하면 `(error)`로 알립니다.

<div class="demo vp-raw"><AngularDemo name="tts/Basic" /></div>

<<< ./demos/tts/Basic.ts

## 아이콘만

`label`이 없으면 아이콘만 표시되므로 `aria-label`로 버튼 이름을 제공합니다.

<div class="demo vp-raw"><AngularDemo name="tts/IconOnly" /></div>

<<< ./demos/tts/IconOnly.ts

## 크기

`size`로 `xsmall`, `small`, `medium`(기본) 중에서 고릅니다.

<div class="demo vp-raw"><AngularDemo name="tts/Sizes" /></div>

<<< ./demos/tts/Sizes.ts

## 아이콘 타입

`icon`으로 볼륨 아이콘(`volume`, 기본)과 재생 아이콘(`play`) 중에서 고릅니다.

<div class="demo vp-raw"><AngularDemo name="tts/IconTypes" /></div>

<<< ./demos/tts/IconTypes.ts

## 비활성화

<div class="demo vp-raw"><AngularDemo name="tts/Disabled" /></div>

<<< ./demos/tts/Disabled.ts

## API

## KrdsTts

<ComponentApi name="KrdsTts" />
