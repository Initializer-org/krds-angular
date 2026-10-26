import { Component } from '@angular/core'
import {
  KrdsBadge,
  KrdsButton,
  KrdsTable,
  KrdsTableCell,
  KrdsTableHeader,
  type KrdsBadgeColor,
  type KrdsTableColumn
} from '@krds.ui/angular'

interface Row {
  id: number
  title: string
  status: string
  date: string
}

@Component({
  selector: 'demo-table-cell-template',
  imports: [KrdsTable, KrdsTableCell, KrdsTableHeader, KrdsBadge, KrdsButton],
  template: `
    <krds-table caption="민원 신청 내역: 민원명, 처리 상태, 신청일, 관리로 구성" tableClass="col data" [columns]="columns" [rows]="rows">
      <ng-template krdsCell="status" [krdsCellOf]="rows" let-row>
        <span krdsBadge type="bg-light" [color]="badgeColor[row.status] ?? 'gray'">{{ row.status }}</span>
      </ng-template>
      <ng-template krdsHeader="action"><span class="sr-only">관리</span></ng-template>
      <ng-template krdsCell="action" [krdsCellOf]="rows" let-row>
        <button krdsButton text size="small">
          상세 보기<span class="sr-only">: {{ row.title }}</span>
        </button>
      </ng-template>
    </krds-table>
  `
})
export default class TableCellTemplate {
  readonly columns: KrdsTableColumn<Row>[] = [
    { name: 'title', label: '민원명', field: 'title', headerStyle: 'width: 40%' },
    { name: 'status', label: '처리 상태', field: 'status' },
    { name: 'date', label: '신청일', field: 'date' },
    // 템플릿으로만 그리는 열은 field를 생략한다
    { name: 'action', label: '관리' }
  ]
  readonly rows: Row[] = [
    { id: 1, title: '주민등록표 등본 발급', status: '완료', date: '2026.10.02' },
    { id: 2, title: '전입 신고', status: '처리 중', date: '2026.10.05' },
    { id: 3, title: '여권 재발급', status: '반려', date: '2026.10.07' }
  ]
  readonly badgeColor: Record<string, KrdsBadgeColor> = { 완료: 'success', '처리 중': 'information', 반려: 'danger' }
}
