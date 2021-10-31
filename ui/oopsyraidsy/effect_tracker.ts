import logDefinitions from '../../resources/netlog_defs';
import { UnreachableCode } from '../../resources/not_reached';
import PartyTracker from '../../resources/party';
import { EventResponses } from '../../types/event';
import { OopsyDeathReason, OopsyMistake, OopsyMistakeType } from '../../types/oopsy';

import {
  MissableAbility,
  MissableEffect,
  missedAbilityBuffMap,
  missedEffectBuffMap,
} from './buff_map';
import { ProcessedOopsyTriggerSet } from './damage_tracker';
import { DeathReport } from './death_report';
import { MistakeCollector } from './mistake_collector';
import { IsPlayerId, ShortNamify, Translate } from './oopsy_common';
import { OopsyOptions } from './oopsy_options';

// Abilities seem roughly instant.
// Observation: up to ~1.2 seconds for an effect to roll through the party.
const defaultCollectSeconds = 0.5;

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

type CollectedBuff = {
  timestamp: number;
  expireTimestamp: number;
  sourceId: string;
  buffName: string;
  targetIds: string[];
  splitLine: string[];
  buff: MissableAbility | MissableEffect;
  expireCallback: (timestamp: number) => void;
};

export type RequestTimestampCallback = (
  timestamp: number,
  callback: (timestamp: number) => void,
) => void;
type CollectedBuffCallback = (timestamp: number, buff: CollectedBuff) => void;

// Handles tracking whether everybody received a buff or not.
// In response to missed buffs, calls `collectedBuffCallback` when timestamps have expired.
class MissedBuffCollector {
  private buffs: { [sourceId: string]: { [buffId: string]: CollectedBuff } } = {};

  constructor(
    private requestTimestampCallback: RequestTimestampCallback,
    private collectedBuffCallback: CollectedBuffCallback,
  ) {
  }

  // TODO: call something like this on zone change, etc?
  ExpireBuffsIfNeeded(timestamp: number) {
    for (const buffList of Object.values(this.buffs)) {
      for (const buffId of Object.keys(buffList)) {
        const collectedBuff = buffList[buffId];
        if (!collectedBuff)
          continue;

        if (timestamp > collectedBuff.timestamp)
          collectedBuff.expireCallback(timestamp);
      }
    }
  }

  // Caller has vetted that we care about the target, so we don't need to do that here.
  // Most (all) buffs only hit the party, and so no need to vet that the source is in the party.
  OnAbilityBuff(splitLine: string[], buff: MissableAbility): void {
    const sourceId = splitLine[logDefinitions.Ability.fields.sourceId];
    const targetId = splitLine[logDefinitions.Ability.fields.targetId];
    const buffName = splitLine[logDefinitions.Ability.fields.ability];
    const timestamp = splitLine[logDefinitions.Ability.fields.timestamp];
    if (
      sourceId === undefined || targetId === undefined || buffName === undefined ||
      timestamp === undefined
    )
      return;

    this.OnBuff(new Date(timestamp).getTime(), splitLine, buff, buffName, sourceId, targetId);
  }

  OnEffectBuff(splitLine: string[], buff: MissableEffect): void {
    const sourceId = splitLine[logDefinitions.GainsEffect.fields.sourceId];
    const targetId = splitLine[logDefinitions.GainsEffect.fields.targetId];
    const buffName = splitLine[logDefinitions.GainsEffect.fields.effect];
    const timestamp = splitLine[logDefinitions.GainsEffect.fields.timestamp];
    if (
      sourceId === undefined || targetId === undefined || buffName === undefined ||
      timestamp === undefined
    )
      return;

    this.OnBuff(new Date(timestamp).getTime(), splitLine, buff, buffName, sourceId, targetId);
  }

