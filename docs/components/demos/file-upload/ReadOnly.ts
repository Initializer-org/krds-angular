import { Component, signal } from '@angular/core'
import { KrdsFileUpload, type KrdsFileInfo } from '@krds.ui/angular'

const name = '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp'

@Component({
  selector: 'demo-file-upload-read-only',
  imports: [KrdsFileUpload],
  template: ` <krds-file-upload heading="읽기 전용" description="업로드된 파일만 확인할 수 있습니다." readonly [(files)]="files" /> `
})
export default class FileUploadReadOnly {
  readonly files = signal<KrdsFileInfo[]>([
    {
      id: '5',
      file: new File([''], name),
      name,
      size: 17 * 1024,
      type: 'application/x-hwp',
      status: 'completed',
      downloadUrl: '/files/sample.hwp'
    }
  ])
}
