import { Component } from '@angular/core'
import { KrdsTts } from '@krds.ui/angular'

@Component({
  selector: 'demo-tts-disabled',
  imports: [KrdsTts],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center">
      <button krdsTts text="비활성화 상태입니다." label="듣기" disabled></button>
      <button krdsTts text="비활성화 상태입니다." aria-label="듣기" disabled></button>
      <button krdsTts text="비활성화 상태입니다." label="듣기" icon="play" disabled></button>
    </div>
  `
})
export default class TtsDisabled {}
