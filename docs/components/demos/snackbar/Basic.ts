import { Component, inject } from '@angular/core'
import { KrdsButton, KrdsSnackbar, KrdsSnackbarService } from '@krds.ui/angular'

@Component({
  selector: 'demo-snackbar-basic',
  imports: [KrdsButton, KrdsSnackbar],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap">
      <button krdsButton (click)="send()">신청서 보내기</button>
      <button krdsButton variant="secondary" (click)="fail()">실패 상황</button>
      <krds-snackbar />
    </div>
  `
})
export default class SnackbarBasic {
  // 실제 앱에서는 <krds-snackbar />를 루트 컴포넌트에 한 번만 두고 각 화면에서 KrdsSnackbarService로 띄웁니다
  private readonly snackbar = inject(KrdsSnackbarService)
  private sent = 0

  send() {
    this.sent++
    this.snackbar.show({
      title: '전송 완료',
      message: `신청서를 ${this.sent}건 보냈습니다.`,
      action: '목록으로',
      onAction: () => alert('목록으로 이동')
    })
  }

  fail() {
    this.snackbar.show({
      icon: 'ico-error-fill',
      title: '전송 실패',
      message: '네트워크 오류로 보내지 못했습니다.',
      action: '다시 시도',
      onAction: () => this.send()
    })
  }
}
