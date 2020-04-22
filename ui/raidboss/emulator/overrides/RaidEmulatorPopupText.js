class RaidEmulatorPopupText extends PopupText {
  constructor(options) {
    super(options);
    this.$popupTextContainerWrapper = $('.popup-text-container-outer');
  }

  emulatedOffset = 0;

  emulator;

  DisplayedText = [];
  ScheduledTriggers = [];

  BindTo(emulator) {
    this.emulator = emulator;
    emulator.on('Tick', (timestampOffset) => {
      this.emulatedOffset = timestampOffset;
      this.ScheduledTriggers = this.ScheduledTriggers.filter((t) => {
        let remaining = t.Expires - timestampOffset;
        if (remaining > 0) {
          return true;
        } else {
          t.Promise();
          return false;
        }
      });
      this.DisplayedText = this.DisplayedText.filter((t) => {
        let remaining = t.Expires - timestampOffset;
        if (remaining > 0) {
          t.Element.find('.popup-text-remaining').text('(' + (remaining / 1000).toFixed(1) + ')');
          return true;
        } else {
          t.Element.remove();
          return false;
        }
      });
    });
    emulator.on('PreSeek', (time) => {
      this.ScheduledTriggers = [];
      this.DisplayedText = this.DisplayedText.filter((t) => {
        t.Element.remove();
        return false;
      });
    });
    emulator.on('MidSeek', (time) => {
      this.emulatedOffset = time;
    });
    emulator.on('CurrentEncounterChanged', () => {
      this.ScheduledTriggers = [];
      this.DisplayedText = this.DisplayedText.filter((t) => {
        t.Element.remove();
        return false;
      });
    });
  }

  _AddTextFor(TextType, triggerOptions, trigger, response, duration, SoundOptions, ValueOrFunction) {
    let UpperTextType = TextType[0].toUpperCase() + TextType.slice(1);
    let textObj = triggerOptions[UpperTextType] || trigger[TextType] || response[TextType];
    if (textObj) {
      let text = ValueOrFunction(textObj);
      SoundOptions.defaultTTSText = SoundOptions.defaultTTSText || text;
      if (text && SoundOptions.showText) {
        text = triggerUpperCase(text);
        let div = this._MakeTextElement(text, TextType.split('T')[0] + '-text');
        this.AddDisplayText(div, this.emulatedOffset + ((duration.fromTrigger || duration[TextType]) * 1000));

        if (!SoundOptions.soundUrl) {
          SoundOptions.soundUrl = this.options[UpperTextType.split('T')[0] + 'Sound'];
          SoundOptions.soundVol = this.options[UpperTextType.split('T')[0] + 'SoundVolume'];
        }
      }
    }
  }

  _ScheduleTrigger(promiseThenTrigger, delay) {
    this.ScheduledTriggers.push({
      Expires: this.emulatedOffset + delay,
      Promise: promiseThenTrigger,
    });
  }

  _PlayAudioFile(SoundOptions) {
    if (![this.options.InfoSound, this.options.AlertSound, this.options.AlarmSound]
        .includes(SoundOptions.soundUrl)) {
      let div = this._MakeTextElement(SoundOptions.soundUrl, 'audio-file');
      this.AddDisplayText(div, this.emulatedOffset + 2000);
    }
    super._PlayAudioFile(SoundOptions);
  }
  ttsSay(ttsText) {
    let div = this._MakeTextElement(ttsText, 'tts-text');
    this.AddDisplayText(div, this.emulatedOffset + 2000);
    super.ttsSay(ttsText);
  }

  _MakeTextElement(text, className) {
    let $ret = $('<div class="popup-text-container"></div>')
    $ret.addClass(className);
    let $text = $('<span class="popup-text"></span>');
    $text.text(text);
    let $rem = $('<span class="popup-text-remaining pl-1"></span>');
    $ret.append($text, $rem);
    return $ret;
  }

  AddDisplayText($e, endTimestamp) {
    $e.find('.popup-text-remaining').text('(' + ((endTimestamp - this.emulatedOffset) / 1000).toFixed(1) + ')');
    this.$popupTextContainerWrapper.append($e);
    this.DisplayedText.push({
      Element: $e,
      Expires: endTimestamp,
    });
  }
}