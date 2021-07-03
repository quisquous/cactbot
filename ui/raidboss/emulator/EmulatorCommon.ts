import { Lang } from '../../../resources/languages';
import NetRegexes from '../../../resources/netregexes';
import { UnreachableCode } from '../../../resources/not_reached';
import { LocaleNetRegex } from '../../../resources/translations';
import { CactbotBaseRegExp, CactbotRegExpExecArray, TriggerTypes } from '../../../types/net_trigger';

// Disable no-explicit-any for cloneData as it needs to work on raw objects for performance reasons.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataType = { [key: string]: any } | null;

export type MatchStartInfo = {
  StartIn: string;
  StartType: string;
  language?: string | undefined;
};

export type MatchEndInfo = {
  EndType: string;
  language?: string | undefined;
};

export const querySelectorSafe = (node: ParentNode, sel: string): HTMLElement => {
  const ret = node.querySelector(sel);
  if (!(ret instanceof HTMLElement))
    throw new UnreachableCode();
  return ret;
};

export const querySelectorAllSafe = (node: ParentNode, sel: string): HTMLElement[] => {
  const ret = [...node.querySelectorAll(sel)].map((elem) => {
    if (!(elem instanceof HTMLElement))
      throw new UnreachableCode();
    return elem;
  });
  return ret;
};

export const getTemplateChild = (node: ParentNode, sel: string): HTMLElement => {
  const template = querySelectorSafe(node, sel);
  if (!(template instanceof HTMLTemplateElement))
    throw new UnreachableCode();
  const ret = template.content.firstElementChild;
  if (!ret)
    throw new UnreachableCode();
  if (!(ret instanceof HTMLElement))
    throw new UnreachableCode();
  return ret;
};

export const cloneSafe = (node: HTMLElement): HTMLElement => {
  const cloned = node.cloneNode(true);
  if (!(cloned instanceof HTMLElement))
    throw new UnreachableCode();
  return cloned;
};

export default class EmulatorCommon {
  static cloneData(data: DataType, exclude = ['options', 'party']): DataType {
    const ret: DataType = {};

    // Use extra logic for top-level extend for property exclusion
    // This cut the execution time of this code from 41,000ms to 50ms when parsing a 12 minute pull
    for (const i in data) {
      if (exclude.includes(i))
        continue;

      if (typeof data[i] === 'object') {
        // Cloning any. See DataType definition above for reasoning.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ret[i] = EmulatorCommon._cloneData(data[i]);
        continue;
      }

      // Assignment of any to any. See DataType definition above for reasoning.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ret[i] = data[i];
    }
    return ret;
  }

  static _cloneData(data: DataType): DataType {
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        const ret = [];
        for (let i = 0; i < data.length; ++i) {
          // Cloning any. See DataType definition above for reasoning.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          ret[i] = EmulatorCommon._cloneData(data[i]);
        }

        return ret;
      }

      if (data === null)
        return null;

      if (data instanceof RegExp)
        return new RegExp(data);

      const ret: DataType = {};
      for (const i in data) {
        // Cloning any. See DataType definition above for reasoning.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ret[i] = EmulatorCommon._cloneData(data[i]);
      }

