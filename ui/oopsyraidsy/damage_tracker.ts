import logDefinitions from '../../resources/netlog_defs';
import NetRegexes from '../../resources/netregexes';
import { PlayerChangedDetail } from '../../resources/player_override';
import Regexes from '../../resources/regexes';
import { LocaleNetRegex } from '../../resources/translations';
import Util from '../../resources/util';
import ZoneId from '../../resources/zone_id';
import ZoneInfo from '../../resources/zone_info';
import { OopsyData } from '../../types/data';
import { EventResponses } from '../../types/event';
import { Job, Role } from '../../types/job';
import { Matches, NetMatches } from '../../types/net_matches';
import { CactbotBaseRegExp } from '../../types/net_trigger';
import {
  LooseOopsyTrigger,
  LooseOopsyTriggerSet,
  MistakeMap,
  OopsyDeathReason,
  OopsyField,
  OopsyFileData,
  OopsyMistake,
  OopsyMistakeType,
  OopsyTrigger,
  OopsyTriggerField,
} from '../../types/oopsy';
import { ZoneIdType } from '../../types/trigger';

import { CombatState } from './combat_state';
import { MistakeCollector } from './mistake_collector';
import {
  GetShareMistakeText,
  GetSoloMistakeText,
  IsPlayerId,
  IsTriggerEnabled,
  kAttackFlags,
  kFieldFlags,
  kShiftFlagValues,
  playerDamageFields,
  ShortNamify,
  Translate,
  UnscrambleDamage,
} from './oopsy_common';
import { OopsyOptions } from './oopsy_options';
import { PlayerStateTracker } from './player_state_tracker';

const actorControlFadeInCommand = '40000010';

const partyWipeText = {
  en: 'Party Wipe',
  de: 'Gruppe ausgelöscht',
  fr: 'Party Wipe',
  ja: 'ワイプ',
  cn: '团灭',
  ko: '파티 전멸',
};

const earlyPullText = {
  en: 'early pull',
  de: 'zu früh angegriffen',
  fr: 'early pull',
  ja: 'タゲ取り早い',
  cn: '抢开',
  ko: '풀링 빠름',
};

const latePullText = {
  en: 'late pull',
  de: 'zu spät angegriffen',
  fr: 'late pull',
  ja: 'タゲ取り遅い',
  cn: '晚开',
  ko: '풀링 늦음',
};

// Internal trigger id for early pull
export const earlyPullTriggerId = 'General Early Pull';

const isOopsyMistake = (x: OopsyMistake | OopsyDeathReason): x is OopsyMistake => 'type' in x;

export type ProcessedOopsyTriggerSet = LooseOopsyTriggerSet & {
  filename?: string;
};

type ProcessedOopsyTrigger = LooseOopsyTrigger & {
  localRegex: RegExp;
};

export class DamageTracker {
  private triggerSets?: ProcessedOopsyTriggerSet[];
  private inCombat = false;
  private ignoreZone = false;
  private timers: number[] = [];
  private triggers: ProcessedOopsyTrigger[] = [];
  private playerStateTracker: PlayerStateTracker;
  private countdownEngageRegex: RegExp;
  private countdownStartRegex: RegExp;
  private countdownCancelRegex: RegExp;
  private abilityFullRegex: CactbotBaseRegExp<'Ability'>;
  private wipeCactbotEcho: CactbotBaseRegExp<'GameLog'>;
  private wipeEndEcho: CactbotBaseRegExp<'GameLog'>;
  private combatState = new CombatState(this);
  private engageTime?: number;
  private firstPuller?: string;
  private lastTimestamp = 0;
  private triggerSuppress: { [triggerId: string]: number } = {};
  private data: OopsyData;
  private timestampCallbacks: {
    timestamp: number;
    callback: (timestamp: number) => void;
  }[] = [];

  private job: Job = 'NONE';
  private role: Role = 'none';
  private me = '';
  private zoneName?: string;
  private zoneId: ZoneIdType = ZoneId.MatchAll;
  private contentType = 0;

