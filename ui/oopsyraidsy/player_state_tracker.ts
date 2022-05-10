import logDefinitions from '../../resources/netlog_defs';
import { UnreachableCode } from '../../resources/not_reached';
import PartyTracker from '../../resources/party';
import {
  DeathReportData,
  OopsyDeathReason,
  OopsyMistake,
  OopsyMistakeType,
} from '../../types/oopsy';

import {
  MissableAbility,
  MissableEffect,
  missedAbilityBuffMap,
  missedEffectBuffMap,
} from './buff_map';
import { ProcessedOopsyTriggerSet } from './damage_tracker';
import { DeathReport } from './death_report';
import {
  CollectedBuff,
  MissedBuffCollector,
  RequestTimestampCallback,
} from './missed_buff_collector';
import { MistakeCollector } from './mistake_collector';
import {
  GetShareMistakeText,
  GetSoloMistakeText,
  IsPlayerId,
  ShortNamify,
  Translate,
} from './oopsy_common';
import { OopsyOptions } from './oopsy_options';

const emptyId = 'E0000000';
const timestampFieldIdx = 1;

// TODO: add this to effect_id.ts?
const raiseEffectId = '94';

const getTimestamp = (splitLine: string[]): number => {
  const timestampField = splitLine[timestampFieldIdx];
  if (timestampField === undefined)
    throw new UnreachableCode();
  return new Date(timestampField).getTime();
};

export type TrackedLineEventType =
  | 'Ability'
  | 'GainsEffect'
  | 'LosesEffect'
  | 'HoTDoT'
  | 'MissedAbility'
  | 'MissedEffect';

export type TrackedLineEvent = {
  timestamp: number;
  type: TrackedLineEventType;
  targetId: string;
  // Annotate this line with a mistake icon.
  mistake?: OopsyMistakeType;
  // Override the text from the splitLine with explicit text (e.g. solo/share mistake).
  mistakeText?: string;
  splitLine: string[];
};

export type TrackedDeathReasonEvent = {
  timestamp: number;
  type: 'DeathReason';
  targetId: string;
  text: string;
};

export type TrackedMistakeEvent = {
  timestamp: number;
  type: 'Mistake';
  targetId: string;
  mistakeEvent: OopsyMistake;
};

export type TrackedEvent = TrackedLineEvent | TrackedDeathReasonEvent | TrackedMistakeEvent;
export type TrackedEventType = TrackedEvent['type'];

// * Tracks various state about the party (party, pets, buffs, deaths).
// * Generates some internal mistakes that need extra tracking (missed buffs, deaths)
// * Tracks events in `trackedEvents` that can be handed to DeathReports for processing.
export class PlayerStateTracker {
  private missedBuffCollector;
  private triggerSets: ProcessedOopsyTriggerSet[] = [];
  private partyIds: Set<string> = new Set();
  private deadIds: Set<string> = new Set();
  private petIdToOwnerId: { [petId: string]: string } = {};
  private abilityIdToBuff: { [abilityId: string]: MissableAbility } = {};
  private effectIdToBuff: { [effectId: string]: MissableEffect } = {};
  private trackedEvents: TrackedEvent[] = [];
  private trackedEffectMap: { [targetId: string]: { [effectId: string]: TrackedEvent } } = {};
  // The minimum amount of time to keep events for.
  private readonly eventWindowMs = 20 * 1000;
  // The time delta in the future to request cleaning up events from the past, after a cleanup.
  // The larger this is, the more it exchanges memory for cpu, to keep more events rather than
  // constantly cycling `trackedEvents`.  0 = clean up immediately.
  private readonly cleanupWindowMs = this.eventWindowMs * 2;
  private nextPruneTimestamp?: number;
  private baseTime?: number;
  private myPlayerId?: string;

  // Cached ability -> mistake icon types for "simple" mistakes.
  private mistakeDamageMap: { [id: string]: OopsyMistakeType } = {};
  private mistakeShareMap: { [id: string]: OopsyMistakeType } = {};
  private mistakeSoloMap: { [id: string]: OopsyMistakeType } = {};

