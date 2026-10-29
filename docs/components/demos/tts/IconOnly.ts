import { Component } from '@angular/core'
import { KrdsTts } from '@krds.ui/angular'

@Component({
  selector: 'demo-tts-icon-only',
  imports: [KrdsTts],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center">
      <button krdsTts text="볼륨 아이콘 타입입니다." icon="volume" aria-label="듣기"></button>
      <button krdsTts text="재생 아이콘 타입입니다." icon="play" aria-label="듣기"></button>
    </div>
  `
})
export default class TtsIconOnly {}
