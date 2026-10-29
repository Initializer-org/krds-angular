import { Component, signal } from '@angular/core'
import { classesOf, expectNoA11yViolations, render } from '../../test/render'
import { KrdsFileUpload, type KrdsFileError, type KrdsFileInfo } from './file-upload'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsFileUpload], template: '<krds-file-upload [(files)]="files" />' })
class Host {
  readonly files = signal<KrdsFileInfo[]>([])
  readonly events: string[] = []
  readonly errors: KrdsFileError[] = []

  /** 파일을 받자마자 업로드를 시작한 것처럼 상태를 바꾼다 */
  startUpload(file: KrdsFileInfo) {
    this.files.update(files => files.map(item => (item.id === file.id ? { ...item, status: 'uploading' } : item)))
  }
}

const makeFile = (name: string, size = 1024, type = 'application/pdf') => new File([new Uint8Array(size)], name, { type })

const transfer = (files: File[]) => {
  const dataTransfer = new DataTransfer()
  files.forEach(file => dataTransfer.items.add(file))
  return dataTransfer
}

const info = (name: string, extra: Partial<KrdsFileInfo> = {}): KrdsFileInfo => {
  const file = makeFile(name)
  return { id: name, file, name, size: file.size, type: file.type, status: 'pending', ...extra }
}

async function renderUpload(attrs = '') {
  const result = await render(
    Host,
    `<krds-file-upload heading="증빙 서류" description="PDF 파일" ${attrs}
       [(files)]="files"
       (fileAdded)="events.push('added:' + $event.name)"
       (fileRemoved)="events.push('removed:' + $event)"
       (fileError)="errors.push($event)"
       (cleared)="events.push('cleared')"
       (download)="events.push('download:' + $event.name)"
       (preview)="events.push('preview:' + $event.name)" />`
  )
  const { $, $$, stable } = result
  return {
    ...result,
    names: () => $$('.file-name').map(el => el.textContent?.trim()),
    choose: async (files: File[]) => {
      const input = $<HTMLInputElement>('input[type="file"]')
      input.files = transfer(files).files
      input.dispatchEvent(new Event('change', { bubbles: true }))
      await stable()
    },
    drop: async (files: File[]) => {
      const area = $('.file-upload')
      area.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: transfer(files) }))
      await stable()
      const active = area.classList.contains('active')
      area.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: transfer(files) }))
      await stable()
      return active
    },
    buttonByText: (text: string) => $$<HTMLButtonElement>('button').find(button => button.textContent?.trim().startsWith(text))!
  }
}

