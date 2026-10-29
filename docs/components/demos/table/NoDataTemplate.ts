import { Component } from '@angular/core'
import { KrdsTable, KrdsTableNoData, type KrdsTableColumn } from '@krds.ui/angular'

interface Row {
  id: number
  name: string
  email: string
}

@Component({
  selector: 'demo-table-no-data-template',
  imports: [KrdsTable, KrdsTableNoData],
  template: `
    <krds-table caption="빈 목록 템플릿이 있는 테이블" tableClass="col data" [columns]="columns" [rows]="[]">
      <ng-template krdsNoData>
        <div style="padding: 2rem; text-align: center; color: #666">
          <div style="font-size: 1.2rem; margin-bottom: 0.5rem">데이터를 찾을 수 없습니다</div>
          <div style="font-size: 0.9rem">새로운 데이터를 추가해보세요</div>
        </div>
      </ng-template>
    </krds-table>
  `
})
export default class TableNoDataTemplate {
  readonly columns: KrdsTableColumn<Row>[] = [
    { name: 'id', label: 'ID', field: 'id' },
    { name: 'name', label: '이름', field: 'name' },
    { name: 'email', label: '이메일', field: 'email' }
  ]
}
