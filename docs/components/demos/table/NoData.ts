import { Component } from '@angular/core'
import { KrdsTable, type KrdsTableColumn } from '@krds.ui/angular'

interface Row {
  id: number
  name: string
  email: string
}

@Component({
  selector: 'demo-table-no-data',
  imports: [KrdsTable],
  template: ` <krds-table caption="데이터가 없는 테이블" tableClass="col data" [columns]="columns" [rows]="[]" /> `
})
export default class TableNoData {
  readonly columns: KrdsTableColumn<Row>[] = [
    { name: 'id', label: 'ID', field: 'id' },
    { name: 'name', label: '이름', field: 'name' },
    { name: 'email', label: '이메일', field: 'email' }
  ]
}
