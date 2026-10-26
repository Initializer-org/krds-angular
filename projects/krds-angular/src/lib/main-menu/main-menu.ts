import {
  Component,
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  Injector,
  TemplateRef,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  contentChild,
  inject,
  input,
  model,
  output,
  signal,
  untracked
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import { KrdsExternalLink } from '../link/link'

/** 메인 메뉴 렌더링 방식: PC 메가 메뉴 또는 모바일 드로어 */
export type KrdsMainMenuVariant = 'pc' | 'mobile'

/** 서브 패널 배치: default는 배너가 아래, between은 배너가 오른쪽 */
export type KrdsMainMenuLayout = 'default' | 'between'

/** 모바일 4단계 항목 */
export interface KrdsMainMenuDepth4Item {
  text: string
  href?: string
  /** 새 창 열림 */
  external?: boolean
  /** 현재 페이지 */
  selected?: boolean
}

/** 링크 항목 (PC 서브 패널의 마지막 단계, 모바일 3단계) */
export interface KrdsMainMenuLinkItem {
  text: string
  /** 링크 주소 (없으면 button) */
  href?: string
  external?: boolean
  /** 메뉴 설명 (PC type-description) */
  description?: string
  selected?: boolean
  /** 모바일 4단계 패널 제목 (기본: text) */
  panelTitle?: string
  /** 모바일 4단계 항목 */
  items?: KrdsMainMenuDepth4Item[]
}

/** 2단계 항목 (items가 있으면 서브 패널을 여는 버튼, 없으면 바로가기 링크) */
export interface KrdsMainMenuSubItem {
  text: string
  href?: string
  external?: boolean
  /** 서브 패널 제목 (기본: text) */
  title?: string
  /** 서브 패널 제목 옆 바로가기 링크 (PC) */
  titleLink?: { text?: string; href: string }
  items?: KrdsMainMenuLinkItem[]
  /** 배너 영역 표시 (krdsMainMenuBanner 템플릿, PC) */
  banner?: boolean
  layout?: KrdsMainMenuLayout
  /** 모바일 3단계 처음 펼침 */
  expanded?: boolean
  selected?: boolean
}

/** 1단계 항목 (subItems가 있으면 2단계 목록이 있는 패널, items만 있으면 링크만 나열하는 single-list 패널, 둘 다 없으면 링크) */
export interface KrdsMainMenuItem {
  text: string
  href?: string
  external?: boolean
  subItems?: KrdsMainMenuSubItem[]
  items?: KrdsMainMenuLinkItem[]
  /** single-list 패널 제목 */
  title?: string
  banner?: boolean
  layout?: KrdsMainMenuLayout
  selected?: boolean
}

/** 메뉴 항목 클릭 이벤트 (라우터로 이동하려면 event.preventDefault()) */
export interface KrdsMainMenuClick {
  item: KrdsMainMenuItem | KrdsMainMenuSubItem | KrdsMainMenuLinkItem | KrdsMainMenuDepth4Item
  event: MouseEvent
}

/** PC 패널 열림 이벤트 */
export interface KrdsMainMenuToggle {
  index: number
  expanded: boolean
}

/** PC 서브 패널 배너 템플릿 컨텍스트 */
export interface KrdsMainMenuBannerContext {
  $implicit: KrdsMainMenuItem
  item: KrdsMainMenuItem
  subItem?: KrdsMainMenuSubItem
  index: number
  subIndex: number
}

/** PC 서브 패널 배너 (`<ng-template krdsMainMenuBanner let-item let-subItem="subItem">`) */
@Directive({ selector: 'ng-template[krdsMainMenuBanner]' })
export class KrdsMainMenuBanner {
  readonly template = inject<TemplateRef<KrdsMainMenuBannerContext>>(TemplateRef)

  static ngTemplateContextGuard(_dir: KrdsMainMenuBanner, _ctx: unknown): _ctx is KrdsMainMenuBannerContext {
    return true
  }
}

/** 모바일 드로어 아래쪽 영역 (`<div krdsMainMenuBottom>`) */
@Directive({
  selector: '[krdsMainMenuBottom]',
  host: { class: 'gnb-bottom' }
})
export class KrdsMainMenuBottom {}

const DRAWER_OPEN_DELAY = 100
const DRAWER_CLOSE_DELAY = 400
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

let nextId = 0

/**
 * KRDS 메인 메뉴. variant="pc"는 메가 메뉴, variant="mobile"은 드로어다.
 * - PC: 1단계 버튼으로 패널을 열고 닫고, Esc·바깥 클릭·초점 이탈로 닫는다. 1·2단계 버튼은 Home·End·방향키로 옮긴다. 열리면 배경을 어둡게 한다
 * - 모바일: `[(open)]`으로 드로어를 열고 닫고, 열리면 드로어로 초점을 옮겨 Tab을 가두며 닫히면 연 요소로 돌려준다. 1단계 탭은 해당 패널로 스크롤하고, 3단계는 펼치고, 4단계는 패널로 연다
 *
 * @example
 * <krds-main-menu [items]="menu" (itemClick)="navigate($event)" />
 * <krds-main-menu variant="mobile" [items]="menu" [(open)]="menuOpen">
 *   <div krdsMainMenuHeader>로그인</div>
 * </krds-main-menu>
 */
@Component({
  selector: 'krds-main-menu',
  imports: [NgTemplateOutlet, KrdsExternalLink],
  host: {
    // 헤더의 flex 배치에 메뉴 요소가 그대로 들어가도록 이 요소의 상자는 없앤다
    style: 'display: contents',
    '(document:click)': 'onDocumentClick($event)'
  },
  template: `
    @if (variant() === 'pc') {
      <nav #root class="krds-main-menu" [attr.aria-label]="label()" (keydown)="onPcKeydown($event)" (focusout)="onPcFocusout($event, root)">
        <div class="inner">
          <ul class="gnb-menu" [attr.aria-label]="label()">
            @for (item of items(); track $index; let i = $index) {
              <li>
                @if (hasPanel(item)) {
                  <button
                    type="button"
                    class="gnb-main-trigger"
                    data-trigger="gnb"
                    aria-haspopup="true"
                    [class.active]="openIndex() === i"
                    [class.selected]="item.selected"
                    [attr.aria-controls]="panelId(i)"
                    [attr.aria-expanded]="openIndex() === i ? 'true' : 'false'"
                    (click)="toggleMain(i); onItemClick(item, $event)"
                  >
                    {{ item.text }}
                  </button>
                  <div class="gnb-toggle-wrap" [id]="panelId(i)" [class.is-open]="openIndex() === i">
                    <div
                      class="gnb-main-list"
                      [attr.data-has-submenu]="item.subItems?.length ? 'true' : null"
                      [style.min-height.px]="openIndex() === i && panelMinHeight() ? panelMinHeight() : null"
                    >
                      @if (item.subItems?.length) {
                        <ul>
                          @for (sub of item.subItems; track $index; let j = $index) {
                            <li>
                              @if (sub.items?.length) {
                                <button
                                  type="button"
                                  class="gnb-sub-trigger"
                                  data-trigger="gnb"
                                  aria-haspopup="true"
                                  [class.active]="activeSub(i) === j"
                                  [class.selected]="sub.selected"
                                  [attr.aria-controls]="subPanelId(i, j)"
                                  [attr.aria-expanded]="activeSub(i) === j ? 'true' : 'false'"
                                  (click)="selectSub(i, j); onItemClick(sub, $event)"
                                >
                                  {{ sub.text }}
                                </button>
                                <ng-container
                                  *ngTemplateOutlet="
                                    subList;
                                    context: {
                                      id: subPanelId(i, j),
                                      title: sub.title || sub.text,
                                      titleLink: sub.titleLink,
                                      links: sub.items,
                                      layout: sub.layout,
                                      single: false,
                                      active: activeSub(i) === j,
                                      banner: sub.banner,
                                      bannerContext: { $implicit: item, item, subItem: sub, index: i, subIndex: j }
                                    }
                                  "
                                />
                              } @else if (sub.href) {
                                <a
                                  class="gnb-sub-trigger is-link"
                                  data-trigger="gnb"
                                  [href]="sub.href"
                                  [krdsExternal]="!!sub.external"
                                  [class.external-link]="sub.external"
                                  [class.selected]="sub.selected"
                                  (click)="onItemClick(sub, $event)"
                                >
                                  {{ sub.text }}
                                </a>
                              } @else {
                                <button
                                  type="button"
                                  class="gnb-sub-trigger is-link"
                                  data-trigger="gnb"
                                  [class.selected]="sub.selected"
                                  (click)="onItemClick(sub, $event)"
                                >
                                  {{ sub.text }}
                                </button>
                              }
                            </li>
                          }
                        </ul>
                      } @else {
                        <ng-container
                          *ngTemplateOutlet="
                            subList;
                            context: {
                              id: null,
                              title: item.title || item.text,
                              links: item.items,
                              layout: item.layout,
                              single: true,
                              active: false,
                              banner: item.banner,
                              bannerContext: { $implicit: item, item, index: i, subIndex: -1 }
                            }
                          "
                        />
                      }
                    </div>
                  </div>
                } @else if (item.href) {
                  <a
                    class="gnb-main-trigger is-link"
                    data-trigger="gnb"
                    [href]="item.href"
                    [krdsExternal]="!!item.external"
                    [class.selected]="item.selected"
                    (click)="onItemClick(item, $event)"
                  >
                    {{ item.text }}
                  </a>
                } @else {
                  <button
                    type="button"
                    class="gnb-main-trigger is-link"
                    data-trigger="gnb"
                    [class.selected]="item.selected"
                    (click)="onItemClick(item, $event)"
                  >
                    {{ item.text }}
                  </button>
                }
              </li>
            }
          </ul>
        </div>
      </nav>
    } @else {
      <div
        class="krds-main-menu-mobile"
        [id]="mobileId()"
        [class.is-open]="drawerOpened()"
        [class.is-backdrop]="drawerOpened()"
        [style.display]="drawerDisplayed() ? null : 'none'"
        (keydown)="onMobileKeydown($event, wrap)"
      >
        <div #wrap class="gnb-wrap" tabindex="-1">
          <div class="gnb-header"><ng-content select="[krdsMainMenuHeader]" /></div>
          <div #body class="gnb-body" (scroll)="onBodyScroll(body)">
            <div class="gnb-menu">
              <div class="menu-wrap">
                <ul role="tablist" [attr.aria-label]="label()">
                  @for (item of items(); track $index; let i = $index) {
                    <li role="none">
                      <a
                        class="gnb-main-trigger"
                        role="tab"
                        [id]="tabId(i)"
                        [href]="'#' + panelId(i)"
                        [class.active]="activeTab() === i"
                        [attr.aria-controls]="panelId(i)"
                        [attr.aria-selected]="activeTab() === i ? 'true' : 'false'"
                        (click)="onTabClick($event, i, body); onItemClick(item, $event)"
                      >
                        {{ item.text }}
                      </a>
                    </li>
                  }
                </ul>
              </div>
              <div class="submenu-wrap">
                @for (item of items(); track $index; let i = $index) {
                  <div class="gnb-sub-list" role="tabpanel" [id]="panelId(i)" [attr.aria-labelledby]="tabId(i)">
                    <h2 class="sub-title">{{ item.title || item.text }}</h2>
                    <ul>
                      @for (sub of mobileSubItems(item); track $index; let j = $index) {
                        @let key = i + '-' + j;
                        @let withDepth3 = !!sub.items?.length;
                        <li>
                          <a
                            class="gnb-sub-trigger"
                            [href]="sub.href || '#'"
                            [krdsExternal]="!withDepth3 && !!sub.external"
                            [class.has-depth3]="withDepth3"
                            [class.active]="withDepth3 && depth3Open(key)"
                            [class.selected]="sub.selected"
                            [attr.aria-controls]="withDepth3 ? depth3Id(i, j) : null"
                            [attr.aria-expanded]="withDepth3 ? (depth3Open(key) ? 'true' : 'false') : null"
                            (click)="withDepth3 && toggleDepth3($event, key); onItemClick(sub, $event)"
                          >
                            {{ sub.text }}
                          </a>
                          @if (withDepth3) {
                            <div class="depth3-wrap" [id]="depth3Id(i, j)" [class.is-open]="depth3Open(key)">
                              <ul>
                                @for (link of sub.items; track $index; let k = $index) {
                                  @let key4 = key + '-' + k;
                                  @let withDepth4 = !!link.items?.length;
                                  <li>
                                    <a
                                      #depth3Trigger
                                      class="depth3-trigger"
                                      [href]="link.href || '#'"
                                      [krdsExternal]="!withDepth4 && !!link.external"
                                      [class.has-depth4]="withDepth4"
                                      [class.selected]="link.selected"
                                      [attr.aria-haspopup]="withDepth4 ? 'true' : null"
                                      [attr.aria-expanded]="withDepth4 ? (depth4Opened() === key4 ? 'true' : 'false') : null"
                                      (click)="withDepth4 && openDepth4($event, key4, depth3Trigger); onItemClick(link, $event)"
                                    >
                                      {{ link.text }}
                                    </a>
                                    @if (withDepth4) {
                                      <div
                                        class="depth4-wrap"
                                        [class.is-open]="depth4Opened() === key4"
                                        [style.display]="depth4Displayed() === key4 ? 'block' : null"
                                      >
                                        <div class="depth4-head">
                                          <button type="button" class="krds-btn icon trigger-prev" (click)="closeDepth4()">
                                            <span class="sr-only">이전화면</span><i class="svg-icon ico-angle left"></i>
                                          </button>
                                          <button type="button" class="krds-btn icon trigger-close" (click)="closeDepth4()">
                                            <span class="sr-only">{{ closeLabel() }}</span
                                            ><i class="svg-icon ico-popup-close"></i>
                                          </button>
                                        </div>
                                        <div class="depth4-body">
                                          <h4 class="sub-title">{{ link.panelTitle || link.text }}</h4>
                                          <ul class="depth4-ul">
                                            @for (depth4 of link.items; track $index) {
                                              <li>
                                                <a
                                                  [href]="depth4.href || '#'"
                                                  [krdsExternal]="!!depth4.external"
                                                  [class.selected]="depth4.selected"
                                                  (click)="onItemClick(depth4, $event)"
                                                >
                                                  {{ depth4.text }}
                                                </a>
                                              </li>
                                            }
                                          </ul>
                                        </div>
                                      </div>
                                    }
                                  </li>
                                }
                              </ul>
                            </div>
                          }
                        </li>
                      }
                    </ul>
                  </div>
                }
              </div>
            </div>
            <ng-content select="[krdsMainMenuBottom]" />
          </div>
          <button type="button" id="close-nav" class="krds-btn medium icon" (click)="open.set(false)">
            <span class="sr-only">{{ closeLabel() }}</span
            ><i class="svg-icon ico-popup-close"></i>
          </button>
        </div>
      </div>
    }

    <ng-template
      #subList
      let-id="id"
      let-title="title"
      let-titleLink="titleLink"
      let-links="links"
      let-layout="layout"
      let-single="single"
      let-active="active"
      let-banner="banner"
      let-bannerContext="bannerContext"
    >
      @let described = hasDescription(links);
      <div class="gnb-sub-list" [attr.id]="id" [class.active]="active" [class.between]="layout === 'between'" [class.single-list]="single">
        <div class="gnb-sub-content">
          <h2 class="sub-title">
            @if (titleLink) {
              {{ title }}
              <a class="krds-btn link basic small" [href]="titleLink.href">
                <span class="underline">{{ titleLink.text || '바로가기' }}</span
                ><i class="svg-icon ico-angle right"></i>
              </a>
            } @else {
              <span>{{ title }}</span>
            }
          </h2>
          <ul [class.type-description]="described">
            @for (link of links; track $index) {
              <li>
                @if (described) {
                  <h3 class="tit">
                    <a
                      [href]="link.href || '#'"
                      [krdsExternal]="!!link.external"
                      [class.active]="link.selected"
                      (click)="onItemClick(link, $event)"
                    >
                      {{ link.text }}
                      @if (link.external) {
                        <i class="svg-icon ico-go"></i>
                      }
                    </a>
                  </h3>
                  @if (link.description) {
                    <p class="txt">{{ link.description }}</p>
                  }
                } @else if (link.href) {
                  <a [href]="link.href" [krdsExternal]="!!link.external" [class.active]="link.selected" (click)="onItemClick(link, $event)">
                    {{ link.text }}
                    @if (link.external) {
                      <i class="svg-icon ico-go"></i>
                    }
                  </a>
                } @else {
                  <button type="button" [class.active]="link.selected" (click)="onItemClick(link, $event)">{{ link.text }}</button>
                }
              </li>
            }
          </ul>
        </div>
        @if (banner && bannerTemplate(); as template) {
          <div class="gnb-sub-banner">
            <ng-container *ngTemplateOutlet="template.template; context: bannerContext" />
          </div>
        }
      </div>
    </ng-template>
  `
})
export class KrdsMainMenu {
  /** 메뉴 항목 */
  readonly items = input<KrdsMainMenuItem[]>([])
  /** 렌더링 방식 */
  readonly variant = input<KrdsMainMenuVariant>('pc')
  /** 메뉴 이름 */
  readonly label = input('메인 메뉴')
  /** 모바일 드로어 열림 */
  readonly open = model(false)
  /** 모바일 드로어 id (바깥 열기 버튼의 aria-controls 대상) */
  readonly mobileId = input('mobile-nav')
  /** PC 패널이 열리면 배경을 어둡게 */
  readonly backdrop = input(true, { transform: booleanAttribute })
  /** 모바일 닫기 버튼 문구 */
  readonly closeLabel = input('전체메뉴 닫기')

  /** PC 패널을 열거나 닫았을 때 */
  readonly menuToggle = output<KrdsMainMenuToggle>()
  /** 메뉴 항목을 클릭했을 때 */
  readonly itemClick = output<KrdsMainMenuClick>()

  protected readonly bannerTemplate = contentChild(KrdsMainMenuBanner)

  private readonly uid = nextId++
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  private readonly document = inject(DOCUMENT)
  private readonly injector = inject(Injector)

  // PC 상태
  protected readonly openIndex = signal(-1)
  private readonly subOverrides = signal<Record<number, number>>({})
  protected readonly panelMinHeight = signal(0)
  private backdropEl: HTMLElement | null = null

  // 모바일 상태
  protected readonly activeTab = signal(0)
  private readonly depth3Expanded = signal<Record<string, boolean>>({})
  protected readonly depth4Displayed = signal<string | null>(null)
  protected readonly depth4Opened = signal<string | null>(null)
  protected readonly drawerDisplayed = signal(false)
  protected readonly drawerOpened = signal(false)
  private depth4Trigger: HTMLElement | null = null
  private previousFocus: HTMLElement | null = null
  private drawerTimer?: ReturnType<typeof setTimeout>
  private drawerInitialized = false

  constructor() {
    // 모바일 드로어: 처음에는 전환 없이 상태를 맞추고, 이후에는 원본처럼 전환 시간에 맞춰 연다·닫는다 (브라우저에서만)
    afterRenderEffect(() => {
      const open = this.open()
      untracked(() => {
        if (this.variant() !== 'mobile') return
        if (!this.drawerInitialized) {
          this.drawerInitialized = true
          this.depth3Expanded.set(this.initialDepth3())
          if (!open) return
          this.drawerDisplayed.set(true)
          this.drawerOpened.set(true)
          this.document.body.classList.add('is-gnb-mobile')
          return
        }
        if (open) this.openDrawer()
        else this.closeDrawer()
      })
    })
    // PC: 패널이 열리면 body 상태 클래스(스크롤 잠금)와 배경 딤을 맞춘다
    afterRenderEffect(() => {
      const isOpen = this.openIndex() !== -1
      untracked(() => {
        const body = this.document.body
        body.classList.toggle('is-gnb-web', isOpen)
        body.classList.toggle('hasScrollY', isOpen && body.scrollHeight > window.innerHeight)
        if (isOpen && this.backdrop() && !this.backdropEl) {
          // 쌓임 순서에 가리지 않게 body에 둔다 (Vue의 Teleport)
          this.backdropEl = this.document.createElement('div')
          this.backdropEl.className = 'gnb-backdrop active'
          this.backdropEl.setAttribute('aria-hidden', 'true')
          body.appendChild(this.backdropEl)
        } else if (!isOpen) {
          this.removeBackdrop()
        }
      })
    })
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.drawerTimer)
      this.removeBackdrop()
      this.document.body.classList.remove('is-gnb-web', 'hasScrollY', 'is-gnb-mobile')
    })
  }

  protected panelId(i: number) {
    return `krds-gnb-${this.uid}-panel-${i}`
  }

  protected subPanelId(i: number, j: number) {
    return `krds-gnb-${this.uid}-sub-${i}-${j}`
  }

  protected tabId(i: number) {
    return `krds-gnb-${this.uid}-tab-${i}`
  }

  protected depth3Id(i: number, j: number) {
    return `krds-gnb-${this.uid}-depth3-${i}-${j}`
  }

  protected hasPanel(item: KrdsMainMenuItem) {
    return !!item.subItems?.length || !!item.items?.length
  }

  protected hasDescription(links?: KrdsMainMenuLinkItem[]) {
    return !!links?.some(link => link.description)
  }

  protected onItemClick(item: KrdsMainMenuClick['item'], event: MouseEvent) {
    this.itemClick.emit({ item, event })
    // 라우터처럼 페이지를 새로 읽지 않는 이동에서도 패널이 남지 않게 닫고 초점을 1단계 버튼으로 돌려준다 (패널 전환 버튼은 제외)
    if ((event.currentTarget as Element | null)?.tagName === 'A') this.closeMain(true)
  }

  // ===== PC =====

  /** 원본처럼 링크가 아닌 첫 2단계를 기본으로 연다 */
  protected activeSub(i: number) {
    return this.subOverrides()[i] ?? this.items()[i]?.subItems?.findIndex(sub => !!sub.items?.length) ?? -1
  }

  private mainTriggers() {
    return [...this.host.querySelectorAll<HTMLElement>('.gnb-menu > li > .gnb-main-trigger')]
  }

  protected toggleMain(i: number) {
    if (this.openIndex() === i) return this.closeMain()
    this.closeMain()
    this.openIndex.set(i)
    this.menuToggle.emit({ index: i, expanded: true })
    this.adjustPanelHeight()
  }

  protected closeMain(restoreFocus = false) {
    const index = this.openIndex()
    if (index === -1) return
    this.openIndex.set(-1)
    this.panelMinHeight.set(0)
    this.menuToggle.emit({ index, expanded: false })
    if (restoreFocus) this.mainTriggers()[index]?.focus()
  }

  protected selectSub(i: number, j: number) {
    this.subOverrides.update(overrides => ({ ...overrides, [i]: j }))
    this.adjustPanelHeight()
  }

  /** 서브 패널이 absolute라 열린 패널 높이에 맞춰 목록 최소 높이를 맞춘다 */
  private adjustPanelHeight() {
    afterNextRender(
      () => {
        const active = this.host.querySelectorAll('.gnb-main-list')[this.openIndex()]?.querySelector<HTMLElement>('.gnb-sub-list.active')
        this.panelMinHeight.set(active?.scrollHeight ?? 0)
      },
      { injector: this.injector }
    )
  }

  private removeBackdrop() {
    this.backdropEl?.remove()
    this.backdropEl = null
  }

  protected onDocumentClick(event: MouseEvent) {
    if (this.variant() === 'pc' && !this.host.contains(event.target as Node)) this.closeMain()
  }

  protected onPcFocusout(event: FocusEvent, root: HTMLElement) {
    const next = event.relatedTarget as Node | null
    if (next && !root.contains(next)) this.closeMain()
  }

  protected onPcKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') return this.closeMain(true)
    const target = event.target as HTMLElement
    if (!target.dataset['trigger']) return
    const triggers = this.mainTriggers()
    const sibling = (direction: 'next' | 'prev') => {
      const li = target.closest('li')
      return (direction === 'next' ? li?.nextElementSibling : li?.previousElementSibling)?.querySelector<HTMLElement>('[data-trigger]')
    }
    const next = {
      Home: triggers[0],
      End: triggers[triggers.length - 1],
      ArrowRight: sibling('next'),
      ArrowDown: sibling('next'),
      ArrowLeft: sibling('prev'),
      ArrowUp: sibling('prev')
    }[event.key]
    if (next === undefined && !['Home', 'End', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return
    event.preventDefault()
    next?.focus()
  }

  // ===== 모바일 =====

  /** PC와 같은 메뉴 데이터로 쓰도록 single-list(items)와 하위 메뉴 없는 링크도 패널에 링크로 보여 준다 */
  protected mobileSubItems(item: KrdsMainMenuItem): KrdsMainMenuSubItem[] {
    if (item.subItems) return item.subItems
    const links = item.items ?? (item.href ? [item] : [])
    return links.map(({ text, href, external, selected }) => ({ text, href, external, selected }))
  }

  private initialDepth3() {
    const expanded: Record<string, boolean> = {}
    this.items().forEach((item, i) => item.subItems?.forEach((sub, j) => sub.expanded && (expanded[`${i}-${j}`] = true)))
    return expanded
  }

  protected depth3Open(key: string) {
    return !!this.depth3Expanded()[key]
  }

  protected toggleDepth3(event: MouseEvent, key: string) {
    event.preventDefault()
    this.depth3Expanded.update(expanded => ({ ...expanded, [key]: !expanded[key] }))
  }

  /** 4단계 패널: 먼저 보이게 한 뒤 열림 클래스를 붙이고(전환), 이전화면 버튼으로 초점 */
  protected openDepth4(event: MouseEvent, key: string, trigger: HTMLElement) {
    event.preventDefault()
    this.depth4Trigger = trigger
    this.depth4Displayed.set(key)
    afterNextRender(
      () => {
        this.depth4Opened.set(key)
        afterNextRender(() => this.host.querySelector<HTMLElement>('.depth4-wrap.is-open .trigger-prev')?.focus(), {
          injector: this.injector
        })
      },
      { injector: this.injector }
    )
  }

  protected closeDepth4() {
    this.depth4Opened.set(null)
    this.depth4Trigger?.focus()
    this.depth4Trigger = null
    setTimeout(() => !this.depth4Opened() && this.depth4Displayed.set(null), DRAWER_CLOSE_DELAY)
  }

  /** 1단계 탭을 누르면 해당 패널 위치로 스크롤 */
  protected onTabClick(event: MouseEvent, i: number, body: HTMLElement) {
    event.preventDefault()
    this.activeTab.set(i)
    const panel = body.querySelectorAll<HTMLElement>('.gnb-sub-list')[i]
    if (panel) body.scrollTo({ left: 0, top: panel.offsetTop, behavior: 'smooth' })
  }

  /** 스크롤 위치에 따라 활성 탭 */
  protected onBodyScroll(body: HTMLElement) {
    const { scrollTop, scrollHeight, clientHeight } = body
    let active = this.activeTab()
    body.querySelectorAll<HTMLElement>('.gnb-sub-list').forEach((panel, i) => {
      if (scrollTop >= panel.offsetTop || scrollTop + clientHeight >= scrollHeight) active = i
    })
    this.activeTab.set(active)
  }

  private openDrawer() {
    clearTimeout(this.drawerTimer)
    this.previousFocus = this.document.activeElement as HTMLElement | null
    this.drawerDisplayed.set(true)
    // display를 바꾼 직후에는 전환이 동작하지 않으므로 원본처럼 조금 뒤에 열림 클래스를 붙인다
    this.drawerTimer = setTimeout(() => {
      this.drawerOpened.set(true)
      this.document.body.classList.add('is-gnb-mobile')
      const root = this.host.querySelector<HTMLElement>('.krds-main-menu-mobile')
      const focusDrawer = () => this.drawerOpened() && this.host.querySelector<HTMLElement>('.gnb-wrap')?.focus()
      // visibility 전환이 끝나야 초점을 받을 수 있다. 전환이 없으면 그린 뒤 바로
      root?.addEventListener('transitionend', focusDrawer, { once: true })
      requestAnimationFrame(() => !root?.getAnimations().length && focusDrawer())
    }, DRAWER_OPEN_DELAY)
  }

  private closeDrawer() {
    clearTimeout(this.drawerTimer)
    this.drawerOpened.set(false)
    this.previousFocus?.focus()
    this.previousFocus = null
    this.drawerTimer = setTimeout(() => {
      this.drawerDisplayed.set(false)
      this.document.body.classList.remove('is-gnb-mobile')
    }, DRAWER_CLOSE_DELAY)
  }

  protected onMobileKeydown(event: KeyboardEvent, wrap: HTMLElement) {
    if (event.key === 'Escape') {
      if (this.depth4Opened()) this.closeDepth4()
      else this.open.set(false)
      return
    }
    if (event.key !== 'Tab') return
    const container = this.host.querySelector<HTMLElement>('.depth4-wrap.is-open') ?? wrap
    const focusable = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)]
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = this.document.activeElement
    if (event.shiftKey && (active === first || active === container)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }
}
