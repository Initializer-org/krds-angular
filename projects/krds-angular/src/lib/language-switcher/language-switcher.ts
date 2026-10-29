import { Component, Directive, inject, input, model, output } from '@angular/core'
import { KrdsDropdown } from '../dropdown/dropdown'
import { KrdsExternalLink } from '../link/link'

/** 언어 */
export interface KrdsLanguage {
  /** 언어 코드 (lang 속성) */
  code: string
  /** 그 언어로 쓴 이름 */
  name: string
  /** 다른 누리집으로 가는 주소 (type="external") */
  url?: string
}

/** 언어 목록 위쪽 영역 (현재 언어 안내 등, `<div krdsLanguageTop>`) */
@Directive({
  selector: '[krdsLanguageTop]',
  host: { class: 'drop-top' }
})
export class KrdsLanguageTop {}

/**
 * KRDS 언어 변경. 버튼으로 언어 목록을 열고, 고르면 `[(language)]`를 바꾸고 닫은 뒤 버튼으로 초점을 돌려준다.
 * type="external"이면 언어별 누리집으로 가는 새 창 링크 목록이다. 버튼 글자는 내용으로 넣는다
 *
 * @example
 * <krds-language-switcher [languages]="languages" [(language)]="lang">
 *   언어변경
 *   <div krdsLanguageTop><p class="current-laguage"><span>현재 언어</span><strong>한국어</strong></p></div>
 * </krds-language-switcher>
 */
@Component({
  selector: 'krds-language-switcher',
  imports: [KrdsExternalLink],
  hostDirectives: [{ directive: KrdsDropdown, inputs: ['position: dropPosition'] }],
  host: { class: 'krds-language' },
  template: `
    <!-- 공백만 있는 글자는 템플릿에서 지워지므로 &ngsp;로 아이콘과 내용 사이를 띄운다 -->
    <button type="button" class="krds-btn small text drop-btn">
      <i class="svg-icon ico-global" aria-hidden="true"></i>&ngsp;<ng-content />&ngsp;<i class="svg-icon ico-toggle" aria-hidden="true"></i>
    </button>
    <div class="drop-menu">
      <div class="drop-in">
        <ng-content select="[krdsLanguageTop]" />
        <ul class="drop-list">
          @for (item of languages(); track item.code) {
            <li>
              @if (type() === 'external') {
                <a class="item-link" krdsExternal [href]="item.url || '#'" [lang]="item.code"
                  >{{ item.name }} <i class="svg-icon ico-go" aria-hidden="true"></i
                ></a>
              } @else {
                <!-- KRDS 원본의 aria-selected는 링크에 쓸 수 없으므로 현재 언어는 aria-current로 알린다 -->
                <a
                  href="#"
                  class="item-link"
                  [class.active]="item.code === language()"
                  [lang]="item.code"
                  [attr.aria-current]="item.code === language() ? 'true' : null"
                  (click)="select($event, item.code)"
                >
                  {{ item.name }}
                  @if (item.code === language()) {
                    <span class="sr-only">선택됨</span>
                  }
                </a>
              }
            </li>
          }
        </ul>
      </div>
    </div>
  `
})
export class KrdsLanguageSwitcher {
  /** 언어 목록 */
  readonly languages = input.required<KrdsLanguage[]>()
  /** 고른 언어 코드 */
  readonly language = model('')
  /** default는 언어 선택, external은 언어별 누리집 링크 */
  readonly type = input<'default' | 'external'>('default')

  /** 언어를 골라 목록을 닫았을 때 */
  readonly closed = output<void>()

  private readonly dropdown = inject(KrdsDropdown)

  protected select(event: MouseEvent, code: string) {
    event.preventDefault()
    this.language.set(code)
    this.dropdown.close(true)
    this.closed.emit()
  }
}
