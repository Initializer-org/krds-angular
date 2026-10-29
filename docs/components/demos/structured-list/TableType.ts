import { Component, computed, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
  KrdsButton,
  KrdsCheckArea,
  KrdsCheckbox,
  KrdsControl,
  KrdsPagination,
  KrdsSelect,
  KrdsTable,
  KrdsTableCell,
  KrdsTableHeader,
  type KrdsTableColumn
} from '@krds.ui/angular'

interface Notice {
  id: number
  type: string
  title: string
  summary: string
  date: string
  views: number
}

@Component({
  selector: 'demo-structured-list-table-type',
  imports: [
    FormsModule,
    KrdsButton,
    KrdsCheckArea,
    KrdsCheckbox,
    KrdsControl,
    KrdsPagination,
    KrdsSelect,
    KrdsTable,
    KrdsTableCell,
    KrdsTableHeader
  ],
  template: `
    <div class="krds-structured-list-table">
      <div class="search-list-top">
        <div class="sch-left">
          <div krdsCheckArea>
            <krds-checkbox>
              <input type="checkbox" krdsControl id="table-type-chk-all" [ngModel]="allChecked()" (ngModelChange)="toggleAll($event)" />
              전체선택
            </krds-checkbox>
          </div>
          <ul class="side-line-ul">
            <li>
              <button krdsButton text size="medium" [disabled]="!selected().length">
                <i class="svg-icon ico-down" aria-hidden="true"></i> 선택 다운로드
              </button>
            </li>
            <li>
              <button krdsButton text size="medium"><i class="svg-icon ico-down" aria-hidden="true"></i> 전체 다운로드</button>
            </li>
          </ul>
        </div>
        <ul class="sch-sort">
          <li>
            <strong class="sort-label"><label for="table-type-size">목록 표시 개수</label></strong>
            <select krdsSelect sort id="table-type-size" [ngModel]="size()" (ngModelChange)="size.set($event); page.set(1)">
              @for (option of sizeOptions; track option.value) {
                <option [ngValue]="option.value">{{ option.label }}</option>
              }
            </select>
          </li>
          <li>
            <strong class="sort-label"><label for="table-type-sort">정렬기준</label></strong>
            <!-- PC는 버튼, 모바일은 셀렉트로 정렬 기준을 고른다 -->
            <div class="w-sort-btn" role="group" aria-label="정렬기준">
              @for (option of sortOptions; track option.value) {
                <button
                  type="button"
                  [class.active]="sort() === option.value"
                  [attr.aria-pressed]="sort() === option.value"
                  (click)="setSort(option.value)"
                >
                  {{ option.label }}
                </button>
              }
            </div>
            <div class="m-sort-btn">
              <select krdsSelect sort id="table-type-sort" [ngModel]="sort()" (ngModelChange)="setSort($event)">
                @for (option of sortOptions; track option.value) {
                  <option [value]="option.value">{{ option.label }}</option>
                }
              </select>
            </div>
          </li>
        </ul>
      </div>

      <krds-table
        caption="게시물 목록: 선택, 유형, 제목, 내용, 다운로드, 게시일로 구성"
        tableClass="col data"
        [columns]="columns"
        [rows]="rows()"
      >
        <ng-template krdsCell="select" [krdsCellOf]="rows()" let-row>
          <krds-checkbox>
            <input
              type="checkbox"
              krdsControl
              [id]="'table-type-chk-' + row.id"
              [ngModel]="selected().includes(row.id)"
              (ngModelChange)="toggleRow(row.id, $event)"
            />
            <span class="sr-only">{{ row.title }} 선택</span>
          </krds-checkbox>
        </ng-template>
        <ng-template krdsHeader="download"><span class="sr-only">다운로드</span></ng-template>
        <ng-template krdsCell="download" [krdsCellOf]="rows()" let-row>
          <button krdsButton text size="medium">
            <i class="svg-icon ico-down" aria-hidden="true"></i> 다운로드<span class="sr-only">: {{ row.title }}</span>
          </button>
        </ng-template>
      </krds-table>

      <nav krdsPagination label="게시물 목록 페이지" [max]="maxPage()" [(page)]="page"></nav>
    </div>
  `
})
export default class StructuredListTableType {
  readonly items: Notice[] = [
    {
      id: 1,
      type: '공지',
      title: '2026년 하반기 민원 서비스 개편 안내',
      summary: '민원 신청 화면이 새 디자인 시스템으로 바뀝니다.',
      date: '2026.10.02',
      views: 812
    },
    {
      id: 2,
      type: '보도자료',
      title: '디지털 정부 서비스 만족도 조사 결과',
      summary: '전년 대비 만족도가 4.2점 올랐습니다.',
      date: '2026.09.28',
      views: 1540
    },
    {
      id: 3,
      type: '고시',
      title: '전자문서 보존 기간 기준 개정 고시',
      summary: '보존 기간 산정 기준이 일부 바뀝니다.',
      date: '2026.09.15',
      views: 402
    },
    {
      id: 4,
      type: '공지',
      title: '추석 연휴 고객센터 운영 시간 안내',
      summary: '연휴 기간 전화 상담은 오전에만 운영합니다.',
      date: '2026.09.10',
      views: 2210
    },
    {
      id: 5,
      type: '보도자료',
      title: '공공 누리집 접근성 점검 결과 발표',
      summary: '점검 대상 누리집의 91%가 기준을 충족했습니다.',
      date: '2026.08.30',
      views: 967
    },
    {
      id: 6,
      type: '공지',
      title: '본인 인증 수단 추가 안내',
      summary: '간편 인증으로 민원을 신청할 수 있습니다.',
      date: '2026.08.21',
      views: 1325
    },
    {
      id: 7,
      type: '고시',
      title: '행정정보 공동이용 대상 정보 고시',
      summary: '공동이용 대상 정보 3종이 추가됩니다.',
      date: '2026.08.12',
      views: 288
    }
  ]
  readonly columns: KrdsTableColumn<Notice>[] = [
    { name: 'select', label: '선택', headerStyle: 'width: 6%' },
    { name: 'type', label: '유형', field: 'type', headerStyle: 'width: 10%' },
    { name: 'title', label: '제목', field: 'title', headerStyle: 'width: 28%' },
    { name: 'summary', label: '내용', field: 'summary' },
    { name: 'download', label: '다운로드', headerStyle: 'width: 12%' },
    { name: 'date', label: '게시일', field: 'date', headerStyle: 'width: 12%' }
  ]
  readonly sortOptions = [
    { value: 'relevance', label: '관련도순' },
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' }
  ]
  readonly sizeOptions = [
    { value: 5, label: '5개' },
    { value: 10, label: '10개' }
  ]

