import EmulatorCommon from '../EmulatorCommon';
import StubbedPopupText from '../overrides/StubbedPopupText';

export default class PopupTextAnalysis extends StubbedPopupText {
  OnTriggerInternal(trigger, matches, currentTime) {
    this.currentTriggerStatus = {
      initialData: EmulatorCommon.cloneData(this.data),
      condition: undefined,
      response: false,
      result: false,
      delay: false,
      suppressed: false,
      executed: false,
      promise: undefined,
    };
    this.currentFunction = 'initial';
    super.OnTriggerInternal(trigger, matches, currentTime);
  }

  async OnLog(e) {
    for (const logObj of e.detail.logs) {
      const log = logObj.properCaseConvertedLine || logObj.convertedLine;

      if (log.includes('00:0038:cactbot wipe'))
        this.SetInCombat(false);

      for (const trigger of this.triggers) {
        const r = log.match(trigger.localRegex);
        if (r) {
          // Some async magic here, force waiting for the entirety of
          // the trigger execution before continuing
          const delayPromise = new Promise((res) => {
            this.delayResolver = res;
          });
          const promisePromise = new Promise((res) => {
            this.promiseResolver = res;
          });
          const runPromise = new Promise((res) => {
            this.runResolver = res;
          });

          this.OnTrigger(trigger, r);

          await delayPromise;
          await promisePromise;
          const triggerHelper = await runPromise;

          this.currentTriggerStatus.finalData = EmulatorCommon.cloneData(this.data);

          this.callback(logObj, triggerHelper, this.currentTriggerStatus);
        }
      }
    }
  }

  async OnNetLog(e) {
    for (const logObj of e.detail.logs) {
      const log = logObj.networkLine;

      for (const trigger of this.netTriggers) {
        const r = log.match(trigger.localNetRegex);
        if (r) {
          // Some async magic here, force waiting for the entirety of
          // the trigger execution before continuing
          const delayPromise = new Promise((res) => {
            this.delayResolver = res;
          });
          const promisePromise = new Promise((res) => {
            this.promiseResolver = res;
          });
          const runPromise = new Promise((res) => {
            this.runResolver = res;
          });

          this.OnTrigger(trigger, r);

          await delayPromise;
          await promisePromise;
          const triggerHelper = await runPromise;

          this.currentTriggerStatus.finalData = EmulatorCommon.cloneData(this.data);

          this.callback(logObj, triggerHelper, this.currentTriggerStatus, this.data);
        }
      }
    }
  }

  _onTriggerInternalCheckSuppressed(trigger, when) {
    this.currentFunction = '_onTriggerInternalCheckSuppressed';
    const ret = super._onTriggerInternalCheckSuppressed(trigger, when);
    this.currentTriggerStatus.suppressed = ret;
    if (ret) {
      this.delayResolver();
      this.promiseResolver();
      this.runResolver({ trigger: trigger });
    }
    return ret;
  }

  _onTriggerInternalCondition(triggerHelper) {
    this.currentFunction = '_onTriggerInternalCondition';
    const ret = super._onTriggerInternalCondition(triggerHelper);
    this.currentTriggerStatus.condition = ret;
    if (!ret) {
      this.delayResolver();
      this.promiseResolver();
      this.runResolver(triggerHelper);
    }
    return ret;
  }

  // This is pointless right now since _onTriggerInternalHelperDefaults won't ever
  // modify the data state, but adding it for consistency
  _onTriggerInternalHelperDefaults(triggerHelper) {
    this.currentFunction = '_onTriggerInternalHelperDefaults';
    super._onTriggerInternalHelperDefaults(triggerHelper);
  }

  _onTriggerInternalPreRun(triggerHelper) {
    this.currentFunction = '_onTriggerInternalPreRun';
    super._onTriggerInternalPreRun(triggerHelper);
  }

  _onTriggerInternalDelaySeconds(triggerHelper) {
    this.currentFunction = '_onTriggerInternalDelaySeconds';
    // Can't inherit the default logic for delay since we don't
    // want to delay for mass processing of the timeline
    const delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;
    this.currentTriggerStatus.delay = delay;
    return new Promise((res) => {
      this.delayResolver();
      res();
    });
  }

