import { Directive, ElementRef, afterNextRender, inject, input, isDevMode } from '@angular/core'

const roleWords = /(이미지|사진|그림|그래픽|image|photo|picture)[\s.]*$/i

/**
 * KRDS 이미지. 기본 `<img>`에 KRDS 클래스를 붙이고 기본으로 지연 로딩한다.
 * 개발 모드에서는 대체 텍스트(alt)가 역할을 되풀이하거나('…사진') 옆 설명(figcaption)과 같으면 경고한다
 *
 * @example
 * <figure krdsFigure>
 *   <img krdsImage src="/office.jpg" alt="정부서울청사 정문" />
 *   <figcaption>정부서울청사</figcaption>
 * </figure>
 */
@Directive({
  selector: 'img[krdsImage]',
  host: {
    class: 'krds-image',
    '[attr.loading]': 'loading()'
  }
})
export class KrdsImage {
  /** 로딩 방식 (화면 위쪽의 중요한 이미지는 eager) */
  readonly loading = input<'lazy' | 'eager'>('lazy')

  constructor() {
    if (!isDevMode()) return
    const img = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement
    afterNextRender(() => {
      const alt = img.alt.trim()
      if (!alt) return
      // oxlint-disable-next-line no-console -- 개발 모드 접근성 경고
      if (roleWords.test(alt)) console.warn(`krdsImage: 대체 텍스트에 '이미지'·'사진'처럼 역할과 겹치는 말을 넣지 않습니다. (alt="${alt}")`)
      if (alt === img.closest('figure')?.querySelector('figcaption')?.textContent?.trim()) {
        // oxlint-disable-next-line no-console -- 개발 모드 접근성 경고
        console.warn(`krdsImage: 대체 텍스트를 옆 설명(figcaption)과 같게 쓰지 않습니다. (alt="${alt}")`)
      }
    })
  }
}

/** 설명이 있는 이미지 묶음 (`<figure>`) */
@Directive({
  selector: 'figure[krdsFigure]',
  host: { class: 'krds-figure' }
})
export class KrdsFigure {}
