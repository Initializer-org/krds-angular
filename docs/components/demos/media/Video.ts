import { Component } from '@angular/core'
import { KrdsMedia, KrdsMediaTranscript } from '@krds.ui/angular'

@Component({
  selector: 'demo-media-video',
  imports: [KrdsMedia, KrdsMediaTranscript],
  template: `
    <figure krdsMedia heading="단계 진행 표시 예시 영상">
      <video controls preload="metadata" src="/demo/media/steps.mp4" poster="/demo/media/steps-poster.jpg" width="640" height="360">
        <track kind="captions" src="/demo/media/steps.ko.vtt" srclang="ko" label="한국어" default />
      </video>
      <div krdsMediaTranscript>
        <p>연한 회색 화면 가운데에 회색 테두리의 네모 칸 세 개가 가로로 놓여 있습니다.</p>
        <p>[알림음] 왼쪽 칸이 파란색으로 채워집니다.</p>
        <p>[알림음] 가운데 칸이 파란색으로 채워집니다.</p>
        <p>[알림음] 오른쪽 칸이 파란색으로 채워집니다.</p>
        <p>[완료 알림음 두 번] 세 칸 아래에 초록색 막대가 나타납니다.</p>
      </div>
    </figure>
  `
})
export default class MediaVideo {}