  constructor(
    private options: OopsyOptions,
    private partyTracker: PartyTracker,
    private collector: MistakeCollector,
    requestTimestampCallback: RequestTimestampCallback,
  ) {
    this.missedBuffCollector = new MissedBuffCollector(
      requestTimestampCallback,
      (timestamp, buff) => this.OnBuffCollected(timestamp, buff),
    );

    // Build maps of ids to buffs for ease of use.
    for (const buff of missedAbilityBuffMap) {
      if (typeof buff.abilityId === 'string') {
        this.abilityIdToBuff[buff.abilityId] = buff;
      } else {
        for (const id of buff.abilityId)
          this.abilityIdToBuff[id] = buff;
      }
    }
    for (const buff of missedEffectBuffMap) {
      if (typeof buff.effectId === 'string') {
        this.effectIdToBuff[buff.effectId] = buff;
      } else {
        for (const id of buff.effectId)
          this.effectIdToBuff[id] = buff;
      }
    }

    this.OnPartyChanged();
  }

  OnStartEncounter(timestamp: number): void {
    this.baseTime = timestamp;
    this.collector.StartEncounter(timestamp);
  }

  OnStopEncounter(_timestamp: number): void {
    // TODO: forward this along to MistakeObserver
  }

  PushTriggerSet(set: ProcessedOopsyTriggerSet): void {
    this.triggerSets.push(set);
    for (const set of this.triggerSets) {
      for (const value of Object.values(set.damageWarn ?? {}))
        this.mistakeDamageMap[value] = 'warn';
      for (const value of Object.values(set.damageFail ?? {}))
        this.mistakeDamageMap[value] = 'fail';
      for (const value of Object.values(set.shareWarn ?? {}))
        this.mistakeShareMap[value] = 'warn';
      for (const value of Object.values(set.shareFail ?? {}))
        this.mistakeShareMap[value] = 'fail';
      for (const value of Object.values(set.soloWarn ?? {}))
        this.mistakeSoloMap[value] = 'warn';
      for (const value of Object.values(set.soloFail ?? {}))
        this.mistakeSoloMap[value] = 'fail';
    }
  }

  ClearTriggerSets(): void {
    this.triggerSets = [];
    this.mistakeDamageMap = {};
    this.mistakeShareMap = {};
    this.mistakeSoloMap = {};
  }

  // Called to update the list of player ids we care about.
  OnPartyChanged(): void {
    // TODO: do we need to clean anything else up here if this changes?
    // Or, do we just assume party doesn't change unless at zone change, so ignore edge cases?
    const arr = [...this.partyTracker.partyIds];

    // Include the player in the party for mistakes even if there is no party.
    if (this.myPlayerId && !arr.includes(this.myPlayerId))
      arr.push(this.myPlayerId);

    this.partyIds = new Set(arr);
  }

  private Reset(): void {
    this.petIdToOwnerId = {};
    this.deadIds.clear();
    this.trackedEvents = [];
    this.baseTime = undefined;
  }

  OnChangeZone(timestamp: number, zoneName: string, zoneId: number): void {
    this.Reset();
    this.collector.OnChangeZone(timestamp, zoneName, zoneId);
  }

  OnAddedCombatant(_line: string, splitLine: string[]): void {
    const petId = splitLine[logDefinitions.AddedCombatant.fields.id];
    const ownerId = splitLine[logDefinitions.AddedCombatant.fields.ownerId];
    if (petId === undefined || ownerId === undefined)
      return;
    if (ownerId === '0' || ownerId === '0000')
      return;

    // Fix any lowercase ids.
    this.petIdToOwnerId[petId.toUpperCase()] = ownerId.toUpperCase();
  }

  OnChangedPlayer(_line: string, splitLine: string[]): void {
    const id = splitLine[logDefinitions.ChangedPlayer.fields.id];
    if (id)
      this.SetPlayerId(id);
  }

  SetPlayerId(id: string): void {
    if (this.myPlayerId === id)
      return;
    this.myPlayerId = id;
    this.OnPartyChanged();
  }

