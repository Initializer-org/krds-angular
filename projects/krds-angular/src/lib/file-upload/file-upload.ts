import { Component, booleanAttribute, computed, input, model, output, signal } from '@angular/core'

/** 파일 업로드 목록의 파일 */
export interface KrdsFileInfo {
  /** 파일 id */
  id: string
  /** 파일 객체 */
  file: File
  /** 파일명 */
  name: string
  /** 파일 크기 (bytes) */
  size: number
  /** 파일 타입 (MIME) */
  type: string
  /** 업로드 상태 (업로드는 사용하는 쪽에서 처리하고 상태만 바꿔 넘긴다) */
  status: 'pending' | 'uploading' | 'completed' | 'error'
  /** 오류 문구 */
  errorMessage?: string
  /** 다운로드 주소 (있으면 다운로드·바로보기 버튼) */
  downloadUrl?: string
}

/** 파일 검사 실패 이벤트 */
export interface KrdsFileError {
  file: KrdsFileInfo
  error: string
}

/** 파일 선택 버튼 크기 */
export type KrdsFileUploadSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

let nextId = 0

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`
  return `${Number((bytes / (1024 * 1024)).toFixed(1))}MB`
}

const extensionOf = (name: string) => {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

/**
 * KRDS 파일 업로드. 파일을 끌어다 놓거나 파일선택 버튼으로 고르면 크기·형식·개수를 검사해 목록(`[(files)]`)에 넣는다.
 * 실제 업로드는 사용하는 쪽에서 처리하고, 파일의 status·downloadUrl을 바꿔 넘기면 상태별 버튼을 보여 준다
 *
 * @example <krds-file-upload title="증빙 서류" accept=".pdf,.jpg" [maxFiles]="3" [(files)]="files" />
 */
@Component({
  selector: 'krds-file-upload',
  host: { class: 'krds-file-upload line' },
  template: `
    @if (title() || description()) {
      <div class="file-head">
        <h3 class="tit">{{ title() }}</h3>
        <div>
          <p>{{ description() }}</p>
        </div>
      </div>
    }
    @if (!readonly()) {
      <div
        class="file-upload"
        [class.active]="dragOver()"
        (dragover)="onDragOver($event)"
        (dragleave)="dragOver.set(false)"
        (drop)="onDrop($event)"
      >
        <p class="txt">{{ placeholder() }}</p>
        <div class="file-upload-btn-wrap">
          <input
            #fileInput
            type="file"
            hidden
            [id]="inputId"
            [name]="name()"
            [attr.accept]="accept() || null"
            [multiple]="multiple()"
            (change)="onFileChange(fileInput)"
          />
          <label [for]="inputId">
            <button type="button" class="krds-btn" [class]="size()" [disabled]="disabled()" (click)="fileInput.click()">
              <i class="svg-icon ico-upload"></i>파일선택
            </button>
          </label>
        </div>
      </div>
    }
    @if (files().length) {
      <div class="file-list">
        <div class="total">
          <span class="current">{{ validCount() }}개</span>
          / {{ maxFiles() }}개
        </div>
        <ul class="upload-list">
          @for (file of files(); track file.id) {
            <li [class.is-error]="file.status === 'error'">
              <div class="file-info" [class.m-column]="!!file.downloadUrl">
                <div class="file-name">{{ fileName(file) }}</div>
                <div class="btn-wrap">
                  @if (file.status === 'uploading') {
                    <span class="krds-spinner" role="status"><span class="sr-only">업로드 중</span></span>
                  } @else if (file.downloadUrl) {
                    @if (showDownload()) {
                      <button type="button" class="krds-btn medium text" (click)="download.emit(file)">
                        다운로드 <i class="svg-icon ico-down"></i>
                      </button>
                    }
                    @if (showPreviewButton()) {
                      <button type="button" class="krds-btn medium text" (click)="preview.emit(file)">
                        바로보기 <i class="svg-icon ico-angle right"></i>
                      </button>
                    }
                  } @else if (file.status === 'completed') {
                    <span class="ico-invalid complete"><em class="sr-only">업로드 완료</em></span>
                  } @else if (!readonly()) {
                    <button type="button" class="krds-btn medium text" [disabled]="disabled()" (click)="removeFile(file.id)">
                      삭제 <i class="svg-icon ico-delete-fill"></i>
                    </button>
                  }
                </div>
              </div>
              @if (file.status === 'error' && file.errorMessage) {
                <p class="file-hint-invalid">
                  @for (line of lines(file.errorMessage); track $index) {
                    @if (!$first) {
                      <br />
                    }
                    {{ line }}
                  }
                </p>
              }
            </li>
          }
        </ul>
        @if (showClearAll() && !readonly()) {
          <div class="upload-delete-btn">
            <button type="button" class="krds-btn xsmall tertiary" [disabled]="disabled()" (click)="clearAll()">
              전체 파일 삭제<i class="svg-icon ico-angle right"></i>
            </button>
          </div>
        }
      </div>
    }
  `
})
export class KrdsFileUpload {
  /** 파일 목록 */
  readonly files = model<KrdsFileInfo[]>([])
  /** 제목 */
  readonly title = input<string>()
  /** 설명 */
  readonly description = input<string>()
  /** 끌어다 놓는 영역의 안내 문구 */
  readonly placeholder = input('첨부할 파일을 여기에 끌어다 놓거나, 파일 선택 버튼을 눌러 파일을 직접 선택해주세요.')
  /** 파일선택 버튼 크기 */
  readonly size = input<KrdsFileUploadSize>('medium')
  /** 허용 파일 형식 (예: '.jpg,.png,.pdf', 'image/*') */
  readonly accept = input<string>()
  /** 최대 파일 개수 (오류 항목은 세지 않음) */
  readonly maxFiles = input(10)
  /** 최대 파일 크기 (bytes, 이 크기 이상이면 오류) */
  readonly maxFileSize = input(20 * 1024 * 1024)
  /** 여러 파일 선택 (끄면 새 파일이 기존 파일을 대체) */
  readonly multiple = input(true, { transform: booleanAttribute })
  /** 비활성화 */
  readonly disabled = input(false, { transform: booleanAttribute })
  /** 읽기 전용 (추가·삭제 없이 다운로드·바로보기만) */
  readonly readonly = input(false, { transform: booleanAttribute })
  /** 끌어다 놓기 */
  readonly dragAndDrop = input(true, { transform: booleanAttribute })
  /** 다운로드 버튼 표시 */
  readonly showDownload = input(true, { transform: booleanAttribute })
  /** 바로보기 버튼 표시 */
  readonly showPreviewButton = input(true, { transform: booleanAttribute })
  /** 전체 파일 삭제 버튼 표시 */
  readonly showClearAll = input(true, { transform: booleanAttribute })
  /** 파일 input의 name */
  readonly name = input('myFile')

  /** 파일을 추가했을 때 */
  readonly fileAdded = output<KrdsFileInfo>()
  /** 파일을 삭제했을 때 (파일 id) */
  readonly fileRemoved = output<string>()
  /** 추가한 파일이 검사(크기·형식)에 실패했을 때 */
  readonly fileError = output<KrdsFileError>()
  /** 전체 파일 삭제 버튼을 눌렀을 때 */
  readonly cleared = output<void>()
  /** 파일의 다운로드 버튼을 눌렀을 때 */
  readonly download = output<KrdsFileInfo>()
  /** 파일의 바로보기 버튼을 눌렀을 때 */
  readonly preview = output<KrdsFileInfo>()

  protected readonly inputId = `krds-file-upload-${nextId++}`
  protected readonly dragOver = signal(false)
  protected readonly validCount = computed(() => this.files().filter(file => file.status !== 'error').length)

  private get locked() {
    return this.disabled() || this.readonly()
  }

  protected lines(message: string) {
    return message.split('\n')
  }

  protected fileName(file: KrdsFileInfo) {
    const ext = extensionOf(file.name)
    return ext
      ? `${file.name.slice(0, -(ext.length + 1))} [${ext}, ${formatFileSize(file.size)}]`
      : `${file.name} [${formatFileSize(file.size)}]`
  }

  private validate(file: File): string | null {
    const maxFileSize = this.maxFileSize()
    if (maxFileSize && file.size >= maxFileSize) {
      return `등록 가능한 파일 용량을 초과하였습니다.\n${formatFileSize(maxFileSize)} 미만의 파일만 등록할 수 있습니다.`
    }
    const accept = this.accept()
    if (accept) {
      const ext = `.${extensionOf(file.name)}`
      const accepted = accept.split(',').map(type => type.trim().toLowerCase())
      const ok = accepted.some(type =>
        type.startsWith('.') ? ext === type : type.endsWith('/*') ? file.type.startsWith(type.slice(0, -1)) : file.type === type
      )
      if (!ok) return '허용되지 않는 파일 형식입니다.'
    }
    return null
  }

  private addFiles(fileList: FileList) {
    if (this.locked) return
    // 단일 파일은 기존 파일을 대체하고 첫 파일만 쓴다 (기본 input과 같음)
    const current = this.multiple() ? this.files() : []
    const picked = this.multiple() ? Array.from(fileList) : Array.from(fileList).slice(0, 1)
    let validCount = current.filter(file => file.status !== 'error').length
    const added: KrdsFileInfo[] = []
    for (const file of picked) {
      if (validCount >= this.maxFiles()) break
      const error = this.validate(file)
      if (!error) validCount++
      const info: KrdsFileInfo = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: error ? 'error' : 'pending',
        errorMessage: error ?? undefined
      }
      added.push(info)
      if (error) this.fileError.emit({ file: info, error })
      else this.fileAdded.emit(info)
    }
    if (added.length) this.files.set([...current, ...added])
  }

  protected onFileChange(input: HTMLInputElement) {
    if (!input.files?.length) return
    this.addFiles(input.files)
    // 같은 파일을 다시 고를 수 있게 비운다
    input.value = ''
  }

  protected onDragOver(event: DragEvent) {
    if (this.locked || !this.dragAndDrop()) return
    event.preventDefault()
    this.dragOver.set(true)
  }

  protected onDrop(event: DragEvent) {
    event.preventDefault()
    this.dragOver.set(false)
    if (this.locked || !this.dragAndDrop() || !event.dataTransfer?.files) return
    this.addFiles(event.dataTransfer.files)
  }

  protected removeFile(id: string) {
    if (this.locked) return
    this.files.set(this.files().filter(file => file.id !== id))
    this.fileRemoved.emit(id)
  }

  protected clearAll() {
    if (this.locked) return
    this.files.set([])
    this.cleared.emit()
  }
}
