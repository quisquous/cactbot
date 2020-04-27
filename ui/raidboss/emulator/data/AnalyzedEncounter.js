class AnalyzedEncounter extends EventBus {
  static lineTimestampRegex = /^\[(\d\d:\d\d:\d\d.\d\d\d)\]/i;

  Perspectives = {};

  /** @type Encounter */
  encounter;

  constructor(encounter) {
    super();
    this.encounter = encounter;
  }

  selectPerspective(ID) {
    this.popupText.OnPlayerChange({
      detail: {
        name: this.encounter.combatantTracker.combatants[ID].name.split('(')[0],
        job: this.encounter.combatantTracker.combatants[ID].job,
        currentHP: this.encounter.combatantTracker.combatants[ID].getState(this.encounter.logLines[0].timestamp).HP,
      },
    });
  }

  popupText = null;

  async Analyze(popupText) {
    this.popupText = popupText;
    let PartyEvent = {
      party: this.encounter.combatantTracker.partyMembers.map((ID) => {
        return {
          name: this.encounter.combatantTracker.combatants[ID].name.split('(')[0],
          job: this.JobToJobEnum(this.encounter.combatantTracker.combatants[ID].job),
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
          name: this.encounter.combatantTracker.combatants[ID].name.split('(')[0],
          job: this.encounter.combatantTracker.combatants[ID].job,
          currentHP: this.encounter.combatantTracker.combatants[ID].getState(this.encounter.logLines[0].timestamp).HP,
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
      me: this.encounter.combatantTracker.combatants[ID].name.split('(')[0],
      job: this.encounter.combatantTracker.combatants[ID].job,
      role: Util.jobToRole(this.encounter.combatantTracker.combatants[ID].job),
    };

    this.Perspectives[ID] = {
      initialData: AnalyzedEncounter.cloneData(data, true),
      triggers: [],
      finalData: data,
    };

    let suppressed = {};

    for (let i = 0; i < this.encounter.logLines.length; i++) {
      let log = this.encounter.logLines[i];
      popupText.OnPlayerChange({
        detail: {
          name: this.encounter.combatantTracker.combatants[ID].name.split('(')[0],
          job: this.encounter.combatantTracker.combatants[ID].job,
          currentHP: this.encounter.combatantTracker.combatants[ID].getState(log.timestamp).HP,
        },
      });
      for (let t = 0; t < triggers.length; t++) {
        let trigger = triggers[t];
        if (trigger.disabled)
          continue;

        let matches = log.line.match(trigger.localRegex);
        if (matches) {
          if (matches.groups)
            matches = matches.groups;

          let preData = AnalyzedEncounter.cloneData(data);
          let status = await this.runTriggers(log.timestamp, trigger, data, matches, suppressed);
          this.Perspectives[ID].triggers.push({
            trigger: trigger,
            timestamp: log.timestamp,
            offset: log.timestamp - this.encounter.startTimestamp,
            resolvedOffset: (log.timestamp - this.encounter.startTimestamp) + (status.Delay || 0),
            preData: preData,
            postData: AnalyzedEncounter.cloneData(data),
            matches: matches,
            status: status,
          });
        }
      }
    }
  }

  async runTriggers(timestamp, trigger, data, matches, suppressed) {
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
      ret.DataPrePromise = AnalyzedEncounter.cloneData(data);
      ret.Promise = trigger.promise(data, matches);
      if (Promise.resolve(ret.Promise) === ret.Promise) {
        await ret.Promise;
        ret.PromiseStatus = 'Resolved';
      } else {
        ret.PromiseStatus = 'Not a function';
      }
      ret.DataPostPromise = AnalyzedEncounter.cloneData(data);
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

  static cloneData(data, full = false) {
    let ret = {};
    // Use our own extend logic for the top level to avoid cloning the `options` property
    // This cut the execution time of this code from 41,000ms to 50ms when parsing a 12 minute pull
    for (let i in data) {
      if (!full && (i === 'options' || i === 'party')) {
        continue;
      }
      if (typeof data[i] === 'object') {
        // Potential future bug: jQuery's extend doesn't include properties with a value of `undefined`
        if(Array.isArray(data[i])) {
          ret[i] = jQuery.extend(true, [], data[i]);
        } else {
          ret[i] = jQuery.extend(true, {}, data[i]);
        }
      } else {
        ret[i] = data[i];
      }
    }
    return ret;
  }

  JobToJobEnum(Job) {
    return Object.keys(kJobEnumToName).filter((k) => kJobEnumToName[k] === Job).pop();
  }
};
