import { Component } from '@angular/core'
import { KrdsMedia, KrdsMediaTranscript } from '@krds.ui/angular'

@Component({
  selector: 'demo-media-audio',
  imports: [KrdsMedia, KrdsMediaTranscript],
  template: `
    <figure krdsMedia heading="알림음 예시 음성">
      <audio controls preload="metadata" src="/demo/media/steps.m4a"></audio>
      <div krdsMediaTranscript>
        <p>[알림음] 세 번이 약 3초 간격으로 울린 뒤, [더 높은 완료 알림음] 두 번이 짧게 이어집니다.</p>
      </div>
    </figure>
  `
})
export default class MediaAudio {}
