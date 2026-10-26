import { Component } from '@angular/core'
import { KrdsAccordion, KrdsAccordionItem } from '@krds.ui/angular'

@Component({
  selector: 'demo-accordion-line',
  imports: [KrdsAccordion, KrdsAccordionItem],
  template: `
    <div krdsAccordion typeLine headingLevel="3">
      <krds-accordion-item>
        <span krdsAccordionLabel>title1</span>
        content1
      </krds-accordion-item>
      <krds-accordion-item>
        <span krdsAccordionLabel>title2</span>
        content2
      </krds-accordion-item>
    </div>
  `
})
export default class AccordionLine {}
