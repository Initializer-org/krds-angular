import { Component, signal } from '@angular/core'
import { KrdsFileUpload, type KrdsFileInfo } from '@krds.ui/angular'

@Component({
  selector: 'demo-file-upload-basic',
  imports: [KrdsFileUpload],
  template: `<krds-file-upload heading="타이틀영역" description="컨텐츠 영역" [(files)]="files" />`
})
export default class FileUploadBasic {
  readonly files = signal<KrdsFileInfo[]>([])
}
