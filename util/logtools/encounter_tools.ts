import { Console } from 'console';
import { Transform } from 'stream';

import ContentType from '../../resources/content_type';
import NetRegexes from '../../resources/netregexes';
import { UnreachableCode } from '../../resources/not_reached';
import ZoneInfo from '../../resources/zone_info';
import { NetMatches, NetAnyMatches } from '../../types/net_matches';
import { CactbotBaseRegExp } from '../../types/net_trigger';
import { commonReplacement, syncKeys } from '../../ui/raidboss/common_replacement';

// TODO: add some error checking that a zone has been found before a fight.
// This can happen on partial logs.

type ZoneEncInfo = {
  zoneName?: string;
  zoneId?: number;
  startLine?: string;
  endLine?: string;
  startTime?: Date;
  endTime?: Date;
};

type FightEncInfo = ZoneEncInfo & {
  fightName?: string;
  endType?: string;
  sealName?: string;
  logLines?: string[];
};

const fixedTable = (data: { [index: number]: { [index: string]: string } }): void => {
  // Original console output interception and rewriting technique by Brickshot
  // See https://stackoverflow.com/a/69874540
  const ts = new Transform({
    transform(chunk, _enc, cb) {
      cb(null, chunk);
    }
  });
  const logger = new Console({ stdout: ts });
  logger.table(data);
  const tsRead = ts.read() as Buffer;
  let result = '';
  for (const row of tsRead.toString().split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    // console.table emits a pipe character with identifier u2502,
    // rather than the standard u7C.
    // If we naively just do /['"](\s+\|/ and aren't explicit about it,
    // there's too much chance one of the consuming applications will get it wrong.
    r = r.replace(/['"](\s+\u2502)/g, ' $1');
    r = r.replace(/(\u2502\s+)['"]/g, '$1 ');
    result += `${r}\n`;
  }
  console.log(result);
};

export class EncounterFinder {
  currentZone: ZoneEncInfo = {};
  currentFight: FightEncInfo = {};
  currentSeal?: string;
  zoneInfo?: typeof ZoneInfo[number];

  haveWon = false;
  haveSeenSeals = false;

  regex: {
    changeZone: CactbotBaseRegExp<'ChangeZone'>;
    cactbotWipe: CactbotBaseRegExp<'GameLog'>;
    win: CactbotBaseRegExp<'ActorControl'>;
    wipe: CactbotBaseRegExp<'ActorControl'>;
    commence: CactbotBaseRegExp<'ActorControl'>;
    playerAttackingMob: CactbotBaseRegExp<'Ability'>;
    mobAttackingPlayer: CactbotBaseRegExp<'Ability'>;
  };

  sealRegexes: Array<CactbotBaseRegExp<'GameLog'>> = [];
  unsealRegexes: Array<CactbotBaseRegExp<'GameLog'>> = [];

  initializeZone(): void {
    this.currentZone = {};
    this.zoneInfo = undefined;
    this.haveWon = false;
    this.haveSeenSeals = false;
  }
  initializeFight(): void {
    this.currentFight = {};
  }
  constructor() {
    this.regex = {
      changeZone: NetRegexes.changeZone(),
      cactbotWipe: NetRegexes.echo({ line: 'cactbot wipe.*?' }),
      win: NetRegexes.network6d({ command: '40000003' }),
      wipe: NetRegexes.network6d({ command: '40000010' }),
      commence: NetRegexes.network6d({ command: '4000000[16]' }),
      playerAttackingMob: NetRegexes.ability({ sourceId: '1.{7}', targetId: '4.{7}' }),
      mobAttackingPlayer: NetRegexes.ability({ sourceId: '4.{7}', targetId: '1.{7}' }),
    };

    const sealReplace = commonReplacement.replaceSync[syncKeys.seal];
    if (!sealReplace)
      throw new Error('missing seal regex');
    for (const regexString of Object.values(sealReplace)) {
      const line = `${regexString?.replace('$1', '(?<seal>.*?)')}.*?`;
      this.sealRegexes.push(NetRegexes.message({ line: line }));
    }

    const unsealReplace = commonReplacement.replaceSync[syncKeys.unseal];
    if (!unsealReplace)
      throw new Error('missing unseal regex');
    for (const lang of Object.values(unsealReplace)) {
      const line = `.*?${lang}.*?`;
      this.unsealRegexes.push(NetRegexes.message({ line: line }));
    }
  }

  skipZone(): boolean {
    // We don't want combat from the overworld or from solo instanced duties.
    // However, if we can't find zone info, we explicitly don't skip it.
    if (!this.zoneInfo)
      return false;
    const content = this.zoneInfo.contentType;
    if (!content)
      return false;

    // There are some seal messages in older raids, but not consistently.
    // Therefore, we can't require them.
    const keepTypes: Array<number> = [
      ContentType.Dungeons,
      ContentType.Eureka,
      ContentType.Raids,
      ContentType.Trials,
      ContentType.UltimateRaids,
      ContentType.DeepDungeons,
    ];

    return !keepTypes.includes(content);
  }

  process(line: string, store: boolean): void {
    // Irrespective of any processing that occurs, we want to store every line of an encounter.
    // This allows us to save a pass when making timelines.
    if (store && this.currentFight.startTime !== undefined) {
      this.currentFight.logLines = this.currentFight.logLines ?? [];
      this.currentFight.logLines?.push(line);
    }

    const cZ = this.regex.changeZone.exec(line)?.groups;
    if (cZ) {
      if (this.currentZone.zoneName === cZ.name) {
        // Zoning into the same zone, possibly a d/c situation.
        // Don't stop anything?
        return;
      }

      // If we changed zones, we have definitely stopped fighting.
      // Therefore we can safely initialize everything.
      if (this.currentFight.startTime)
        this.onEndFight(line, cZ, 'Zone Change');
      if (this.currentZone.zoneName)
        this.onEndZone(line, this.currentZone.zoneName, cZ);

      this.zoneInfo = ZoneInfo[parseInt(cZ.id, 16)];
      this.currentZone.zoneName = cZ.name;
      if (this.skipZone()) {
        this.initializeZone();
        return;
      }
      this.onStartZone(line, this.currentZone.zoneName, cZ);
      return;
    }

    // If no zone change is found, we next verify that we are inside a combat zone.
    if (this.skipZone() || !this.currentZone.zoneName)
      return;

    // We are in a combat zone, so we next check for victory/defeat.
    // If either is found, end the current encounter.
    // However, *if* seals are present, we want to use them to end the current encounter,
    // rather than using combat status.
    const cW = this.regex.cactbotWipe.exec(line)?.groups;
    if (cW) {
      if (this.currentFight.startTime && !this.haveSeenSeals)
      this.onEndFight(line, cW, 'Wipe');
      return;
    }

    const wipe = this.regex.wipe.exec(line)?.groups;
    if (wipe) {
      if (this.currentFight.startTime && !this.haveSeenSeals)
      this.onEndFight(line, wipe, 'Wipe');
      return;
    }

    const win = this.regex.win.exec(line)?.groups;
    if (win) {
      if (this.currentFight.startTime && !this.haveSeenSeals) {
        this.haveWon = true;
        this.onEndFight(line, win, 'Win');
      }
      return;
    }

    // Once we see a seal, we know that we will be falling through to here throughout the zone.
    for (const regex of this.sealRegexes) {
      const s = regex.exec(line)?.groups;
      if (s) {
        const seal = s.seal ?? 'UNKNOWN';
        this.onSeal(line, seal, s);
      }
    }

    for (const regex of this.unsealRegexes) {
      const u = regex.exec(line)?.groups;
      if (u)
        this.onUnseal(line, u);
    }

    // Most dungeons and some older raid content have zone zeals that indicate encounters.
    // If they don't, we need to start encounters by looking for combat.
    if (!(this.currentFight.startTime || this.haveWon || this.haveSeenSeals)) {
      let a = this.regex.playerAttackingMob.exec(line);
      if (!a)
      // TODO: This regex catches faerie healing and could potentially give false positives!
        a = this.regex.mobAttackingPlayer.exec(line);
      if (a?.groups) {
        this.onStartFight(line, this.currentZone.zoneName, a.groups);
        return;
      }
    }
  }

  // start/endZone always bracket all fights and seals.
  // All starts and ends of the same type are ordered and do not nest.
  // Fights and seal start/end may interleave with each other.
  // TODO: probably this should follow an "event bus" model instead of requiring derived classes.
  onStartZone(line: string, zoneName: string, matches: NetMatches['ChangeZone']): void {
    this.currentZone = {
      zoneName: zoneName,
      startLine: line,
      zoneId: parseInt(matches.id),
      startTime: TLFuncs.dateFromMatches(matches),
    };
  }
  onStartFight(line: string, fightName: string, matches: NetMatches['Ability' | 'GameLog']): void {
    this.currentFight = {
      fightName: fightName,
      zoneName: this.currentZone.zoneName, // Sometimes the same as the fight name, but that's fine.
      startLine: line,
      startTime: TLFuncs.dateFromMatches(matches),
    };
  }

  onEndZone(_line: string, _zoneName: string, _matches: NetMatches['ChangeZone']): void {
    this.initializeZone();
  }

  onEndFight(_line: string, _matches: NetAnyMatches, _endType: string): void {
    this.initializeFight();
  }

  onSeal(line: string, sealName: string, matches: NetMatches['GameLog']): void {
    this.onStartFight(line, sealName, matches);
    this.currentSeal = sealName;
    this.haveSeenSeals = true;
  }

  onUnseal(line: string, matches: NetMatches['GameLog']): void {
    this.onEndFight(line, matches, 'Unseal');
    this.currentSeal = undefined;
  }
}

class EncounterCollector extends EncounterFinder {
  zones: Array<ZoneEncInfo> = [];
  fights: Array<FightEncInfo> = [];
  lastSeal?: string;
  constructor() {
    super();
  }

  override onEndZone(line: string, _zoneName: string, matches: NetMatches['ChangeZone']): void {
    this.currentZone.endLine = line;
    this.currentZone.endTime = TLFuncs.dateFromMatches(matches);
    this.zones.push(this.currentZone);
    this.initializeZone();
  }

  override onStartFight(line: string, fightName: string, matches: NetMatches['Ability' | 'GameLog']): void {
    this.currentFight = {
      fightName: fightName,
      zoneName: this.currentZone.zoneName,
      startLine: line,
      startTime: TLFuncs.dateFromMatches(matches),
      zoneId: this.currentZone.zoneId,
    };
  }

  override onEndFight(line: string, matches: NetAnyMatches, endType: string): void {
    this.currentFight.endLine = line;
    this.currentFight.endTime = TLFuncs.dateFromMatches(matches);
    this.currentFight.endType = endType;
    this.fights.push(this.currentFight);
    this.initializeFight();
  }

  override onSeal(line: string, sealName: string, matches: NetMatches['GameLog']): void {
    this.onStartFight(line, sealName, matches);
    this.haveSeenSeals = true;
    this.lastSeal = sealName;
    this.currentFight.sealName = this.lastSeal;
  }

  override onUnseal(line: string, matches: NetMatches['GameLog']): void {
    this.onEndFight(line, matches, 'Unseal');
    this.lastSeal = undefined;
  }
}

class TLFuncs {
  static dateFromMatches(matches: NetAnyMatches): Date {
    // No current match definitions are missing a timestamp,
    // but in the event any are added without in future, we will be ready!
    if (!matches.timestamp)
      throw new UnreachableCode();
    return new Date(Date.parse(matches.timestamp));
  }
  static timeFromDate(date?: Date): string {
    if (date) {
      const wholeTime = date.toLocaleTimeString('en-US', { hour12: false });
      const milliseconds = date.getMilliseconds();
      // If milliseconds is under 100, the leading zeroes will be truncated.
      // We don't want that, so we pad it inside the formatter.
      return `${wholeTime}.${milliseconds.toString().padStart(3, '0')}`;
    }
    return 'Unknown_Time';
  }

  static dayFromDate(date?: Date): string {
    if (date)
      return date.toISOString().slice(0, 10);
    return 'Unknown_Date';
  }

  static durationFromDates(start?: Date, end?: Date): string {
    if (start === undefined || end === undefined)
      return 'Unknown_Duration';
    const ms = end.valueOf() - start.valueOf();
    const totalSeconds = Math.round(ms / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    if (totalMinutes > 0)
      return totalMinutes.toString() + 'm';
    return (totalSeconds % 60).toString() + 's';
  }

  static toProperCase(str: string): string {
    return str.split(' ').map((str) => {
      const cap = str[0]?.toUpperCase();
      const lower = str.slice(1);
      if (cap)
        return `${cap}${lower}`;
    }).join(' ');
  }

  static leftExtendStr(str?: string, length?: number): string {
    if (str === undefined)
      return '';
    if (length === undefined)
      return str;
    return str.padStart(length, ' ');
  }

  static rightExtendStr(str?: string, length?: number): string {
    if (str === undefined)
      return '';
    if (length === undefined)
      return str;
    return str.padEnd(length, ' ');
  }

  static generateFileName(fightOrZone: FightEncInfo | ZoneEncInfo): string {
    const zoneName = fightOrZone.zoneName ?? 'Unknown_Zone';
    const dateStr = TLFuncs.dayFromDate(fightOrZone.startTime).replace(/-/g, '');
    const timeStr = TLFuncs.timeFromDate(fightOrZone.startTime).replace(/:/g, '');
    const duration = TLFuncs.durationFromDates(fightOrZone.startTime, fightOrZone.endTime);
    let seal;
    if ('sealName' in fightOrZone)
      seal = fightOrZone['sealName'];
    if (seal)
      seal = '_' + TLFuncs.toProperCase(seal).replace(/[^A-z0-9]/g, '');
    else
      seal = '';
    let wipeStr = '';
    if ('endType' in fightOrZone)
      wipeStr = fightOrZone.endType === 'Wipe' ? '_wipe' : '';
    return `${zoneName}${seal}_${dateStr}_${timeStr}_${duration}${wipeStr}.log`;
  }

// For an array of arrays, return an array where each value is the max length at that index
// among all of the inner arrays, e.g. find the max length per field of an array of rows.
  static maxLengthPerIndex(outputRows: Array<Array<string>>): Array<number> {
    const outputSizes = outputRows.map((row) => row.map((field) => field.length));
    return outputSizes.reduce((max, row) => {
      return max.map((val, idx) => {
        const indexed = row[idx];
        if (indexed !== undefined)
          return Math.max(val, indexed);
        return val;
     });
    });
  }

  static printCollectedZones(collector: EncounterCollector): void {
    let idx = 1;
    const outputRows: { [index: number]: { [index: string]: string } } = {};
    for (const zone of collector.zones) {
      const zoneName = zone.zoneName ?? 'Unknown_Zone';
      const startDate = zone.startTime ? TLFuncs.dayFromDate(zone.startTime) : 'Unknown_Date';
      const startTime = zone.startTime ? TLFuncs.timeFromDate(zone.startTime) : 'Unknown_Start';
      const duration = TLFuncs.durationFromDates(zone.startTime, zone.endTime);

      const row = {
        'Index': idx.toString(),
        'Start Date': startDate,
        'Start Time': startTime,
        'Duration': duration,
        'Zone Name': zoneName,
      };
      outputRows[idx] = row;
      idx++;
    }

    if (Object.keys(outputRows).length === 0)
      return;
    fixedTable(outputRows);
    }

  static printCollectedFights = (collector: EncounterCollector): void => {
    let idx = 1;
    const outputRows: { [index: number]: { [index: string]: string } } = {};
    let seenSeal = false;
    for (const fight of collector.fights) {
      const startDate = fight.startTime ? TLFuncs.dayFromDate(fight.startTime) : 'Unknown Date';
      const startTime = fight.startTime ? TLFuncs.timeFromDate(fight.startTime) : 'Unknown Start';
      const fightDuration = TLFuncs.durationFromDates(fight.startTime, fight.endTime) ?? 'Unknown Duration';
      let fightName = 'Unknown Encounter';
      if (fight.sealName)
        fightName = fight.sealName;
      else if (fight.fightName)
        fightName = fight.fightName;

      if (!seenSeal && fight.sealName)
        seenSeal = true;
       else if (seenSeal && !fight.sealName)
        seenSeal = false;

      const row = {
        'Index': idx.toString(),
        'Start Date': startDate,
        'Start Time': startTime,
        'Duration': fightDuration,
        'Zone Name': fight.zoneName ?? 'Unknown Zone',
        'Encounter Name': fightName,
        'End Type': fight.endType ?? 'Unknown End Type',
      };
      outputRows[idx] = row;
      idx++;
    }

    if (Object.keys(outputRows).length === 0)
      return;

    fixedTable(outputRows);
  };
}

export { EncounterCollector, TLFuncs, ZoneEncInfo, FightEncInfo };
