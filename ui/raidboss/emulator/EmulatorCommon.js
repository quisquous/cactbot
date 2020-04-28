'use strict';

class EmulatorCommon {
  static getTimestampFromLogLine(day, line) {
    let result = EmulatorCommon.logLineRegex.exec(line);
    return +new Date(day + ' ' + result.groups.lineTimestamp);
  }
}

EmulatorCommon.logLineRegex = /^\[(?<lineTimestamp>[^\]]+)\] ([0-9A-Z]+):(.*)$/i;

EmulatorCommon.SealRegexes = {
  ja: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*)の封鎖まであと(?<Time>.*)秒/,
  en: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:(?<Zone>.*) will be sealed off in (?<Time>.*) seconds!/,
  de: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:Noch (?<Time>.*) Sekunden, bis sich (?<Zone>.*) schließt/,
  // @TODO: Time? If we need it for some reason?
  fr: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:Fermeture (?<Zone>.*) dans /,
  cn: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:距(?<Zone>.*)被封锁还有(?<Time>.*)秒/,
  ko: /\[(?<lineTimestamp>[^\]]+)\] 00:0839:(?<Time>.*)초 후에 (?<Zone>.*)(이|가) 봉쇄됩니다\./,
};

EmulatorCommon.EngageRegexes = {
  ja: /\[(?<lineTimestamp>[^\]]+)\] 00:0039:戦闘開始！/,
  en: /\[(?<lineTimestamp>[^\]]+)\] 00:0039:Engage!/,
  de: /\[(?<lineTimestamp>[^\]]+)\] 00:0039:Start!/,
  fr: /\[(?<lineTimestamp>[^\]]+)\] 00:0039:À l'attaque !/,
  cn: /\[(?<lineTimestamp>[^\]]+)\] 00:0039:战斗开始！/,
  ko: /\[(?<lineTimestamp>[^\]]+)\] 00:0039:전투 시작!/,
};

EmulatorCommon.CountdownRegexes = {
  ja: /\[(?<lineTimestamp>[^\]]+)\] 00:.{4}:戦闘開始まで(?<Time>\d+)秒！/,
  en: /\[(?<lineTimestamp>[^\]]+)\] 00:.{4}:Battle commencing in (?<Time>\d+) seconds!/,
  de: /\[(?<lineTimestamp>[^\]]+)\] 00:.{4}:Noch (?<Time>\d+) Sekunden bis Kampfbeginn!/,
  fr: /\[(?<lineTimestamp>[^\]]+)\] 00:.{4}:Début du combat dans (?<Time>\d+) secondes !/,
  cn: /\[(?<lineTimestamp>[^\]]+)\] 00:.{4}:距离战斗开始还有(?<Time>\d+)秒！/,
  ko: /\[(?<lineTimestamp>[^\]]+)\] 00:.{4}:전투 시작 (?<Time>\d+)초 전!/,
};

EmulatorCommon.EventDetailsRegexes = {
  '03': /\[(?<lineTimestamp>[^\]]+)\] 03:(?<source_id>[^:]+):Added new combatant (?<source_name>[^:]+)\. {2}Job: (?<job>[^:]+) Level: (?<level>[^:]+) Max HP: (?<source_maxHP>\d+) Max MP: (?<source_maxMP>\d+) Pos: \((?<source_posX>[^,)]+),(?<source_posY>[^,)]+),(?<source_posZ>[^,)]+)\)/i,
  '04': /\[(?<lineTimestamp>[^\]]+)\] 04:(?<source_id>[^:]+):Removing combatant (?<source_name>[^:]+)\. {2}Max HP: (?<source_maxHP>\d+)\. Pos: \((?<source_posX>[^,]+),(?<source_posY>[^,]+),(?<source_posZ>[^,)]+)\)/i,
  '15': /\[(?<lineTimestamp>[^\]]+)\] 15:(?<source_id>[^:]*?):(?<source_name>[^:]*?):(?<AbilityID>[^:]*?):(?<AbilityName>[^:]*?):(?<target_id>[^:]*?):(?<target_name>[^:]*?):[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:(?<target_HP>[^:]*?):(?<target_maxHP>[^:]*?):(?<target_MP>[^:]*?):(?<target_maxMP>[^:]*?):[^:]*?:[^:]*?:(?<target_posX>[^:]*?):(?<target_posY>[^:]*?):(?<target_posZ>[^:]*?):(?<target_heading>[^:]*?):(?<source_HP>[^:]*?):(?<source_maxHP>[^:]*?):(?<source_MP>[^:]*?):(?<source_maxMP>[^:]*?):[^:]*?:[^:]*?:(?<source_posX>[^:]*?):(?<source_posY>[^:]*?):(?<source_posZ>[^:]*?):(?<source_heading>[^:]*?):/i,
  '16': /\[(?<lineTimestamp>[^\]]+)\] 16:(?<source_id>[^:]*?):(?<source_name>[^:]*?):(?<AbilityID>[^:]*?):(?<AbilityName>[^:]*?):(?<target_id>[^:]*?):(?<target_name>[^:]*?):[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:[^:]*?:(?<target_HP>[^:]*?):(?<target_maxHP>[^:]*?):(?<target_MP>[^:]*?):(?<target_maxMP>[^:]*?):[^:]*?:[^:]*?:(?<target_posX>[^:]*?):(?<target_posY>[^:]*?):(?<target_posZ>[^:]*?):(?<target_heading>[^:]*?):(?<source_HP>[^:]*?):(?<source_maxHP>[^:]*?):(?<source_MP>[^:]*?):(?<source_maxMP>[^:]*?):[^:]*?:[^:]*?:(?<source_posX>[^:]*?):(?<source_posY>[^:]*?):(?<source_posZ>[^:]*?):(?<source_heading>[^:]*?):/i,
  '26': /\[(?<lineTimestamp>[^\]]+)\] 26:(?<source_id>[^:]+):(?<source_name>[^:]*?):[^:]+:(?<source_HP>[^:]+):(?<source_maxHP>[^:]+):(?<source_MP>[^:]+):(?<source_maxMP>[^:]+)/i,
};

EmulatorCommon.petNames = [
  'Emerald Carbuncle', 'Topaz Carbuncle', 'Moonstone Carbuncle',
  'Ifrit-Egi', 'Titan-Egi', 'Garuda-Egi',
  'Eos', 'Selene', 'Seraph',
  'Rook Autoturret', 'Bishop Autoturret', 'Automaton Queen',
  'Demi-Bahamut', 'Demi-Phoenix',
  'Esteem', 'Bunshin',
];

EmulatorCommon.Languages = [
  'ja',
  'en',
  'de',
  'fr',
  'cn',
  'ko',
];
