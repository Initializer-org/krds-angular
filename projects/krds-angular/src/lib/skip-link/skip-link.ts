import { Directive, input } from '@angular/core'

/**
 * KRDS 건너뛰기 링크 묶음. KRDS CSS가 id(#krds-skip-link)로 스타일을 주므로 id만 붙이고, 링크는 기본 `<a>`로 넣는다.
 * 페이지 맨 앞에 두고 href는 같은 페이지의 #id로 쓴다
 *
 * @example
 * <div krdsSkipLink>
 *   <a href="#main-content">본문 바로가기</a>
 *   <a href="#main-menu">주메뉴 바로가기</a>
 * </div>
 */
@Directive({
  selector: '[krdsSkipLink]',
  host: { '[id]': 'id()' }
})
export class KrdsSkipLink {
  /** id (KRDS CSS 기준 krds-skip-link) */
  readonly id = input('krds-skip-link')
}
