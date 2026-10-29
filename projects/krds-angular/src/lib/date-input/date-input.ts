import {
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  contentChild,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild
} from '@angular/core'
import { KrdsButton } from '../button/button'
import { KRDS_INPUT_CLASS, KrdsInput } from '../input/input'

interface CalendarDay {
  day: number
  dateString: string
  isCurrentMonth: boolean
  isToday: boolean
  isPrevMonth: boolean
  isNextMonth: boolean
  isSunday: boolean
}

type SwitchType = 'year' | 'month'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']
const pad = (n: number) => String(n).padStart(2, '0')
const formatDate = (date: Date) => `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
const toTime = (dateString: string) => new Date(dateString.replace(/\./g, '-')).getTime()

/** 열린 달력의 닫기 함수 (원본처럼 달력을 열면 다른 달력은 모두 닫는다) */
const openCalendars = new Set<() => void>()

/**
 * KRDS 날짜 입력 필드. 안에 넣은 `<input krdsInput>` 옆에 달력 버튼과 달력을 붙인다.
 * 직접 입력은 기본 input 그대로이고, 달력에서 고른 날짜(기간이면 'YYYY.MM.DD ~ YYYY.MM.DD')는 input에 넣고 input 이벤트로 알리므로
 * `[(ngModel)]`·`formControlName`이 그대로 값을 받는다
 *
 * @example
 * <krds-form-group label="신청일">
 *   <krds-date-input [holidays]="['2025.03.01']">
 *     <input krdsInput placeholder="YYYY.MM.DD" [(ngModel)]="date" />
 *   </krds-date-input>
 * </krds-form-group>
 */
@Component({
  selector: 'krds-date-input',
  imports: [KrdsButton],
  providers: [{ provide: KRDS_INPUT_CLASS, useValue: 'datepicker cal' }],
  host: {
    class: 'form-conts calendar-conts',
    '(document:click)': 'onDocumentClick($event)'
  },
  template: `
    <div class="calendar-input">
      <ng-content />
      <button
        #toggle
        type="button"
        class="krds-btn icon form-btn-datepicker"
        [class]="buttonSize()"
        [disabled]="disabled()"
        [attr.aria-expanded]="open()"
        (click)="open() ? close(true) : openCalendar()"
      >
        <span class="sr-only">달력 열기</span>
        <i class="svg-icon ico-calendar"></i>
      </button>
    </div>
    <div class="krds-calendar-area" [class.active]="open()">
      <div
        #wrap
        class="calendar-wrap"
        [class.bottom]="openUpward()"
        aria-label="달력"
        tabindex="0"
        [style.display]="open() ? null : 'none'"
        (keydown.escape)="onEscape()"
      >
        <div class="calendar-head">
          <button type="button" class="btn-cal-move prev" (click)="moveMonth(-1)"><span class="sr-only">이전 달</span></button>
          <div class="calendar-switch-wrap">
            @for (type of switchTypes; track type) {
              <div class="calendar-drop-down">
                <button
                  #switchButton
                  type="button"
                  class="btn-cal-switch"
                  [class]="type"
                  [attr.aria-label]="format(type, current(type)) + (type === 'year' ? ' 연도 선택' : ' 월 선택')"
                  [attr.aria-expanded]="dropdown() === type"
                  (click)="dropdown.set(dropdown() === type ? null : type)"
                >
                  {{ format(type, current(type)) }}
                </button>
                <div
                  class="calendar-select"
                  [class]="type === 'year' ? 'calendar-year-wrap' : 'calendar-mon-wrap'"
                  [class.active]="dropdown() === type"
                  [style.display]="dropdown() === type ? null : 'none'"
                >
                  <ul class="sel" [class]="type">
                    @for (option of options(type); track option) {
                      <li>
                        <button type="button" [class.active]="option === current(type)" (click)="pick(type, option, switchButton)">
                          {{ format(type, option) }}
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              </div>
            }
          </div>
          <button type="button" class="btn-cal-move next" (click)="moveMonth(1)"><span class="sr-only">다음 달</span></button>
        </div>
        <div class="calendar-body">
          <div class="calendar-table-wrap">
            <table class="calendar-tbl">
              <caption>
                {{
                  year()
                }}년
                {{
                  pad(month())
                }}월
              </caption>
              <thead>
                <tr>
                  @for (label of weekdays; track label) {
                    <th>{{ label }}</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (week of grid(); track $index) {
                  <tr>
                    @for (day of week; track day.dateString) {
                      <td [class]="cellClasses(day)" [attr.data-date]="day.dateString">
                        <button
                          type="button"
                          class="btn-set-date"
                          [attr.aria-pressed]="range(day.dateString).isInRange"
                          (click)="selectDate(day.dateString)"
                        >
                          <span>{{ day.day }}</span>
                        </button>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <div class="calendar-footer">
          <div class="calendar-btn-wrap">
            <button krdsButton text size="small" (click)="selectDate(todayString, true)">오늘</button>
            <button krdsButton variant="tertiary" size="small" (click)="close(true)">취소</button>
            <button krdsButton size="small" (click)="confirm()">확인</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class KrdsDateInput {
  /** 일정이 있는 날짜 (YYYY.MM.DD) */
  readonly eventDates = input<string[]>([])
  /** 휴일 (YYYY.MM.DD, 일요일은 기본으로 휴일 표시) */
  readonly holidays = input<string[]>([])
  /** 처음 보여 줄 연도 (기본: 올해) */
  readonly initialYear = input<number>()
  /** 처음 보여 줄 월 1~12 (기본: 이번 달) */
  readonly initialMonth = input<number>()

  protected readonly weekdays = WEEKDAY_LABELS
  protected readonly switchTypes: SwitchType[] = ['year', 'month']
  protected readonly pad = pad

  private readonly today = new Date()
  protected readonly todayString = formatDate(this.today)

  protected readonly open = signal(false)
  protected readonly dropdown = signal<SwitchType | null>(null)
  // 원본처럼 위로 여는 것이 기본이고, 위 공간이 모자라고 아래가 더 넓으면 아래로 연다
  protected readonly openUpward = signal(true)
  protected readonly disabled = signal(false)
  protected readonly year = linkedSignal(() => this.initialYear() ?? this.today.getFullYear())
  protected readonly month = linkedSignal(() => this.initialMonth() ?? this.today.getMonth() + 1)
  private readonly start = signal<string | null>(null)
  private readonly end = signal<string | null>(null)

  private readonly control = contentChild.required(KrdsInput)
  private readonly controlEl = contentChild.required(KrdsInput, { read: ElementRef })
  private readonly toggle = viewChild.required<ElementRef<HTMLButtonElement>>('toggle')
  private readonly wrap = viewChild.required<ElementRef<HTMLElement>>('wrap')
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef)
  private readonly injector = inject(Injector)
  private readonly destroyRef = inject(DestroyRef)

  protected readonly buttonSize = computed(() => this.control().size() ?? 'medium')

  protected readonly grid = computed<CalendarDay[][]>(() => {
    const year = this.year()
    const month = this.month()
    const firstDate = new Date(year, month - 1, 1)
    // 첫 번째 날의 요일만큼 이전 달 날짜부터 6주
    const date = new Date(year, month - 1, 1 - firstDate.getDay())
    return Array.from({ length: 6 }, () =>
      Array.from({ length: 7 }, () => {
        const day: CalendarDay = {
          day: date.getDate(),
          dateString: formatDate(date),
          isCurrentMonth: date.getMonth() === month - 1,
          isToday: date.toDateString() === this.today.toDateString(),
          isPrevMonth: date < firstDate,
          isNextMonth: date.getMonth() !== month - 1 && date > firstDate,
          isSunday: date.getDay() === 0
        }
        date.setDate(date.getDate() + 1)
        return day
      })
    )
  })

  private readonly closeOthers = () => this.close(false)

  constructor() {
    // 기본 input의 disabled(ngModel·reactive forms가 바꾸는 것 포함)를 따라 달력 버튼도 비활성화한다
    afterNextRender(() => {
      const el = this.controlEl().nativeElement as HTMLInputElement
      const sync = () => this.disabled.set(el.disabled)
      sync()
      const observer = new MutationObserver(sync)
      observer.observe(el, { attributes: true, attributeFilter: ['disabled'] })
      this.destroyRef.onDestroy(() => observer.disconnect())
    })
    this.destroyRef.onDestroy(() => openCalendars.delete(this.closeOthers))
  }

  protected current(type: SwitchType) {
    return type === 'year' ? this.year() : this.month()
  }

  protected options(type: SwitchType) {
    const year = this.today.getFullYear()
    return type === 'year' ? Array.from({ length: 21 }, (_, i) => year - 10 + i) : Array.from({ length: 12 }, (_, i) => i + 1)
  }

  protected format(type: SwitchType, value: number) {
    return type === 'year' ? `${value}년` : `${pad(value)}월`
  }

  protected pick(type: SwitchType, value: number, switchButton: HTMLButtonElement) {
    if (type === 'year') this.year.set(value)
    else this.month.set(value)
    this.dropdown.set(null)
    // 목록이 숨겨질 때 초점을 잃지 않게 연/월 버튼으로 옮긴다
    switchButton.focus()
  }

  protected openCalendar() {
    openCalendars.forEach(close => close())
    openCalendars.add(this.closeOthers)
    this.open.set(true)
    this.dropdown.set(null)
    afterNextRender(
      () => {
        this.updatePlacement()
        this.wrap().nativeElement.focus()
      },
      { injector: this.injector }
    )
  }

  /** 닫기. 취소·확인·Esc·달력 버튼은 초점을 달력 버튼으로 돌려주고, 바깥 클릭과 다른 달력 열기는 초점을 그대로 둔다 */
  protected close(returnFocus: boolean) {
    if (returnFocus && this.open()) this.toggle().nativeElement.focus()
    this.open.set(false)
    this.dropdown.set(null)
    openCalendars.delete(this.closeOthers)
  }

  protected onEscape() {
    const type = this.dropdown()
    if (!type) return this.close(true)
    this.dropdown.set(null)
    this.host.nativeElement.querySelector<HTMLElement>(`.btn-cal-switch.${type}`)?.focus()
  }

  protected onDocumentClick(event: MouseEvent) {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close(false)
  }

  protected moveMonth(delta: number) {
    const date = new Date(this.year(), this.month() - 1 + delta, 1)
    this.year.set(date.getFullYear())
    this.month.set(date.getMonth() + 1)
  }

  /** 첫 클릭은 시작일, 다음 클릭은 종료일 (시작일보다 앞이면 시작일을 다시 정함) */
  protected selectDate(dateString: string, single = false) {
    const start = this.start()
    if (single) {
      this.start.set(dateString)
      this.end.set(dateString)
    } else if (!start || this.end() || toTime(dateString) < toTime(start)) {
      this.start.set(dateString)
      this.end.set(null)
    } else {
      this.end.set(dateString)
    }
  }

  protected range(dateString: string) {
    const start = this.start()
    const end = this.end()
    const isStart = dateString === start
    if (!start || !end) return { isInRange: isStart, isStart, isEnd: false }
    const time = toTime(dateString)
    return { isInRange: time >= toTime(start) && time <= toTime(end), isStart, isEnd: dateString === end }
  }

  protected cellClasses(day: CalendarDay) {
    const range = day.isCurrentMonth ? this.range(day.dateString) : undefined
    return [
      day.isPrevMonth && 'old',
      day.isNextMonth && 'new',
      day.isToday && 'today',
      (day.isSunday || this.holidays().includes(day.dateString)) && 'day-off',
      this.eventDates().includes(day.dateString) && 'day-event',
      range?.isInRange && 'period',
      range?.isInRange && range.isStart && 'start',
      range?.isInRange && range.isEnd && 'end'
    ]
      .filter(Boolean)
      .join(' ')
  }

  protected confirm() {
    const start = this.start()
    if (!start) return
    const end = this.end()
    const el = this.controlEl().nativeElement as HTMLInputElement
    el.value = end && end !== start ? `${start} ~ ${end}` : start
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
    this.close(true)
  }

  private updatePlacement() {
    const rect = this.toggle().nativeElement.parentElement?.getBoundingClientRect()
    if (!rect) return
    const spaceAbove = rect.top
    const spaceBelow = window.innerHeight - rect.bottom
    this.openUpward.set(spaceAbove >= this.wrap().nativeElement.offsetHeight || spaceAbove >= spaceBelow)
  }
}
