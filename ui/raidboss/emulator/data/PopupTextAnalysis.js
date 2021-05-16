import EmulatorCommon from '../EmulatorCommon';
import StubbedPopupText from '../overrides/StubbedPopupText';

class Resolver {
  constructor() {
    this.promise = null;
    this.run = null;
    this.delayUntil = null;
    this.final = null;
  }
  async isResolved(log) {
    if (this.delayUntil) {
      if (this.delayUntil < log.timestamp) {
        this.delayUntil = null;
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
  setDelay(delayUntil) {
    this.delayUntil = delayUntil;
    return this.delayPromise = new Promise((res) => {
      this.delayResolver = res;
    });
  }
  setPromise(promise) {
    this.promise = promise;
  }
  setRun(run) {
    this.run = run;
  }
  setFinal(final) {
    this.final = final;
  }
  setHelper(triggerHelper) {
    this.triggerHelper = triggerHelper;
  }
}

export default class PopupTextAnalysis extends StubbedPopupText {
  constructor(options, timelineLoader, raidbossFileData) {
    super(options, timelineLoader, raidbossFileData);
    this.triggerResolvers = [];
  }

  // Override `OnTrigger` so we can use our own exception handler
  OnTrigger(trigger, matches, currentTime) {
    try {
      this.OnTriggerInternal(trigger, matches, currentTime);
    } catch (e) {
      console.log(trigger, e);
    }
  }

  async OnLog(e) {
    for (const logObj of e.detail.logs) {
      const log = logObj.properCaseConvertedLine || logObj.convertedLine;

      if (log.includes('00:0038:cactbot wipe'))
        this.SetInCombat(false);

      for (const trigger of this.triggers) {
        const r = log.match(trigger.localRegex);
        if (r) {
          const resolver = this.currentResolver = new Resolver();
          resolver.status = {
            initialData: EmulatorCommon.cloneData(this.data),
            condition: undefined,
            response: false,
            result: false,
            delay: false,
            suppressed: false,
            executed: false,
            promise: undefined,
          };
          this.triggerResolvers.push(resolver);

          this.OnTrigger(trigger, r, logObj.timestamp);

          resolver.setFinal(() => {
            resolver.status.finalData = EmulatorCommon.cloneData(this.data);
            delete resolver.triggerHelper.resolver;
            this.callback(logObj, resolver.triggerHelper, resolver.status, this.data);
          });
        }
      }

      await this.checkResolved(logObj);
    }
  }

  async OnNetLog(e) {
    for (const logObj of e.detail.logs) {
      const log = logObj.networkLine;

      for (const trigger of this.netTriggers) {
        const r = log.match(trigger.localNetRegex);
        if (r) {
          const resolver = this.currentResolver = new Resolver();
          resolver.status = {
            initialData: EmulatorCommon.cloneData(this.data),
            condition: undefined,
            response: false,
            result: false,
            delay: false,
            suppressed: false,
            executed: false,
            promise: undefined,
          };
          this.triggerResolvers.push(resolver);

          this._onTriggerInternalGetHelper(trigger, r, logObj.timestamp);
          this.OnTrigger(trigger, r, logObj.timestamp);

          resolver.setFinal(() => {
            resolver.status.finalData = EmulatorCommon.cloneData(this.data);
            delete resolver.triggerHelper.resolver;
            this.callback(logObj, resolver.triggerHelper, resolver.status, this.data);
          });
        }
      }

      await this.checkResolved(logObj);
    }
  }

  async checkResolved(logObj) {
    await Promise.all(
        this.triggerResolvers.map(async (resolver) => await resolver.isResolved(logObj)))
      .then((results) => {
        this.triggerResolvers = this.triggerResolvers.filter((_, index) => !results[index]);
      });
  }

  _onTriggerInternalCondition(triggerHelper) {
    const ret = super._onTriggerInternalCondition(triggerHelper);
    triggerHelper.resolver.status.condition = ret;
    return ret;
  }

  _onTriggerInternalDelaySeconds(triggerHelper) {
    // Can't inherit the default logic for delay since we don't
    // want to delay for mass processing of the timeline
    const delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;
    triggerHelper.resolver.status.delay = delay;
    if (!delay || delay <= 0)
      return null;
    return triggerHelper.resolver.setDelay(triggerHelper.now + (delay * 1000));
  }

  _onTriggerInternalPromise(triggerHelper) {
    const ret = super._onTriggerInternalPromise(triggerHelper);
    triggerHelper.resolver.status.promise = ret;
    if (!ret)
      return ret;
    return triggerHelper.resolver.setPromise(ret);
  }

  _onTriggerInternalTTS(triggerHelper) {
    super._onTriggerInternalTTS(triggerHelper);
    if (triggerHelper.ttsText !== undefined &&
      triggerHelper.resolver.status.responseType === undefined) {
      triggerHelper.resolver.status.responseType = 'tts';
      triggerHelper.resolver.status.responseLabel = triggerHelper.ttsText;
    }
  }

  _onTriggerInternalRun(triggerHelper) {
    triggerHelper.resolver.setRun(() => {
      triggerHelper.resolver.status.executed = true;
      super._onTriggerInternalRun(triggerHelper);
    });
  }

  _makeTextElement(triggerHelper, text, className) {
    triggerHelper.resolver.status.result = triggerHelper.resolver.status.result || text;
    return null;
  }

  _createTextFor(triggerHelper, text, textType, lowerTextKey, duration) {
    // No-op for functionality, but store off this info for feedback
    triggerHelper.resolver.status.responseType = textType;
    triggerHelper.resolver.status.responseLabel = text;
  }

  _playAudioFile(triggerHelper, url, volume) {
    // No-op for functionality, but store off this info for feedback

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

  _scheduleRemoveText(container, e, delay) {
    // No-op
  }

  _onTriggerInternalGetHelper(trigger, matches, now) {
    const ret = super._onTriggerInternalGetHelper(trigger, matches, now);
    ret.resolver = this.currentResolver;
    ret.resolver.setHelper(ret);
    return ret;
  }
}
