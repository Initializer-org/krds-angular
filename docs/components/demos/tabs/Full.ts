import { Component } from '@angular/core'
import { KrdsTabPanel, KrdsTabs, type KrdsTabItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-tabs-full',
  imports: [KrdsTabs, KrdsTabPanel],
  template: `
    <div style="display: flex; flex-direction: column; gap: 4rem">
      <krds-tabs [tabs]="tabs" full>
        <ng-template krdsTabPanel="tab1">라인형 풀사이즈 탭 1 영역</ng-template>
        <ng-template krdsTabPanel="tab2">라인형 풀사이즈 탭 2 영역</ng-template>
      </krds-tabs>
      <krds-tabs [tabs]="tabs" variant="fill" full>
        <ng-template krdsTabPanel="tab1">버튼형 풀사이즈 탭 1 영역</ng-template>
        <ng-template krdsTabPanel="tab2">버튼형 풀사이즈 탭 2 영역</ng-template>
      </krds-tabs>
    </div>
  `
})
export default class TabsFull {
  readonly tabs: KrdsTabItem[] = [
    { id: 'tab1', label: '타이틀 1' },
    { id: 'tab2', label: '타이틀 2' }
  ]
}
