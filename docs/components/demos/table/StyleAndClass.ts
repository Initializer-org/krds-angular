import { Component } from '@angular/core'
import { KrdsTable, type KrdsTableColumn } from '@krds.ui/angular'

interface Row {
  id: number
  name: string
  score: number
  status: 'PASS' | 'FAIL'
}

@Component({
  selector: 'demo-table-style-and-class',
  imports: [KrdsTable],
  template: ` <krds-table caption="헤더와 바디에 스타일/클래스가 적용된 테이블" tableClass="col data" [columns]="columns" [rows]="rows" /> `
})
export default class TableStyleAndClass {
  readonly columns: KrdsTableColumn<Row>[] = [
    {
      name: 'id',
      label: 'ID',
      field: 'id',
      headerStyle: 'width: 80px',
      headerClasses: 'bg-gray-100 text-center font-bold',
      style: 'width: 80px',
      classes: 'text-center',
      align: 'center'
    },
    {
      name: 'name',
      label: '이름',
      field: 'name',
      headerStyle: 'width: 150px; color: #333',
      classes: 'font-medium'
    },
    {
      name: 'score',
      label: '점수',
      field: 'score',
      headerStyle: 'width: 100px',
      headerClasses: 'text-right',
      classes: row => (row.score >= 80 ? 'score-high text-right' : 'score-low text-right'),
      align: 'right'
    },
    {
      name: 'status',
      label: '상태',
      field: 'status',
      headerClasses: 'text-center',
      classes: row => `status-${row.status.toLowerCase()} text-center`,
      align: 'center'
    }
  ]
  readonly rows: Row[] = [
    { id: 1, name: '김철수', score: 95, status: 'PASS' },
    { id: 2, name: '이영희', score: 78, status: 'FAIL' },
    { id: 3, name: '박민수', score: 88, status: 'PASS' },
    { id: 4, name: '정수진', score: 92, status: 'PASS' }
  ]
}
