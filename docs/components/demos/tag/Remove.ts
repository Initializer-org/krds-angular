import { Component, signal } from '@angular/core'
import { KrdsTag, KrdsTagGroup } from '@krds.ui/angular'

@Component({
  selector: 'demo-tag-remove',
  imports: [KrdsTag, KrdsTagGroup],
  template: `
    <div krdsTagGroup>
      @for (tag of tags(); track tag) {
        <krds-tag (remove)="remove(tag, $event)">{{ tag }}</krds-tag>
      }
      <a krdsTag href="#">링크 태그</a>
    </div>
  `
})
export default class TagRemove {
  readonly tags = signal(['커스텀 내용 1', '커스텀 내용 2'])

  remove(tag: string, event: MouseEvent) {
    // 지운 태그의 다음(없으면 앞) 태그로 초점을 옮겨, 삭제 버튼과 함께 초점이 사라지지 않게 한다
    const item = (event.target as HTMLElement).closest('.krds-btn-tag')!
    const neighbor = (item.nextElementSibling ?? item.previousElementSibling) as HTMLElement | null
    this.tags.update(tags => tags.filter(name => name !== tag))
    ;(neighbor?.querySelector('button') ?? neighbor)?.focus()
  }
}
