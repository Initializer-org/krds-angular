import { Component, signal } from '@angular/core'
import { KrdsFloatingButton, type KrdsFloatingButtonItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-floating-button-expand',
  imports: [KrdsFloatingButton],
  template: `
    <p>오른쪽 아래 + 버튼으로 항목을 펼치세요. 선택한 항목: {{ selected() || '없음' }}</p>
    <krds-floating-button label="상담 메뉴" [items]="items" (itemSelect)="selected.set($event.item.label)" />
  `
})
export default class FloatingButtonExpand {
  readonly items: KrdsFloatingButtonItem[] = [
    { label: '자주 묻는 질문', icon: 'ico-faq' },
    { label: '전화 상담', icon: 'ico-call', href: 'tel:1555-6365' },
    { label: '이메일 문의', icon: 'ico-email', href: 'mailto:krds@nia.or.kr' }
  ]
  readonly selected = signal('')
}
