import { Component, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { KrdsSelect } from '@krds.ui/angular'

@Component({
  selector: 'demo-select-sort',
  imports: [KrdsSelect, FormsModule],
  template: `
    <select krdsSelect sort aria-label="정렬 기준" [(ngModel)]="sort">
      <option value="latest">최신순</option>
      <option value="popular">인기순</option>
      <option value="name">이름순</option>
    </select>
  `
})
export default class SelectSort {
  readonly sort = signal('latest')
}
