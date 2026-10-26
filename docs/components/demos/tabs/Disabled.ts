import { Component } from '@angular/core'
import { KrdsTabPanel, KrdsTabs, type KrdsTabItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-tabs-disabled',
  imports: [KrdsTabs, KrdsTabPanel],
  template: `
    <krds-tabs [tabs]="tabs">
      <ng-template krdsTabPanel="tab1">탭 1 영역</ng-template>
      <ng-template krdsTabPanel="tab2">탭 2 영역</ng-template>
      <ng-template krdsTabPanel="tab3">탭 3 영역</ng-template>
    </krds-tabs>
  `
})
export default class TabsDisabled {
  readonly tabs: KrdsTabItem[] = [
    { id: 'tab1', label: '타이틀 1' },
    { id: 'tab2', label: '타이틀 2', disabled: true },
    { id: 'tab3', label: '타이틀 3' }
  ]
}
