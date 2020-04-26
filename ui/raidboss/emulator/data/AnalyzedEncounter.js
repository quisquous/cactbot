class AnalyzedEncounter extends EventBus {
  static LineTimestampRegex = /^\[(\d\d:\d\d:\d\d.\d\d\d)\]/i;

  Perspectives = {};

  /** @type Encounter */
  encounter;

  constructor(encounter) {
    super();
    this.encounter = encounter;
    let encDate = timeToDateString(encounter.startTimestamp);
    //Extract the required info from log lines for playback
    this.logLines = encounter.logLines.map((line) => {
      let matches = AnalyzedEncounter.LineTimestampRegex.exec(line);
      let ts = +new Date(encDate + ' ' + matches[1]);
      return {
        Timestamp: ts,
        Offset: ts - encounter.startTimestamp,
        Line: line,
      };
    });
  }

  selectPerspective(ID) {
    this.popupText.OnPlayerChange({
      detail: {
        name: this.encounter.combatantTracker.combatants[ID].Name.split('(')[0],
        job: this.encounter.combatantTracker.combatants[ID].Job,
        currentHP: this.encounter.combatantTracker.combatants[ID].States[this.logLines[0].Timestamp].HP,
      },
    });
  }

  popupText = null;

  async Analyze(popupText) {
    this.popupText = popupText;
    let PartyEvent = {
      party: this.encounter.combatantTracker.partyMembers.map((ID) => {
        return {
          name: this.encounter.combatantTracker.combatants[ID].Name.split('(')[0],
          job: this.JobToJobEnum(this.encounter.combatantTracker.combatants[ID].Job),
          inParty: true,
        };
      }),
    };
    popupText.partyTracker.onPartyChanged(PartyEvent);
    // @TODO: Make this run in parallel sometime in the future, since it could be really slow?
    for (let index in this.encounter.combatantTracker.partyMembers) {
      let ID = this.encounter.combatantTracker.partyMembers[index];
      popupText.OnPlayerChange({
        detail: {
          name: this.encounter.combatantTracker.combatants[ID].Name.split('(')[0],
          job: this.encounter.combatantTracker.combatants[ID].Job,
          currentHP: this.encounter.combatantTracker.combatants[ID].States[this.logLines[0].Timestamp].HP,
        },
      });
      popupText.OnZoneChange({
        detail: {
          zoneName: this.encounter.encounterZone,
        }
      });
      let triggers = popupText.triggers;
      await this.AnalyzeFor(ID, triggers, popupText);
    }
    this.dispatch('analyzed');
  }

  async AnalyzeFor(ID, triggers, popupText) {
    let data = {
      lang: this.encounter.language || popupText.data.lang,
      currentHP: 0,
      options: popupText.options,
      party: new PartyTracker(),
      StopCombat: () => { },
      ParseLocaleFloat: parseFloat,
      CanStun: () => Util.canStun(this.job),
      CanSilence: () => Util.canSilence(this.job),
      CanSleep: () => Util.canSleep(this.job),
      CanCleanse: () => Util.canCleanse(this.job),
      CanFeint: () => Util.canFeint(this.job),
      CanAddle: () => Util.canAddle(this.job),
      ShortName: (name) => !name ? '(undefined)' : name.split(/\s/)[0],
      me: this.encounter.combatantTracker.combatants[ID].Name.split('(')[0],
      job: this.encounter.combatantTracker.combatants[ID].Job,
      role: Util.jobToRole(this.encounter.combatantTracker.combatants[ID].Job),
    };

    this.Perspectives[ID] = {
      InitialData: AnalyzedEncounter.CloneData(data, true),
      Triggers: [],
      FinalData: data,
    };

    let suppressed = {};

    for (let i = 0; i < this.logLines.length; i++) {
      let log = this.logLines[i];
      popupText.OnPlayerChange({
        detail: {
          name: this.encounter.combatantTracker.combatants[ID].Name.split('(')[0],
          job: this.encounter.combatantTracker.combatants[ID].Job,
          currentHP: this.encounter.combatantTracker.combatants[ID].States[log.Timestamp].HP,
        },
      });
      for (let t = 0; t < triggers.length; t++) {
        let trigger = triggers[t];
        if (trigger.disabled)
          continue;

        let matches = log.Line.match(trigger.localRegex);
        if (matches) {
          if (matches.groups)
            matches = matches.groups;

          let preData = AnalyzedEncounter.CloneData(data);
          let status = await this.RunTriggers(log.Timestamp, trigger, data, matches, suppressed);
          this.Perspectives[ID].Triggers.push({
            Trigger: trigger,
            Timestamp: log.Timestamp,
            Offset: log.Timestamp - this.encounter.startTimestamp,
            ResolvedOffset: (log.Timestamp - this.encounter.startTimestamp) + (status.Delay || 0),
            PreData: preData,
            PostData: AnalyzedEncounter.CloneData(data),
            Matches: matches,
            Status: status,
          });
        }
      }
    }
  }

  async RunTriggers(timestamp, trigger, data, matches, suppressed) {
    let run;
    let result;
    let delay = 0;
    let suppress = 1;

    let ret = {
      Condition: undefined,
      Response: false,
      Result: false,
      Delay: false,
      Suppressed: false,
      Executed: false,
      Promise: undefined,
      PromiseStatus: false,
      DataPrePromise: undefined,
      DataPostPromise: undefined,
    };

    if (typeof trigger.delaySeconds === 'function')
      delay = trigger.delaySeconds(data, matches) * 1000 || delay * 1000;
    if (typeof trigger.delaySeconds === 'number')
      delay = trigger.delaySeconds * 1000 || delay * 1000;

    // first check condition
    if (typeof trigger.condition === 'function') {
      if (!trigger.condition(data, matches)) {
        ret.Condition = false;
        return ret;
      } else {
        ret.Condition = true;
      }
    }

    // preRun
    if (typeof trigger.preRun === 'function') {
      run = true;
      trigger.preRun(data, matches);
    }

    ret.Delay = delay ? delay : ret.Delay;

    // promise
    if (typeof trigger.promise === 'function') {
      ret.DataPrePromise = AnalyzedEncounter.CloneData(data);
      ret.Promise = trigger.promise(data, matches);
      if (Promise.resolve(ret.Promise) === ret.Promise) {
        await ret.Promise;
        ret.PromiseStatus = 'Resolved';
      } else {
        ret.PromiseStatus = 'Not a function';
      }
      ret.DataPostPromise = AnalyzedEncounter.CloneData(data);
    }

    let response = {};
    if (trigger.response) {
      let r = trigger.response;
      response = (typeof r === 'function') ? r(data, matches) : r;
    }

    ret.Response = response;

    // popup text
    if (typeof trigger.alarmText === 'function' && trigger.alarmText(data, matches))
      result = trigger.alarmText(data, matches);
    else if (typeof trigger.alarmText === 'object')
      result = trigger.alarmText;
    else if (response.alarmText)
      result = response.alarmText;

    if (typeof trigger.alertText === 'function' && trigger.alertText(data, matches))
      result = trigger.alertText(data, matches);
    else if (typeof trigger.alertText === 'object')
      result = trigger.alertText;
    else if (response.alertText)
      result = response.alertText;

    if (typeof trigger.infoText === 'function' && trigger.infoText(data, matches))
      result = trigger.infoText(data, matches);
    else if (typeof trigger.infoText === 'object')
      result = trigger.infoText;
    else if (response.infoText)
      result = response.infoText;

    ret.Result = result;

    // execute run function after text!
    if (typeof trigger.run === 'function') {
      run = true;
      trigger.run(data, matches);
    }

    // checking for suppression, first local then global
    if (typeof suppressed[trigger.id] !== 'undefined') {
      let timestamps = suppressed[trigger.id];
      for (let i in timestamps) {
        if (timestamps[i] > timestamp) {
          ret.Suppressed = timestamps[i];
          return ret;
        }
      }
    }

    ret.Executed = true;

    if (!result && !run)
      return ret;

    suppressed[trigger.id] = suppressed[trigger.id] || [];

    if (trigger.suppressSeconds) {
      if (typeof trigger.suppressSeconds === 'function')
        timestamp = timestamp + trigger.suppressSeconds(data, matches) * 1000;
      else
        timestamp = timestamp + trigger.suppressSeconds * 1000;
      suppressed[trigger.id].push(timestamp);
    } else {
      timestamp = timestamp + suppress * 1000;
      suppressed[trigger.id].push(timestamp);
    }

    return ret;
  }

  static CloneData(data, full = false) {
    // Potential future bug: jQuery's extend doesn't include properties with a value of `undefined`
    let ret = jQuery.extend(true, {}, data);
    // Filter out the stuff that won't ever change from trigger call to trigger call
    if (!full) {
      delete ret.options;
      delete ret.party;
    }
    return ret;
  }

  JobToJobEnum(Job) {
    return Object.keys(kJobEnumToName).filter((k) => kJobEnumToName[k] === Job).pop();
  }
};
