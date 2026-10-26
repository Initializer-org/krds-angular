import { Component, signal } from '@angular/core'
import { KrdsFileUpload, type KrdsFileInfo } from '@krds.ui/angular'

@Component({
  selector: 'demo-file-upload-single-file',
  imports: [KrdsFileUpload],
  template: `
    <krds-file-upload heading="단일 파일 업로드" description="하나의 파일만 업로드할 수 있습니다." [multiple]="false" [(files)]="files" />
  `
})
export default class FileUploadSingleFile {
  readonly files = signal<KrdsFileInfo[]>([])
}
