import { Component } from '@angular/core'
import { KrdsTts } from '@krds.ui/angular'

@Component({
  selector: 'demo-tts-sizes',
  imports: [KrdsTts],
  template: `
    <div style="display: flex; flex-direction: column; gap: 1.5rem">
      <div style="display: flex; gap: 1rem; align-items: center">
        <button krdsTts text="xsmall 크기입니다." label="듣기" size="xsmall"></button>
        <button krdsTts text="small 크기입니다." label="듣기" size="small"></button>
        <button krdsTts text="medium 크기입니다." label="듣기" size="medium"></button>
      </div>
      <div style="display: flex; gap: 1rem; align-items: center">
        <button krdsTts text="xsmall 크기입니다." size="xsmall" aria-label="듣기"></button>
        <button krdsTts text="small 크기입니다." size="small" aria-label="듣기"></button>
        <button krdsTts text="medium 크기입니다." size="medium" aria-label="듣기"></button>
      </div>
    </div>
  `
})
export default class TtsSizes {}
