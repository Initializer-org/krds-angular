import { Component } from '@angular/core'

@Component({
  selector: 'demo-sr-only-basic',
  template: `
    <div>
      <p>일반 텍스트입니다.</p>
      <span class="sr-only">스크린 리더 전용 텍스트입니다.</span>
      <p>다시 일반 텍스트입니다.</p>
    </div>
  `
})
export default class SrOnlyBasic {}
