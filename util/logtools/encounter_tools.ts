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
  name?: string;
  zoneId?: number;
  startLine?: string;
  endLine?: string;
  startTime?: Date;
  endTime?: Date;
};

type FightEncInfo = {
  name?: string;
  zoneId?: number;
  startLine?: string;
  endLine?: string;
  startTime?: Date;
  endTime?: Date;
  endType?: string;
  sealName?: string;
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
      const line = `*.?${lang}.*?`;
      this.unsealRegexes.push(NetRegexes.message({ line: line }));
    }
  }

  skipZone(): boolean {
    if (!this.currentZone.zoneId || !this.zoneInfo)
      return false;
    if (!(this.zoneInfo.contentType))
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

  process(line: string): void {
    const cZ = this.regex.changeZone.exec(line)?.groups;
    if (cZ) {
      if (this.currentZone.name === cZ.name) {
        // Zoning into the same zone, possibly a d/c situation.
        // Don't stop anything?
        return;
      }

      // If we changed zones, we have definitely stopped fighting.
      // Therefore we can safely initialize everything.
      if (this.currentFight.startTime)
        this.initializeFight();
      if (this.currentZone.startTime)
        this.initializeZone();

      this.haveWon = false;
      this.haveSeenSeals = false;
      this.zoneInfo = ZoneInfo[parseInt(cZ.id, 16)];
      if (this.skipZone()) {
        this.initializeZone();
        return;
      }

      this.currentZone.name = cZ.name;
      this.onStartZone(line, this.currentZone.name, cZ);
      return;
    }

    if (this.skipZone() || !this.currentZone.name)
      return;

    const cW = this.regex.cactbotWipe.exec(line);
    if (cW) {
      if (this.currentFight.startTime)
        this.initializeFight();
      return;
    }

    const wipe = this.regex.wipe.exec(line);
    if (wipe) {
      if (this.currentFight.startTime)
        this.initializeFight();
      return;
    }

    const win = this.regex.win.exec(line);
    if (win) {
      if (this.currentFight.startTime) {
        this.haveWon = true;
        this.initializeFight();
      }
      return;
    }

    if (!(this.currentFight.startTime || this.haveWon || this.haveSeenSeals)) {
      let a = this.regex.playerAttackingMob.exec(line);
      if (!a)
        a = this.regex.mobAttackingPlayer.exec(line);
      if (a?.groups) {
        this.onStartFight(line, this.currentZone.name, a.groups);
        return;
      }
    }

    for (const regex of this.sealRegexes) {
      const s = regex.exec(line)?.groups;
      if (s) {
        this.haveSeenSeals = true;
        this.currentSeal = s.name;
        this.onStartFight(line, this.currentSeal, s);
        return;
      }
    }

    for (const regex of this.unsealRegexes) {
      const u = regex.exec(line);
      if (u) {
        this.currentSeal = undefined;
        if (this.currentFight)
          this.initializeFight();
        return;
      }
    }
  }

  // start/endZone always bracket all fights and seals.
  // All starts and ends of the same type are ordered and do not nest.
  // Fights and seal start/end may interleave with each other.
  // TODO: probably this should follow an "event bus" model instead of requiring derived classes.
  onStartZone(line: string, name: string, matches: NetMatches['ChangeZone']): void {
    this.currentZone = {
      name: name,
      startLine: line,
      zoneId: parseInt(matches.id),
      startTime: this.dateFromMatches(matches),
    };
  }
  onStartFight(line: string, name: string, matches: NetAnyMatches): void {
    this.currentFight = {
      name: name,
      startLine: line,
      startTime: this.dateFromMatches(matches),
    };
  }

  dateFromMatches(matches: NetAnyMatches): Date {
    // No current match definitions are missing a timestamp,
    // but in the event any are added without in future, we will be ready!
    if (!matches.timestamp)
      throw new UnreachableCode();
    return new Date(Date.parse(matches.timestamp));
  }
}

export class EncounterCollector extends EncounterFinder {
  zones: Array<ZoneEncInfo> = [];
  fights: Array<FightEncInfo> = [];
  lastZone: ZoneEncInfo = {};
  lastFight: FightEncInfo = {};
  lastSeal?: string;
  constructor() {
    super();
  }

  override onStartZone(line: string, name: string, matches: NetMatches['ChangeZone']): void {
    this.lastZone = {
      name: name,
      startLine: line,
      zoneId: parseInt(matches.id),
      startTime: this.dateFromMatches(matches),
    };
  }

  onEndZone(line: string, matches: NetMatches['ChangeZone']): void {
    this.lastZone.endLine = line;
    this.lastZone.endTime = this.dateFromMatches(matches);
    this.zones.push(this.lastZone);
    this.lastZone = {};
  }

  override onStartFight(line: string, name: string, matches: NetMatches['Ability' | 'GameLog']): void {
    const id = this.lastZone.zoneId ?? 0;
    this.lastFight = {
      name: name,
      startLine: line,
      startTime: this.dateFromMatches(matches),
      zoneId: id,
    };
    this.lastSeal = undefined;
  }

  onEndFight(line: string, matches: NetAnyMatches): void {
    this.lastFight.endLine = line;
    this.lastFight.endTime = this.dateFromMatches(matches);
    this.lastFight.endType = matches.endType;

    this.fights.push(this.lastFight);
    this.lastFight = {};
  }

  onSeal(line: string, name: string, matches: NetMatches['GameLog']): void {
    this.onStartFight(line, name, matches);
    this.lastSeal = name;
    if (this.lastFight)
      this.lastFight.sealName = this.lastSeal;
  }

  onUnseal(line: string, matches: NetMatches['GameLog']): void {
    this.onEndFight(line, matches);
    this.lastSeal = undefined;
  }
}
