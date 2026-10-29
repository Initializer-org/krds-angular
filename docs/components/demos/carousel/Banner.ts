import { Component } from '@angular/core'
import { KrdsCarousel, KrdsSlide } from '@krds.ui/angular'

@Component({
  selector: 'demo-carousel-banner',
  imports: [KrdsCarousel, KrdsSlide],
  template: `
    <krds-carousel variant="banner" label="배너형 캐러셀 예제" moreHref="#">
      @for (index of slides; track index) {
        <li krdsSlide>
          <div class="in">
            <div class="text">
              <p class="cate">서브타이틀 {{ index }}</p>
              <p class="tit">타이틀 {{ index }}</p>
            </div>
            <div class="im">
              <svg
                width="243"
                height="178"
                viewBox="0 0 243 178"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="예시"
              >
                <rect width="243" height="178" fill="#E6E8EA" />
              </svg>
            </div>
          </div>
        </li>
      }
    </krds-carousel>
  `
})
export default class CarouselBanner {
  readonly slides = [1, 2, 3]
}