  IsInParty(id?: string): boolean {
    if (id === undefined)
      return false;
    return this.partyIds.has(this.petIdToOwnerId[id] ?? id);
  }

  IsPlayerInParty(id?: string): boolean {
    if (id === undefined)
      return false;
    return this.partyIds.has(id);
  }

  OnAbility(_line: string, splitLine: string[]): void {
    // Abilities can not miss everybody (e.g. Battle Voice never hitting the source)
    // so check both target and source.
    const targetId = splitLine[logDefinitions.Ability.fields.targetId];
    const sourceId = splitLine[logDefinitions.Ability.fields.sourceId];
    const targetInParty = this.IsInParty(targetId);
    const sourceInParty = this.IsInParty(sourceId);
    if (sourceId === undefined || targetId === undefined)
      return;

    // Just in case, if a target is performing actions, then they are alive.
    if (sourceInParty)
      this.deadIds.delete(sourceId);

    const abilityId = splitLine[logDefinitions.Ability.fields.id];
    if (abilityId === undefined)
      return;

    // Only track events on players.  Ideally, it'd be nice to only include
    // party members in tracked events, but this is used for death reports
    // on dead non-party members.
    // TODO: maybe oopsy should only report party failures?
    if (IsPlayerId(targetId)) {
      this.trackedEvents.push({
        timestamp: getTimestamp(splitLine),
        type: 'Ability',
        targetId: targetId,
        splitLine: splitLine,
      });
    }

    // Report missed buffs on the party.
    if (!targetInParty && !sourceInParty)
      return;
    const buff = this.abilityIdToBuff[abilityId];
    if (buff)
      this.missedBuffCollector.OnAbilityBuff(splitLine, buff);
  }

  OnGainsEffect(_line: string, splitLine: string[]): void {
    const targetId = splitLine[logDefinitions.GainsEffect.fields.targetId];
    // Do not consider pets gaining effects here.
    // Summoner pets (e.g. Demi-Phoenix) gain party buffs (e.g. Embolden), with no sourceId/source.
    if (!targetId || !this.IsPlayerInParty(targetId))
      return;

    const effectId = splitLine[logDefinitions.GainsEffect.fields.effectId];
    if (effectId === undefined)
      return;

    const timestamp = getTimestamp(splitLine);

    // We need to request a cleanup somewhere.  Assume that somebody will gain an effect
    // at some point.  These happen less often than abilities, so we do it here just
    // to reduce per-log overhead.
    if (this.nextPruneTimestamp === undefined) {
      this.nextPruneTimestamp = timestamp + this.cleanupWindowMs;
    } else if (timestamp > this.nextPruneTimestamp) {
      this.PruneTrackedEvents(timestamp - this.eventWindowMs);
      this.nextPruneTimestamp = timestamp + this.cleanupWindowMs;
    }

    // Upon coming back to life, players get Transcendent / Weakness / Brink of Death.
    // However, they also get a Raise effect prior to coming back to life.
    if (effectId !== raiseEffectId)
      this.deadIds.delete(targetId);

    // Keep track of active buffs in case they have a very long duration and fall outside the
    // window of this.trackedEffects.
    const event: TrackedEvent = {
      timestamp: timestamp,
      type: 'GainsEffect',
      targetId: targetId,
      splitLine: splitLine,
    };

    (this.trackedEffectMap[targetId] ??= {})[effectId] = event;
    this.trackedEvents.push(event);

    const buff = this.effectIdToBuff[effectId.toUpperCase()];
    if (buff)
      this.missedBuffCollector.OnEffectBuff(splitLine, buff);
  }

  OnLosesEffect(_line: string, splitLine: string[]): void {
    const targetId = splitLine[logDefinitions.GainsEffect.fields.targetId];
    if (!targetId || !this.IsPlayerInParty(targetId))
      return;

    const effectId = splitLine[logDefinitions.GainsEffect.fields.effectId];
    if (effectId === undefined)
      return;

    this.trackedEvents.push({
      timestamp: getTimestamp(splitLine),
      type: 'LosesEffect',
      targetId: targetId,
      splitLine: splitLine,
    });

    delete this.trackedEffectMap[targetId]?.[effectId];
  }

