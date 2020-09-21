'use strict';

const TTSEngineType = {
  SpeechSynthesis: 0,
  GoogleTTS: 1,
};

class TTSItem {
  play() {}
}

class SpeechTTSItem extends TTSItem {
  constructor(text, lang, voice) {
    super();
    this.text = text;
    this.item = new SpeechSynthesisUtterance(text);
    this.item.lang = lang;
    this.item.voice = voice;
  }

  play() {
    window.speechSynthesis.speak(this.item);
  }
}

class GoogleTTSItem extends TTSItem {
  constructor(text, lang) {
    super();
    this.lang = lang;
    this.text = text;
    let iframe = document.createElement('iframe');
    // remove sandbox so we can modify contents/call play on audio element later
    iframe.removeAttribute('sandbox');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    let encText = encodeURIComponent(text);
    iframe.contentDocument.body.innerHTML = '<audio src="https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + lang + '&q=' + encText + '" id="TTS">';
    this.item = iframe.contentDocument.body.firstElementChild;
  }

  play() {
    this.item.play();
  }
}

class BrowserTTSEngine {
  constructor(lang) {
    this.googleTTSLang = lang == 'cn' ? 'zh' : lang;
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

    this.engineType = TTSEngineType.GoogleTTS;
    this.ttsItems = {};
  }

  play(text) {
    try {
      if (this.ttsItems[text] !== undefined)
        this.ttsItems[text].play();
      else
        this.playTTS(text);
    } catch (e) {
      console.log('Exception performing TTS', e);
    }
  }

  playTTS(text) {
    switch (this.engineType) {
    case TTSEngineType.SpeechSynthesis:
      this.playSpeechTTS(text);
      break;
    case TTSEngineType.GoogleTTS:
      this.playGoogleTTS(text);
      break;
    }
  }

  playSpeechTTS(text) {
    this.ttsItems[text] = new SpeechTTSItem(text, this.speechLang, this.speechVoice);
    this.ttsItems[text].play();
  }

  playGoogleTTS(text) {
    this.ttsItems[text] = new GoogleTTSItem(text, this.googleTTSLang);
    this.ttsItems[text].play();
  }
}
