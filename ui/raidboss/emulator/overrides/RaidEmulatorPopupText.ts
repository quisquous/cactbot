import { RaidbossFileData } from '../../data/raidboss_manifest.txt';
import { UnreachableCode } from '../../../../resources/not_reached';
import { RaidbossOptions } from '../../raidboss_options';
import { TimelineLoader } from '../../timeline';
import StubbedPopupText from '../overrides/StubbedPopupText';
import RaidEmulator from '../data/RaidEmulator';
import { EventResponses, LogEvent } from '../../../../types/event';
import LineEvent from '../data/network_log_converter/LineEvent';
import { Text, TextText, TriggerHelper } from '../../popup-text';

type DisplayedText = {
  element: HTMLElement;
  expires: number;
};

type ScheduledFunc = () => void;

type ScheduledTrigger = {
  expires: number;
  promise: Promise<unknown>;
  resolver: ScheduledFunc;
  rejecter: ScheduledFunc;
};


export default class RaidEmulatorPopupText extends StubbedPopupText {
  $popupTextContainerWrapper: HTMLElement;
  emulatedOffset: number;
  emulator?: RaidEmulator;
  displayedText: DisplayedText[];
  scheduledTriggers: ScheduledTrigger[];
  seeking: boolean;
  $textElementTemplate: HTMLElement;
  audioDebugTextDuration: number;

  constructor(options: RaidbossOptions,
      timelineLoader: TimelineLoader,
      raidbossFileData: RaidbossFileData) {
    super(options, timelineLoader, raidbossFileData);
    const popupElem = document.querySelector('.popup-text-container-outer');
    if (!(popupElem instanceof HTMLElement))
      throw new UnreachableCode();

    this.$popupTextContainerWrapper = popupElem;
    this.emulatedOffset = 0;

    this.displayedText = [];
    this.scheduledTriggers = [];

    this.seeking = false;

    const templateElement = document.querySelector('template.textElement');
    if (!(templateElement instanceof HTMLTemplateElement))
      throw new UnreachableCode;

    const textElement = templateElement.content.firstElementChild;

    if (!(textElement instanceof HTMLElement))
      throw new UnreachableCode();

    this.$textElementTemplate = textElement;

    this.audioDebugTextDuration = 2000;

    const parentTtsSay = this.ttsSay;

    this.ttsSay = (ttsText: string): void => {
      if (this.seeking)
        return;

      const div = this._makeTextElement(undefined, ttsText, 'tts-text');
      this.addDisplayText(div, this.emulatedOffset + this.audioDebugTextDuration);
      parentTtsSay(ttsText);
    };
  }

  async doUpdate(currentLogTime: number): Promise<void> {
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
        const elem = t.element.querySelector('.popup-text-remaining');
        if (!elem)
          throw new UnreachableCode();
        elem.textContent = `(${(remaining / 1000).toFixed(1)})`;
        return true;
      }
      t.element.remove();
      return false;
    });
  }

  OnLog(_e: LogEvent): void {
    throw new UnreachableCode();
  }

  onEmulatorLog(logs: LineEvent[]): void {
    for (const l of logs) {
      const log = l.properCaseConvertedLine || l.convertedLine;
      const currentTime = l.timestamp;
      if (log.includes('00:0038:cactbot wipe'))
        this.SetInCombat(false);

      for (const trigger of this.triggers) {
        const r = trigger.localRegex?.exec(log);
        if (r)
          this.OnTrigger(trigger, r, currentTime);
      }
      for (const trigger of this.netTriggers) {
        const r = trigger.localNetRegex?.exec(l.networkLine);
        if (r)
          this.OnTrigger(trigger, r, currentTime);
      }
    }
  }

  OnNetLog(_e: EventResponses['LogLine']): void {
    throw new UnreachableCode();
  }

  bindTo(emulator: RaidEmulator): void {
    this.emulator = emulator;
    emulator.on('emitLogs', (event: { logs: LineEvent[] }) => {
      this.onEmulatorLog(event.logs);
    });
    emulator.on('tick', async (currentLogTime: number) => {
      await this.doUpdate(currentLogTime);
    });
    emulator.on('midSeek', async (line: LineEvent) => {
      await this.doUpdate(line.timestamp);
    });
    emulator.on('preSeek', () => {
      this.seeking = true;
      this._emulatorReset();
    });
    emulator.on('postSeek', () => {
      // This is a hacky fix for audio still playing during seek
      window.setTimeout(() => {
        this.seeking = false;
      }, 5);
    });
    emulator.on('currentEncounterChanged', () => {
      const currentEnc = emulator.currentEncounter;
      if (!currentEnc)
        return;

      const enc = currentEnc.encounter;
      if (!enc || !enc.encounterZoneName || enc.encounterZoneId === undefined)
        return;

      this._emulatorReset();
      this.OnChangeZone({
        type: 'ChangeZone',
        zoneName: enc.encounterZoneName,
        zoneID: parseInt(enc.encounterZoneId, 16),
      });
    });
  }

  _emulatorReset(): void {
    for (const i of this.scheduledTriggers)
      i.rejecter();

    this.scheduledTriggers = [];
    this.displayedText = this.displayedText.filter((t) => {
      t.element.remove();
      return false;
    });
    this.triggerSuppress = {};
  }

  _createTextFor(
      triggerHelper: TriggerHelper,
      text: string,
      textType: Text,
      _lowerTextKey: TextText,
      duration: number): void {
    const textElementClass = textType + '-text';
    const e = this._makeTextElement(triggerHelper, text, textElementClass);
    this.addDisplayText(e, this.emulatedOffset + (duration * 1000));
  }

  _onTriggerInternalDelaySeconds(triggerHelper: TriggerHelper): Promise<void> | undefined {
    const delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;

    if (!delay || delay <= 0 || typeof delay !== 'number')
      return;

    const ret = new Promise<void>((res, rej) => {
      this.scheduledTriggers.push({
        expires: this.emulatedOffset + (delay * 1000),
        promise: ret,
        resolver: res,
        rejecter: rej,
      });
    });
    return ret;
  }

  _playAudioFile(triggerHelper: TriggerHelper, url: string, volume?: number): void {
    if (![this.options.InfoSound, this.options.AlertSound, this.options.AlarmSound]
      .includes(url)) {
      const div = this._makeTextElement(triggerHelper, url, 'audio-file');
      this.addDisplayText(div, this.emulatedOffset + this.audioDebugTextDuration);
    }
    if (this.seeking)
      return;

    super._playAudioFile(triggerHelper, url, volume);
  }

  _makeTextElement(triggerHelper: TriggerHelper | undefined,
      text: string,
      className: string): HTMLElement {
    const $ret = this.$textElementTemplate.cloneNode(true);
    if (!($ret instanceof HTMLElement))
      throw new UnreachableCode();
    $ret.classList.add(className);
    const container = $ret.querySelector('.popup-text');
    if (!(container instanceof HTMLElement))
      throw new UnreachableCode();
    container.textContent = text;
    return $ret;
  }

  addDisplayText($e: HTMLElement, endTimestamp: number): void {
    const remaining = (endTimestamp - this.emulatedOffset) / 1000;
    const container = $e.querySelector('.popup-text-remaining');
    if (!(container instanceof HTMLElement))
      throw new UnreachableCode();
    container.textContent = `(${remaining.toFixed(1)})`;
    this.$popupTextContainerWrapper.append($e);
    this.displayedText.push({
      element: $e,
      expires: endTimestamp,
    });
  }
}
