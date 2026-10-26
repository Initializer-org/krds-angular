import { Component } from '@angular/core'
import { render } from '../test/render'
import { KrdsAccordion, KrdsAccordionItem } from './accordion/accordion'
import { KrdsCarousel, KrdsSlide } from './carousel/carousel'
import { KrdsCheckbox, KrdsRadio } from './checkbox/checkbox'
import { KrdsCoachMark } from './coach-mark/coach-mark'
import { KrdsContextualHelp } from './contextual-help/contextual-help'
import { KrdsControl } from './control/control'
import { KrdsCriticalAlerts } from './critical-alerts/critical-alerts'
import { KrdsDateInput } from './date-input/date-input'
import { KrdsDisclosure } from './disclosure/disclosure'
import { KrdsFileUpload } from './file-upload/file-upload'
import { KrdsFloatingButton } from './floating-button/floating-button'
import { KrdsFormGroup } from './form-group/form-group'
import { KrdsInPageNavigation } from './in-page-navigation/in-page-navigation'
import { KrdsInput } from './input/input'
import { KrdsPanel } from './panel/panel'
import { KrdsQuantityToggle } from './quantity-toggle/quantity-toggle'
import { KrdsRangeSlider } from './range-slider/range-slider'
import { KrdsSnackbar } from './snackbar/snackbar'
import { KrdsSpinner } from './spinner/spinner'
import { KrdsTable } from './table/table'
import { KrdsTabs } from './tabs/tabs'
import { KrdsTextarea } from './textarea/textarea'
import { KrdsToast } from './toast/toast'
import { KrdsToggleSwitch } from './toggle-switch/toggle-switch'
import { KrdsTooltip } from './tooltip/tooltip'

@Component({
  imports: [
    KrdsAccordion,
    KrdsAccordionItem,
    KrdsCarousel,
    KrdsSlide,
    KrdsCheckbox,
    KrdsRadio,
    KrdsCoachMark,
    KrdsContextualHelp,
    KrdsPanel,
    KrdsQuantityToggle,
    KrdsRangeSlider,
    KrdsSnackbar,
    KrdsToast,
    KrdsTooltip,
    KrdsControl,
    KrdsCriticalAlerts,
    KrdsDateInput,
    KrdsDisclosure,
    KrdsFileUpload,
    KrdsFloatingButton,
    KrdsFormGroup,
    KrdsInPageNavigation,
    KrdsInput,
    KrdsSpinner,
    KrdsTable,
    KrdsTabs,
    KrdsTextarea,
    KrdsToggleSwitch
  ],
  template: ''
})
class Host {}

describe('컴포넌트 요소의 display·box-sizing', () => {
  it('KRDS 마크업의 바깥 틀이 되는 컴포넌트 요소는 원본의 div처럼 inline이 아니고 border-box다', async () => {
    const { el } = await render(
      Host,
      `
        <krds-checkbox><input type="checkbox" krdsControl />a</krds-checkbox>
        <krds-radio><input type="radio" krdsControl />a</krds-radio>
        <krds-toggle-switch><input type="checkbox" krdsControl />a</krds-toggle-switch>
        <krds-form-group label="a"><input krdsInput /></krds-form-group>
        <krds-textarea><textarea krdsInput aria-label="a"></textarea></krds-textarea>
        <krds-date-input><input krdsInput aria-label="a" /></krds-date-input>
        <krds-file-upload />
        <krds-floating-button label="a" />
        <krds-spinner />
        <krds-disclosure label="a">a</krds-disclosure>
        <div krdsAccordion><krds-accordion-item label="a">a</krds-accordion-item></div>
        <krds-tabs [tabs]="[{ id: 'a', label: 'a' }]" />
        <krds-table [columns]="[]" [rows]="[]" />
        <krds-carousel><li krdsSlide>a</li></krds-carousel>
        <krds-in-page-navigation />
        <krds-critical-alerts message="a" />
        <krds-panel />
        <krds-contextual-help heading="a">a</krds-contextual-help>
        <krds-coach-mark [steps]="[]" [step]="1" />
        <krds-tooltip content="a">a</krds-tooltip>
        <krds-range-slider label="a" />
        <krds-quantity-toggle label="a" />
        <krds-toast />
        <krds-snackbar />
      `
    )
    const inline = [...el.querySelectorAll('*')]
      .filter(node => node.tagName.startsWith('KRDS-') && getComputedStyle(node).display === 'inline')
      .map(node => node.tagName.toLowerCase())
    expect(inline).toEqual([])
    // KRDS 클래스가 display를 정하면 그쪽을 따른다
    expect(getComputedStyle(el.querySelector('krds-form-group')!).display).toBe('flex')

    // 원본의 div처럼 border-box: 패딩·테두리가 있어도 부모 폭을 넘지 않는다
    const contentBox = [...el.querySelectorAll('*')]
      .filter(node => node.tagName.startsWith('KRDS-') && getComputedStyle(node).boxSizing !== 'border-box')
      .map(node => node.tagName.toLowerCase())
    expect(contentBox).toEqual([])
    const upload = el.querySelector('krds-file-upload')!
    expect(upload.getBoundingClientRect().width).toBeLessThanOrEqual(el.getBoundingClientRect().width)
  })
})
