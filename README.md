# KRDS Angular

[KRDS(대한민국 정부 디자인 시스템)](https://www.krds.go.kr/html/site/index.html)를 Angular로 구현한 컴포넌트 라이브러리입니다. Vue 버전인 [@krds.ui/vue](https://github.com/Initializer-org/krds-vue)와 같은 KRDS 스타일을 씁니다.

> 초기 개발 단계입니다. 아직 npm에 배포하지 않았고, 컴포넌트는 Button만 있습니다. 스타일시트에는 KRDS 컴포넌트 CSS가 모두 들어 있어서, 아직 없는 컴포넌트도 KRDS 원본 마크업과 클래스로 바로 쓸 수 있습니다.

## 빠른 시작

```bash
pnpm add @krds.ui/angular
```

`angular.json`의 `styles`에 스타일시트를 추가합니다.

```json
"styles": ["@krds.ui/angular/style.css"]
```

```ts
import { Component } from '@angular/core'
import { KrdsButton } from '@krds.ui/angular'

@Component({
  selector: 'app-root',
  imports: [KrdsButton],
  template: `<button krdsButton variant="secondary" size="large">확인</button>`
})
export class App {}
```

Angular `^22.2.0`이 필요합니다.

스타일시트는 KRDS 전체 CSS라 압축 전 약 620kB(전송 약 45kB)입니다. `ng new`의 기본 번들 예산(`initial` 경고 500kB)에서 경고가 나오면 `angular.json`의 `budgets`에서 `maximumWarning`을 `1mb`로 올리세요.

## 개발

```bash
pnpm install
pnpm test     # 단위 테스트와 axe-core 접근성 검사 (Vitest, jsdom)
pnpm build    # dist/krds-angular에 패키지 생성
pnpm lint
pnpm format
```

## 라이선스

MIT © [Initializer Team](https://github.com/Initializer-org)
