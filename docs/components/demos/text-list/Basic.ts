import { Component } from '@angular/core'
import { KrdsTextList } from '@krds.ui/angular'

@Component({
  selector: 'demo-text-list-basic',
  imports: [KrdsTextList],
  template: `
    <ul krdsTextList variant="dash">
      <li>텍스트 목록 레벨1</li>
      <li>
        텍스트 목록 레벨1
        <ul krdsTextList variant="hollow">
          <li>텍스트 목록 레벨2</li>
          <li>텍스트 목록 레벨2</li>
        </ul>
      </li>
      <li>텍스트 목록 레벨1</li>
    </ul>
  `
})
export default class TextListBasic {}