  _onTriggerInternalDurationSeconds(triggerHelper) {
    this.currentFunction = '_onTriggerInternalDurationSeconds';
    super._onTriggerInternalDurationSeconds(triggerHelper);
  }

  _onTriggerInternalSuppressSeconds(triggerHelper) {
    this.currentFunction = '_onTriggerInternalSuppressSeconds';
    super._onTriggerInternalSuppressSeconds(triggerHelper);
  }

  _onTriggerInternalPromise(triggerHelper) {
    this.currentFunction = '_onTriggerInternalPromise';
    const ret = super._onTriggerInternalPromise(triggerHelper);
    this.currentTriggerStatus.promise = ret;
    return (async () => {
      await ret;
      this.promiseResolver();
    })();
  }

  _onTriggerInternalSound(triggerHelper) {
    this.currentFunction = '_onTriggerInternalSound';
    super._onTriggerInternalSound(triggerHelper);
  }

  _onTriggerInternalSoundVolume(triggerHelper) {
    this.currentFunction = '_onTriggerInternalSoundVolume';
    super._onTriggerInternalSoundVolume(triggerHelper);
  }

  _onTriggerInternalResponse(triggerHelper) {
    this.currentFunction = '_onTriggerInternalResponse';
    super._onTriggerInternalResponse(triggerHelper);
  }

  _onTriggerInternalAlarmText(triggerHelper) {
    this.currentFunction = '_onTriggerInternalAlarmText';
    super._onTriggerInternalAlarmText(triggerHelper);
  }

  _onTriggerInternalAlertText(triggerHelper) {
    this.currentFunction = '_onTriggerInternalAlertText';
    super._onTriggerInternalAlertText(triggerHelper);
  }

  _onTriggerInternalInfoText(triggerHelper) {
    this.currentFunction = '_onTriggerInternalInfoText';
    super._onTriggerInternalInfoText(triggerHelper);
  }

  _onTriggerInternalTTS(triggerHelper) {
    this.currentFunction = '_onTriggerInternalTTS';
    super._onTriggerInternalTTS(triggerHelper);
    if (triggerHelper.ttsText !== undefined &&
      this.currentTriggerStatus.responseType === undefined) {
      this.currentTriggerStatus.responseType = 'tts';
      this.currentTriggerStatus.responseLabel = triggerHelper.ttsText;
    }
  }

  _onTriggerInternalPlayAudio(triggerHelper) {
    this.currentFunction = '_onTriggerInternalPlayAudio';
    super._onTriggerInternalPlayAudio(triggerHelper);
  }

  _onTriggerInternalRun(triggerHelper) {
    this.currentFunction = '_onTriggerInternalRun';
    this.currentTriggerStatus.executed = true;
    super._onTriggerInternalRun(triggerHelper);
    this.runResolver(triggerHelper);
  }

  _makeTextElement(text, className) {
    this.currentTriggerStatus.result = this.currentTriggerStatus.result || text;
    return null;
  }

  _createTextFor(text, textType, lowerTextKey, duration) {
    // No-op for functionality, but store off this info for feedback
    this.currentTriggerStatus.responseType = textType;
    this.currentTriggerStatus.responseLabel = text;
  }

  _playAudioFile(url, volume) {
    // No-op for functionality, but store off this info for feedback

    // If we already have text and this is a default alert sound, don't override that info
    if (this.currentTriggerStatus.responseType) {
      if (this.currentTriggerStatus.responseType === 'info' &&
          url === this.options.InfoSound)
        return;
      if (this.currentTriggerStatus.responseType === 'alert' &&
          url === this.options.AlertSound)
        return;
      if (this.currentTriggerStatus.responseType === 'alarm' &&
          url === this.options.AlarmSound)
        return;
    }
    this.currentTriggerStatus.responseType = 'audiofile';
    this.currentTriggerStatus.responseLabel = url;
  }

  _scheduleRemoveText(container, e, delay) {
    // No-op
  }
}