describe('KrdsFileUpload', () => {
  it('제목·설명과 끌어다 놓는 영역, 드래그 강조, 드롭한 파일 추가', async () => {
    const { host, $, names, drop } = await renderUpload()
    expect(classesOf($('krds-file-upload'))).toEqual(['krds-file-upload', 'line'])
    expect($('.file-head .tit').textContent).toBe('증빙 서류')
    // 제목이 기본 title 속성으로 남아 영역 전체에 툴팁이 뜨지 않는다
    expect($('krds-file-upload').hasAttribute('title')).toBe(false)
    expect($('.file-upload .txt').textContent).toContain('끌어다 놓거나')

    expect(await drop([makeFile('신청서.pdf', 2048)])).toBe(true)
    expect($('.file-upload').classList).not.toContain('active')
    expect(names()).toEqual(['신청서 [pdf, 2KB]'])
    expect($('.total').textContent?.replace(/\s+/g, ' ').trim()).toBe('1개 / 10개')
    expect(host.files()[0]).toMatchObject({ name: '신청서.pdf', status: 'pending' })
    expect(host.events).toEqual(['added:신청서.pdf'])
  })

  it('파일선택 버튼으로 숨긴 input을 열고, 다중 선택·삭제·전체 삭제', async () => {
    const { host, $, names, choose, click, buttonByText } = await renderUpload()
    const input = $<HTMLInputElement>('input[type="file"]')
    expect(input.hidden).toBe(true)
    expect(input.multiple).toBe(true)
    let opened = false
    input.addEventListener('click', event => {
      opened = true
      event.preventDefault()
    })
    await click(buttonByText('파일선택'))
    expect(opened).toBe(true)

    await choose([makeFile('a.pdf'), makeFile('b.pdf')])
    expect(names()).toEqual(['a [pdf, 1KB]', 'b [pdf, 1KB]'])
    // 같은 파일을 다시 고를 수 있게 비운다
    expect(input.value).toBe('')

    await click(buttonByText('삭제'))
    expect(names()).toEqual(['b [pdf, 1KB]'])
    expect(host.events.at(-1)).toMatch(/^removed:/)

    await click(buttonByText('전체 파일 삭제'))
    expect(host.files()).toEqual([])
    expect($('.file-list')).toBeNull()
    expect(host.events.at(-1)).toBe('cleared')
  })

  it('용량 초과·형식 오류는 오류 항목으로 표시하고 개수에서 뺀다, 최대 개수', async () => {
    const { host, $, $$, names, choose } = await renderUpload(`accept="image/*,.pdf" [maxFiles]="2" [maxFileSize]="2048"`)
    await choose([makeFile('큰 파일.pdf', 4096), makeFile('문서.hwp', 100, 'application/x-hwp'), makeFile('사진.png', 100, 'image/png')])
    const [big, hwp] = $$('.upload-list li')
    expect(big.classList).toContain('is-error')
    expect(big.querySelector('.file-hint-invalid')?.innerHTML).toContain('<br>')
    expect(big.querySelector('.file-hint-invalid')?.textContent).toContain('2KB 미만의 파일만')
    expect(hwp.querySelector('.file-hint-invalid')?.textContent?.trim()).toBe('허용되지 않는 파일 형식입니다.')
    expect(host.errors.map(({ file }) => file.name)).toEqual(['큰 파일.pdf', '문서.hwp'])
    expect($('.total .current').textContent).toBe('1개')

    // 유효한 파일이 2개가 되면 더 넣지 않는다
    await choose([makeFile('두번째.pdf'), makeFile('세번째.pdf')])
    expect(names()).toContain('두번째 [pdf, 1KB]')
    expect(names()).not.toContain('세번째 [pdf, 1KB]')
  })

  it('단일 파일: 새 파일이 기존 파일을 대체하고 드롭은 첫 파일만', async () => {
    const { $, names, choose, drop } = await renderUpload('[multiple]="false"')
    expect($<HTMLInputElement>('input[type="file"]').multiple).toBe(false)
    await choose([makeFile('a.pdf')])
    await choose([makeFile('b.pdf')])
    expect(names()).toEqual(['b [pdf, 1KB]'])
    await drop([makeFile('c.pdf'), makeFile('d.pdf')])
    expect(names()).toEqual(['c [pdf, 1KB]'])
  })

  it('파일 상태별 표시: 업로드 중, 완료, 다운로드·바로보기', async () => {
    const { host, $$, stable, click, buttonByText } = await renderUpload()
    host.files.set([
      info('a.pdf', { status: 'uploading' }),
      info('b.pdf', { status: 'completed' }),
      info('c.pdf', { downloadUrl: '/c.pdf' })
    ])
    await stable()
    const [uploading, completed, downloadable] = $$('.upload-list li')
    expect(uploading.querySelector('.krds-spinner[role="status"]')?.textContent).toBe('업로드 중')
    expect(completed.querySelector('.ico-invalid.complete')?.textContent).toBe('업로드 완료')
    expect(downloadable.querySelector('.file-info')?.classList).toContain('m-column')

    await click(buttonByText('다운로드'))
    await click(buttonByText('바로보기'))
    expect(host.events).toEqual(['download:c.pdf', 'preview:c.pdf'])
  })

  it('비활성화: 조작 버튼을 막고 드롭·선택을 무시', async () => {
    const { host, stable, drop, buttonByText } = await renderUpload('disabled')
    host.files.set([info('a.pdf')])
    await stable()
    expect(buttonByText('파일선택').disabled).toBe(true)
    expect(buttonByText('삭제').disabled).toBe(true)
    expect(buttonByText('전체 파일 삭제').disabled).toBe(true)
    expect(await drop([makeFile('b.pdf')])).toBe(false)
    expect(host.files()).toHaveLength(1)
  })

  it('읽기 전용: 추가 영역·삭제 버튼 없이 다운로드·바로보기만', async () => {
    const { host, $, stable, buttonByText } = await renderUpload('readonly')
    host.files.set([info('a.pdf'), info('b.pdf', { downloadUrl: '/b.pdf' })])
    await stable()
    expect($('.file-upload')).toBeNull()
    expect(buttonByText('삭제')).toBeUndefined()
    expect(buttonByText('전체 파일 삭제')).toBeUndefined()
    expect(buttonByText('다운로드')).toBeTruthy()
  })

  it('fileAdded 처리기에서 바꾼 목록이 남는다 (목록에 넣은 뒤 알림)', async () => {
    const { host, $, stable } = await render(Host, '<krds-file-upload [(files)]="files" (fileAdded)="startUpload($event)" />')
    const input = $<HTMLInputElement>('input[type="file"]')
    input.files = transfer([makeFile('신청서.pdf')]).files
    input.dispatchEvent(new Event('change', { bubbles: true }))
    await stable()
    expect(host.files().map(file => file.status)).toEqual(['uploading'])
  })

  it('제목 없이 설명만 주면 빈 제목을 그리지 않는다', async () => {
    const { el, $ } = await render(Host, '<krds-file-upload description="PDF 파일만 올릴 수 있습니다" />')
    expect($('.file-head p').textContent).toBe('PDF 파일만 올릴 수 있습니다')
    expect(el.querySelector('.file-head h3')).toBeNull()
    await expectNoA11yViolations(el)
  })

  it('접근성 위반이 없다', async () => {
    const { host, el, stable } = await renderUpload()
    host.files.set([
      info('a.pdf'),
      info('b.pdf', { status: 'error', errorMessage: '허용되지 않는 파일 형식입니다.' }),
      info('c.pdf', { downloadUrl: '/c.pdf' })
    ])
    await stable()
    await expectNoA11yViolations(el)
  })
})
