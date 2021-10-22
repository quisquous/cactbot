import ContentType from '../../resources/content_type';
import NetRegexes from '../../resources/netregexes';
import { data as ZoneInfo, ZoneInfoType } from '../../resources/zone_info';
import { LocaleText } from '../../types/trigger';
import { commonReplacement, syncKeys } from '../../ui/raidboss/common_replacement';


// TODO: add some error checking that a zone has been found before a fight.
// This can happen on partial logs.


export class EncounterFinder {
  currentZone: LocaleText | null;
  currentFight: LocaleText | null;
  currentSeal: boolean;
  zoneInfo: ZoneInfoType | null;
  zoneId: number | null;

  haveWon: boolean;
  haveSeenSeals: boolean;

  regex: Record<string, NetRegexes>;

  sealRegexes: Array<NetRegexes>;
  unsealRegexes: Array<NetRegexes>;
  constructor() {
    this.currentZone = null;
    this.currentFight = null;
    this.currentSeal = false;
    // May be null for some zones.
    this.zoneInfo = null;
    this.zoneId = null;

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
    if (this.zoneId === null || this.zoneInfo === null)
      return false;
    const info = this.zoneInfo;
    if ((info[this.zoneId]?.contentType) === null)
      return false;
    const content = info?.[this.zoneId]?.contentType;
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
    let m: RegExpMatchArray | null;

    m = line.match(this.regex.changeZone);
    // m = NetRegexes.changeZone(line);
    if (m) {
      if (this.currentZone === m.groups.name) {
        // Zoning into the same zone, possibly a d/c situation.
        // Don't stop anything?
        return;
      }

      if (this.currentFight !== null) {
        this.onEndFight(line, this.currentFight, { ...m.groups, endType: 'Zone' });
        this.currentFight = null;
      }
      if (this.currentZone !== null) {
        this.onEndZone(line, this.currentZone, m.groups);
        this.currentZone = null;
      }

      this.haveWon = false;
      this.haveSeenSeals = false;

      this.zoneInfo = ZoneInfo[parseInt(m.groups.id, 16)];
      if (this.skipZone()) {
        this.zoneInfo = null;
        return;
      }

      this.currentZone = m.groups.name;
      this.onStartZone(line, this.currentZone, m.groups);
      return;
    }

    if (this.skipZone())
      return;

    m = new RegExp(this.regex.cactbotWipe);
    if (m) {
      if (this.currentFight !== null) {
        this.onEndFight(line, this.currentFight, { ...m.groups, endType: 'CactbotWipe' });
        this.currentFight = null;
      }
      return;
    }

    m = line.match(this.regex.wipe);
    if (m) {
      if (this.currentFight !== null) {
        this.onEndFight(line, this.currentFight, { ...m.groups, endType: 'Wipe' });
        this.currentFight = null;
      }
      return;
    }

    m = line.match(this.regex.win);
    if (m) {
      if (this.currentFight !== null) {
        this.haveWon = true;
        this.onEndFight(line, this.currentFight, { ...m.groups, endType: 'Win' });
        this.currentFight = null;
      }
      return;
    }

    if (this.currentFight === null && !this.haveWon && !this.haveSeenSeals) {
      m = line.match(this.regex.playerAttackingMob);
      if (!m)
        m = line.match(this.regex.mobAttackingPlayer);
      if (m) {
        // TODO: maybe we should come up with a better name here?
        this.currentFight = this.currentZone;
        this.onStartFight(line, this.currentFight, m.groups);
        return;
      }
    }

    for (const regex of this.sealRegexes) {
      m = line.match(regex);
      if (m) {
        this.haveSeenSeals = true;
        this.currentSeal = m.groups.seal;
        this.onSeal(line, this.currentSeal, m.groups);

        this.currentFight = this.currentZone;
        this.onStartFight(line, this.currentFight, m.groups);
        return;
      }
    }

    for (const regex of this.unsealRegexes) {
      m = line.match(regex);
      if (m) {
        this.onUnseal(line, this.currentSeal, m.groups);
        this.currentSeal = null;

        if (this.currentFight) {
          this.onEndFight(line, this.currentFight, { ...m.groups, endType: 'Unseal' });
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
  onStartZone(line: string, matches): void {

  }
  onEndZone(line, name, matches) {}
  onStartFight(line, name, matches) {}
  onEndFight(line, name, matches) {}
  onSeal(line: string, name: string, matches: NetRegexes): void {
    this.currentSeal = true;
  }
  onUnseal(line, name, matches) {}
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

  dateFromMatches(matches) {
    return new Date(Date.parse(matches.timestamp));
  }

  onStartZone(line, name, matches) {
    this.lastZone = {
      name: name,
      startLine: line,
      zoneId: matches.id,
      startTime: this.dateFromMatches(matches),
    };
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
