import { Component, signal } from '@angular/core'
import { KrdsFileUpload, type KrdsFileInfo } from '@krds.ui/angular'

const hwp = (id: string, name: string, size: number, extra: Partial<KrdsFileInfo>): KrdsFileInfo => ({
  id,
  file: new File([''], name),
  name,
  size,
  type: 'application/x-hwp',
  status: 'pending',
  ...extra
})

@Component({
  selector: 'demo-file-upload-with-files',
  imports: [KrdsFileUpload],
  template: `<krds-file-upload heading="타이틀영역" description="컨텐츠 영역" [(files)]="files" />`
})
export default class FileUploadWithFiles {
  readonly files = signal<KrdsFileInfo[]>([
    hwp('1', '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp', 17 * 1024, { status: 'uploading' }),
    hwp('2', '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp', 17 * 1024, { status: 'completed' }),
    hwp('3', '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp', 17 * 1024, { status: 'pending' }),
    hwp('4', '전입재등록신고서 [주민등록법 시행령 별지서식 15, 15호의2호].hwp', 25 * 1024 * 1024, {
      status: 'error',
      errorMessage: '등록 가능한 파일 용량을 초과하였습니다.\n20MB 미만의 파일만 등록할 수 있습니다.'
    }),
    hwp('5', '위임장(주민등록법 시행령 별지 제15호의2호서식).hwp', 17 * 1024, { status: 'completed', downloadUrl: '/files/sample.hwp' })
  ])
}
