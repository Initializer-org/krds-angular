import { Component, signal } from '@angular/core'
import { classesOf, expectNoA11yViolations, render, user } from '../../test/render'
import { KrdsBadge } from '../badge/badge'
import { KrdsTable, KrdsTableCell, KrdsTableHeader, KrdsTableNoData, type KrdsTableColumn, type KrdsTableRowClick } from './table'

interface Application {
  id: number
  name: string
  status: string
  fee: number
}

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({
  imports: [KrdsTable, KrdsTableCell, KrdsTableHeader, KrdsTableNoData, KrdsBadge],
  template: '<krds-table [columns]="columns" [rows]="rows()" />'
})
class Host {
  readonly columns: KrdsTableColumn<Application>[] = [
    { name: 'name', label: '신청 항목', field: 'name', headerStyle: 'width: 40%' },
    { name: 'status', label: '상태', field: 'status', align: 'center' },
    { name: 'fee', label: '수수료', field: row => `${row.fee.toLocaleString()}원`, align: 'right', classes: row => (row.fee ? 'paid' : '') }
  ]
  readonly rows = signal<Application[]>([
    { id: 1, name: '주민등록등본', status: '처리 중', fee: 0 },
    { id: 2, name: '가족관계증명서', status: '완료', fee: 1000 }
  ])
  readonly clicks: KrdsTableRowClick<Application>[] = []
}

describe('KrdsTable', () => {
  it('KRDS 마크업: 제목·colgroup 너비·머리글, 첫 열은 행 머리글, 정렬·셀 클래스', async () => {
    const { $, $$ } = await render(Host, '<krds-table caption="신청 내역" tableClass="col data" [columns]="columns" [rows]="rows()" />')
    expect($('krds-table').className).toBe('krds-table-wrap')
    expect(classesOf($('table'))).toEqual(['col', 'data', 'tbl'])
    expect($('caption').textContent?.trim()).toBe('신청 내역')
    expect($$<HTMLElement>('col').map(col => col.style.width)).toEqual(['40%', '', ''])
    expect($$('thead th').map(th => [th.getAttribute('scope'), th.textContent?.trim()])).toEqual([
      ['col', '신청 항목'],
      ['col', '상태'],
      ['col', '수수료']
    ])
    expect($('thead th').getAttribute('style')).toBe('width: 40%;')
    const [first, second] = $$('tbody tr')
    expect(first.firstElementChild?.tagName).toBe('TH')
    expect(first.firstElementChild?.getAttribute('scope')).toBe('row')
    expect(second.textContent?.replace(/\s+/g, ' ').trim()).toBe('가족관계증명서 완료 1,000원')
    expect(classesOf(second.children[2])).toEqual(['paid', 'text-right'])
    expect(classesOf(first.children[1])).toEqual(['text-center'])
    // clickable이 아니면 행은 초점을 받지 않는다
    expect(first.hasAttribute('tabindex')).toBe(false)
  })

  it('셀·머리글 템플릿과 빈 목록', async () => {
    const { host, $, $$, stable } = await render(
      Host,
      `
        <krds-table [columns]="columns" [rows]="rows()">
          <ng-template krdsCell="status" let-row let-value="value" let-index="index">
            <span krdsBadge [color]="value === '완료' ? 'success' : 'primary'">{{ index + 1 }}. {{ value }} ({{ row.id }})</span>
          </ng-template>
          <ng-template krdsHeader="fee" let-column><abbr title="수수료(원)">{{ column.label }}</abbr></ng-template>
          <ng-template krdsNoData>신청 내역이 없습니다.</ng-template>
        </krds-table>
      `
    )
    expect($$('tbody .krds-badge').map(badge => badge.textContent?.trim())).toEqual(['1. 처리 중 (1)', '2. 완료 (2)'])
    expect($('thead abbr').textContent).toBe('수수료')

    host.rows.set([])
    await stable()
    const empty = $('tbody td')
    expect(empty.getAttribute('colspan')).toBe('3')
    expect(empty.className).toBe('text-center')
    expect(empty.textContent?.trim()).toBe('신청 내역이 없습니다.')
  })

  it('행이 없고 빈 목록 템플릿이 없으면 기본 문구', async () => {
    const { host, $, stable } = await render(Host, '<krds-table [columns]="columns" [rows]="rows()" />')
    host.rows.set([])
    await stable()
    expect($('tbody td').textContent?.trim()).toBe('데이터가 없습니다.')
  })

  it('clickable: 클릭·Enter·Space로 행 선택, 셀 안 버튼 클릭은 제외', async () => {
    const { host, $$, click } = await render(
      Host,
      `
        <krds-table [columns]="columns" [rows]="rows()" clickable (rowClick)="clicks.push($event)">
          <ng-template krdsCell="status" let-value="value"><button type="button">{{ value }}</button></ng-template>
        </krds-table>
      `
    )
    const [first, second] = $$('tbody tr')
    expect(first.getAttribute('tabindex')).toBe('0')
    await click(first.children[0])
    await click(second.querySelector('button')!)
    second.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(host.clicks.map(({ row, index }) => [row.id, index])).toEqual([
      [1, 0],
      [2, 1],
      [2, 1]
    ])
  })

  it('접근성 위반이 없다', async () => {
    const { el } = await render(
      Host,
      '<krds-table caption="신청 내역" tableClass="col data" [columns]="columns" [rows]="rows()" clickable />'
    )
    await expectNoA11yViolations(el)
  })
})
