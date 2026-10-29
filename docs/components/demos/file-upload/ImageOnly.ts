import { Component, signal } from '@angular/core'
import { KrdsFileUpload, type KrdsFileInfo } from '@krds.ui/angular'

@Component({
  selector: 'demo-file-upload-image-only',
  imports: [KrdsFileUpload],
  template: `
    <krds-file-upload
      heading="이미지 파일 업로드"
      description="JPG, PNG, GIF 파일만 업로드할 수 있습니다."
      accept=".jpg,.jpeg,.png,.gif"
      [maxFiles]="5"
      [(files)]="files"
    />
  `
})
export default class FileUploadImageOnly {
  readonly files = signal<KrdsFileInfo[]>([])
}
