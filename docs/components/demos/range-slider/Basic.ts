import { Component, signal } from '@angular/core'
import { KrdsRangeSlider } from '@krds.ui/angular'

@Component({
  selector: 'demo-range-slider-basic',
  imports: [KrdsRangeSlider],
  template: ` <krds-range-slider label="글자 크기" [max]="sizes.length - 1" [valueText]="sizeText" [(value)]="size" /> `
})
export default class RangeSliderBasic {
  readonly sizes = ['작게', '보통', '조금 크게', '크게', '아주 크게']
  readonly size = signal(2)
  readonly sizeText = (value: number) => this.sizes[value]
}
