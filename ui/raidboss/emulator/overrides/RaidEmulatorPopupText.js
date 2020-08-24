'use strict';

class RaidEmulatorPopupText extends StubbedPopupText {
  constructor(options) {
    super(options);
    this.$popupTextContainerWrapper = document.querySelector('.popup-text-container-outer');
    this.emulatedOffset = 0;

    this.emulator = null;

    this.displayedText = [];
    this.scheduledTriggers = [];

    this.seeking = false;

    this.$textElementTemplate = document.querySelector('template.textElement').content.firstElementChild;

    this.audioDebugTextDuration = 2000;
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
        t.element.querySelector('.popup-text-remaining').textContent = '(' + (remaining / 1000).toFixed(1) + ')';
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
          logs: event.logs.map((a) => a.properCaseConvertedLine || a.convertedLine),
        },
      });
      event.logs.forEach((l) => {
        this.OnNetLog({
          rawLine: l.networkLine,
        });
      });
    });
    emulator.on('tick', async (timestampOffset) => {
      await this.doUpdate(timestampOffset);
    });
    emulator.on('midSeek', async (line) => {
      await this.doUpdate(line.offset);
    });
    emulator.on('preSeek', (time) => {
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
      this.OnChangeZone({
        zoneName: emulator.currentEncounter.encounter.encounterZoneName,
        zoneID: parseInt(emulator.currentEncounter.encounter.encounterZoneId, 16),
      });
    });
  }

  _createTextFor(text, textType, lowerTextKey, duration) {
    let textElementClass = textType + '-text';
    let e = this._makeTextElement(text, textElementClass);
    this.addDisplayText(e, this.emulatedOffset + (duration * 1000));
  }

  _onTriggerInternalDelaySeconds(triggerHelper) {
    let delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;

    if (!delay || delay <= 0)
      return null;

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
      this.addDisplayText(div, this.emulatedOffset + this.audioDebugTextDuration);
    }
    if (this.seeking)
      return;

    super._playAudioFile(url, volume);
  }
  ttsSay(ttsText) {
    if (this.seeking)
      return;

    let div = this._makeTextElement(ttsText, 'tts-text');
    this.addDisplayText(div, this.emulatedOffset + this.audioDebugTextDuration);
    super.ttsSay(ttsText);
  }

  _makeTextElement(text, className) {
    let $ret = this.$textElementTemplate.cloneNode(true);
    $ret.classList.add(className);
    $ret.querySelector('.popup-text').textContent = text;
    return $ret;
  }

  addDisplayText($e, endTimestamp) {
    let remaining = (endTimestamp - this.emulatedOffset) / 1000;
    $e.querySelector('.popup-text-remaining').textContent = '(' + remaining.toFixed(1) + ')';
    this.$popupTextContainerWrapper.append($e);
    this.displayedText.push({
      element: $e,
      expires: endTimestamp,
    });
  }
}
