import { Component, computed, signal } from '@angular/core'
import { KrdsLanguageSwitcher, KrdsLanguageTop, type KrdsLanguage } from '@krds.ui/angular'

@Component({
  selector: 'demo-language-switcher-basic',
  imports: [KrdsLanguageSwitcher, KrdsLanguageTop],
  template: `
    <div style="height: 400px; padding: 50px">
      <krds-language-switcher [languages]="languages" [(language)]="language">
        언어변경
        <div krdsLanguageTop>
          <p class="current-laguage">
            <span>현재 언어</span>
            <strong>{{ currentName() }}</strong>
          </p>
        </div>
      </krds-language-switcher>
      <p style="margin-top: 20px">선택된 언어: {{ language() }}</p>
    </div>
  `
})
export default class LanguageSwitcherBasic {
  readonly languages: KrdsLanguage[] = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English (영어)' },
    { code: 'zh', name: '中文 (중국어)' },
    { code: 'ja', name: '日本語 (일본어)' },
    { code: 'fr', name: 'français (프랑스어)' }
  ]
  readonly language = signal('')
  readonly currentName = computed(() => this.languages.find(item => item.code === this.language())?.name || '선택해주세요')
}
