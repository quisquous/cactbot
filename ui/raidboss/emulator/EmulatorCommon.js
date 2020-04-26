class EmulatorCommon {
  static LogLineRegex = /^\[(\d\d:\d\d:\d\d.\d\d\d)\] ([0-9A-Z]+):(.*)$/i;
  
  static SealRegexes = {
    ja: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*)の封鎖まであと(?<Time>.*)秒/,
    en: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*) will be sealed off in (?<Time>.*) seconds!/,
    de: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:Noch (?<Time>.*) Sekunden, bis sich (?<Zone>.*) schließt/,
    fr: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:Fermeture (?<Zone>.*) dans /, //@TODO: Time? If we need it for some reason?
    cn: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:距(?<Zone>.*)被封锁还有(?<Time>.*)秒/,
    ko: /\[(?<LineTimestamp>[^\]]+)\] 00:0839:(?<Time>.*)초 후에 (?<Zone>.*)(이|가) 봉쇄됩니다\./
  };

  static EngageRegexes = {
    ja: /\[(?<LineTimestamp>[^\]]+)\] 00:0039:戦闘開始！/,
    en: /\[(?<LineTimestamp>[^\]]+)\] 00:0039:Engage!/,
    de: /\[(?<LineTimestamp>[^\]]+)\] 00:0039:Start!/,
    fr: /\[(?<LineTimestamp>[^\]]+)\] 00:0039:À l'attaque !/,
    cn: /\[(?<LineTimestamp>[^\]]+)\] 00:0039:战斗开始！/,
    ko: /\[(?<LineTimestamp>[^\]]+)\] 00:0039:전투 시작!/,
  };

  static CountdownRegexes = {
    ja: /\[(?<LineTimestamp>[^\]]+)\] 00:.{4}:戦闘開始まで(?<Time>\d+)秒！/,
    en: /\[(?<LineTimestamp>[^\]]+)\] 00:.{4}:Battle commencing in (?<Time>\d+) seconds!/,
    de: /\[(?<LineTimestamp>[^\]]+)\] 00:.{4}:Noch (?<Time>\d+) Sekunden bis Kampfbeginn!/,
    fr: /\[(?<LineTimestamp>[^\]]+)\] 00:.{4}:Début du combat dans (?<Time>\d+) secondes !/,
    cn: /\[(?<LineTimestamp>[^\]]+)\] 00:.{4}:距离战斗开始还有(?<Time>\d+)秒！/,
    ko: /\[(?<LineTimestamp>[^\]]+)\] 00:.{4}:전투 시작 (?<Time>\d+)초 전!/,
  };

  static EventDetailsRegexes = {
    '03': /^[^ ]+ 03:(?<SourceID>[^:]+):Added new combatant (?<SourceName>[^:]+)\.  Job: (?<Job>[^:]+) Level: (?<Level>[^:]+) Max HP: (?<SourceMaxHP>\d+) Max MP: (?<SourceMaxMP>\d+) Pos: \((?<SourcePosX>[^,)]+),(?<SourcePosY>[^,)]+),(?<SourcePosZ>[^,)]+)\)/i,
    '04': /^[^ ]+ 04:(?<SourceID>[^:]+):Removing combatant (?<SourceName>[^:]+)\.  Max HP: (?<SourceMaxHP>\d+)\. Pos: \((?<SourcePosX>[^,]+),(?<SourcePosY>[^,]+),(?<SourcePosZ>[^,)]+)\)/i,
    '15': /^[^ ]+ 15:(?<SourceID>[^:]*?):(?<SourceName>[^:]*?):(?<AbilityID>[^:]*?):(?<AbilityName>[^:]*?):(?<TargetID>[^:]*?):(?<TargetName>[^:]*?):[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:(?<TargetHP>[^:]*?):(?<TargetMaxHP>[^:]*?):(?<TargetMP>[^:]*?):(?<TargetMaxMP>[^:]*?):[^:]*?:[^:]*?:(?<TargetPosX>[^:]*?):(?<TargetPosY>[^:]*?):(?<TargetPosZ>[^:]*?):(?<TargetHeading>[^:]*?):(?<SourceHP>[^:]*?):(?<SourceMaxHP>[^:]*?):(?<SourceMP>[^:]*?):(?<SourceMaxMP>[^:]*?):[^:]*?:[^:]*?:(?<SourcePosX>[^:]*?):(?<SourcePosY>[^:]*?):(?<SourcePosZ>[^:]*?):(?<SourceHeading>[^:]*?):/i,
    '16': /^[^ ]+ 16:(?<SourceID>[^:]*?):(?<SourceName>[^:]*?):(?<AbilityID>[^:]*?):(?<AbilityName>[^:]*?):(?<TargetID>[^:]*?):(?<TargetName>[^:]*?):[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:(?<TargetHP>[^:]*?):(?<TargetMaxHP>[^:]*?):(?<TargetMP>[^:]*?):(?<TargetMaxMP>[^:]*?):[^:]*?:[^:]*?:(?<TargetPosX>[^:]*?):(?<TargetPosY>[^:]*?):(?<TargetPosZ>[^:]*?):(?<TargetHeading>[^:]*?):(?<SourceHP>[^:]*?):(?<SourceMaxHP>[^:]*?):(?<SourceMP>[^:]*?):(?<SourceMaxMP>[^:]*?):[^:]*?:[^:]*?:(?<SourcePosX>[^:]*?):(?<SourcePosY>[^:]*?):(?<SourcePosZ>[^:]*?):(?<SourceHeading>[^:]*?):/i,
    '26': /^[^ ]+ 26:(?<SourceID>[^:]+):(?<SourceName>[^:]*?):[^:]+:(?<SourceHP>[^:]+):(?<SourceMaxHP>[^:]+):(?<SourceMP>[^:]+):(?<SourceMaxMP>[^:]+)/i,
  };

  static PetNames = ["Emerald Carbuncle", "Topaz Carbuncle", "Ifrit-Egi", "Titan-Egi", "Garuda-Egi", "Eos", "Selene", "Rook Autoturret", "Bishop Autoturret", "Demi-Bahamut", "Demi-Phoenix", "Seraph", "Moonstone Carbuncle", "Esteem", "Automaton Queen", "Bunshin", "Demi-Phoenix", "Seraph", "Bunshin"];

  static Languages = ['ja', 'en', 'de', 'fr', 'cn', 'ko',];

}