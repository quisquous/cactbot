'use strict';

class PopupTextAnalysis extends StubbedPopupText {
  OnTriggerInternal(trigger, matches) {
    this.currentTriggerStatus = {
      dataStates: {
        'initial': [EmulatorCommon.cloneData(this.data)],
      },
      condition: undefined,
      response: false,
      result: false,
      delay: false,
      suppressed: false,
      executed: false,
      promise: undefined,
    };
    this.currentFunction = 'initial';
    super.OnTriggerInternal(trigger, matches);
  }

  async OnLog(e) {
    for (let logObj of e.detail.logs) {
      let log = logObj.line;

      if (log.indexOf('00:0038:cactbot wipe') >= 0)
        this.SetInCombat(false);

      for (let trigger of this.triggers) {
        let r = log.match(trigger.localRegex);
        if (r != null) {
          // Some async magic here, force waiting for the entirety of
          // the trigger execution before continuing
          let delayPromise = new Promise((res) => {
            this.delayResolver = res;
          });
          let promisePromise = new Promise((res) => {
            this.promiseResolver = res;
          });
          let runPromise = new Promise((res) => {
            this.runResolver = res;
          });

          this.OnTrigger(trigger, r);

          await delayPromise;
          await promisePromise;
          let triggerHelper = await runPromise;

          this.callback(logObj, triggerHelper, this.currentTriggerStatus, this.data);
        }
      }
    }
  }

  _onTriggerInternalGetHelper(trigger, matches, now) {
    this.currentFunction = '_onTriggerInternalGetHelper';
    // Intercept triggerHelper to capture data state changes
    let triggerHelper = super._onTriggerInternalGetHelper(trigger, matches, now);
    let originalValueOrFunction = triggerHelper.valueOrFunction;
    triggerHelper.valueOrFunction = (f) => {
      let oldData = JSON.stringify(EmulatorCommon.cloneData(this.data));
      let ret = originalValueOrFunction(f);
      let newData = EmulatorCommon.cloneData(this.data);
      if (oldData !== JSON.stringify(newData)) {
        this.currentTriggerStatus.dataStates[this.currentFunction] =
          this.currentTriggerStatus.dataStates[this.currentFunction] || [];
        this.currentTriggerStatus.dataStates[this.currentFunction].push(newData);
      }
      return ret;
    };
    return triggerHelper;
  }

  _onTriggerInternalCheckSuppressed(trigger, when) {
    this.currentFunction = '_onTriggerInternalCheckSuppressed';
    let ret = super._onTriggerInternalCheckSuppressed(trigger, when);
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
    let ret = super._onTriggerInternalCondition(triggerHelper);
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
    let delay = 'delaySeconds' in triggerHelper.trigger ? triggerHelper.valueOrFunction(triggerHelper.trigger.delaySeconds) : 0;
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
    let ret = super._onTriggerInternalPromise(triggerHelper);
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
    this.currentTriggerStatus.response = triggerHelper.response;
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

  _onTriggerInternalGroupTTS(triggerHelper) {
    this.currentFunction = '_onTriggerInternalGroupTTS';
    super._onTriggerInternalGroupTTS(triggerHelper);
  }

  _onTriggerInternalTTS(triggerHelper) {
    this.currentFunction = '_onTriggerInternalTTS';
    super._onTriggerInternalTTS(triggerHelper);
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

  _addText(holder, div) {
    // No-op
  }

  _playAudioFile(url, volume) {
    // No-op
  }

  _scheduleRemoveText(container, e, delay) {
    // No-op
  }
}
