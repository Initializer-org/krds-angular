import { Component, signal } from '@angular/core'
import { KrdsAccordion, KrdsAccordionItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-accordion-basic',
  imports: [KrdsAccordion, KrdsAccordionItem],
  template: `
    <div krdsAccordion headingLevel="3" [(open)]="open">
      <krds-accordion-item value="basic-1" label="title1">content1</krds-accordion-item>
      <krds-accordion-item value="basic-2" label="title2">content2</krds-accordion-item>
    </div>
  `
})
export default class AccordionBasic {
  readonly open = signal<string | null>(null)
}
