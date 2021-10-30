import ContentType from '../../resources/content_type';
import NetRegexes from '../../resources/netregexes';
import { data as ZoneInfo, ZoneInfoType } from '../../resources/zone_info';
import { CactbotBaseRegExp } from '../../types/net_trigger';
import { LocaleText } from '../../types/trigger';
import { commonReplacement, syncKeys } from '../../ui/raidboss/common_replacement';

// TODO: add some error checking that a zone has been found before a fight.
// This can happen on partial logs.

export class EncounterFinder {
  currentZone: {
    name: string | null;
    startLine: string | null;
    zoneId: number | null;
    startTime: Date | null;
  };
  currentFight: string | null;
  currentSeal: string | null;
  zoneInfo: {
    readonly exVersion: number;
    readonly contentType?: number;
    readonly name: LocaleText;
    readonly offsetX: number;
    readonly offsetY: number;
    readonly sizeFactor: number;
    readonly weatherRate: number;
  } | null;

  haveWon: boolean;
  haveSeenSeals: boolean;

  regex: {
    changeZone: CactbotBaseRegExp<'ChangeZone'>;
    cactbotWipe: CactbotBaseRegExp<'GameLog'>;
    win: CactbotBaseRegExp<'ActorControl'>;
    wipe: CactbotBaseRegExp<'ActorControl'>;
    commence: CactbotBaseRegExp<'ActorControl'>;
    playerAttackingMob: CactbotBaseRegExp<'Ability'>;
    mobAttackingPlayer: CactbotBaseRegExp<'Ability'>;
  };

  sealRegexes: Array<CactbotBaseRegExp<'GameLog'>>;
  unsealRegexes: Array<CactbotBaseRegExp<'GameLog'>>;

  initializeZone(): void {
    this.currentZone = {
      name: null,
      startLine: null,
      zoneId: null,
      startTime: null,
    };
  }
  constructor() {
    this.currentZone = {
      name: null,
      startLine: null,
      zoneId: null,
      startTime: null,
    };
    this.currentFight = null;
    this.currentSeal = null;
    // May be null for some zones.
    this.zoneInfo = null;

    this.haveWon = false;
    this.haveSeenSeals = false;

    this.regex = {
      changeZone: NetRegexes.changeZone({ id: '*' }),
      cactbotWipe: NetRegexes.echo({ line: 'cactbot wipe.*?' }),
      win: NetRegexes.network6d({ command: '40000003' }),
      wipe: NetRegexes.network6d({ command: '40000010' }),
      commence: NetRegexes.network6d({ command: '4000000[16]' }),
      playerAttackingMob: NetRegexes.ability({ sourceId: '1.{7}', targetId: '4.{7}' }),
      mobAttackingPlayer: NetRegexes.ability({ sourceId: '4.{7}', targetId: '1.{7}' }),
    };

    // TODO: consider also doing this with lang? But lang only deals with Regexes???
    // Sorry, this is quite a bit of a hack.
    this.sealRegexes = [];
    this.unsealRegexes = [];

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
    if (this?.currentZone?.zoneId === null || this.zoneInfo === null)
      return false;
    const info = this.zoneInfo;
    if ((info?.contentType) === null)
      return false;
    const content = info?.contentType;
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
    const cZ = this.regex.changeZone.exec(line);
    if (cZ?.groups) {
      if (this?.currentZone?.name === cZ.groups.name) {
        // Zoning into the same zone, possibly a d/c situation.
        // Don't stop anything?
        return;
      }

      if (this.currentFight !== null) {
        this.onEndFight(line, this.currentFight, { ...cZ.groups, endType: 'Zone' });
        this.currentFight = null;
      }
      if (this.currentZone !== null) {
        this.onEndZone(line, this.currentZone.name, cZ.groups);
        this.initializeZone();
      }

      this.haveWon = false;
      this.haveSeenSeals = false;
      this.zoneInfo = ZoneInfo[parseInt(cZ.groups.id, 16)] || null;
      if (this.skipZone()) {
        this.initializeZone();
        return;
      }

      this.currentZone.name = cZ.groups.name;
      this.onStartZone(line, this.currentZone.name, cZ.groups);
      return;
    }

    if (this.skipZone())
      return;

    const cW = this.regex.cactbotWipe.exec(line);
    if (cW?.groups) {
      if (this.currentFight !== null) {
        this.onEndFight(line, this.currentFight, { ...cW.groups, endType: 'CactbotWipe' });
        this.currentFight = null;
      }
      return;
    }

    const wipe = this.regex.wipe.exec(line);
    if (wipe?.groups) {
      if (this.currentFight !== null) {
        this.onEndFight(line, this.currentFight, { ...wipe.groups, endType: 'Wipe' });
        this.currentFight = null;
      }
      return;
    }

    const win = this.regex.win.exec(line);
    if (win?.groups) {
      if (this.currentFight !== null) {
        this.haveWon = true;
        this.onEndFight(line, this.currentFight, { ...win.groups, endType: 'Win' });
        this.currentFight = null;
      }
      return;
    }

    if (this.currentFight === null && !this.haveWon && !this.haveSeenSeals) {
      let a = this.regex.playerAttackingMob.exec(line);
      if (!a)
        a = this.regex.mobAttackingPlayer.exec(line);
      if (a?.groups) {
        // TODO: maybe we should come up with a better name here?
        this.currentFight = this.currentZone.name;
        this.onStartFight(line, this.currentFight, a.groups);
        return;
      }
    }

    for (const regex of this.sealRegexes) {
      const s = regex.exec(line);
      if (s?.groups?.name) {
        this.haveSeenSeals = true;
        this.currentSeal = s.groups?.name;
        this.onSeal(line, this.currentSeal, s.groups);

        this.currentFight = this.currentZone.name;
        this.onStartFight(line, this.currentFight, s.groups);
        return;
      }
    }

    for (const regex of this.unsealRegexes) {
      const u = regex.exec(line);
      if (u) {
        this.onUnseal(line, this.currentSeal, u.groups);
        this.currentSeal = null;

        if (this.currentFight) {
          this.onEndFight(line, this.currentFight, { ...u.groups, endType: 'Unseal' });
          this.currentFight = null;
        }
        return;
      }
    }
  }

