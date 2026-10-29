import { Component, Directive, ElementRef, inject, input, output } from '@angular/core'

/** 태그 묶음 크기 */
export type KrdsTagGroupSize = 'small' | 'medium' | 'large'

let nextId = 0

/**
 * KRDS 태그. `<krds-tag>`는 삭제 버튼이 있는 태그, `<a krdsTag>`는 링크 태그다.
 * 삭제 버튼 이름은 "태그 내용 삭제"로 읽혀 어느 태그를 지우는지 알 수 있다. 태그 크기와 색은 감싸는 `[krdsTagGroup]`이 정한다
 *
 * @example
 * <div krdsTagGroup>
 *   <krds-tag (remove)="remove(tag)">{{ tag }}</krds-tag>
 *   <a krdsTag href="/search?q=정책">#정책</a>
 * </div>
 */
@Component({
  selector: 'krds-tag, a[krdsTag]',
  host: {
    class: 'krds-btn-tag',
    '[class.link]': 'isLink'
  },
  template: `
    <!-- ng-content는 한 곳에만 투영되므로 분기 밖에 둔다 -->
    <span [id]="labelId"><ng-content /></span>
    @if (!isLink) {
      <button type="button" class="btn-delete" [attr.aria-labelledby]="labelId + ' ' + labelId + '-delete'" (click)="remove.emit($event)">
        <span class="sr-only" [id]="labelId + '-delete'">삭제</span>
      </button>
    }
  `
})
export class KrdsTag {
  /** 삭제 버튼을 클릭했을 때 */
  readonly remove = output<MouseEvent>()

  protected readonly isLink = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'A'
  protected readonly labelId = `krds-tag-${nextId++}`
}

/**
 * 태그 묶음. 안에 든 태그의 크기와 색을 정한다
 */
@Directive({
  selector: '[krdsTagGroup]',
  host: {
    '[class]': "'krds-tag-wrap ' + size()"
  }
})
export class KrdsTagGroup {
  /** 태그 크기 */
  readonly size = input<KrdsTagGroupSize>('medium')
}
