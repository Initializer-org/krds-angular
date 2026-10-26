import { Component, inject } from '@angular/core'
import { KrdsButton, KrdsToast, KrdsToastService } from '@krds.ui/angular'

@Component({
  selector: 'demo-toast-basic',
  imports: [KrdsButton, KrdsToast],
  template: `
    <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap">
      <button krdsButton (click)="toast.show('저장되었습니다.')">저장</button>
      <button krdsButton variant="secondary" (click)="toast.warning('파일 업로드에 실패했습니다.')">업로드 실패</button>
      <krds-toast />
    </div>
  `
})
export default class ToastBasic {
  // 실제 앱에서는 <krds-toast />를 루트 컴포넌트에 한 번만 두고 각 화면에서 KrdsToastService로 띄웁니다
  protected readonly toast = inject(KrdsToastService)
}