  OnDeathReason(timestamp: number, reason: OopsyDeathReason): void {
    const targetId = reason.id;
    if (!targetId || !IsPlayerId(targetId))
      return;

    const text = Translate(this.options.DisplayLanguage, reason.text);
    if (!text)
      return;
    this.trackedEvents.push({
      timestamp: timestamp,
      type: 'DeathReason',
      targetId: targetId,
      text: text,
    });
  }

  OnMistakeObj(timestamp: number, mistake: OopsyMistake): void {
    this.collector.OnMistakeObj(timestamp, mistake);

    const targetId = mistake.reportId;
    if (!targetId || !IsPlayerId(targetId))
      return;

    this.trackedEvents.push({
      timestamp: timestamp,
      type: 'Mistake',
      targetId: targetId,
      mistakeEvent: mistake,
    });
  }

  // Returns an event for why this person died.
  OnDefeated(_line: string, splitLine: string[]): void {
    const targetId = splitLine[logDefinitions.WasDefeated.fields.targetId];
    if (!targetId || !IsPlayerId(targetId))
      return;

    const targetInParty = this.IsInParty(targetId);
    if (targetInParty)
      this.deadIds.add(targetId);

    const timestamp = getTimestamp(splitLine);
    const firstTimestamp = timestamp - this.eventWindowMs;
    const events = this.trackedEvents.filter((event) => {
      return event.timestamp >= firstTimestamp && event.targetId === targetId;
    });

    // Mark simple mistakes that can be attached to single ability ids.
    for (const event of events) {
      if (event.type !== 'Ability')
        continue;
      const id = event.splitLine[logDefinitions.Ability.fields.id];
      if (!id)
        continue;

      const type = event.splitLine[logDefinitions.None.fields.type];
      const targetCount = event.splitLine[logDefinitions.Ability.fields.targetCount];
      // Some abilities (e.g. Kampeos Harma 6826) are AOE Ability types but only hit one person.
      // The reverse (Ability.type but targetCount > 1) is not possible.
      const isSharedDamage = type === logDefinitions.NetworkAOEAbility.type && targetCount !== '1';

      // Combining share/solo mistake lines with ability damage lines is a bit of
      // duplication, but unless PlayerStateTracker generated share/solo/damage mistakes
      // itself, there's no way to undo the mistake + ability.  So, we'll add the
      // mistake text into the TrackedEventLine for the ability and hide the mistake.
      if (id in this.mistakeDamageMap) {
        event.mistake = this.mistakeDamageMap[id];
      } else if (isSharedDamage && id in this.mistakeShareMap) {
        event.mistake = this.mistakeShareMap[id];
        const ability = event.splitLine[logDefinitions.Ability.fields.ability] ?? '???';
        event.mistakeText = Translate(this.options.DisplayLanguage, GetShareMistakeText(ability));
      } else if (!isSharedDamage && id in this.mistakeSoloMap) {
        event.mistake = this.mistakeSoloMap[id];
        const ability = event.splitLine[logDefinitions.Ability.fields.ability] ?? '???';
        event.mistakeText = Translate(this.options.DisplayLanguage, GetSoloMistakeText(ability));
      }
    }

    const targetName = splitLine[logDefinitions.WasDefeated.fields.target] ?? '???';
    const reportData: DeathReportData = {
      lang: this.options.DisplayLanguage,
      baseTimestamp: this.baseTime,
      deathTimestamp: timestamp,
      targetId: targetId,
      targetName: targetName,
      events: events,
    };

    const mistake = DeathReport.generateMistake(reportData);
    this.collector.OnMistakeObj(timestamp, mistake);
  }

  OnHoTDoT(_line: string, splitLine: string[]): void {
    const targetId = splitLine[logDefinitions.NetworkDoT.fields.id];
    if (!targetId || !this.IsInParty(targetId))
      return;

    this.trackedEvents.push({
      timestamp: getTimestamp(splitLine),
      type: 'HoTDoT',
      targetId: targetId,
      splitLine: splitLine,
    });
  }