  readonly sort = signal('relevance')
  readonly size = signal(5)
  readonly page = signal(1)
  readonly selected = signal<number[]>([])

  readonly sorted = computed(() => {
    if (this.sort() === 'latest') return [...this.items].sort((a, b) => b.date.localeCompare(a.date))
    if (this.sort() === 'popular') return [...this.items].sort((a, b) => b.views - a.views)
    return this.items
  })
  readonly maxPage = computed(() => Math.ceil(this.items.length / this.size()))
  readonly rows = computed(() => this.sorted().slice((this.page() - 1) * this.size(), this.page() * this.size()))
  // 전체선택은 지금 페이지의 행 기준
  readonly allChecked = computed(() => this.rows().every(row => this.selected().includes(row.id)))

  // 정렬 기준을 바꾸면 첫 페이지로
  setSort(value: string) {
    this.sort.set(value)
    this.page.set(1)
  }

  toggleAll(checked: boolean) {
    const ids = this.rows().map(row => row.id)
    this.selected.update(selected => (checked ? [...new Set([...selected, ...ids])] : selected.filter(id => !ids.includes(id))))
  }

  toggleRow(id: number, checked: boolean) {
    this.selected.update(selected => (checked ? [...selected, id] : selected.filter(item => item !== id)))
  }
}
