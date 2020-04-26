class LogEventHandler extends EventBus {

  static UnsealRegexes = {
    ja: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*)の封鎖が解かれた……/,
    en: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*) is no longer sealed/,
    de: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:(?:Der Zugang zu\w* |)(?<Zone>.*) öffnet sich (?:erneut|wieder)/,
    fr: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:Ouverture (?<Zone>.*)/,
    cn: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*)的封锁解除了/,
    ko: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*)의 봉쇄가 해제되었습니다\./,
  };

  static WipeRegex = /\[(?<LineTimestamp>[^\]]+)\] 21:........:40000010:/;
  static WinRegex = /\[(?<LineTimestamp>[^\]]+)\] 21:........:40000003:/;
  static CactbotWipeRegex = /\[(?<LineTimestamp>[^\]]+)\] 00:0038:cactbot wipe/;

  static ZoneChangeRegex = / 01:Changed Zone to (?<Zone>.*)\./;

  static DoesLineMatch(line, regexes) {
    for (let i in regexes) {
      let res = regexes[i].exec(line);
      if (res) {
        return res;
      }
    }
    return false;
  }

  static IsMatchStart(line) {
    let res;
    res = LogEventHandler.DoesLineMatch(line, EmulatorCommon.CountdownRegexes);
    if (res) {
      res.groups.StartIn = res.groups.Time * 1000;
      res.groups.StartType = 'Countdown';
      return res;
    }
    res = LogEventHandler.DoesLineMatch(line, EmulatorCommon.SealRegexes);
    if (res) {
      res.groups.StartIn = 0;
      res.groups.StartType = 'Seal';
      return res;
    }
    res = LogEventHandler.DoesLineMatch(line, EmulatorCommon.EngageRegexes);
    if (res) {
      res.groups.StartIn = 0;
      res.groups.StartType = 'Engage';
      return res;
    }
    return false;
  }

  static IsMatchEnd(line) {
    let res;
    res = LogEventHandler.DoesLineMatch(line, [LogEventHandler.WinRegex]);
    if (res) {
      res.groups.EndType = 'Win';
      return res;
    }
    res = LogEventHandler.DoesLineMatch(line, [LogEventHandler.WipeRegex]);
    if (res) {
      res.groups.EndType = 'Wipe';
      return res;
    }
    res = LogEventHandler.DoesLineMatch(line, [LogEventHandler.CactbotWipeRegex]);
    if (res) {
      res.groups.EndType = 'Cactbot Wipe';
      return res;
    }
    res = LogEventHandler.DoesLineMatch(line, LogEventHandler.UnsealRegexes);
    if (res) {
      res.groups.EndType = 'Unseal';
      return res;
    }
    return false;
  }

  constructor() {
    super();
    window.addOverlayListener('onImportLogEvent', (e) => {
      console.log("Parsing " + e.detail.logs.length + " lines...");
      this.ParseLogs(e.detail.logs);
    });
    this.currentZone = null;
    this.currentDate = null;
    this.currentFight = [];
  }

  ParseLogs(logs) {
    for (let i = 0; i < logs.length; ++i) {
      let line = logs[i];
      this.currentFight.push(line);
      let res;
      if (res = LogEventHandler.IsMatchEnd(line)) {
        this.EndFight();
      } else if (res = LogEventHandler.DoesLineMatch(line, [LogEventHandler.ZoneChangeRegex])) {
        this.currentZone = res.groups.Zone;
        this.EndFight();
      }
    }
  }

  EndFight() {
    if (this.currentFight.length < 2) {
      return;
    }
    // @TODO: Pull this from log import event when it's possible
    // Until then, allow this to be passed in from controller
    // or carried over from previous encounter
    if (this.currentDate === null) {
      this.currentDate = new Date().toISOString().substr(0, 10);
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