      return ret;
    }
    return data;
  }

  static timeToString(time: number, includeMillis = true): string {
    const negative = time < 0 ? '-' : '';
    time = Math.abs(time);
    const millisNum = time % 1000;
    const secsNum = ((time % (60 * 1000)) - millisNum) / 1000;
    // Milliseconds
    const millis = `00${millisNum}`.substr(-3);
    const secs = `0${secsNum}`.substr(-2);
    const mins = `0${((((time % (60 * 60 * 1000)) - millisNum) / 1000) - secsNum) / 60}`.substr(-2);
    return negative + mins + ':' + secs + (includeMillis ? '.' + millis : '');
  }

  static timeToDateString(time: number): string {
    return this.dateObjectToDateString(new Date(time));
  }

  static dateObjectToDateString(date: Date): string {
    const year = date.getFullYear();
    const month = EmulatorCommon.zeroPad((date.getMonth() + 1).toString());
    const day = EmulatorCommon.zeroPad(date.getDate().toString());
    return `${year}-${month}-${day}`;
  }

  static timeToTimeString(time: number, includeMillis = false): string {
    return this.dateObjectToTimeString(new Date(time), includeMillis);
  }

  static dateObjectToTimeString(date: Date, includeMillis = false): string {
    const hour = EmulatorCommon.zeroPad(date.getHours().toString());
    const minute = EmulatorCommon.zeroPad(date.getMinutes().toString());
    const second = EmulatorCommon.zeroPad(date.getSeconds().toString());
    let ret = `${hour}:${minute}:${second}`;
    if (includeMillis)
      ret = ret + `.${date.getMilliseconds()}`;

    return ret;
  }

  static msToDuration(ms: number): string {
    const tmp = EmulatorCommon.timeToString(ms, false);
    return tmp.replace(':', 'm') + 's';
  }

  static dateTimeToString(time: number, includeMillis = false): string {
    const date = new Date(time);
    return `${this.dateObjectToDateString(date)} ${this.dateObjectToTimeString(date, includeMillis)}`;
  }

  static zeroPad(str: string, len = 2): string {
    return ('' + str).padStart(len, '0');
  }

  static properCase(str: string): string {
    return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  static spacePadLeft(str: string, len: number): string {
    return str.padStart(len, ' ');
  }

  static doesLineMatch<T extends TriggerTypes>(line: string,
      regexes: Record<Lang, RegExp> | RegExp | CactbotBaseRegExp<T>):
      RegExpExecArray | CactbotRegExpExecArray<T> | null {
    if (regexes instanceof RegExp)
      return regexes.exec(line);

    for (const langStr in regexes) {
      const lang = langStr as keyof typeof regexes;
      const res = regexes[lang].exec(line);
      if (res) {
        if (res.groups)
          res.groups.language = lang;
        return res;
      }
    }
    return null;
  }

  static matchStart(line: string): MatchStartInfo | undefined {
    let res;
    // Currently all of these regexes have groups if they match at all,
    // but be robust to that changing in the future.
    res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.countdownRegexes);
    if (res) {
      return {
        StartIn: (parseInt(res.groups?.time ?? '0') * 1000).toString(),
        StartType: 'Countdown',
        language: res.groups?.language ?? undefined,
      };
    }
    res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.sealRegexes);
    if (res) {
      return {
        StartIn: '0',
        StartType: 'Seal',
        language: res.groups?.language ?? undefined,
      };
    }
    res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.engageRegexes);
    if (res) {
      return {
        StartIn: '0',
        StartType: 'Engage',
        language: res.groups?.language ?? undefined,
      };
    }
  }

  static matchEnd(line: string): MatchEndInfo | undefined {
    let res;
    // Currently all of these regexes have groups if they match at all,
    // but be robust to that changing in the future.
    res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.winRegex);
    if (res) {
      return {
        EndType: 'Win',
        language: res.groups?.language ?? undefined,
      };
    }
    res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.wipeRegex);
    if (res) {
      return {
        EndType: 'Wipe',
        language: res.groups?.language ?? undefined,
      };
    }
    res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.cactbotWipeRegex);
    if (res) {
      return {
        EndType: 'Cactbot Wipe',
        language: res.groups?.language ?? undefined,
      };
    }
    res = EmulatorCommon.doesLineMatch(line, EmulatorCommon.unsealRegexes);
    if (res) {
      return {
        EndType: 'Unseal',
        language: res.groups?.language ?? undefined,
      };
    }
  }

  static sealRegexes = LocaleNetRegex.areaSeal;
  static engageRegexes = LocaleNetRegex.countdownEngage;
  static countdownRegexes = LocaleNetRegex.countdownStart;
  static unsealRegexes = LocaleNetRegex.areaUnseal;
  static wipeRegex = NetRegexes.network6d({ command: '40000010' });
  static winRegex = NetRegexes.network6d({ command: '40000003' });
  static cactbotWipeRegex = NetRegexes.echo({ line: 'cactbot wipe.*?' });
}