  constructor(
    private options: OopsyOptions,
    private collector: MistakeCollector,
    private dataFiles: OopsyFileData,
  ) {
    const timestampCallback = (timestamp: number, callback: (timestamp: number) => void) =>
      this.OnRequestTimestampCallback(timestamp, callback);
    this.playerStateTracker = new PlayerStateTracker(
      this.options,
      this.collector,
      timestampCallback,
    );

    const lang = this.options.ParserLanguage;
    this.countdownEngageRegex = LocaleNetRegex.countdownEngage[lang];
    this.countdownStartRegex = LocaleNetRegex.countdownStart[lang];
    this.countdownCancelRegex = LocaleNetRegex.countdownCancel[lang];
    this.abilityFullRegex = NetRegexes.abilityFull();
    this.wipeCactbotEcho = NetRegexes.echo({ line: 'cactbot wipe.*?' });
    this.wipeEndEcho = NetRegexes.echo({ line: 'end' });

    this.data = this.GetDataObject();
    this.Reset();
  }

  OnRequestTimestampCallback(timestamp: number, callback: (timestamp: number) => void): void {
    this.timestampCallbacks.push({
      timestamp: timestamp,
      callback: callback,
    });
    // Sort earliest to latest.
    this.timestampCallbacks.sort((a, b) => a.timestamp - b.timestamp);
  }

  GetDataObject(): OopsyData {
    return {
      me: this.me,
      job: this.job,
      role: this.role,
      party: this.playerStateTracker.partyTracker,
      inCombat: this.inCombat,
      ShortName: (name?: string) => ShortNamify(name, this.options.PlayerNicks),
      IsPlayerId: IsPlayerId,
      DamageFromMatches: (matches: NetMatches['Ability']) => UnscrambleDamage(matches?.damage),
      options: this.options,

      // Deprecated.
      ParseLocaleFloat: parseFloat,
    };
  }

  // TODO: this shouldn't clear timers and triggers
  // TODO: seems like some reloads are causing the /poke test to get undefined
  Reset(): void {
    this.data = this.GetDataObject();
    this.triggerSuppress = {};

    for (const timer of this.timers)
      window.clearTimeout(timer);
    this.timers = [];
  }

  private OnEngage(timestamp: number) {
    this.engageTime = timestamp;

    if (!this.firstPuller || !this.combatState.startTime)
      return;

    const seconds = (timestamp - this.combatState.startTime) / 1000;
    if (seconds >= this.options.MinimumTimeForPullMistake) {
      const mistakeStr = Translate(this.options.DisplayLanguage, earlyPullText) ?? '';
      const text = `${mistakeStr} (${seconds.toFixed(1)}s)`;
      if (IsTriggerEnabled(this.options, earlyPullTriggerId)) {
        this.playerStateTracker.OnMistakeObj(timestamp, {
          type: 'pull',
          name: this.firstPuller,
          blame: this.firstPuller,
          text: text,
        });
      }
    }
  }

  private UpdateLastTimestamp(splitLine: string[]): void {
    const timeField = splitLine[logDefinitions.None.fields.timestamp];
    if (timeField)
      this.lastTimestamp = new Date(timeField).getTime();
  }

