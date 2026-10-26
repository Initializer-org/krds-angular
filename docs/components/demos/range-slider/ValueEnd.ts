import { Component, signal } from '@angular/core'
import { KrdsRangeSlider } from '@krds.ui/angular'

@Component({
  selector: 'demo-range-slider-value-end',
  imports: [KrdsRangeSlider],
  template: ` <krds-range-slider label="음량" [step]="10" [valueText]="percent" valuePosition="end" [(value)]="volume" /> `
})
export default class RangeSliderValueEnd {
  readonly volume = signal(50)
  readonly percent = (value: number) => `${value}%`
}
