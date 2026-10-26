import { Component, signal } from '@angular/core'
import { KrdsTag, KrdsTagGroup } from '@krds.ui/angular'

@Component({
  selector: 'demo-tag-remove',
  imports: [KrdsTag, KrdsTagGroup],
  template: `
    <div krdsTagGroup>
      @for (tag of tags(); track tag) {
        <krds-tag (remove)="remove(tag)">{{ tag }}</krds-tag>
      }
      <a krdsTag href="#">링크 태그</a>
    </div>
  `
})
export default class TagRemove {
  readonly tags = signal(['커스텀 내용 1', '커스텀 내용 2'])

  remove(tag: string) {
    this.tags.update(tags => tags.filter(item => item !== tag))
  }
}