  // start/endZone always bracket all fights and seals.
  // All starts and ends of the same type are ordered and do not nest.
  // Fights and seal start/end may interleave with each other.
  // TODO: probably this should follow an "event bus" model instead of requiring derived classes.
  onStartZone(line: string, name: string, matches: RegExpMatchArray): void {
    this.currentZone = {
      name: name,
      startLine: line,
      zoneId: matches.id,
      startTime: this.dateFromMatches(matches),
    };
  }
  onEndZone(line, name, matches): void {}
  onStartFight(line, name, matches): void {}
  onEndFight(line, name, matches): void {}
  onSeal(line: string, name: string, matches: NetRegexes): void {
    this.currentSeal = true;
  }
  onUnseal(line, name, matches) {}

  dateFromMatches(matches: RegExpMatchArray): Date {
    return new Date(Date.parse(matches.timestamp));
  }
}

export class EncounterCollector extends EncounterFinder {
  zones: Array<LocaleText>;
  fights: Array<LocaleText>;
  lastZone: ZoneInfoType | null;
  lastFight: LocaleText | null;
  lastSeal: NetRegexes | null;
  constructor() {
    super();
    this.zones = [];
    this.fights = [];

    this.lastZone = null;
    this.lastFight = null;
    this.lastSeal = null;
  }

  onEndZone(line, name, matches) {
    this.lastZone.endLine = line;
    this.lastZone.endTime = this.dateFromMatches(matches);

    this.zones.push(this.lastZone);
    this.lastZone = null;
  }

  onStartFight(line, name, matches) {
    this.lastFight = {
      name: name,
      startLine: line,
      startTime: this.dateFromMatches(matches),
      zoneId: this.lastZone ? this.lastZone.zoneId : 0,
      sealName: this.lastSeal,
    };
    this.lastSeal = null;
  }

  onEndFight(line, name, matches): void {
    this.lastFight.endLine = line;
    this.lastFight.endTime = this.dateFromMatches(matches);
    this.lastFight.endType = matches.endType;

    this.fights.push(this.lastFight);
    this.lastFight = null;
  }

  onSeal(line, name, matches) {
    this.lastSeal = name;
    if (this.lastFight)
      this.lastFight.sealName = this.lastSeal;
  }

  onUnseal(line: string, name, matches): void {
    this.lastSeal = null;
  }
}