  OnNetLog(e: EventResponses['LogLine']): void {
    if (this.ignoreZone)
      return;

    const line = e.rawLine;
    const splitLine = e.line;
    const type = splitLine[logDefinitions.None.fields.type];

    // If we're waiting on a timestamp callback, check if any have passed with this line.
    // Ignore game log lines, which don't track milliseconds.
    if (type !== logDefinitions.GameLog.type) {
      this.UpdateLastTimestamp(splitLine);
      let timestampCallback = this.timestampCallbacks[0];
      while (timestampCallback) {
        if (this.lastTimestamp < timestampCallback.timestamp)
          break;

        timestampCallback.callback(this.lastTimestamp);
        this.timestampCallbacks.shift();
        timestampCallback = this.timestampCallbacks[0];
      }
    }

    switch (type) {
      case logDefinitions.GameLog.type:
        if (this.countdownEngageRegex.test(line)) {
          // It would be ideal if we could use the log timestamp, but many early/late pulls are <1s,
          // and the accuracy of game log lines is also at most 1s off from real time.
          this.OnEngage(Date.now());
        }
        if (this.countdownStartRegex.test(line) || this.countdownCancelRegex.test(line))
          this.combatState.Reset();
        if (this.wipeCactbotEcho.test(line) || this.wipeEndEcho.test(line))
          this.Wipe(this.lastTimestamp);
        break;
      case logDefinitions.ChangeZone.type:
        {
          const name = splitLine[logDefinitions.ChangeZone.fields.name];
          const id = splitLine[logDefinitions.ChangeZone.fields.id];
          if (name !== undefined && id !== undefined)
            this.SetZone(this.lastTimestamp, name, parseInt(id, 16));
        }
        break;
      case logDefinitions.PartyList.type:
        this.playerStateTracker.OnPartyList(line, splitLine);
        break;
      case logDefinitions.ChangedPlayer.type:
        this.playerStateTracker.OnChangedPlayer(line, splitLine);
        break;
      case logDefinitions.AddedCombatant.type:
        this.playerStateTracker.OnAddedCombatant(line, splitLine);
        break;
      case logDefinitions.Ability.type:
      case logDefinitions.NetworkAOEAbility.type:
        this.OnAbilityEvent(line, splitLine);
        this.playerStateTracker.OnAbility(line, splitLine);
        break;
      case logDefinitions.WasDefeated.type:
        this.playerStateTracker.OnDefeated(line, splitLine);
        break;
      case logDefinitions.GainsEffect.type:
        this.playerStateTracker.OnGainsEffect(line, splitLine);
        break;
      case logDefinitions.LosesEffect.type:
        this.playerStateTracker.OnLosesEffect(line, splitLine);
        break;
      case logDefinitions.NetworkDoT.type:
        this.playerStateTracker.OnHoTDoT(line, splitLine);
        break;
      case logDefinitions.ActorControl.type:
        if (splitLine[logDefinitions.ActorControl.fields.command] === actorControlFadeInCommand) {
          this.Wipe(this.lastTimestamp);
          this.playerStateTracker.OnWipe(line, splitLine);
        }
        break;
    }

    // Process triggers after abilities, so that death reasons for abilities that do damage get
    // listed after the damage from that ability.
    for (const trigger of this.triggers) {
      const matches = trigger.localRegex.exec(line);
      if (matches)
        this.OnTrigger(trigger, matches, this.lastTimestamp);
    }
  }

  private OnAbilityEvent(line: string, splitLine: string[]): void {
    if (this.firstPuller || this.combatState.startTime)
      return;

    // This is kind of obnoxious to have to regex match every ability line that's already split.
    // But, it turns it into a usable match object.
    // TODO: use log definitions here??
    const lineMatches = this.abilityFullRegex.exec(line);
    if (!lineMatches || !lineMatches.groups)
      return;

    const matches = lineMatches.groups;

    // Shift damage and flags forward for mysterious spurious :3E:0:.
    // Plenary Indulgence also appears to prepend confession stacks.
    // UNKNOWN: Can these two happen at the same time?
    const origFlags = splitLine[kFieldFlags];
    if (origFlags && kShiftFlagValues.includes(origFlags)) {
      matches.flags = splitLine[kFieldFlags + 2] ?? matches.flags;
      matches.damage = splitLine[kFieldFlags + 3] ?? matches.damage;
    }

    // Length 1 or 2.
    let lowByte = matches.flags.substr(-2);
    if (lowByte.length === 1)
      lowByte = '0' + lowByte;

    if (!kAttackFlags.includes(lowByte))
      return;

    // Start combat first prior to sending a late pull mistake,
    // as starting a new combat can reset the live list.
    this.combatState.StartCombat(this.lastTimestamp);

    if (IsPlayerId(matches.sourceId))
      this.firstPuller = matches.source;
    else if (IsPlayerId(matches.targetId))
      this.firstPuller = matches.target;
    else
      this.firstPuller = '???';

    if (this.engageTime) {
      const seconds = ((Date.now() - this.engageTime) / 1000);
      if (seconds >= this.options.MinimumTimeForPullMistake) {
        const mistakeStr = Translate(this.options.DisplayLanguage, latePullText) ?? '';
        const text = `${mistakeStr} (${seconds.toFixed(1)}s)`;
        if (IsTriggerEnabled(this.options, earlyPullTriggerId)) {
          this.playerStateTracker.OnMistakeObj(this.lastTimestamp, {
            type: 'pull',
            name: this.firstPuller,
            blame: this.firstPuller,
            text: text,
          });
        }
      }
    }
  }

  OnStartEncounter(timestamp: number): void {
    this.playerStateTracker.OnStartEncounter(timestamp);
  }

