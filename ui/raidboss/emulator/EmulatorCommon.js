'use strict';

class EmulatorCommon {
  static getTimestampFromLogLine(day, line) {
    let result = EmulatorCommon.logLineRegex.exec(line);
    return +new Date(day + ' ' + result.groups.lineTimestamp);
  }

  static cloneData(data, exclude = ['options', 'party']) {
    let ret;
    if (Array.isArray(data))
      ret = [];
    else
      ret = {};

    // Use extra logic for top-level extend for property exclusion
    // This cut the execution time of this code from 41,000ms to 50ms when parsing a 12 minute pull
    for (let i in data) {
      if (exclude.includes(i))
        continue;

      if (typeof data[i] === 'object')
        ret[i] = EmulatorCommon._cloneData(data[i]);
      else
        ret[i] = data[i];
    }
    return ret;
  }

  static _cloneData(data) {
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        let ret = [];
        for (let i = 0; i < data.length; ++i)
          ret[i] = EmulatorCommon._cloneData(data[i]);

        return ret;
      }

      if (data === null)
        return null;

      if (data instanceof RegExp)
        return new RegExp(data);

      let ret = {};
      for (let i in data)
        ret[i] = EmulatorCommon._cloneData(data[i]);

      return ret;
    }
    return data;
  }
}

EmulatorCommon.logLineRegex = /^\[(?<lineTimestamp>[^\]]+)\] ([0-9A-Z]+):(.*)$/i;
EmulatorCommon.sealRegexes = {};
EmulatorCommon.engageRegexes = {};
EmulatorCommon.countdownRegexes = {};
EmulatorCommon.unsealRegexes = {};

EmulatorCommon.cactbotLanguages = {
  'ja': new CactbotLanguageJa(),
  'en': new CactbotLanguageEn(),
  'de': new CactbotLanguageDe(),
  'fr': new CactbotLanguageFr(),
  'cn': new CactbotLanguageCn(),
  'ko': new CactbotLanguageKo(),
};

for (let lang of EmulatorCommon.cactbotLanguages.en.kLanguages) {
  let langObj = EmulatorCommon.cactbotLanguages[lang];
  EmulatorCommon.sealRegexes[lang] = langObj.areaSealRegex();
  EmulatorCommon.engageRegexes[lang] = langObj.countdownEngageRegex();
  EmulatorCommon.countdownRegexes[lang] = langObj.countdownStartRegex();
  EmulatorCommon.unsealRegexes[lang] = langObj.areaUnsealRegex();
}

EmulatorCommon.wipeRegex = /\[(?<lineTimestamp>[^\]]+)\] 21:........:40000010:/;
EmulatorCommon.winRegex = /\[(?<lineTimestamp>[^\]]+)\] 21:........:40000003:/;
EmulatorCommon.cactbotWipeRegex = /\[(?<lineTimestamp>[^\]]+)\] 00:0038:cactbot wipe/;

EmulatorCommon.zoneChangeRegex = /\[(?<lineTimestamp>[^\]]+)\] 01:Changed Zone to (?<zone>.*)\./;

EmulatorCommon.eventDetailsRegexes = {
  '03': Regexes.addedCombatantFull({ capture: true }),
  '04': Regexes.removingCombatant({ capture: true }),
  '15': Regexes.abilityFull({ capture: true }),
  '16': Regexes.abilityFull({ capture: true }),
  '26': Regexes.statusEffectExplicit({ capture: true }),
};
