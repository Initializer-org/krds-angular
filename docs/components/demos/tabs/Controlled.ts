import { Component, signal } from '@angular/core'
import { KrdsTabPanel, KrdsTabs, type KrdsTabItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-tabs-controlled',
  imports: [KrdsTabs, KrdsTabPanel],
  template: `
    <div style="display: flex; flex-direction: column; gap: 2rem">
      <p>현재 탭: {{ selected() }}</p>
      <krds-tabs [tabs]="tabs" [(selected)]="selected">
        <ng-template krdsTabPanel="tab1">탭 1 영역</ng-template>
        <ng-template krdsTabPanel="tab2">탭 2 영역</ng-template>
        <ng-template krdsTabPanel="tab3">탭 3 영역</ng-template>
      </krds-tabs>
    </div>
  `
})
export default class TabsControlled {
  readonly tabs: KrdsTabItem[] = [
    { id: 'tab1', label: '타이틀 1' },
    { id: 'tab2', label: '타이틀 2' },
    { id: 'tab3', label: '타이틀 3' }
  ]
  readonly selected = signal('tab2')
}
