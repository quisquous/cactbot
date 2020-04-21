class RaidEmulatorPopupText extends PopupText {
  emulatedOffset = 0;

  emulator;

  BindTo(emulator) {
    this.emulator = emulator;
    emulator.on('Tick', (timestampOffset) => {
      this.emulatedOffset = timestampOffset;
      // @TODO: Update displayed and scheduled
    });
  }

  DisplayedText = [];

  _AddTextFor(TextType, triggerOptions, trigger, response, duration, SoundOptions, ValueOrFunction) {
    let UpperTextType = TextType[0].toUpperCase() + TextType.slice(1);
    let textObj = triggerOptions[UpperTextType] || trigger[TextType] || response[TextType];
    if (textObj) {
      let text = ValueOrFunction(textObj);
      SoundOptions.defaultTTSText = SoundOptions.defaultTTSText || text;
      if (text && SoundOptions.showText) {
        text = triggerUpperCase(text);
        let div = this._MakeTextElement(text, TextType.split('T')[0] + '-text');
        this.AddDisplayText(TextType, div, this.emulatedOffset + (duration.fromTrigger || duration[TextType]));

        if (!SoundOptions.soundUrl) {
          SoundOptions.soundUrl = this.options[UpperTextType.split('T')[0] + 'Sound'];
          SoundOptions.soundVol = this.options[UpperTextType.split('T')[0] + 'SoundVolume'];
        }
      }
    }
  }

  ScheduledTriggers = [];

  _ScheduleTrigger(promiseThenTrigger, delay) {
    this.ScheduledTriggers.push({
      Expires: this.emulatedOffset + delay,
      Promise: promiseThenTrigger,
    });
  }

  _PlayAudioFile(SoundOptions) {
    let div = this._MakeTextElement(SoundOptions.soundUrl, 'audio-file');
    this.AddDisplayText('audioFile', div, this.emulatedOffset + 2000);
    super._PlayAudioFile(SoundOptions);
  }
  ttsSay(ttsText) {
    let div = this._MakeTextElement(ttsText, 'tts-text');
    this.AddDisplayText('ttsText', div, this.emulatedOffset + 2000);
    super.ttsSay(ttsText);
  }

  AddDisplayText(elem, endTimestamp) {
    let $e = $(elem);
    // @TODO: Add element to DOM
    switch (type) {
      case 'infoText':
        break;
      case 'alertText':
        break;
      case 'alarmText':
        break;
      case 'ttsText':
        break;
      case 'audioFile':
        break;
    }
    this.DisplayedText.push({
      Element: $e,
      Expires: endTimestamp,
    });
  }
}