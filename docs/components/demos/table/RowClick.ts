import { Component, signal } from '@angular/core'
import { KrdsTable, type KrdsTableColumn, type KrdsTableRowClick } from '@krds.ui/angular'

interface Row {
  name: string
  score: number
}

@Component({
  selector: 'demo-table-row-click',
  imports: [KrdsTable],
  template: `
    <krds-table
      caption="행을 클릭하거나 Enter·Space로 선택하는 테이블"
      tableClass="col data"
      [columns]="columns"
      [rows]="rows"
      clickable
      (rowClick)="onRowClick($event)"
    />
    <p style="margin-top: 1.6rem">선택된 행: {{ selected() }}</p>
  `
})
export default class TableRowClick {
  readonly columns: KrdsTableColumn<Row>[] = [
    { name: 'name', label: '이름', field: 'name' },
    { name: 'score', label: '점수', field: 'score' }
  ]
  readonly rows: Row[] = [
    { name: '김철수', score: 95 },
    { name: '이영희', score: 78 },
    { name: '박민수', score: 88 }
  ]
  readonly selected = signal('없음')

  onRowClick({ row, index }: KrdsTableRowClick<Row>) {
    this.selected.set(`${row.name} (${index})`)
  }
}
