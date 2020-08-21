'use strict';

class EmulatorCommon {
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

EmulatorCommon.sealRegexes = {};
EmulatorCommon.engageRegexes = {};
EmulatorCommon.countdownRegexes = {};
EmulatorCommon.unsealRegexes = {};

for (let lang in LocaleNetRegex.areaSeal) {
  EmulatorCommon.sealRegexes[lang] = LocaleNetRegex.areaSeal[lang];
  EmulatorCommon.engageRegexes[lang] = LocaleNetRegex.countdownEngage[lang];
  EmulatorCommon.countdownRegexes[lang] = LocaleNetRegex.countdownStart[lang];
  EmulatorCommon.unsealRegexes[lang] = LocaleNetRegex.areaUnseal[lang];
}

EmulatorCommon.wipeRegex = NetRegexes.network6d({ command: '40000010' });
EmulatorCommon.winRegex = NetRegexes.network6d({ command: '40000003' });
EmulatorCommon.cactbotWipeRegex = NetRegexes.echo({ line: 'cactbot wipe.*?' });
