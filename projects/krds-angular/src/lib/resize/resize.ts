import { Component, DOCUMENT, afterRenderEffect, inject, model, output } from '@angular/core'
import { KrdsDropdown } from '../dropdown/dropdown'

/** 화면 크기 단계 */
export type KrdsResizeScale = 'sm' | 'md' | 'lg' | 'xlg' | 'xxlg'

const SCALES: { key: KrdsResizeScale; label: string; zoom: string }[] = [
  { key: 'sm', label: '작게', zoom: '0.9' },
  { key: 'md', label: '보통', zoom: '1' },
  { key: 'lg', label: '조금 크게', zoom: '1.1' },
  { key: 'xlg', label: '크게', zoom: '1.3' },
  { key: 'xxlg', label: '가장 크게', zoom: '1.5' }
]

/**
 * KRDS 화면 크기 조정. 목록에서 크기를 고르면 화면(body)을 확대·축소하고 `[(scale)]`를 바꾼 뒤 닫고 버튼으로 초점을 돌려준다
 *
 * @example <krds-resize [(scale)]="scale" />
 */
@Component({
  selector: 'krds-resize',
  hostDirectives: [KrdsDropdown],
  host: { class: 'krds-resize', 'data-adjust': 'scale' },
  template: `
    <button type="button" class="krds-btn small text drop-btn">화면크기 <i class="svg-icon ico-toggle" aria-hidden="true"></i></button>
    <div class="drop-menu">
      <div class="drop-in">
        <ul class="drop-list">
          @for (item of scales; track item.key) {
            <li>
              <button
                type="button"
                class="item-link"
                [class]="item.key"
                [class.active]="item.key === (scale() ?? 'md')"
                [attr.data-adjust-scale]="item.key"
                [attr.aria-pressed]="item.key === (scale() ?? 'md')"
                (click)="select(item.key)"
              >
                {{ item.label }}
              </button>
            </li>
          }
        </ul>
        <div class="drop-bottom">
          <button type="button" class="krds-btn medium text" data-adjust-scale="md" (click)="select('md')">
            <i class="svg-icon ico-reset" aria-hidden="true"></i> 초기화
          </button>
        </div>
      </div>
    </div>
  `
})
export class KrdsResize {
  /** 화면 크기 (넘기거나 고르기 전에는 화면을 바꾸지 않고 '보통'으로 표시) */
  readonly scale = model<KrdsResizeScale>()

  /** 크기를 골라 목록을 닫았을 때 */
  readonly closed = output<void>()

  protected readonly scales = SCALES
  private readonly dropdown = inject(KrdsDropdown)
  private readonly document = inject(DOCUMENT)

  constructor() {
    // 고른 크기를 화면에 적용한다 (바깥에서 바꾼 값 포함, 브라우저에서만)
    afterRenderEffect(() => {
      const zoom = SCALES.find(item => item.key === this.scale())?.zoom
      if (zoom) this.document.body.style.zoom = zoom
    })
  }

  protected select(key: KrdsResizeScale) {
    this.scale.set(key)
    this.dropdown.close(true)
    this.closed.emit()
  }
}
