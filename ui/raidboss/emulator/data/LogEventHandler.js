class LogEventHandler extends EventBus {

  static SealRegexes = {
    ja: / 00:0839:(?<Zone>.*)の封鎖まであと(?<Time>.*)秒/,
    en: / 00:0839:(?<Zone>.*) will be sealed off in (?<Time>.*) seconds!/,
    de: / 00:0839:Noch (?<Time>.*) Sekunden, bis sich (?<Zone>.*) schließt/,
    fr: / 00:0839:Fermeture (?<Zone>.*) dans /, //@TODO: Time? If we need it for some reason?
    cn: / 00:0839:距(?<Zone>.*)被封锁还有(?<Time>.*)秒/,
    ko: / 00:0839:(?<Time>.*)초 후에 (?<Zone>.*)(이|가) 봉쇄됩니다\./
  };

  static UnsealRegexes = {
    ja: / 00:0839:(?<Zone>.*)の封鎖が解かれた……/,
    en: / 00:0839:(?<Zone>.*) is no longer sealed/,
    de: / 00:0839:(?:Der Zugang zu\w* |)(?<Zone>.*) öffnet sich (?:erneut|wieder)/,
    fr: / 00:0839:Ouverture (?<Zone>.*)/,
    cn: / 00:0839:(?<Zone>.*)的封锁解除了/,
    ko: / 00:0839:(?<Zone>.*)의 봉쇄가 해제되었습니다\./,
  };

  static EngageRegexes = {
    ja: / 00:0039:戦闘開始！/,
    en: / 00:0039:Engage!/,
    de: / 00:0039:Start!/,
    fr: / 00:0039:À l'attaque !/,
    cn: / 00:0039:战斗开始！/,
    ko: / 00:0039:전투 시작!/,
  };

  static CountdownRegexes = {
    ja: / 00:.{4}:戦闘開始まで(?<Time>\d+)秒！/,
    en: / 00:.{4}:Battle commencing in (?<Time>\d+) seconds!/,
    de: / 00:.{4}:Noch (?<Time>\d+) Sekunden bis Kampfbeginn!/,
    fr: / 00:.{4}:Début du combat dans (?<Time>\d+) secondes !/,
    cn: / 00:.{4}:距离战斗开始还有(?<Time>\d+)秒！/,
    ko: / 00:.{4}:전투 시작 (?<Time>\d+)초 전!/,
  };

  static WipeRegex = / 21:........:40000010:/;
  static WinRegex = / 21:........:40000003:/;
  static CactbotWipeRegex = /00:0038:cactbot wipe/;

  static ZoneChangeRegex = / 01:Changed Zone to (?<Zone>.*)\./;

  static DoesLineMatch(line, regexes) {
    for (let i in regexes) {
      let res = regexes[i].exec(line);
      if (res)
        return res;
    }
    return false;
  }

  static IsMatchStart(line) {
    let res;
    res = LogEventHandler.DoesLineMatch(line, LogEventHandler.CountdownRegexes);
    if (res) {
      return res;
    }
    res = LogEventHandler.DoesLineMatch(line, LogEventHandler.EngageRegexes);
    if (res) {
      return res;
    }
    res = LogEventHandler.DoesLineMatch(line, LogEventHandler.SealRegexes);
    if (res) {
      return res;
    }
    return false;
  }

  static IsMatchEnd(line) {
    let res;
    res = LogEventHandler.DoesLineMatch(line, [LogEventHandler.WinRegex, LogEventHandler.WipeRegex, LogEventHandler.CactbotWipeRegex]);
    if (res) {
      return res;
    }
    res = LogEventHandler.DoesLineMatch(line, LogEventHandler.UnsealRegexes);
    if (res) {
      return res;
    }
    return false;
  }

  constructor(addFightCallback) {
    super();
    window.addOverlayListener('onImportLogEvent', (e) => {
      this.ParseLogs(e.detail.logs);
    });
    this.currentZone = null;
    this.currentDate = null;
    this.currentFight = [];
    this.currentFightHasStart = false;
    this.currentFightHasEnd = false;
  }

  ParseLogs(logs) {
    for (let i = 0; i < logs.length; ++i) {
      let line = logs[i];
      this.currentFight.push(line);
      let res;
      if (res = LogEventHandler.IsMatchStart(line)) {
        this.currentFightHasStart = true;
      } else if (res = LogEventHandler.IsMatchEnd(line)) {
        this.currentFightHasEnd = true;
        this.EndFight();
      } else if (res = LogEventHandler.DoesLineMatch(line, [LogEventHandler.ZoneChangeRegex])) {
        this.currentZone = res.groups.Zone;
        this.EndFight();
      }
    }
  }

  EndFight() {
    if (this.currentFightHasStart && this.currentFightHasEnd) {
      // @TODO: Pull this from log import event when it's possible
      if (this.currentDate === null) {
        this.currentDate = new Date().toISOString().substr(0, 10);
      }
      this.dispatch('fight', this.currentDate, this.currentZone, this.currentFight);
    }
    this.currentFight = [];
    this.currentFightHasStart = false;
    this.currentFightHasEnd = false;
  }
}