import { Component, signal } from '@angular/core'
import { KrdsTts } from '@krds.ui/angular'

@Component({
  selector: 'demo-tts-basic',
  imports: [KrdsTts],
  template: `
    <button
      krdsTts
      text="대한민국 정부 디자인 시스템 KRDS는 정부 서비스의 일관된 사용자 경험을 제공합니다."
      label="듣기"
      size="medium"
      icon="volume"
      (play)="status.set('읽는 중')"
      (pause)="status.set('멈춤')"
      (end)="status.set('다 읽음')"
      (error)="status.set('읽지 못함: ' + $event.message)"
    ></button>
    <p style="margin-top: 1rem">상태: {{ status() }}</p>
  `
})
export default class TtsBasic {
  readonly status = signal('대기')
}
