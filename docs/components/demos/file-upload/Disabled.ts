import { Component, signal } from '@angular/core'
import { KrdsFileUpload, type KrdsFileInfo } from '@krds.ui/angular'

const name = '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp'

@Component({
  selector: 'demo-file-upload-disabled',
  imports: [KrdsFileUpload],
  template: ` <krds-file-upload heading="비활성화 상태" description="파일 업로드가 비활성화된 상태입니다." disabled [(files)]="files" /> `
})
export default class FileUploadDisabled {
  readonly files = signal<KrdsFileInfo[]>([
    { id: '3', file: new File([''], name), name, size: 17 * 1024, type: 'application/x-hwp', status: 'pending' }
  ])
}
