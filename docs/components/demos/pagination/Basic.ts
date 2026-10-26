import { Component, signal } from '@angular/core'
import { KrdsPagination } from '@krds.ui/angular'

@Component({
  selector: 'demo-pagination-basic',
  imports: [KrdsPagination],
  template: `
    <nav krdsPagination [max]="99" [pageRange]="8" [(page)]="page"></nav>
    <p style="margin-top: 1.6rem">현재 페이지: {{ page() }}</p>
  `
})
export default class PaginationBasic {
  readonly page = signal(4)
}
