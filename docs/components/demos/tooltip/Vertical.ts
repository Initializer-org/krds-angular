import { Component } from '@angular/core'
import { KrdsTooltip } from '@krds.ui/angular'

@Component({
  selector: 'demo-tooltip-vertical',
  imports: [KrdsTooltip],
  template: `
    <div style="display: flex; align-items: flex-start; gap: 10px">
      <krds-tooltip vertical content="툴팁의 기본 설정입니다">
        tooltip-horizontal <i class="svg-icon ico-angle right" aria-hidden="true"></i>
      </krds-tooltip>
      <krds-tooltip vertical type="icon" content="아이콘 버튼에 제공되는 툴팁">
        <span class="sr-only">도움말</span>
        <i class="svg-icon ico-help" aria-hidden="true"></i>
      </krds-tooltip>
      <krds-tooltip vertical type="button" content="버튼에 제공되는 툴팁">도움말</krds-tooltip>
    </div>
  `
})
export default class TooltipVertical {}