  OnBuff(
    timestamp: number,
    splitLine: string[],
    buff: MissableAbility | MissableEffect,
    buffName: string,
    sourceId: string,
    targetId: string,
  ): void {
    const buffList = this.buffs[sourceId] ??= {};

    // Expire this buff if needed.
    const expiredBuff = buffList[buff.id];
    if (expiredBuff && timestamp > expiredBuff.expireTimestamp) {
      // Handle and remove this buff if it has expired.
      expiredBuff.expireCallback(timestamp);
    }

    // If we're already tracking, and it hasn't expired, just append the targetId.
    const collectedBuff = buffList[buff.id];
    if (collectedBuff) {
      collectedBuff.targetIds.push(targetId);
      return;
    }

    // Otherwise, we're tracking a new buff.
    const collectSeconds = buff.collectSeconds ?? defaultCollectSeconds;
    const expireTimestamp = timestamp + collectSeconds * 1000;

    const expireCallback = (timestamp: number) => {
      // Re-get the buff from the map, so that repeated calls to expireCallback will not
      // call the collectedBuffCallback multiple times.
      const expiredBuff = this.buffs[sourceId]?.[buff.id];
      if (!expiredBuff)
        return;
      this.collectedBuffCallback(timestamp, expiredBuff);
      delete this.buffs[sourceId]?.[buff.id];
    };

    // If we get here, this buff is not being tracked yet.
    buffList[buff.id] = {
      timestamp: timestamp,
      splitLine: splitLine,
      expireTimestamp: expireTimestamp,
      sourceId: sourceId,
      buffName: buffName,
      targetIds: [targetId],
      buff: buff,
      expireCallback: expireCallback,
    };

    this.requestTimestampCallback(expireTimestamp, expireCallback);
  }
}

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
  mistake?: OopsyMistakeType;
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

// Tracks various state about the party (party, pets, buffs).
// TODO: EffectTracker isn't a great name here, sorry.
// TODO: Maybe EffectTracker -> StateTracker and DamageTracker -> OopsyTriggerProcessor?
export class EffectTracker {
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

  SetBaseTime(splitLine: string[]): void {
    this.baseTime = getTimestamp(splitLine);
  }

  PushTriggerSet(set: ProcessedOopsyTriggerSet): void {
    this.triggerSets.push(set);
  }

  ClearTriggerSets(): void {
    this.triggerSets = [];
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

  OnChangeZone(_e: EventResponses['ChangeZone']): void {
    this.Reset();
  }

  OnAddedCombatant(line: string, splitLine: string[]): void {
    const petId = splitLine[logDefinitions.AddedCombatant.fields.id];
    const ownerId = splitLine[logDefinitions.AddedCombatant.fields.ownerId];
    if (petId === undefined || ownerId === undefined || ownerId === '0')
      return;

    // Fix any lowercase ids.
    this.petIdToOwnerId[petId.toUpperCase()] = ownerId.toUpperCase();
  }

  // TODO: player change lines occur on every zone change, but for safety we should also
  // consider passing the id in the plugin `PlayerChangedDetail` event listener, which
  // will get re-sent on every reload.
  OnChangedPlayer(line: string, splitLine: string[]): void {
    this.myPlayerId = splitLine[logDefinitions.ChangedPlayer.fields.id];
    this.OnPartyChanged();
  }

  IsInParty(id?: string): boolean {
    if (id === undefined)
      return false;
    return this.partyIds.has(this.petIdToOwnerId[id] ?? id);
  }

  OnAbility(line: string, splitLine: string[]): void {
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

  OnGainsEffect(line: string, splitLine: string[]): void {
    const targetId = splitLine[logDefinitions.GainsEffect.fields.targetId];
    if (!targetId || !this.IsInParty(targetId))
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

  OnLosesEffect(line: string, splitLine: string[]): void {
    const targetId = splitLine[logDefinitions.GainsEffect.fields.targetId];
    if (!targetId || !this.IsInParty(targetId))
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
    this.collector.OnMistakeObj(mistake);

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
  OnDefeated(line: string, splitLine: string[]): void {
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
    // TODO: should we just do this once when the triggersets are set?
    const abilityMap: { [id: string]: OopsyMistakeType } = {};
    for (const set of this.triggerSets) {
      for (const value of Object.values(set.damageWarn ?? {}))
        abilityMap[value] = 'warn';
      for (const value of Object.values(set.damageFail ?? {}))
        abilityMap[value] = 'fail';
    }
    for (const event of events) {
      if (event.type !== 'Ability')
        continue;
      const id = event.splitLine[logDefinitions.Ability.fields.id];
      if (!id)
        continue;
      event.mistake = abilityMap[id];
    }

    const targetName = splitLine[logDefinitions.WasDefeated.fields.target] ?? '???';
    const report = new DeathReport(
      this.options.DisplayLanguage,
      this.baseTime,
      timestamp,
      targetId,
      targetName,
      events,
    );

    const mistake = report.generateMistake();
    this.collector.OnMistakeObj(mistake);
  }

  OnHoTDoT(line: string, splitLine: string[]): void {
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
