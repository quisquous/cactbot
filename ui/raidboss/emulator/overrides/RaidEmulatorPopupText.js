class RaidEmulatorPopupText extends PopupText {
  constructor(options) {
    super(options);
    this.$popupTextContainerWrapper = $('.popup-text-container-outer');
  }

  emulatedOffset = 0;

  emulator;

  DisplayedText = [];
  scheduledTriggers = [];

  Seeking = false;

  LastSeekTo = 0;

  async DoUpdate(timestampOffset) {
    this.emulatedOffset = timestampOffset;
    for (let t of this.scheduledTriggers) {
      let remaining = t.Expires - timestampOffset;
      if (remaining <= 0) {
        t.Resolver();
        await t.Promise;
      }
    }
    this.scheduledTriggers = this.scheduledTriggers.filter((t) => {
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
      for (let i of this.scheduledTriggers) {
        i.Rejecter();
      }
      this.scheduledTriggers = [];
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
      for (let i of this.scheduledTriggers) {
        i.Rejecter();
      }
      this.scheduledTriggers = [];
      this.DisplayedText = this.DisplayedText.filter((t) => {
        t.Element.remove();
        return false;
      });
    });
  }

  _addTextFor(textType, triggerHelper) {
    let textTypeUpper = textType[0].toUpperCase() + textType.slice(1);
    // infoText
    let lowerTextKey = textType + 'Text';
    // InfoText
    let upperTextKey = textTypeUpper + 'Text';
    // info-text
    let textElementClass = textType + '-text';
    let textObj = triggerHelper.triggerOptions[upperTextKey] ||
      triggerHelper.trigger[lowerTextKey] || triggerHelper.response[lowerTextKey];
    if (textObj) {
      let text = triggerHelper.valueOrFunction(textObj);
      triggerHelper.defaultTTSText = triggerHelper.defaultTTSText || text;
      if (text && triggerHelper.textAlertsEnabled) {
        text = triggerUpperCase(text);
        let div = this._makeTextElement(text, textElementClass);
        this.AddDisplayText(div, this.emulatedOffset + ((triggerHelper.duration.fromTrigger || triggerHelper.duration[lowerTextKey]) * 1000));

        if (!triggerHelper.soundUrl) {
          triggerHelper.soundUrl = this.options[textTypeUpper + 'Sound'];
          triggerHelper.soundVol = this.options[textTypeUpper + 'SoundVolume'];
        }
      }
    }
  }

  _onTriggerInternalDelaySeconds(triggerHelper) {
    let delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;

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
    this.scheduledTriggers.push({
      Expires: this.emulatedOffset + (delay * 1000),
      Promise: ret,
      Resolver: resolver,
      Rejecter: rejecter,
    });
    return ret;
  }

  _playAudioFile(url, volume) {
    if (![this.options.InfoSound, this.options.AlertSound, this.options.AlarmSound]
      .includes(url)) {
      let div = this._makeTextElement(url, 'audio-file');
      this.AddDisplayText(div, this.emulatedOffset + 2000);
    }
    if (this.Seeking) {
      return;
    }
    super._playAudioFile(url, volume);
  }
  ttsSay(ttsText) {
    if (this.Seeking) {
      return;
    }
    let div = this._makeTextElement(ttsText, 'tts-text');
    this.AddDisplayText(div, this.emulatedOffset + 2000);
    super.ttsSay(ttsText);
  }

  _makeTextElement(text, className) {
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