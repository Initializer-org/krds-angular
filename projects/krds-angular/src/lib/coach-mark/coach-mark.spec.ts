import { Component, signal } from '@angular/core'
import { expectNoA11yViolations, render } from '../../test/render'
import { KrdsCoachMark } from './coach-mark'

// 템플릿은 테스트마다 render()에서 덮어쓴다
@Component({ imports: [KrdsCoachMark], template: '<krds-coach-mark [steps]="steps" [step]="1" />' })
class Host {
  readonly steps = [
    { id: 1, title: '메뉴 찾기', description: '메뉴에서 신청할 서비스를 찾습니다.' },
    { id: 2, title: '신청하기', description: '신청 버튼을 누릅니다.' },
    { id: 3, title: '확인하기', description: '신청 내역을 확인합니다.' }
  ]
  readonly current = signal<number | null>(1)
  closed = 0
}

const template = `
  @for (s of steps; track s.id) {
    <krds-coach-mark [steps]="steps" [step]="s.id" [(current)]="current" (closed)="closed = closed + 1; current.set(null)">
      <div class="coach-box">{{ s.title }} 영역</div>
    </krds-coach-mark>
  }
`

describe('KrdsCoachMark', () => {
  it('현재 단계의 코치마크만 말풍선, 이전으로·다음으로·그만보기', async () => {
    const { host, el, click } = await render(Host, template)
    const balloon = () => el.querySelector('.coach-balloon')
    const buttons = () => [...el.querySelectorAll<HTMLButtonElement>('.coach-balloon button')].map(button => button.textContent?.trim())
    expect(el.querySelectorAll('.coach-balloon')).toHaveLength(1)
    expect(balloon()?.closest('krds-coach-mark')?.textContent).toContain('메뉴 찾기 영역')
    expect(balloon()?.querySelector('.coach-tit')?.textContent).toBe('1단계 : 메뉴 찾기')
    expect([...balloon()!.querySelectorAll('.num > *')].map(node => node.textContent)).toEqual(['현재 단계', '1', '총 단계', '3'])
    expect(buttons()).toEqual(['그만보기', '다음으로'])

    const press = (text: string) =>
      click([...el.querySelectorAll<HTMLButtonElement>('.coach-balloon button')].find(b => b.textContent?.trim() === text)!)
    await press('다음으로')
    expect(host.current()).toBe(2)
    expect(buttons()).toEqual(['그만보기', '이전으로', '다음으로'])
    // 누른 버튼이 든 말풍선이 사라지므로 새 단계의 제목으로 초점을 옮긴다
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('2단계 : 신청하기'))
    await press('다음으로')
    expect(buttons()).toEqual(['그만보기', '이전으로'])
    await press('이전으로')
    expect(host.current()).toBe(2)
    await vi.waitFor(() => expect(document.activeElement?.textContent).toBe('2단계 : 신청하기'))
    await expectNoA11yViolations(el)

    await press('그만보기')
    expect(host.closed).toBe(1)
    expect(balloon()).toBeNull()
  })
})
