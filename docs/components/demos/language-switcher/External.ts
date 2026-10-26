import { Component } from '@angular/core'
import { KrdsLanguageSwitcher, type KrdsLanguage } from '@krds.ui/angular'

@Component({
  selector: 'demo-language-switcher-external',
  imports: [KrdsLanguageSwitcher],
  template: `
    <div style="height: 400px; padding: 50px">
      <krds-language-switcher type="external" [languages]="languages"> 언어변경 </krds-language-switcher>
    </div>
  `
})
export default class LanguageSwitcherExternal {
  readonly languages: KrdsLanguage[] = [
    { code: 'ko', name: '한국어', url: 'https://example.com/ko' },
    { code: 'en', name: 'English (영어)', url: 'https://example.com/en' },
    { code: 'zh', name: '中文 (중국어)', url: 'https://example.com/zh' },
    { code: 'ja', name: '日本語 (일본어)', url: 'https://example.com/ja' },
    { code: 'fr', name: 'français (프랑스어)', url: 'https://example.com/fr' }
  ]
}
