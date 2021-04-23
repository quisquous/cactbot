import { Lang } from 'types/global';

const TTSEngineType = {
  SpeechSynthesis: 0,
  GoogleTTS: 1,
};

interface TTSItem {
  play: () => void;
}

class SpeechTTSItem implements TTSItem {
  readonly text: string;
  readonly item: SpeechSynthesisUtterance;

  constructor(text: string, lang: string, voice: SpeechSynthesisVoice) {
    this.text = text;
    this.item = new SpeechSynthesisUtterance(text);
    this.item.lang = lang;
    this.item.voice = voice;
  }

  play() {
    window.speechSynthesis.speak(this.item);
  }
}

class GoogleTTSItem implements TTSItem {
  readonly text: string;
  readonly lang: string;
  private item?: Element | null;

  constructor(text: string, lang: string) {
    this.text = text;
    this.lang = lang;
    const iframe = document.createElement('iframe');
    // remove sandbox so we can modify contents/call play on audio element later
    iframe.removeAttribute('sandbox');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const encText = encodeURIComponent(text);
    if (iframe.contentDocument) {
      iframe.contentDocument.body.innerHTML = '<audio src="https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + lang + '&q=' + encText + '" id="TTS">';
      this.item = iframe.contentDocument.body.firstElementChild;
    }
  }

  play() {
    if (this.item && this.item instanceof HTMLAudioElement)
      void this.item.play();
  }
}

type TTSItemDictionary = {
  [key: string]: TTSItem;
}

export default class BrowserTTSEngine {
  readonly ttsItems: TTSItemDictionary = {};
  readonly googleTTSLang;
  private engineType = TTSEngineType.GoogleTTS;
  private speechLang?: string;
  private speechVoice?: SpeechSynthesisVoice;

  constructor(lang: Lang) {
    this.googleTTSLang = lang === 'cn' ? 'zh' : lang;
    // TODO: should there be options for different voices here so that
    // everybody isn't forced into Microsoft Anna?
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
          this.engineType = TTSEngineType.SpeechSynthesis;
        }
      };
    }
  }

  play(text: string): void {
    try {
      const ttsItem = this.ttsItems[text];
      ttsItem ? ttsItem.play() : this.playTTS(text);
    } catch (e) {
      console.log('Exception performing TTS', e);
    }
  }

  playTTS(text: string): void {
    switch (this.engineType) {
    case TTSEngineType.SpeechSynthesis:
      this.playSpeechTTS(text);
      break;
    case TTSEngineType.GoogleTTS:
      this.playGoogleTTS(text);
      break;
    }
  }

  playSpeechTTS(text: string): void {
    if (this.speechLang && this.speechVoice) {
      const ttsItem = new SpeechTTSItem(text, this.speechLang, this.speechVoice);
      this.ttsItems[text] = ttsItem;
      ttsItem.play();
    }
  }

  playGoogleTTS(text: string): void {
    const ttsItem = new GoogleTTSItem(text, this.googleTTSLang);
    this.ttsItems[text] = ttsItem;
    ttsItem.play();
  }
}