  OnStopEncounter(timestamp: number): void {
    this.playerStateTracker.OnStopEncounter(timestamp);
    this.firstPuller = undefined;
    this.engageTime = undefined;
  }

  OnTrigger(trigger: LooseOopsyTrigger, execMatches: RegExpExecArray, timestamp: number): void {
    const triggerTime = Date.now();

    // TODO: turn this into a helper?? this was copied/pasted from popup-text.js

    // If using named groups, treat matches.groups as matches
    // so triggers can do things like matches.target.
    let matches: Matches = {};
    // If using named groups, treat matches.groups as matches
    // so triggers can do things like matches.target.
    if (execMatches.groups) {
      matches = execMatches.groups;
    } else {
      // If there are no matching groups, reproduce the old js logic where
      // groups ended up as the original RegExpExecArray object
      execMatches.forEach((value, idx) => {
        matches[idx] = value;
      });
    }

    if (trigger.id) {
      if (!IsTriggerEnabled(this.options, trigger.id))
        return;

      if (trigger.id in this.triggerSuppress) {
        const suppressTime = this.triggerSuppress[trigger.id];
        if (suppressTime && suppressTime > triggerTime)
          return;
        delete this.triggerSuppress[trigger.id];
      }
    }

    const ValueOrFunction = (
      f: OopsyTriggerField<OopsyData, Matches, OopsyField>,
      matches: Matches,
    ) => {
      return (typeof f === 'function') ? f(this.data, matches) : f;
    };

    if ('condition' in trigger) {
      const condition = ValueOrFunction(trigger.condition, matches);
      if (condition === undefined || condition === null || condition === false)
        return;
    }

    const delayField = 'delaySeconds' in trigger
      ? ValueOrFunction(trigger.delaySeconds, matches)
      : 0;
    const delaySeconds = delayField === undefined || delayField === null || delayField === false ||
        typeof delayField !== 'number'
      ? 0
      : delayField;

    const suppress = 'suppressSeconds' in trigger
      ? ValueOrFunction(trigger.suppressSeconds, matches)
      : 0;
    if (trigger.id && typeof suppress === 'number' && suppress > 0)
      this.triggerSuppress[trigger.id] = triggerTime + (suppress * 1000);

    const f = (() => {
      if ('mistake' in trigger) {
        const m = ValueOrFunction(trigger.mistake, matches);
        if (typeof m === 'object') {
          const mistakeTimestamp = timestamp + delaySeconds * 1000;
          if (Array.isArray(m)) {
            for (const mistake of m)
              this.playerStateTracker.OnMistakeObj(mistakeTimestamp, mistake);
          } else if (isOopsyMistake(m)) {
            this.playerStateTracker.OnMistakeObj(mistakeTimestamp, m);
          }
        }
      }
      if ('deathReason' in trigger) {
        const ret = ValueOrFunction(trigger.deathReason, matches);
        if (ret !== null && typeof ret === 'object' && !Array.isArray(ret)) {
          if (!isOopsyMistake(ret))
            this.playerStateTracker.OnDeathReason(timestamp, ret);
        }
      }
      if ('run' in trigger)
        ValueOrFunction(trigger.run, matches);
    });

    if (delaySeconds <= 0)
      f();
    else
      this.timers.push(window.setTimeout(f, delaySeconds * 1000));
  }

  Wipe(timestamp: number): void {
    this.playerStateTracker.OnMistakeObj(timestamp, {
      type: 'wipe',
      text: partyWipeText,
    });

    this.Reset();
    this.combatState.StopCombat(timestamp);
  }

  // Similar to PlayerStateTracker handling OnPlayerChanged events plus ChangedPlayer lines,
  // handling this event is extra insurance for reloads in the middle of a zone when
  // there won't be ChangeZone lines to do it more naturally.
  OnChangeZone(e: EventResponses['ChangeZone']): void {
    this.SetZone(this.lastTimestamp, e.zoneName, e.zoneID);
  }

  SetZone(timestamp: number, zoneName: string, zoneId: number): void {
    if (this.zoneId === zoneId)
      return;

    this.zoneName = zoneName;
    this.zoneId = zoneId;

    const zoneInfo = ZoneInfo[this.zoneId];
    this.contentType = zoneInfo?.contentType ?? 0;

    this.combatState.StopCombat(timestamp);
    this.combatState.Reset();
    this.playerStateTracker.ClearTriggerSets();
    this.playerStateTracker.OnChangeZone(timestamp, zoneName, zoneId);
    this.ReloadTriggers();
  }

