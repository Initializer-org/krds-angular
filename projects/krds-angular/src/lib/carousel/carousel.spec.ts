import { Component, signal } from '@angular/core'
import { expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsCarousel, KrdsSlide } from './carousel'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsCarousel, KrdsSlide], template: '<krds-carousel><li krdsSlide>1</li></krds-carousel>' })
class Host {
  readonly active = signal(0)
  readonly slides = signal([1, 2, 3, 4])
  readonly events: string[] = []
}

const slides = (count = 4) =>
  Array.from(
    { length: count },
    (_, i) => `
      <li krdsSlide>
        <div class="in">
          <div class="text"><p class="tit">타이틀 영역 ${i + 1}</p><a href="#!" class="krds-btn primary">버튼 영역 ${i + 1}</a></div>
        </div>
      </li>`
  ).join('')

const activeLabel = (el: Element) => el.querySelector('.swiper-slide-active')?.getAttribute('aria-label')

describe('KrdsCarousel', () => {
  it('비주얼 배너형: 마크업 구조, 현재 슬라이드 외에는 숨김, 이전/다음·불릿 이동', async () => {
    const { host, el, $, $$, click } = await render(
      Host,
      `<krds-carousel label="주요 서비스 안내" moreHref="/services" [(active)]="active">${slides()}</krds-carousel>`
    )
    const root = $('krds-carousel')
    expect(root.className).toBe('krds-carousel vb-swiper')
    expect(root.getAttribute('role')).toBe('region')
    expect(root.getAttribute('aria-roledescription')).toBe('carousel')
    expect(root.getAttribute('aria-label')).toBe('주요 서비스 안내')
    expect($$('.swiper > ul.swiper-wrapper > li.swiper-slide')).toHaveLength(4)
    expect($('.swiper-indicator').classList).toContain('text-center')
    expect($('.swiper-indicator > .swiper-button-more').getAttribute('href')).toBe('/services')

    expect(activeLabel(el)).toBe('1 / 4')
    const hidden = $$<HTMLElement>('.swiper-slide[aria-hidden="true"]')
    expect(hidden).toHaveLength(3)
    expect(hidden.every(slide => slide.inert)).toBe(true)

    await click($('.swiper-button-next'))
    expect(activeLabel(el)).toBe('2 / 4')
    expect(host.active()).toBe(1)
    const bullets = $$('.swiper-pagination-bullet')
    expect(bullets[1].getAttribute('aria-current')).toBe('true')
    expect(bullets[1].getAttribute('aria-label')).toBe('2번째 슬라이드로 이동')

    await click(bullets[3])
    expect(activeLabel(el)).toBe('4 / 4')
    // 순환: 마지막에서 다음은 처음
    await click($('.swiper-button-next'))
    expect(activeLabel(el)).toBe('1 / 4')
    await click($('.swiper-button-prev'))
    expect(activeLabel(el)).toBe('4 / 4')
    await expectNoA11yViolations(el)
  })

  it('배너형: 인디케이터 안 분수형 페이지네이션·내비게이션, 다음 버튼으로 분수 갱신', async () => {
    const { $, $$, click } = await render(Host, `<krds-carousel variant="banner" moreHref="#!">${slides(3)}</krds-carousel>`)
    expect($('krds-carousel').className).toBe('krds-carousel main-d-ban-swiper')
    const fraction = $('.swiper-indicator .swiper-pagination.swiper-pagination-fraction')
    expect(fraction.querySelector('.swiper-pagination-current')?.textContent).toBe('1')
    expect(fraction.querySelector('.swiper-pagination-total')?.textContent).toBe('3')
    expect($$('.swiper-indicator .swiper-navigation > .swiper-button-prev')).toHaveLength(1)
    expect($$('.swiper-indicator .swiper-navigation > .swiper-button-more')).toHaveLength(1)
    // 배너형은 슬라이드 위에 겹친 버튼이 없다
    expect($$('krds-carousel > .swiper-button-prev')).toHaveLength(0)

    await click($('.swiper-button-next'))
    expect(fraction.querySelector('.swiper-pagination-current')?.textContent).toBe('2')
  })

  it('순환 없음: 처음·끝에서 버튼 비활성화', async () => {
    const { el, $, click } = await render(Host, `<krds-carousel [loop]="false">${slides(2)}</krds-carousel>`)
    const prev = $<HTMLButtonElement>('.swiper-button-prev')
    const next = $<HTMLButtonElement>('.swiper-button-next')
    expect(prev.disabled).toBe(true)
    expect(prev.classList).toContain('swiper-button-disabled')
    await click(next)
    expect(next.disabled).toBe(true)
    expect(prev.disabled).toBe(false)
    await expectNoA11yViolations(el)
  })

  it('자동 재생: 간격마다 넘기고, 마우스를 올리면 멈추고, 멈춤 버튼을 누르면 재생 버튼으로', async () => {
    const { host, el, $, stable } = await render(
      Host,
      `<p class="away">포인터를 둘 곳</p><krds-carousel variant="banner" autoplay [autoplayDelay]="50" (play)="events.push('play')" (stop)="events.push('stop')">${slides(3)}</krds-carousel>`
    )
    // 실제 마우스 포인터가 캐러셀 위에 있으면 (화면 배치가 바뀔 때도) 멈추므로, 포인터를 캐러셀 밖으로 옮겨 두고 시작한다
    await user.hover($('.away'))
    $('krds-carousel').dispatchEvent(new MouseEvent('mouseleave'))
    const play = $<HTMLButtonElement>('.swiper-button-play')
    const stop = $<HTMLButtonElement>('.swiper-button-stop')
    await vi.waitFor(() => expect(getComputedStyle(stop).display).not.toBe('none'))
    expect(getComputedStyle(play).display).toBe('none')
    expect($('.swiper').getAttribute('aria-live')).toBe('off')
    await vi.waitFor(() => expect(activeLabel(el)).toBe('2 / 3'))

    // 마우스를 올리면 멈춘다
    $('krds-carousel').dispatchEvent(new MouseEvent('mouseenter'))
    await stable()
    const paused = activeLabel(el)
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(activeLabel(el)).toBe(paused)
    $('krds-carousel').dispatchEvent(new MouseEvent('mouseleave'))

    stop.click()
    await stable()
    expect(getComputedStyle(play).display).not.toBe('none')
    expect($('.swiper').getAttribute('aria-live')).toBe('polite')
    expect(host.events).toEqual(['play', 'stop'])
    const stopped = activeLabel(el)
    await new Promise(resolve => setTimeout(resolve, 150))
    expect(activeLabel(el)).toBe(stopped)
    await expectNoA11yViolations(el)
  })

  it('슬라이드를 추가·삭제해도 실제 순서대로 표시하고, 바깥에서 위치를 바꿀 수 있다', async () => {
    const { host, el, stable } = await render(
      Host,
      `
        <krds-carousel [(active)]="active" pagination="fraction">
          @for (n of slides(); track n) {
            <li krdsSlide><p>슬라이드 {{ n }}</p></li>
          }
        </krds-carousel>
      `
    )
    host.active.set(2)
    await stable()
    expect(activeLabel(el)).toBe('3 / 4')
    host.slides.set([0, 1, 2, 3, 4])
    await stable()
    expect(el.querySelector('.swiper-slide-active')?.textContent?.trim()).toBe('슬라이드 2')
    expect(activeLabel(el)).toBe('3 / 5')
    expect(el.querySelector('.swiper-pagination-total')?.textContent).toBe('5')
  })
})
