import { Component } from '@angular/core'
import { KrdsImage } from '@krds.ui/angular'

@Component({
  selector: 'demo-image-decorative',
  imports: [KrdsImage],
  template: ` <img krdsImage src="/demo/image/pattern.svg" alt="" width="640" height="120" /> `
})
export default class ImageDecorative {}
