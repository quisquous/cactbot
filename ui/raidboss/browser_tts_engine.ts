import { Lang } from '../../resources/languages';

class TTSItem {
  readonly text: string;
  readonly item: SpeechSynthesisUtterance;

  constructor(text: string, lang?: string, voice?: SpeechSynthesisVoice) {
    this.text = text;
    this.item = new SpeechSynthesisUtterance(text);
    if (lang !== undefined)
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
};

export default class BrowserTTSEngine {
  readonly ttsItems: TTSItemDictionary = {};
  private speechLang?: string;
  private speechVoice?: SpeechSynthesisVoice;
  private initializeAttempts = 0;

  constructor(private cactbotLang: Lang) {
    if (window.speechSynthesis !== undefined) {
      // https://bugs.chromium.org/p/chromium/issues/detail?id=334847
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initializeVoice();
    } else
      console.error('BrowserTTS error: no browser support for window.speechSynthesis');
  }

  initializeVoice(): boolean {
    if (window.speechSynthesis === undefined)
      return false;
    if (this.speechVoice !== undefined)
      return true;
    if (this.initializeAttempts > 5)
      return false;
    this.initializeAttempts++;

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
    const speechLang = cactbotLangToSpeechLang[this.cactbotLang];
    const voice = window.speechSynthesis.getVoices().find((voice) =>
      voice.lang.replaceAll('_', '-') === speechLang
    );
    if (voice) {
      this.speechLang = speechLang;
      this.speechVoice = voice;
      window.speechSynthesis.onvoiceschanged = null;
      return true;
    }

    console.error('BrowserTTS error: could not find voice');
    return false;
  }

  play(text: string): void {
    // TODO: try to address a report of the constructor not finding voices
    // by lazily looking later.
    if (!this.initializeVoice())
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
