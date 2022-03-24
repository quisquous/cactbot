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
  zoneName?: string;
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
        this.onEndFight(line, cZ, 'Zone Change');
      if (this.currentZone.name)
        this.onEndZone(line, this.currentZone.name, cZ);

      this.zoneInfo = ZoneInfo[parseInt(cZ.id, 16)];
      this.currentZone.name = cZ.name;
      if (this.skipZone()) {
        this.initializeZone();
        return;
      }
      this.onStartZone(line, this.currentZone.name, cZ);
      return;
    }

    // If no zone change is found, we next verify that we are inside a combat zone.
    if (this.skipZone() || !this.currentZone.name)
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
        this.onStartFight(line, this.currentZone.name, a.groups);
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
  onStartFight(line: string, name: string, matches: NetMatches['Ability' | 'GameLog']): void {
    this.currentFight = {
      name: name,
      zoneName: this.currentZone.name, // Sometimes the same as the fight name, but that's fine.
      startLine: line,
      startTime: this.dateFromMatches(matches),
    };
  }

  onEndZone(_line: string, _name: string, _matches: NetMatches['ChangeZone']): void {
    this.initializeZone();
  }

  onEndFight(_line: string, _matches: NetAnyMatches, _endType: string): void {
    this.initializeFight();
  }

  onSeal(line: string, name: string, matches: NetMatches['GameLog']): void {
    this.onStartFight(line, name, matches);
    this.currentSeal = name;
    this.haveSeenSeals = true;
  }

  onUnseal(line: string, matches: NetMatches['GameLog']): void {
    this.onEndFight(line, matches, 'Unseal');
    this.currentSeal = undefined;
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
  lastSeal?: string;
  constructor() {
    super();
  }

  override onEndZone(line: string, _name: string, matches: NetMatches['ChangeZone']): void {
    this.currentZone.endLine = line;
    this.currentZone.endTime = this.dateFromMatches(matches);
    this.zones.push(this.currentZone);
    this.initializeZone();
  }

  override onStartFight(line: string, name: string, matches: NetMatches['Ability' | 'GameLog']): void {
    this.currentFight = {
      name: name,
      zoneName: this.currentZone.name,
      startLine: line,
      startTime: this.dateFromMatches(matches),
      zoneId: this.currentZone.zoneId,
    };
  }

  override onEndFight(line: string, matches: NetAnyMatches, endType: string): void {
    this.currentFight.endLine = line;
    this.currentFight.endTime = this.dateFromMatches(matches);
    this.currentFight.endType = endType;
    this.fights.push(this.currentFight);
    this.initializeFight();
  }

  override onSeal(line: string, name: string, matches: NetMatches['GameLog']): void {
    this.onStartFight(line, name, matches);
    this.haveSeenSeals = true;
    this.lastSeal = name;
    this.currentFight.sealName = this.lastSeal;
  }

  override onUnseal(line: string, matches: NetMatches['GameLog']): void {
    this.onEndFight(line, matches, 'Unseal');
    this.lastSeal = undefined;
  }
}
