import { UnreachableCode } from '../../../../resources/not_reached';
import { EventResponses, LogEvent } from '../../../../types/event';
import { Matches } from '../../../../types/net_matches';
import { LooseTrigger, RaidbossFileData } from '../../../../types/trigger';
import { TriggerHelper, Text, TextText, ProcessedTrigger } from '../../popup-text';
import { RaidbossOptions } from '../../raidboss_options';
import { TimelineLoader } from '../../timeline';
import EmulatorCommon, { DataType } from '../EmulatorCommon';
import StubbedPopupText from '../overrides/StubbedPopupText';

import LineEvent from './network_log_converter/LineEvent';

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
  private promiseResolved = false;
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
    if (this.promise && !this.promiseResolved)
      return false;
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
    void this.promise.then(() => {
      this.promiseResolved = true;
    });
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

export type LineRegExpCache = Map<LineEvent, Map<ProcessedTrigger, RegExpExecArray | false>>;

export default class PopupTextAnalysis extends StubbedPopupText {
  triggerResolvers: Resolver[] = [];
  currentResolver?: Resolver;

  regexCache: LineRegExpCache;

  public callback?: (log: LineEvent,
    triggerHelper: EmulatorTriggerHelper | undefined,
    currentTriggerStatus: ResolverStatus,
    finalData: DataType) => void;

  constructor(
    options: RaidbossOptions,
    timelineLoader: TimelineLoader,
    raidbossFileData: RaidbossFileData) {
    super(options, timelineLoader, raidbossFileData);
    this.regexCache = new Map;
    this.ttsSay = (_text: string) => {
      return;
    };
  }

  // Override `OnTrigger` so we can use our own exception handler
  override OnTrigger(
    trigger: LooseTrigger,
    matches: RegExpExecArray | null,
    currentTime: number,
  ): void {
    try {
      this.OnTriggerInternal(trigger, matches, currentTime);
    } catch (e) {
      console.log(trigger, e);
    }
  }

  override OnLog(_e: LogEvent): void {
    throw new UnreachableCode();
  }

  async onEmulatorLog(logs: LineEvent[], getCurrentLogLine: () => LineEvent): Promise<void> {
    for (const logObj of logs) {
      if (!this.regexCache.has(logObj))
        this.regexCache.set(logObj, new Map);
      const lineCache = this.regexCache.get(logObj);
      if (!lineCache)
        continue;

      // Deliberately exclude the check for `cactbot wipe` since that'll never happen here

      for (const trigger of this.triggers) {
        const regex = trigger.localRegex;
        if (!regex)
          continue;

        let r = lineCache.get(trigger);
        if (r === undefined) {
          r = regex.exec(logObj.convertedLine) ?? false;
          lineCache.set(trigger, r);
        }
        if (!r)
          continue;

        const resolver = this.currentResolver = new Resolver({
          initialData: EmulatorCommon.cloneData(this.data),
          suppressed: false,
          executed: false,
        });

        this.OnTrigger(trigger, r, logObj.timestamp);

        resolver.setFinal(() => {
          const currentLine = getCurrentLogLine();
          resolver.status.finalData = EmulatorCommon.cloneData(this.data);
          delete resolver.triggerHelper?.resolver;
          if (this.callback)
            this.callback(currentLine, resolver.triggerHelper, resolver.status, this.data);
        });

        const isResolved = await resolver.isResolved(logObj);

        if (!isResolved)
          this.triggerResolvers.push(resolver);
      }

      for (const trigger of this.netTriggers) {
        const regex = trigger.localRegex;
        if (!regex)
          continue;

        let r = lineCache.get(trigger);
        if (r === undefined) {
          r = regex.exec(logObj.networkLine) ?? false;
          lineCache.set(trigger, r);
        }
        if (r) {
          const resolver = this.currentResolver = new Resolver({
            initialData: EmulatorCommon.cloneData(this.data),
            suppressed: false,
            executed: false,
          });

          const matches = r.groups ?? {};

          this._onTriggerInternalGetHelper(trigger, matches, logObj.timestamp);
          this.OnTrigger(trigger, r, logObj.timestamp);

          resolver.setFinal(() => {
            const currentLine = getCurrentLogLine();
            resolver.status.finalData = EmulatorCommon.cloneData(this.data);
            delete resolver.triggerHelper?.resolver;
            if (this.callback)
              this.callback(currentLine, resolver.triggerHelper, resolver.status, this.data);
          });

          const isResolved = await resolver.isResolved(logObj);

          if (!isResolved)
            this.triggerResolvers.push(resolver);
        }
      }

      await this.checkResolved(logObj);
    }
  }

