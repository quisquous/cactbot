import EmulatorCommon from '../EmulatorCommon.js';
import EventBus from '../EventBus.js';
import { LocaleNetRegex } from '../../../../resources/translations.js';

export default class LogEventHandler extends EventBus {
  static doesLineMatch(line, regexes) {
    for (const i in regexes) {
      const res = regexes[i].exec(line);
      if (res) {
        if (LocaleNetRegex.areaSeal[i])
          res.groups.language = i;
        return res;
      }
    }
    return false;
  }

  static isMatchStart(line) {
    let res;
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.countdownRegexes);
    if (res) {
      res.groups.StartIn = res.groups.time * 1000;
      res.groups.StartType = 'Countdown';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.sealRegexes);
    if (res) {
      res.groups.StartIn = 0;
      res.groups.StartType = 'Seal';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.engageRegexes);
    if (res) {
      res.groups.StartIn = 0;
      res.groups.StartType = 'Engage';
      return res;
    }
    return false;
  }

  static isMatchEnd(line) {
    let res;
    res = LogEventHandler.doesLineMatch(line, [EmulatorCommon.winRegex]);
    if (res) {
      res.groups.EndType = 'Win';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, [EmulatorCommon.wipeRegex]);
    if (res) {
      res.groups.EndType = 'Wipe';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, [EmulatorCommon.cactbotWipeRegex]);
    if (res) {
      res.groups.EndType = 'Cactbot Wipe';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.unsealRegexes);
    if (res) {
      res.groups.EndType = 'Unseal';
      return res;
    }
    return false;
  }

  constructor() {
    super();

    this.currentZoneName = null;
    this.currentFight = [];
    this.currentZoneId = -1;
  }

  parseLogs(logs) {
    for (let i = 0; i < logs.length; ++i) {
      const lineObj = logs[i];

      this.currentFight.push(lineObj);

      lineObj.offset = lineObj.timestamp - this.currentFight[0].timestamp;

      const res = LogEventHandler.isMatchEnd(lineObj.networkLine);
      if (res) {
        this.endFight();
      } else if (lineObj.zoneName) {
        this.currentZoneId = lineObj.zoneId;
        this.currentZoneName = lineObj.zoneName;
        this.endFight();
      }
    }
  }

  endFight() {
    if (this.currentFight.length < 2)
      return;

    const start = new Date(this.currentFight[0].timestamp);
    this.currentZoneName = this.currentZoneName || 'Unknown';
    this.currentZoneId = this.currentZoneId || -1;

    console.debug(`Dispatching new fight
Start: ${start}
End: ${new Date(this.currentFight[this.currentFight.length - 1].timestamp)}
Zone: ${this.currentZoneName}
Line Count: ${this.currentFight.length}
`);
    this.dispatch('fight', start.toISOString().substr(0, 10), this.currentZoneId, this.currentZoneName, this.currentFight);

    this.currentFight = [];
  }
}
