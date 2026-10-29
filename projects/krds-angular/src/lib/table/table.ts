import {
  Component,
  Directive,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  output
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'

/** 표의 열 */
export interface KrdsTableColumn<T = object> {
  /** 열 이름 (셀·머리글 템플릿을 고를 때 씀) */
  name: string
  /** 머리글 */
  label: string
  /** 셀 값: 행의 속성 이름 또는 행에서 값을 만드는 함수 */
  field?: (keyof T & string) | ((row: T) => unknown)
  /** 정렬 */
  align?: 'left' | 'center' | 'right'
  /** 셀 스타일 */
  style?: string | ((row: T) => string)
  /** 셀 클래스 */
  classes?: string | ((row: T) => string)
  /** 머리글 스타일 (width가 있으면 colgroup 너비로도 씀) */
  headerStyle?: string
  /** 머리글 클래스 */
  headerClasses?: string
}

/** 셀 템플릿 컨텍스트 */
export interface KrdsTableCellContext<T = object> {
  $implicit: T
  row: T
  column: KrdsTableColumn<T>
  value: unknown
  index: number
}

/** 행 클릭 이벤트 */
export interface KrdsTableRowClick<T = object> {
  row: T
  index: number
}

/**
 * 열 이름별 셀 템플릿 (`<ng-template krdsCell="status" let-row let-value="value">`).
 * `[krdsCellOf]="rows"`를 주면 템플릿의 row가 행 타입이 된다 (strictTemplates에서 row.title 같은 접근을 검사)
 */
@Directive({ selector: 'ng-template[krdsCell]' })
export class KrdsTableCell<T extends object = object> {
  readonly name = input.required<string>({ alias: 'krdsCell' })
  /** 행 목록 (템플릿의 row 타입을 정하는 데만 씀) */
  readonly rows = input<readonly T[]>(undefined, { alias: 'krdsCellOf' })
  readonly template = inject<TemplateRef<KrdsTableCellContext<T>>>(TemplateRef)

  static ngTemplateContextGuard<T extends object>(_dir: KrdsTableCell<T>, _ctx: unknown): _ctx is KrdsTableCellContext<T> {
    return true
  }
}

/** 머리글 템플릿 컨텍스트 */
export interface KrdsTableHeaderContext {
  $implicit: KrdsTableColumn
}

/** 열 이름별 머리글 템플릿 (`<ng-template krdsHeader="status" let-column>`) */
@Directive({ selector: 'ng-template[krdsHeader]' })
export class KrdsTableHeader {
  readonly name = input.required<string>({ alias: 'krdsHeader' })
  readonly template = inject<TemplateRef<KrdsTableHeaderContext>>(TemplateRef)

  static ngTemplateContextGuard(_dir: KrdsTableHeader, _ctx: unknown): _ctx is KrdsTableHeaderContext {
    return true
  }
}

/** 행이 없을 때 보여 줄 내용 (`<ng-template krdsNoData>`) */
@Directive({ selector: 'ng-template[krdsNoData]' })
export class KrdsTableNoData {
  readonly template = inject(TemplateRef)
}

const CONTROLS = 'a, button, input, select, textarea, label'

/**
 * KRDS 표. 열(`columns`)과 행(`rows`)으로 그리고, 첫 열은 행 머리글(th scope="row")이 된다.
 * 셀·머리글·빈 목록은 `<ng-template krdsCell="열 이름">` 등으로 바꿔 넣는다.
 * `clickable`이면 행을 클릭·Enter·Space로 고를 수 있다 (셀 안의 버튼·링크 클릭은 행 선택으로 보지 않음)
 *
 * @example
 * <krds-table caption="신청 내역" tableClass="col data" [columns]="columns" [rows]="rows" clickable (rowClick)="open($event.row)">
 *   <ng-template krdsCell="status" let-value="value"><span krdsBadge>{{ value }}</span></ng-template>
 * </krds-table>
 */
@Component({
  selector: 'krds-table',
  imports: [NgTemplateOutlet],
  host: { class: 'krds-table-wrap' },
  template: `
    <table class="tbl" [class]="tableClass()">
      @if (caption()) {
        <caption>
          {{
            caption()
          }}
        </caption>
      }
      @if (colWidths(); as widths) {
        <colgroup>
          @for (width of widths; track $index) {
            <col [style.width]="width" />
          }
        </colgroup>
      }
      <thead>
        <tr>
          @for (column of columns(); track column.name) {
            <th scope="col" [class]="headerClass(column)" [style]="column.headerStyle ?? null">
              @if (headerOf(column.name); as template) {
                <ng-container [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{ $implicit: column }" />
              } @else {
                {{ column.label }}
              }
            </th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track $index; let index = $index) {
          <tr
            [attr.tabindex]="clickable() ? 0 : null"
            (click)="onRowClick($event, row, index)"
            (keydown)="onRowKeydown($event, row, index)"
          >
            @for (column of columns(); track column.name; let first = $first) {
              @if (first) {
                <th scope="row" [class]="cellClass(row, column)" [style]="cellStyle(row, column)">
                  <ng-container [ngTemplateOutlet]="cell" [ngTemplateOutletContext]="{ row, column, index }" />
                </th>
              } @else {
                <td [class]="cellClass(row, column)" [style]="cellStyle(row, column)">
                  <ng-container [ngTemplateOutlet]="cell" [ngTemplateOutletContext]="{ row, column, index }" />
                </td>
              }
            }
          </tr>
        } @empty {
          <tr>
            <td class="text-center" [attr.colspan]="columns().length || 1">
              @if (noData(); as empty) {
                <ng-container [ngTemplateOutlet]="empty.template" />
              } @else {
                데이터가 없습니다.
              }
            </td>
          </tr>
        }
      </tbody>
    </table>

    <ng-template #cell let-row="row" let-column="column" let-index="index">
      @if (cellOf(column.name); as template) {
        <ng-container
          [ngTemplateOutlet]="template"
          [ngTemplateOutletContext]="{ $implicit: row, row, column, value: valueOf(row, column), index }"
        />
      } @else {
        {{ valueOf(row, column) }}
      }
    </ng-template>
  `
})
export class KrdsTable<T extends object> {
  /** 표 제목 (caption) */
  readonly caption = input<string>()
  /** 열 */
  readonly columns = input.required<KrdsTableColumn<T>[]>()
  /** 행 */
  readonly rows = input.required<T[]>()
  /** table 요소에 더 붙일 KRDS 클래스 (예: 'col data') */
  readonly tableClass = input<string>()
  /** 행을 클릭·Enter·Space로 고를 수 있게 함 */
  readonly clickable = input(false, { transform: booleanAttribute })

  /** 행을 골랐을 때 (clickable일 때) */
  readonly rowClick = output<KrdsTableRowClick<T>>()

  private readonly cells = contentChildren(KrdsTableCell)
  private readonly headers = contentChildren(KrdsTableHeader)
  protected readonly noData = contentChild(KrdsTableNoData)

  /** 머리글 스타일의 width를 colgroup 너비로 (하나도 없으면 colgroup 없음) */
  protected readonly colWidths = computed(() => {
    const widths = this.columns().map(column => column.headerStyle?.match(/width\s*:\s*([^;]+)/i)?.[1].trim() ?? null)
    return widths.some(Boolean) ? widths : null
  })

  protected cellOf(name: string) {
    return this.cells().find(cell => cell.name() === name)?.template ?? null
  }

  protected headerOf(name: string) {
    return this.headers().find(header => header.name() === name)?.template ?? null
  }

  protected valueOf(row: T, column: KrdsTableColumn<T>) {
    const { field } = column
    return typeof field === 'function' ? field(row) : field === undefined ? undefined : row[field]
  }

  protected headerClass(column: KrdsTableColumn<T>) {
    return [column.align && `text-${column.align}`, column.headerClasses].filter(Boolean).join(' ')
  }

  protected cellClass(row: T, column: KrdsTableColumn<T>) {
    const classes = typeof column.classes === 'function' ? column.classes(row) : column.classes
    return [column.align && `text-${column.align}`, classes].filter(Boolean).join(' ')
  }

  protected cellStyle(row: T, column: KrdsTableColumn<T>) {
    return (typeof column.style === 'function' ? column.style(row) : column.style) ?? null
  }

  protected onRowClick(event: MouseEvent, row: T, index: number) {
    if (!this.clickable()) return
    // 셀 안 컨트롤(체크박스·버튼 등) 클릭은 행 선택으로 보지 않는다
    const control = (event.target as Element).closest(CONTROLS)
    if (control && (event.currentTarget as Element).contains(control)) return
    this.rowClick.emit({ row, index })
  }

  protected onRowKeydown(event: KeyboardEvent, row: T, index: number) {
    if (!this.clickable() || event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return
    // Space의 페이지 스크롤 방지
    event.preventDefault()
    this.rowClick.emit({ row, index })
  }
}