  override OnNetLog(_e: EventResponses['LogLine']): void {
    throw new UnreachableCode();
  }

  async checkResolved(logObj: LineEvent): Promise<void> {
    await Promise.all(
      this.triggerResolvers.map(async (resolver) => await resolver.isResolved(logObj)))
      .then((results) => {
        this.triggerResolvers = this.triggerResolvers.filter((_, index) => !results[index]);
      });
  }

  override _onTriggerInternalCondition(triggerHelper: EmulatorTriggerHelper): boolean {
    const ret = super._onTriggerInternalCondition(triggerHelper);
    if (triggerHelper.resolver)
      triggerHelper.resolver.status.condition = ret;
    return ret;
  }

  override _onTriggerInternalDelaySeconds(
    triggerHelper: EmulatorTriggerHelper,
  ): Promise<void> | undefined {
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

  override _onTriggerInternalPromise(
    triggerHelper: EmulatorTriggerHelper,
  ): Promise<void> | undefined {
    const ret = super._onTriggerInternalPromise(triggerHelper);
    if (triggerHelper.resolver)
      triggerHelper.resolver.status.promise = ret;
    if (!ret)
      return ret;
    if (triggerHelper.resolver)
      triggerHelper.resolver.setPromise(ret);
    return ret;
  }

  override _onTriggerInternalTTS(triggerHelper: EmulatorTriggerHelper): void {
    super._onTriggerInternalTTS(triggerHelper);
    if (triggerHelper.ttsText !== undefined &&
      triggerHelper.resolver &&
      triggerHelper.resolver.status.responseType === undefined) {
      triggerHelper.resolver.status.responseType = 'tts';
      triggerHelper.resolver.status.responseLabel = triggerHelper.ttsText;
    }
  }

  override _onTriggerInternalRun(triggerHelper: EmulatorTriggerHelper): void {
    triggerHelper.resolver?.setRun(() => {
      if (triggerHelper.resolver)
        triggerHelper.resolver.status.executed = true;
      super._onTriggerInternalRun(triggerHelper);
    });
  }

  override _makeTextElement(triggerHelper: EmulatorTriggerHelper,
    text: string,
    _className: string): HTMLElement {
    if (triggerHelper.resolver)
      triggerHelper.resolver.status.result ??= text;
    return document.createElement('div');
  }

  override _createTextFor(triggerHelper: EmulatorTriggerHelper,
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

  override _playAudioFile(triggerHelper: EmulatorTriggerHelper,
    url: string,
    _volume: number): void {
    // No-op for functionality, but store off this info for feedback

    if (triggerHelper.resolver) {
      // If we already have text and this is a default alert sound, don't override that info
      if (triggerHelper.resolver.status.responseType) {
        if (
          ['info', 'alert', 'alarm'].includes(triggerHelper.resolver.status.responseType) &&
          [this.options.InfoSound, this.options.AlertSound, this.options.AlarmSound].includes(url))
          return;
      }
      triggerHelper.resolver.status.responseType = 'audiofile';
      triggerHelper.resolver.status.responseLabel = url;
    }
  }

  override _onTriggerInternalGetHelper(
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
