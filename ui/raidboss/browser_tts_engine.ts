import { Lang } from '../../resources/languages';

class TTSItem {
  readonly text: string;
  readonly item: SpeechSynthesisUtterance;

  constructor(text: string, lang?: string, voice?: SpeechSynthesisVoice) {
    this.text = text;
    this.item = new SpeechSynthesisUtterance(text);
    if (lang)
      this.item.lang = lang;
    if (voice)
      this.item.voice = voice;
  }

  play() {
    window.speechSynthesis.speak(this.item);
  }
}

type TTSItemDictionary = {
  [key: string]: TTSItem;
}

export default class BrowserTTSEngine {
  readonly ttsItems: TTSItemDictionary = {};
  private speechLang?: string;
  private speechVoice?: SpeechSynthesisVoice;

  constructor(lang: Lang) {
    const cactbotLangToSpeechLang = {
      en: 'en-US',
      de: 'de-DE',
      fr: 'fr-FR',
      ja: 'ja-JP',
      // TODO: maybe need to provide an option of zh-CN, zh-HK, zh-TW?
      cn: 'zh-CN',
      ko: 'ko-KR',
    };

    // figure out what TTS engine type we need
    if (window.speechSynthesis !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        const speechLang = cactbotLangToSpeechLang[lang];
        const voice = window.speechSynthesis.getVoices().find((voice) => voice.lang === speechLang);
        if (voice) {
          this.speechLang = speechLang;
          this.speechVoice = voice;
          window.speechSynthesis.onvoiceschanged = null;
        } else {
          console.error('BrowserTTS error: could not find voice');
        }
      };
    } else {
      console.error('BrowserTTS error: no browser support for window.speechSynthesis');
    }
  }

  play(text: string): void {
    if (!this.speechVoice)
      return;

    try {
      let ttsItem = this.ttsItems[text];
      if (!ttsItem) {
        ttsItem = new TTSItem(text, this.speechLang, this.speechVoice);
        this.ttsItems[text] = ttsItem;
      }
      ttsItem.play();
    } catch (e) {
      console.error('Exception performing TTS', e);
    }
  }
}