  OnWipe(_line: string, _splitLine: string[]): void {
    this.Reset();
  }

  private OnBuffCollected(timestamp: number, collected: CollectedBuff): void {
    // TODO: maybe 'mitigation' should become a separate mistake type?
    const type: OopsyMistakeType = collected.buff.type === 'mitigation'
      ? 'heal'
      : collected.buff.type;

    const ownerId = this.petIdToOwnerId[collected.sourceId];
    const blameId = ownerId ?? collected.sourceId;
    const sourceName = this.partyTracker.nameFromId(blameId);
    if (sourceName === undefined) {
      console.error(`Couldn't find name for ${blameId} (owner: ${ownerId ?? 'none'})`);
      return;
    }

    const gotBuffMap: { [id: string]: boolean } = {};
    if (collected.buff.ignoreSelf)
      gotBuffMap[blameId] = true;

    for (const id of collected.targetIds)
      gotBuffMap[id] = true;

    const missedIds = this.partyTracker.partyIds.filter((id) => {
      // Filter out any empty ids here.
      if (id === emptyId)
        return false;
      // A player is missed if they didn't get the buff and aren't dead.
      return !gotBuffMap[id] && !this.deadIds.has(id);
    });
    if (missedIds.length === 0)
      return;

    // Append events for each missed player for death reports.
    // Whereas the `OnMistakeObj` call blames the source for missing a number of targets,
    // `this.trackedEvents` informs a target in a death report that they were missed by a source.
    if (collected.buff.type === 'heal' || collected.buff.type === 'mitigation') {
      for (const targetId of missedIds) {
        this.trackedEvents.push({
          timestamp: getTimestamp(collected.splitLine),
          type: 'abilityId' in collected.buff ? 'MissedAbility' : 'MissedEffect',
          targetId: targetId,
          splitLine: collected.splitLine,
        });
      }
    }

    const missedNames = missedIds.map((id) => {
      const name = this.partyTracker.nameFromId(id);
      if (!name)
        console.error(`Couldn't find name for ${id}`);
      return name ?? '???';
    });

    // TODO: oopsy could really use mouseover popups for details.
    if (missedNames.length < 4) {
      const nameList = missedNames.map((name) => {
        return ShortNamify(name, this.options.PlayerNicks);
      }).join(', ');

      // As a TrackedLineEvent has been pushed for each person missed already,
      // explicitly don't add a `reportId` field on these mistakes.
      this.OnMistakeObj(timestamp, {
        type: type,
        blame: sourceName,
        triggerType: 'Buff',
        text: {
          en: `${collected.buffName} missed ${nameList}`,
          de: `${collected.buffName} verfehlt ${nameList}`,
          fr: `${collected.buffName} manqué(e) sur ${nameList}`,
          ja: `(${nameList}) が${collected.buffName}を受けなかった`,
          cn: `${nameList} 没受到 ${collected.buffName}`,
          ko: `${collected.buffName} ${nameList}에게 적용안됨`,
        },
      });
      return;
    }

    // If there's too many people, just list the number of people missed.
    // TODO: we could also list everybody on separate lines?
    this.OnMistakeObj(timestamp, {
      type: type,
      blame: sourceName,
      triggerType: 'Buff',
      text: {
        en: `${collected.buffName} missed ${missedNames.length} people`,
        de: `${collected.buffName} verfehlte ${missedNames.length} Personen`,
        fr: `${collected.buffName} manqué(e) sur ${missedNames.length} personnes`,
        ja: `${missedNames.length}人が${collected.buffName}を受けなかった`,
        cn: `有${missedNames.length}人没受到 ${collected.buffName}`,
        ko: `${collected.buffName} ${missedNames.length}명에게 적용안됨`,
      },
    });
  }

  private PruneTrackedEvents(timestamp: number) {
    // Remove any tracked events that occurred prior to `timestamp`.
    const idx = this.trackedEvents.findIndex((event) => event.timestamp >= timestamp);
    if (idx === -1)
      return;
    this.trackedEvents = this.trackedEvents.slice(idx);
  }
}
