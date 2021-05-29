import StubbedPopupText from '../overrides/StubbedPopupText';

export default class RaidEmulatorPopupText extends StubbedPopupText {
  constructor(options, timelineLoader, raidbossFileData) {
    super(options, timelineLoader, raidbossFileData);
    this.$popupTextContainerWrapper = document.querySelector('.popup-text-container-outer');
    this.emulatedOffset = 0;

    this.emulator = null;

    this.displayedText = [];
    this.scheduledTriggers = [];

    this.seeking = false;

    this.$textElementTemplate = document.querySelector('template.textElement').content.firstElementChild;

    this.audioDebugTextDuration = 2000;
  }

  async doUpdate(currentLogTime) {
    this.emulatedOffset = currentLogTime;
    for (const t of this.scheduledTriggers) {
      const remaining = t.expires - currentLogTime;
      if (remaining <= 0) {
        t.resolver();
        await t.promise;
      }
    }
    this.scheduledTriggers = this.scheduledTriggers.filter((t) => {
      return t.expires - currentLogTime > 0;
    });
    this.displayedText = this.displayedText.filter((t) => {
      const remaining = t.expires - currentLogTime;
      if (remaining > 0) {
        t.element.querySelector('.popup-text-remaining').textContent = '(' + (remaining / 1000).toFixed(1) + ')';
        return true;
      }
      t.element.remove();
      return false;
    });
  }

  OnLog(logs) {
    for (const l of logs) {
      const log = l.properCaseConvertedLine || l.convertedLine;
      const currentTime = l.timestamp;
      if (log.includes('00:0038:cactbot wipe'))
        this.SetInCombat(false);

      for (const trigger of this.triggers) {
        const r = log.match(trigger.localRegex);
        if (r)
          this.OnTrigger(trigger, r, currentTime);
      }
    }
  }

  OnNetLog(logs) {
    for (const l of logs) {
      const log = l.networkLine;
      const currentTime = l.timestamp;
      for (const trigger of this.netTriggers) {
        const r = log.match(trigger.localNetRegex);
        if (r)
          this.OnTrigger(trigger, r, currentTime);
      }
    }
  }

  bindTo(emulator) {
    this.emulator = emulator;
    emulator.on('emitLogs', (event) => {
      this.OnLog(event.logs);
      this.OnNetLog(event.logs);
    });
    emulator.on('tick', async (currentLogTime) => {
      await this.doUpdate(currentLogTime);
    });
    emulator.on('midSeek', async (line) => {
      await this.doUpdate(line.timestamp);
    });
    emulator.on('preSeek', (time) => {
      this.seeking = true;
      this._emulatorReset();
    });
    emulator.on('postSeek', async (time) => {
      // This is a hacky fix for audio still playing during seek
      window.setTimeout(() => {
        this.seeking = false;
      }, 5);
    });
    emulator.on('currentEncounterChanged', () => {
      this._emulatorReset();
      this.OnChangeZone({
        zoneName: emulator.currentEncounter.encounter.encounterZoneName,
        zoneID: parseInt(emulator.currentEncounter.encounter.encounterZoneId, 16),
      });
    });
  }

  _emulatorReset() {
    for (const i of this.scheduledTriggers)
      i.rejecter();

    this.scheduledTriggers = [];
    this.displayedText = this.displayedText.filter((t) => {
      t.element.remove();
      return false;
    });
    this.triggerSuppress = [];
  }

  _createTextFor(triggerHelper, text, textType, lowerTextKey, duration) {
    const textElementClass = textType + '-text';
    const e = this._makeTextElement(triggerHelper, text, textElementClass);
    this.addDisplayText(e, this.emulatedOffset + (duration * 1000));
  }

  _onTriggerInternalDelaySeconds(triggerHelper) {
    const delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;

    if (!delay || delay <= 0)
      return null;

    let resolver;
    let rejecter;
    const ret = new Promise((res, rej) => {
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

  _playAudioFile(triggerHelper, url, volume) {
    if (![this.options.InfoSound, this.options.AlertSound, this.options.AlarmSound]
      .includes(url)) {
      const div = this._makeTextElement(triggerHelper, url, 'audio-file');
      this.addDisplayText(div, this.emulatedOffset + this.audioDebugTextDuration);
    }
    if (this.seeking)
      return;

    super._playAudioFile(triggerHelper, url, volume);
  }
  ttsSay(ttsText) {
    if (this.seeking)
      return;

    const div = this._makeTextElement(triggerHelper, ttsText, 'tts-text');
    this.addDisplayText(div, this.emulatedOffset + this.audioDebugTextDuration);
    super.ttsSay(ttsText);
  }

  _makeTextElement(triggerHelper, text, className) {
    const $ret = this.$textElementTemplate.cloneNode(true);
    $ret.classList.add(className);
    $ret.querySelector('.popup-text').textContent = text;
    return $ret;
  }

  addDisplayText($e, endTimestamp) {
    const remaining = (endTimestamp - this.emulatedOffset) / 1000;
    $e.querySelector('.popup-text-remaining').textContent = '(' + remaining.toFixed(1) + ')';
    this.$popupTextContainerWrapper.append($e);
    this.displayedText.push({
      element: $e,
      expires: endTimestamp,
    });
  }
}
