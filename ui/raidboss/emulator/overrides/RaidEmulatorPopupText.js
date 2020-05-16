'use strict';

class RaidEmulatorPopupText extends StubbedPopupText {
  constructor(options) {
    super(options);
    this.$popupTextContainerWrapper = $('.popup-text-container-outer');
    this.emulatedOffset = 0;

    this.emulator = null;

    this.displayedText = [];
    this.scheduledTriggers = [];

    this.seeking = false;

    this.lastSeekTo = 0;
  }

  async doUpdate(timestampOffset) {
    this.emulatedOffset = timestampOffset;
    for (let t of this.scheduledTriggers) {
      let remaining = t.expires - timestampOffset;
      if (remaining <= 0) {
        t.resolver();
        await t.promise;
      }
    }
    this.scheduledTriggers = this.scheduledTriggers.filter((t) => {
      return t.expires - timestampOffset > 0;
    });
    this.displayedText = this.displayedText.filter((t) => {
      let remaining = t.expires - timestampOffset;
      if (remaining > 0) {
        t.element.find('.popup-text-remaining').text('(' + (remaining / 1000).toFixed(1) + ')');
        return true;
      }
      t.element.remove();
      return false;
    });
  }

  bindTo(emulator) {
    this.emulator = emulator;
    emulator.on('emitLogs', (event) => {
      this.OnLog({
        detail: {
          logs:event.logs
        }
      });
    });
    emulator.on('tick', async (timestampOffset) => {
      await this.doUpdate(timestampOffset);
    });
    emulator.on('midSeek', async (timestampOffset) => {
      await this.doUpdate(timestampOffset);
    });
    emulator.on('preSeek', (time) => {
      this.lastSeekTo = time;
      this.seeking = true;
      for (let i of this.scheduledTriggers)
        i.rejecter();

      this.scheduledTriggers = [];
      this.displayedText = this.displayedText.filter((t) => {
        t.element.remove();
        return false;
      });
    });
    emulator.on('postSeek', async (time) => {
      // This is a hacky fix for audio still playing during seek
      window.setTimeout(() => {
        this.seeking = false;
      }, 5);
    });
    emulator.on('currentEncounterChanged', () => {
      for (let i of this.scheduledTriggers)
        i.rejecter();

      this.scheduledTriggers = [];
      this.displayedText = this.displayedText.filter((t) => {
        t.element.remove();
        return false;
      });
      this.OnZoneChange({
        detail: {
          zoneName: emulator.currentEncounter.encounter.encounterZone,
        },
      });
    });
  }

  OnDataFilesRead(e) {
    // Work around Options.Triggers getting modified by the global scope here
    let triggers = Options.Triggers;
    Options.Triggers = EmulatorCommon.cloneData(triggers, []);
    super.OnDataFilesRead(e);
    Options.Triggers = triggers;
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
        let duration =
          (triggerHelper.duration.fromTrigger || triggerHelper.duration[lowerTextKey]) * 1000;
        this.addDisplayText(div, this.emulatedOffset + duration);

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
      expires: this.emulatedOffset + (delay * 1000),
      promise: ret,
      resolver: resolver,
      rejecter: rejecter,
    });
    return ret;
  }

  _playAudioFile(url, volume) {
    if (![this.options.InfoSound, this.options.AlertSound, this.options.AlarmSound]
      .includes(url)) {
      let div = this._makeTextElement(url, 'audio-file');
      this.addDisplayText(div, this.emulatedOffset + 2000);
    }
    if (this.seeking)
      return;

    super._playAudioFile(url, volume);
  }
  ttsSay(ttsText) {
    if (this.seeking)
      return;

    let div = this._makeTextElement(ttsText, 'tts-text');
    this.addDisplayText(div, this.emulatedOffset + 2000);
    super.ttsSay(ttsText);
  }

  _makeTextElement(text, className) {
    let $ret = $('<div class="popup-text-container"></div>');
    $ret.addClass(className);
    let $text = $('<span class="popup-text"></span>');
    $text.text(text);
    let $rem = $('<span class="popup-text-remaining pl-1"></span>');
    $ret.append($text, $rem);
    return $ret;
  }

  addDisplayText($e, endTimestamp) {
    let remaining = (endTimestamp - this.emulatedOffset) / 1000;
    $e.find('.popup-text-remaining').text('(' + remaining.toFixed(1) + ')');
    this.$popupTextContainerWrapper.append($e);
    this.displayedText.push({
      element: $e,
      expires: endTimestamp,
    });
  }
}
