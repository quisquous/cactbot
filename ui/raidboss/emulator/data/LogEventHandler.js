'use strict';

class LogEventHandler extends EventBus {
  static doesLineMatch(line, regexes) {
    for (let i in regexes) {
      let res = regexes[i].exec(line);
      if (res) {
        if (gLang.kLanguages.includes(i))
          res.groups.language = i;
        return res;
      }
    }
    return false;
  }

  static isMatchStart(line) {
    let res;
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.CountdownRegexes);
    if (res) {
      res.groups.StartIn = res.groups.Time * 1000;
      res.groups.StartType = 'Countdown';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.SealRegexes);
    if (res) {
      res.groups.StartIn = 0;
      res.groups.StartType = 'Seal';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.EngageRegexes);
    if (res) {
      res.groups.StartIn = 0;
      res.groups.StartType = 'Engage';
      return res;
    }
    return false;
  }

  static isMatchEnd(line) {
    let res;
    res = LogEventHandler.doesLineMatch(line, [LogEventHandler.WinRegex]);
    if (res) {
      res.groups.EndType = 'Win';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, [LogEventHandler.WipeRegex]);
    if (res) {
      res.groups.EndType = 'Wipe';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, [LogEventHandler.CactbotWipeRegex]);
    if (res) {
      res.groups.EndType = 'Cactbot Wipe';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, LogEventHandler.UnsealRegexes);
    if (res) {
      res.groups.EndType = 'Unseal';
      return res;
    }
    return false;
  }

  constructor() {
    super();

    this.lastFightFirstTimestamp = null;
    this.currentZone = null;
    this.currentDate = null;
    this.currentFight = [];

    window.addOverlayListener('onImportLogEvent', (e) => {
      this.parseLogs(e.detail.logs);
    });
  }

  parseLogs(logs) {
    for (let i = 0; i < logs.length; ++i) {
      // Be a bit more intelligent if we're receiving
      // converted network logs instead of imported logs
      let lineObj = logs[i];
      let line = logs[i];
      if (typeof lineObj === 'object')
        line = lineObj.line;

      this.currentFight.push(line);
      let res = LogEventHandler.isMatchEnd(line);
      if (res) {
        this.endFight();
      } else {
        res = LogEventHandler.doesLineMatch(line, [LogEventHandler.ZoneChangeRegex]);
        if (res) {
          this.currentZone = res.groups.Zone;
          this.endFight();
        }
      }
    }
  }

  endFight() {
    if (this.currentFight.length < 2)
      return;

    // @TODO: Pull this from log import event when it's possible
    // Until then, allow this to be passed in from controller
    // or carried over from previous encounter
    if (this.currentDate === null) {
      this.currentDate = new Date().toISOString().substr(0, 10);
      this.lastFightFirstTimestamp =
        EmulatorCommon.getTimestampFromLogLine(this.currentDate, this.currentFight[0]);
    } else {
      let firstTimestamp =
        EmulatorCommon.getTimestampFromLogLine(this.currentDate, this.currentFight[0]);
      if (this.lastFightFirstTimestamp === null) {
        this.lastFightFirstTimestamp = firstTimestamp;
      } else {
        if (this.lastFightFirstTimestamp - firstTimestamp > 1000*60*60*12) {
          this.lastFightFirstTimestamp = firstTimestamp + 1000*60*60*24;
          this.currentDate = timeToDateString(this.lastFightFirstTimestamp);
        }
      }
    }
    console.log(`Displatching new fight
Date: ${this.currentDate}
Zone: ${this.currentZone}
Line Count: ${this.currentFight.length}
`);
    this.dispatch('fight', this.currentDate, this.currentZone, this.currentFight);

    this.currentFight = [];
  }
}

LogEventHandler.UnsealRegexes = {
  ja: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*)の封鎖が解かれた……/,
  en: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*) is no longer sealed/,
  de: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:(?:Der Zugang zu\w* |)(?<Zone>.*) öffnet sich (?:erneut|wieder)/,
  fr: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:Ouverture (?<Zone>.*)/,
  cn: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*)的封锁解除了/,
  ko: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*)의 봉쇄가 해제되었습니다\./,
};

LogEventHandler.WipeRegex = /\[(?<lineTimestamp>[^\]]+)\] 21:........:40000010:/;
LogEventHandler.WinRegex = /\[(?<lineTimestamp>[^\]]+)\] 21:........:40000003:/;
LogEventHandler.CactbotWipeRegex = /\[(?<lineTimestamp>[^\]]+)\] 00:0038:cactbot wipe/;

LogEventHandler.ZoneChangeRegex = /\[(?<lineTimestamp>[^\]]+)\] 01:Changed Zone to (?<Zone>.*)\./;
