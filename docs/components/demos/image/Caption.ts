import { Component } from '@angular/core'
import { KrdsFigure, KrdsImage } from '@krds.ui/angular'

@Component({
  selector: 'demo-image-caption',
  imports: [KrdsImage, KrdsFigure],
  template: `
    <figure krdsFigure>
      <img
        krdsImage
        src="/demo/image/floor-map.svg"
        alt="정문으로 들어와 복도에서 오른쪽으로 가면 첫 번째 방이 민원실"
        width="480"
        height="270"
      />
      <figcaption>본관 1층 안내도</figcaption>
    </figure>
  `
})
export default class ImageCaption {}
