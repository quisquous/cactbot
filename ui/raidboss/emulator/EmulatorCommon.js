import { LocaleNetRegex } from '../../../resources/translations.js';
import NetRegexes from '../../../resources/netregexes.js';

export default class EmulatorCommon {
  static cloneData(data, exclude = ['options', 'party']) {
    let ret;
    if (Array.isArray(data))
      ret = [];
    else
      ret = {};

    // Use extra logic for top-level extend for property exclusion
    // This cut the execution time of this code from 41,000ms to 50ms when parsing a 12 minute pull
    for (const i in data) {
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
        const ret = [];
        for (let i = 0; i < data.length; ++i)
          ret[i] = EmulatorCommon._cloneData(data[i]);

        return ret;
      }

      if (data === null)
        return null;

      if (data instanceof RegExp)
        return new RegExp(data);

      const ret = {};
      for (const i in data)
        ret[i] = EmulatorCommon._cloneData(data[i]);

      return ret;
    }
    return data;
  }

  static timeToString(time, includeMillis = true) {
    const negative = time < 0 ? '-' : '';
    time = Math.abs(time);
    // Milliseconds
    const millis = ('00' + (time % 1000)).substr(-3);
    const secs = ('0' + ((time % (60 * 1000)) - millis) / 1000).substr(-2);
    const mins = ('0' + ((((time % (60 * 60 * 1000)) - millis) / 1000) - secs) / 60).substr(-2);
    return negative + mins + ':' + secs + (includeMillis ? '.' + millis : '');
  }

  static timeToDateString(time) {
    const date = new Date(time);
    return date.getFullYear() + '-' + EmulatorCommon.zeroPad(date.getMonth() + 1) + '-' + EmulatorCommon.zeroPad(date.getDate());
  }

  static timeToTimeString(time, includeMillis = false) {
    const date = new Date(time);
    let ret = EmulatorCommon.zeroPad(date.getHours()) + ':' + EmulatorCommon.zeroPad(date.getMinutes()) + ':' + EmulatorCommon.zeroPad(date.getSeconds());
    if (includeMillis)
      ret = ret + '.' + EmulatorCommon.zeroPad(date.getMilliseconds(), 3);

    return ret;
  }

  static msToDuration(ms) {
    const tmp = EmulatorCommon.timeToString(ms, false);
    return tmp.replace(':', 'm') + 's';
  }

  static dateTimeToString(time, includeMillis = false) {
    const date = new Date(time);
    let ret = date.getFullYear() + '-' + EmulatorCommon.zeroPad(date.getMonth() + 1) + '-' + EmulatorCommon.zeroPad(date.getDate());
    ret = ret + ' ' + EmulatorCommon.zeroPad(date.getHours()) + ':' + EmulatorCommon.zeroPad(date.getMinutes()) + ':' + EmulatorCommon.zeroPad(date.getSeconds());
    if (includeMillis)
      ret = ret + '.' + date.getMilliseconds();

    return ret;
  }

  static zeroPad(str, len = 2) {
    return ('' + str).padStart(len, '0');
  }

  static properCase(str) {
    return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  static spacePadLeft(str, len) {
    return str.padStart(len, ' ');
  }
}

EmulatorCommon.sealRegexes = {};
EmulatorCommon.engageRegexes = {};
EmulatorCommon.countdownRegexes = {};
EmulatorCommon.unsealRegexes = {};

for (const lang in LocaleNetRegex.areaSeal) {
  EmulatorCommon.sealRegexes[lang] = LocaleNetRegex.areaSeal[lang];
  EmulatorCommon.engageRegexes[lang] = LocaleNetRegex.countdownEngage[lang];
  EmulatorCommon.countdownRegexes[lang] = LocaleNetRegex.countdownStart[lang];
  EmulatorCommon.unsealRegexes[lang] = LocaleNetRegex.areaUnseal[lang];
}

EmulatorCommon.wipeRegex = NetRegexes.network6d({ command: '40000010' });
EmulatorCommon.winRegex = NetRegexes.network6d({ command: '40000003' });
EmulatorCommon.cactbotWipeRegex = NetRegexes.echo({ line: 'cactbot wipe.*?' });
