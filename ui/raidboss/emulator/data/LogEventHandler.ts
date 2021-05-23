import EmulatorCommon from '../EmulatorCommon';
import EventBus from '../EventBus';
import { Lang } from 'types/global';
import LineEvent from './network_log_converter/LineEvent';
import { LineEvent0x01 } from './network_log_converter/LineEvent0x01';

export default class LogEventHandler extends EventBus {
  static doesLineMatch(line: string,
      regexes: Record<Lang, RegExp> | RegExp): RegExpExecArray | null {
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

  static isMatchStart(line: string): RegExpMatchArray | false {
    let res;
    // Currently all of these regexes have groups if they match at all,
    // but be robust to that changing in the future.
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.countdownRegexes);
    if (res) {
      res.groups ??= {};
      res.groups.StartIn = (parseInt(res.groups.time ?? '0') * 1000).toString();
      res.groups.StartType = 'Countdown';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.sealRegexes);
    if (res) {
      res.groups ??= {};
      res.groups.StartIn = '0';
      res.groups.StartType = 'Seal';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.engageRegexes);
    if (res) {
      res.groups ??= {};
      res.groups.StartIn = '0';
      res.groups.StartType = 'Engage';
      return res;
    }
    return false;
  }

  static isMatchEnd(line: string): RegExpMatchArray | false {
    let res;
    // Currently all of these regexes have groups if they match at all,
    // but be robust to that changing in the future.
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.winRegex);
    if (res) {
      res.groups ??= {};
      res.groups.EndType = 'Win';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.wipeRegex);
    if (res) {
      res.groups ??= {};
      res.groups.EndType = 'Wipe';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.cactbotWipeRegex);
    if (res) {
      res.groups ??= {};
      res.groups.EndType = 'Cactbot Wipe';
      return res;
    }
    res = LogEventHandler.doesLineMatch(line, EmulatorCommon.unsealRegexes);
    if (res) {
      res.groups ??= {};
      res.groups.EndType = 'Unseal';
      return res;
    }
    return false;
  }

  public currentFight: LineEvent[] = [];
  public currentZoneName = 'Unknown';
  public currentZoneId = -1;

  parseLogs(logs: LineEvent[]): void {
    for (const lineObj of logs) {
      this.currentFight.push(lineObj);

      lineObj.offset = lineObj.timestamp - this.currentFightStart;

      const res = LogEventHandler.isMatchEnd(lineObj.networkLine);
      if (res) {
        this.endFight();
      } else if (lineObj instanceof LineEvent0x01) {
        this.currentZoneId = parseInt(lineObj.zoneId);
        this.currentZoneName = lineObj.zoneName;
        this.endFight();
      }
    }
  }

  private get currentFightStart(): number {
    return this.currentFight[0]?.timestamp ?? 0;
  }

  private get currentFightEnd(): number {
    return this.currentFight.slice(-1)[0]?.timestamp ?? 0;
  }

  endFight(): void {
    if (this.currentFight.length < 2)
      return;

    const start = new Date(this.currentFightStart).toISOString();
    const end = new Date(this.currentFightEnd).toISOString();

    console.debug(`Dispatching new fight
Start: ${start}
End: ${end}
Zone: ${this.currentZoneName}
Line Count: ${this.currentFight.length}
`);
    void this.dispatch('fight', start.substr(0, 10), this.currentZoneId, this.currentZoneName, this.currentFight);

    this.currentFight = [];
  }
}
