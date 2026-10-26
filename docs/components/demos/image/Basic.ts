import { Component } from '@angular/core'
import { KrdsImage } from '@krds.ui/angular'

@Component({
  selector: 'demo-image-basic',
  imports: [KrdsImage],
  template: `
    <img
      krdsImage
      src="/demo/image/floor-map.svg"
      alt="정문으로 들어와 복도에서 오른쪽으로 가면 첫 번째 방이 민원실"
      width="480"
      height="270"
    />
  `
})
export default class ImageBasic {}
