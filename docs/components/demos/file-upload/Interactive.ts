import { Component, signal } from '@angular/core'
import { KrdsFileUpload, type KrdsFileInfo } from '@krds.ui/angular'

@Component({
  selector: 'demo-file-upload-interactive',
  imports: [KrdsFileUpload],
  template: `
    <krds-file-upload
      heading="파일 업로드"
      description="파일을 선택하거나 드래그하여 업로드하세요."
      [maxFileSize]="20 * 1024 * 1024"
      [(files)]="files"
    />
  `
})
export default class FileUploadInteractive {
  readonly files = signal<KrdsFileInfo[]>([])
}
