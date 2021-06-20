import EmulatorCommon, { DataType } from '../EmulatorCommon';
import StubbedPopupText from '../overrides/StubbedPopupText';
import LineEvent from './network_log_converter/LineEvent';
import { LooseTrigger } from '../../../../types/trigger';
import { TriggerHelper, Text, TextText, ProcessedTrigger } from '../../popup-text';
import { EventResponses, LogEvent } from '../../../../types/event';
import { UnreachableCode } from '../../../../resources/not_reached';
import { Matches } from '../../../../types/net_matches';
import { RaidbossFileData } from '../../data/raidboss_manifest.txt';
import { RaidbossOptions } from '../../raidboss_options';
import { TimelineLoader } from '../../timeline';

type ResolverFunc = () => void;

export interface ResolverStatus {
  responseType?: string;
  responseLabel?: string;
  initialData: DataType;
  finalData?: DataType;
  condition?: boolean;
  response?: undefined;
  result?: string;
  delay?: number;
  suppressed: boolean;
  executed: boolean;
  promise?: Promise<void>;
}

type EmulatorTriggerHelper = TriggerHelper & {
  resolver?: Resolver;
};

export class Resolver {
  private promise?: Promise<void>;
  private run?: ResolverFunc;
  private delayUntil?: number;
  private final?: ResolverFunc;
  private delayPromise?: Promise<void>;
  private delayResolver?: ResolverFunc;
  public triggerHelper?: EmulatorTriggerHelper;

  constructor(public status: ResolverStatus) {}

  async isResolved(log: LineEvent): Promise<boolean> {
    if (this.delayUntil) {
      if (this.delayUntil < log.timestamp) {
        delete this.delayUntil;
        if (this.delayResolver)
          this.delayResolver();
        await this.delayPromise;
      } else {
        return false;
      }
    }
    if (this.promise)
      await this.promise;
    if (this.run)
      this.run();
    if (this.final)
      this.final();
    return true;
  }
  setDelay(delayUntil: number): Promise<void> {
    this.delayUntil = delayUntil;
    return this.delayPromise = new Promise((res) => {
      this.delayResolver = res;
    });
  }
  setPromise(promise: Promise<void>): void {
    this.promise = promise;
  }
  setRun(run: ResolverFunc): void {
    this.run = run;
  }
  setFinal(final: ResolverFunc): void {
    this.final = final;
  }
  setHelper(triggerHelper: EmulatorTriggerHelper): void {
    this.triggerHelper = triggerHelper;
  }
}

export default class PopupTextAnalysis extends StubbedPopupText {
  triggerResolvers: Resolver[] = [];
  currentResolver?: Resolver;
  public callback?: (log: LineEvent,
      triggerHelper: EmulatorTriggerHelper | undefined,
      currentTriggerStatus: ResolverStatus,
      finalData: DataType) => void;

  constructor(
      options: RaidbossOptions,
      timelineLoader: TimelineLoader,
      raidbossFileData: RaidbossFileData) {
    super(options, timelineLoader, raidbossFileData);
    this.ttsSay = (_text: string) => {
      return;
    };
  }

  // Override `OnTrigger` so we can use our own exception handler
  OnTrigger(trigger: LooseTrigger, matches: RegExpExecArray | null, currentTime: number): void {
    try {
      this.OnTriggerInternal(trigger, matches, currentTime);
    } catch (e) {
      console.log(trigger, e);
    }
  }

  OnLog(_e: LogEvent): void {
    throw new UnreachableCode();
  }

  async onEmulatorLog(logs: LineEvent[]): Promise<void> {
    for (const logObj of logs) {
      const log = logObj.properCaseConvertedLine ?? logObj.convertedLine;

      if (log.includes('00:0038:cactbot wipe'))
        this.SetInCombat(false);

      for (const trigger of this.triggers) {
        const r = trigger.localRegex?.exec(log);
        if (!r)
          continue;

        const resolver = this.currentResolver = new Resolver({
          initialData: EmulatorCommon.cloneData(this.data),
          suppressed: false,
          executed: false,
        });
        this.triggerResolvers.push(resolver);

        this.OnTrigger(trigger, r, logObj.timestamp);

        resolver.setFinal(() => {
          resolver.status.finalData = EmulatorCommon.cloneData(this.data);
          delete resolver.triggerHelper?.resolver;
          if (this.callback)
            this.callback(logObj, resolver.triggerHelper, resolver.status, this.data);
        });
      }

      await this.checkResolved(logObj);

      for (const trigger of this.netTriggers) {
        const r = trigger.localNetRegex?.exec(logObj.networkLine);
        if (r) {
          const resolver = this.currentResolver = new Resolver({
            initialData: EmulatorCommon.cloneData(this.data),
            suppressed: false,
            executed: false,
          });
          this.triggerResolvers.push(resolver);

          const matches = r.groups ?? {};

          this._onTriggerInternalGetHelper(trigger, matches, logObj.timestamp);
          this.OnTrigger(trigger, r, logObj.timestamp);

          resolver.setFinal(() => {
            resolver.status.finalData = EmulatorCommon.cloneData(this.data);
            delete resolver.triggerHelper?.resolver;
            if (this.callback)
              this.callback(logObj, resolver.triggerHelper, resolver.status, this.data);
          });
        }
      }

      await this.checkResolved(logObj);
    }
  }

