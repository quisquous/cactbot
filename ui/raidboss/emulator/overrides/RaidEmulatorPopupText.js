class RaidEmulatorPopupText extends PopupText {
  constructor(options) {
    super(options);
    this.$popupTextContainerWrapper = $('.popup-text-container-outer');
  }

  emulatedOffset = 0;

  emulator;

  DisplayedText = [];
  ScheduledTriggers = [];

  Seeking = false;

  LastSeekTo = 0;

  async DoUpdate(timestampOffset) {
    this.emulatedOffset = timestampOffset;
    for (let t of this.ScheduledTriggers) {
      let remaining = t.Expires - timestampOffset;
      if (remaining <= 0) {
        t.Resolver();
        await t.Promise;
      }
    }
    this.ScheduledTriggers = this.ScheduledTriggers.filter((t) => {
      let remaining = t.Expires - timestampOffset;
      if (remaining > 0) {
        return true;
      } else {
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
  }

  bindTo(emulator) {
    this.emulator = emulator;
    emulator.on('tick', async (timestampOffset) => {
      await this.DoUpdate(timestampOffset);
    });
    emulator.on('midSeek', async (timestampOffset) => {
      await this.DoUpdate(timestampOffset);
    });
    emulator.on('preSeek', (time) => {
      this.LastSeekTo = time;
      this.Seeking = true;
      for (let i of this.ScheduledTriggers) {
        i.Rejecter();
      }
      this.ScheduledTriggers = [];
      this.DisplayedText = this.DisplayedText.filter((t) => {
        t.Element.remove();
        return false;
      });
    });
    emulator.on('postSeek', async (time) => {
      // This is a hacky fix for audio still playing during seek
      window.setTimeout(() => {
        this.Seeking = false;
      }, 5);
    });
    emulator.on('currentEncounterChanged', () => {
      for (let i of this.ScheduledTriggers) {
        i.Rejecter();
      }
      this.ScheduledTriggers = [];
      this.DisplayedText = this.DisplayedText.filter((t) => {
        t.Element.remove();
        return false;
      });
    });
  }

  _AddTextFor(TextType, TriggerHelper) {
    let UpperTextType = TextType[0].toUpperCase() + TextType.slice(1);
    let textObj = TriggerHelper.TriggerOptions[UpperTextType] || TriggerHelper.Trigger[TextType] || TriggerHelper.Response[TextType];
    if (textObj) {
      let text = TriggerHelper.ValueOrFunction(textObj);
      TriggerHelper.DefaultTTSText = TriggerHelper.DefaultTTSText || text;
      if (text && TriggerHelper.TextAlertsEnabled) {
        text = triggerUpperCase(text);
        let div = this._MakeTextElement(text, TextType.split('T')[0] + '-text');
        this.AddDisplayText(div, this.emulatedOffset + ((TriggerHelper.Duration.FromTrigger || TriggerHelper.Duration[TextType]) * 1000));

        if (!TriggerHelper.SoundUrl) {
          TriggerHelper.SoundUrl = this.options[UpperTextType.split('T')[0] + 'Sound'];
          TriggerHelper.SoundVol = this.options[UpperTextType.split('T')[0] + 'SoundVolume'];
        }
      }
    }
  }

  _OnTriggerInternal_DelaySeconds(TriggerHelper) {
    let delay = 'delaySeconds' in TriggerHelper.Trigger ? TriggerHelper.ValueOrFunction(TriggerHelper.Trigger.delaySeconds) : 0;

    if (delay === 0) {
      return new Promise((res) => {
        res();
      });
    }

    let resolver;
    let rejecter;
    let ret = new Promise((res, rej) => {
      resolver = res;
      rejecter = rej;
    });
    this.ScheduledTriggers.push({
      Expires: this.emulatedOffset + (delay * 1000),
      Promise: ret,
      Resolver: resolver,
      Rejecter: rejecter,
    });
    return ret;
  }

  _PlayAudioFile(URL, Volume) {
    if (![this.options.InfoSound, this.options.AlertSound, this.options.AlarmSound]
      .includes(URL)) {
      let div = this._MakeTextElement(URL, 'audio-file');
      this.AddDisplayText(div, this.emulatedOffset + 2000);
    }
    if (this.Seeking) {
      return;
    }
    super._PlayAudioFile(URL, Volume);
  }
  ttsSay(ttsText) {
    if (this.Seeking) {
      return;
    }
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