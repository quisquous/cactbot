'use strict';

const TTSEngineType = {
  SpeechSynthesis: 0,
  GoogleTTS: 1,
};

class TTSItem {
  play() {}
}

class SpeechTTSItem extends TTSItem {
  constructor(text) {
    super();
    this.text = text;
    this.item = new SpeechSynthesisUtterance(text);
  }

  play() {
    window.speechSynthesis.speak(this.item);
  }
}

class GoogleTTSItem extends TTSItem {
  constructor(text) {
    super();
    this.text = text;
    let iframe = document.createElement('iframe');
    // remove sandbox so we can modify contents/call play on audio element later
    iframe.removeAttribute('sandbox');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    let encText = encodeURIComponent(text);
    iframe.contentDocument.body.innerHTML = '<audio src="https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=' + encText + '" id="TTS">';
    this.item = iframe.contentDocument.body.firstElementChild;
  }

  play() {
    this.item.play();
  }
}

class BrowserTTSEngine {
  constructor() {
    // figure out what TTS engine type we need
    if (window.speechSynthesis !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        if (window.speechSynthesis.getVoices().length > 0) {
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
    this.ttsItems[text] = new SpeechTTSItem(text);
    this.ttsItems[text].play();
  }

  playGoogleTTS(text) {
    this.ttsItems[text] = new GoogleTTSItem(text);
    this.ttsItems[text].play();
  }
}