  OnNetLog(_e: EventResponses['LogLine']): void {
    throw new UnreachableCode();
  }

  async checkResolved(logObj: LineEvent): Promise<void> {
    await Promise.all(
        this.triggerResolvers.map(async (resolver) => await resolver.isResolved(logObj)))
      .then((results) => {
        this.triggerResolvers = this.triggerResolvers.filter((_, index) => !results[index]);
      });
  }

  _onTriggerInternalCondition(triggerHelper: EmulatorTriggerHelper): boolean {
    const ret = super._onTriggerInternalCondition(triggerHelper);
    if (triggerHelper.resolver)
      triggerHelper.resolver.status.condition = ret;
    return ret;
  }

  _onTriggerInternalDelaySeconds(triggerHelper: EmulatorTriggerHelper): Promise<void> | undefined {
    // Can't inherit the default logic for delay since we don't
    // want to delay for mass processing of the timeline
    const delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;
    if (typeof delay === 'number') {
      if (triggerHelper.resolver)
        triggerHelper.resolver.status.delay = delay;
      if (!delay || delay <= 0)
        return;
      return triggerHelper.resolver?.setDelay(triggerHelper.now + (delay * 1000));
    }
  }

  _onTriggerInternalPromise(triggerHelper: EmulatorTriggerHelper): Promise<void> | undefined {
    const ret = super._onTriggerInternalPromise(triggerHelper);
    if (triggerHelper.resolver)
      triggerHelper.resolver.status.promise = ret;
    if (!ret)
      return ret;
    if (triggerHelper.resolver)
      triggerHelper.resolver.setPromise(ret);
    return;
  }

  _onTriggerInternalTTS(triggerHelper: EmulatorTriggerHelper): void {
    super._onTriggerInternalTTS(triggerHelper);
    if (triggerHelper.ttsText !== undefined &&
      triggerHelper.resolver &&
      triggerHelper.resolver.status.responseType === undefined) {
      triggerHelper.resolver.status.responseType = 'tts';
      triggerHelper.resolver.status.responseLabel = triggerHelper.ttsText;
    }
  }

  _onTriggerInternalRun(triggerHelper: EmulatorTriggerHelper): void {
    triggerHelper.resolver?.setRun(() => {
      if (triggerHelper.resolver)
        triggerHelper.resolver.status.executed = true;
      super._onTriggerInternalRun(triggerHelper);
    });
  }

  _makeTextElement(triggerHelper: EmulatorTriggerHelper,
      text: string,
      _className: string): HTMLElement {
    if (triggerHelper.resolver)
      triggerHelper.resolver.status.result ??= text;
    return document.createElement('div');
  }

  _createTextFor(triggerHelper: EmulatorTriggerHelper,
      text: string,
      textType: Text,
      _lowerTextKey: TextText,
      _duration: number): void {
    // No-op for functionality, but store off this info for feedback
    if (triggerHelper.resolver) {
      triggerHelper.resolver.status.responseType = textType;
      triggerHelper.resolver.status.responseLabel = text;
    }
  }

  _playAudioFile(triggerHelper: EmulatorTriggerHelper,
      url: string,
      _volume: number): void {
    // No-op for functionality, but store off this info for feedback

    if (triggerHelper.resolver) {
      // If we already have text and this is a default alert sound, don't override that info
      if (triggerHelper.resolver.status.responseType) {
        if (triggerHelper.resolver.status.responseType === 'info' &&
            url === this.options.InfoSound)
          return;
        if (triggerHelper.resolver.status.responseType === 'alert' &&
            url === this.options.AlertSound)
          return;
        if (triggerHelper.resolver.status.responseType === 'alarm' &&
            url === this.options.AlarmSound)
          return;
      }
      triggerHelper.resolver.status.responseType = 'audiofile';
      triggerHelper.resolver.status.responseLabel = url;
    }
  }

  _onTriggerInternalGetHelper(
      trigger: ProcessedTrigger,
      matches: Matches,
      now: number): EmulatorTriggerHelper {
    const ret: EmulatorTriggerHelper = {
      ...super._onTriggerInternalGetHelper(trigger, matches, now),
    };
    ret.resolver = this.currentResolver;
    ret.resolver?.setHelper(ret);
    return ret;
  }
}