  OnInCombatChangedEvent(e: EventResponses['onInCombatChangedEvent']): void {
    // Don't send StartCombat with a timestamp=0 before we've seen any
    // log messages.  This can happen if you reload while in combat.
    // We'll see an action event soon enough to also start combat.
    if (!this.lastTimestamp)
      return;

    if (this.inCombat !== e.detail.inGameCombat) {
      if (e.detail.inGameCombat)
        this.combatState.StartCombat(this.lastTimestamp);
      else
        this.combatState.StopCombat(this.lastTimestamp);
    }

    this.inCombat = e.detail.inGameCombat;
    this.data.inCombat = this.inCombat;
  }

  private AddDamageTriggers(type: OopsyMistakeType, dict?: MistakeMap): void {
    if (!dict)
      return;
    for (const key in dict) {
      const id = dict[key];
      const trigger: OopsyTrigger<OopsyData> = {
        id: key,
        type: 'Ability',
        netRegex: NetRegexes.abilityFull({ id: id, ...playerDamageFields }),
        mistake: (_data, matches) => {
          return {
            type: type,
            blame: matches.target,
            reportId: matches.targetId,
            triggerType: 'Damage',
            text: matches.ability,
          };
        },
      };
      this.ProcessTrigger(trigger);
    }
  }

  private AddGainsEffectTriggers(type: OopsyMistakeType, dict?: MistakeMap): void {
    if (!dict)
      return;
    for (const key in dict) {
      const id = dict[key];
      const trigger: OopsyTrigger<OopsyData> = {
        id: key,
        type: 'GainsEffect',
        netRegex: NetRegexes.gainsEffect({ effectId: id }),
        mistake: (_data, matches) => {
          return {
            type: type,
            blame: matches.target,
            reportId: matches.targetId,
            triggerType: 'GainsEffect',
            text: matches.effect,
          };
        },
      };
      this.ProcessTrigger(trigger);
    }
  }

  // Helper function for "double tap" shares where multiple players share
  // damage when it should only be on one person, such as a spread mechanic.
  AddShareTriggers(type: OopsyMistakeType, dict?: MistakeMap): void {
    if (!dict)
      return;
    for (const key in dict) {
      const id = dict[key];
      const trigger: OopsyTrigger<OopsyData> = {
        id: key,
        type: 'Ability',
        netRegex: NetRegexes.ability({ type: '22', id: id, ...playerDamageFields }),
        mistake: (_data, matches) => {
          // Some single target damage is still marked as AOEActionEffect type 22, so check
          // the number of targets that it hits.
          if (parseInt(matches.targetCount) === 1)
            return;
          return {
            type: type,
            blame: matches.target,
            reportId: matches.targetId,
            triggerType: 'Share',
            text: GetShareMistakeText(matches.ability),
          };
        },
      };
      this.ProcessTrigger(trigger);
    }
  }

  AddSoloTriggers(type: OopsyMistakeType, dict?: MistakeMap): void {
    if (!dict)
      return;
    for (const key in dict) {
      const id = dict[key];
      const trigger: OopsyTrigger<OopsyData> = {
        id: key,
        type: 'Ability',
        netRegex: NetRegexes.abilityFull({ type: '21', id: id, ...playerDamageFields }),
        mistake: (_data, matches) => {
          return {
            type: type,
            blame: matches.target,
            reportId: matches.targetId,
            triggerType: 'Solo',
            text: GetSoloMistakeText(matches.ability),
          };
        },
      };
      this.ProcessTrigger(trigger);
    }
  }

