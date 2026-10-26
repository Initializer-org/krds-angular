import { Component } from '@angular/core'
import { KrdsTextList } from '@krds.ui/angular'

@Component({
  selector: 'demo-text-list-ordered',
  imports: [KrdsTextList],
  template: `
    <ol krdsTextList variant="ordered">
      <li><span class="num">1. </span>텍스트 목록 레벨1</li>
      <li>
        <span class="num">2. </span>텍스트 목록 레벨1
        <ol krdsTextList variant="ordered">
          <li><span class="num">a. </span>텍스트 목록 레벨2</li>
          <li>
            <span class="num">b. </span>텍스트 목록 레벨2
            <ol krdsTextList variant="ordered">
              <li><span class="num">①</span>텍스트 목록 레벨3</li>
              <li><span class="num">②</span>텍스트 목록 레벨3</li>
            </ol>
          </li>
          <li><span class="num">c. </span>텍스트 목록 레벨2</li>
        </ol>
      </li>
      <li><span class="num">3. </span>텍스트 목록 레벨1</li>
    </ol>
    <br />
    <ul krdsTextList variant="decimal">
      <li>
        텍스트 목록 레벨1
        <ul krdsTextList variant="dash">
          <li>
            텍스트 목록 레벨2
            <ol krdsTextList variant="ordered">
              <li><span class="num">①</span>텍스트 목록 레벨3</li>
              <li><span class="num">②</span>텍스트 목록 레벨3</li>
            </ol>
          </li>
        </ul>
      </li>
      <li>
        텍스트 목록 레벨1
        <ol krdsTextList variant="ordered">
          <li>
            <span class="num">a. </span>텍스트 목록 레벨2
            <ul krdsTextList variant="hollow">
              <li>텍스트 목록 레벨3</li>
              <li>텍스트 목록 레벨3</li>
            </ul>
          </li>
        </ol>
      </li>
    </ul>
  `
})
export default class TextListOrdered {}