  ReloadTriggers(): void {
    this.ProcessDataFiles();

    // Wait for datafiles / jobs / zone events / localization.
    if (!this.triggerSets || !this.zoneName)
      return;

    this.Reset();

    this.triggers = [];

    this.ignoreZone = this.options.IgnoreContentTypes.includes(this.contentType) ||
      this.options.IgnoreZoneIds.includes(this.zoneId);
    if (this.ignoreZone)
      return;

    for (const set of this.triggerSets) {
      if ('zoneId' in set) {
        if (
          set.zoneId !== ZoneId.MatchAll && set.zoneId !== this.zoneId &&
          !(typeof set.zoneId === 'object' && set.zoneId.includes(this.zoneId))
        )
          continue;
      } else if ('zoneRegex' in set) {
        const zoneError = (s: string) => {
          console.error(`${s}: ${JSON.stringify(set.zoneRegex)} in ${set.filename ?? '???'}`);
        };

        let zoneRegex = set.zoneRegex;
        if (typeof zoneRegex !== 'object') {
          zoneError('zoneRegex must be translatable object or regexp');
          continue;
        } else if (!(zoneRegex instanceof RegExp)) {
          const parserLang = this.options.ParserLanguage || 'en';
          if (parserLang in zoneRegex) {
            zoneRegex = zoneRegex[parserLang];
          } else if ('en' in zoneRegex) {
            zoneRegex = zoneRegex['en'];
          } else {
            zoneError('unknown zoneRegex language');
            continue;
          }

          if (!(zoneRegex instanceof RegExp)) {
            zoneError('zoneRegex must be regexp');
            continue;
          }
        }

        if (this.zoneName.search(Regexes.parse(zoneRegex)) < 0)
          continue;
      } else {
        return;
      }

      if (this.options.Debug) {
        if (set.filename)
          console.log(`Loading ${set.filename}`);
        else
          console.log('Loading user triggers for zone');
      }

      this.AddDamageTriggers('warn', set.damageWarn);
      this.AddDamageTriggers('fail', set.damageFail);
      this.AddGainsEffectTriggers('warn', set.gainsEffectWarn);
      this.AddGainsEffectTriggers('fail', set.gainsEffectFail);
      this.AddShareTriggers('warn', set.shareWarn);
      this.AddShareTriggers('fail', set.shareFail);
      this.AddSoloTriggers('warn', set.soloWarn);
      this.AddSoloTriggers('fail', set.soloFail);

      for (const trigger of set.triggers ?? [])
        this.ProcessTrigger(trigger);

      this.playerStateTracker.PushTriggerSet(set);
    }
  }

  ProcessTrigger(trigger: OopsyTrigger<OopsyData>): void {
    // This is a bit of a hack, but LooseOopsyTrigger extends OopsyTrigger<OopsyData>
    // but not vice versa.  Because the NetMatches['Ability'] requires a number
    // of fields, Matches cannot be assigned to Matches & NetMatches['Ability'].
    const looseTrigger = trigger as LooseOopsyTrigger;

    const regex = looseTrigger.netRegex;
    // Some oopsy triggers (e.g. early pull) have only an id.
    if (!regex)
      return;
    this.triggers.push({
      ...looseTrigger,
      localRegex: Regexes.parse(Array.isArray(regex) ? Regexes.anyOf(regex) : regex),
    });
  }

  OnPlayerChange(e: PlayerChangedDetail): void {
    if (this.job === e.detail.job && this.me === e.detail.name)
      return;

    this.me = e.detail.name;
    this.job = e.detail.job;
    this.role = Util.jobToRole(this.job);
    this.ReloadTriggers();
    this.playerStateTracker.SetPlayerId(e.detail.id.toString(16));
  }

  ProcessDataFiles(): void {
    // Only run this once.
    if (this.triggerSets)
      return;

    this.triggerSets = this.options.Triggers;
    for (const [filename, json] of Object.entries<LooseOopsyTriggerSet>(this.dataFiles)) {
      if (typeof json !== 'object') {
        console.error('Unexpected JSON from ' + filename + ', expected an object');
        continue;
      }
      const hasZoneRegex = 'zoneRegex' in json;
      const hasZoneId = 'zoneId' in json;
      if (!hasZoneRegex && !hasZoneId || hasZoneRegex && hasZoneId) {
        console.error('Unexpected JSON from ' + filename + ', need one of zoneRegex/zoneID');
        continue;
      }

      if ('triggers' in json) {
        if (typeof json.triggers !== 'object' || !(json.triggers.length >= 0)) {
          console.error('Unexpected JSON from ' + filename + ', expected triggers to be an array');
          continue;
        }
      }

      const set = {
        filename: filename,
        ...json,
      };
      this.triggerSets.push(set);
    }
    this.ReloadTriggers();
  }
}
