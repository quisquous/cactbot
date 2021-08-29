import logDefinitions from '../../resources/netlog_defs';
import PartyTracker from '../../resources/party';
import { EventResponses } from '../../types/event';
import { OopsyMistakeType } from '../../types/oopsy';

import {
  MissableAbility,
  MissableEffect,
  missedAbilityBuffMap,
  missedEffectBuffMap,
} from './buff_map';
import { MistakeCollector } from './mistake_collector';
import { ShortNamify } from './oopsy_common';
import { OopsyOptions } from './oopsy_options';

// Abilities seem roughly instant.
// Observation: up to ~1.2 seconds for an effect to roll through the party.
const defaultCollectSeconds = 0.5;

const emptyId = 'E0000000';

// TODO: add this to effect_id.ts?
const raiseEffectId = '94';

type CollectedBuff = {
  timestamp: number;
  expireTimestamp: number;
  sourceId: string;
  buffName: string;
  targetIds: string[];
  buff: MissableAbility | MissableEffect;
  expireCallback: () => void;
};

export type RequestTimestampCallback = (timestamp: number, callback: () => void) => void;
type CollectedBuffCallback = (buff: CollectedBuff) => void;

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
          collectedBuff.expireCallback();
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

    this.OnBuff(new Date(timestamp).getTime(), buff, buffName, sourceId, targetId);
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

    this.OnBuff(new Date(timestamp).getTime(), buff, buffName, sourceId, targetId);
  }

  OnBuff(
    timestamp: number,
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
      expiredBuff.expireCallback();
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

    const expireCallback = () => {
      // Re-get the buff from the map, so that repeated calls to expireCallback will not
      // call the collectedBuffCallback multiple times.
      const expiredBuff = this.buffs[sourceId]?.[buff.id];
      if (!expiredBuff)
        return;
      this.collectedBuffCallback(expiredBuff);
      delete this.buffs[sourceId]?.[buff.id];
    };

    // If we get here, this buff is not being tracked yet.
    buffList[buff.id] = {
      timestamp: timestamp,
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

// Tracks various state about the party (party, pets, buffs).
// TODO: track deaths so missed buffs don't apply to dead players.
// TODO: flesh this out to handle death reports.
// TODO: EffectTracker isn't a great name here, sorry.
export class EffectTracker {
  private missedBuffCollector;
  private partyIds: Set<string> = new Set();
  private deadIds: Set<string> = new Set();
  private petIdToOwnerId: { [petId: string]: string } = {};
  private abilityIdToBuff: { [abilityId: string]: MissableAbility } = {};
  private effectIdToBuff: { [effectId: string]: MissableEffect } = {};

  constructor(
    private options: OopsyOptions,
    private partyTracker: PartyTracker,
    private collector: MistakeCollector,
    requestTimestampCallback: RequestTimestampCallback,
  ) {
    this.missedBuffCollector = new MissedBuffCollector(
      requestTimestampCallback,
      (buff) => this.OnBuffCollected(buff),
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

  // Called to update the list of player ids we care about.
  OnPartyChanged(): void {
    // TODO: do we need to clean anything else up here if this changes?
    // Or, do we just assume party doesn't change unless at zone change, so ignore edge cases?
    this.partyIds = new Set(this.partyTracker.partyIds);
    console.log(`party ids: ${JSON.stringify(this.partyTracker.partyIds)}`);
  }

  OnChangeZone(_e: EventResponses['ChangeZone']): void {
    // Clear this dictionary periodically so it doesn't have false positives.
    // TODO: we could track combatant removal too?
    this.petIdToOwnerId = {};

    // Probably nobody is dead if you change zones.
    this.deadIds.clear();
  }

  OnAddedCombatant(line: string, splitLine: string[]): void {
    const petId = splitLine[logDefinitions.AddedCombatant.fields.id];
    const ownerId = splitLine[logDefinitions.AddedCombatant.fields.ownerId];
    if (petId === undefined || ownerId === undefined || ownerId === '0')
      return;

    // Fix any lowercase ids.
    this.petIdToOwnerId[petId.toUpperCase()] = ownerId.toUpperCase();
  }

  IsInParty(id?: string): boolean {
    if (id === undefined)
      return false;
    return this.partyIds.has(this.petIdToOwnerId[id] ?? id);
  }

  OnAbility(line: string, splitLine: string[]): void {
    // Abilities can not hit anybody (e.g. Battle Voice never hitting the source)
    // so check both target and source.
    const targetId = splitLine[logDefinitions.Ability.fields.targetId];
    const sourceId = splitLine[logDefinitions.Ability.fields.sourceId];
    if (!this.IsInParty(targetId) && !this.IsInParty(sourceId))
      return;

    // Just in case, if a target is performing actions, then they are alive.
    if (sourceId !== undefined)
      this.deadIds.delete(sourceId);

    const abilityId = splitLine[logDefinitions.Ability.fields.id];
    if (abilityId === undefined)
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

    // Upon coming back to life, players get Transcendent / Weakness / Brink of Death.
    // However, they also get a Raise effect prior to coming back to life.
    if (effectId !== raiseEffectId)
      this.deadIds.delete(targetId);

    const buff = this.effectIdToBuff[effectId.toUpperCase()];
    if (buff)
      this.missedBuffCollector.OnEffectBuff(splitLine, buff);
  }

  OnLosesEffect(_line: string, _splitLine: string[]): void {
    // TODO: use this when tracking all buffs on party members
  }

  OnDefeated(line: string, splitLine: string[]): void {
    const targetId = splitLine[logDefinitions.WasDefeated.fields.targetId];
    if (!targetId || !this.IsInParty(targetId))
      return;
    this.deadIds.add(targetId);
  }

  OnWipe(_line: string, _splitLine: string[]): void {
    this.petIdToOwnerId = {};
    this.deadIds.clear();
  }

  private OnBuffCollected(collected: CollectedBuff): void {
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

    const missedNames = missedIds.map((id) => {
      const name = this.partyTracker.nameFromId(id);
      if (!name)
        console.error(`Couldn't find name for ${id}`);
      return name ?? '???';
    });

    // TODO: oopsy could really use mouseover popups for details.
    // TODO: alternatively, if we have a death report, it'd be good to
    // explicitly call out that other people got a heal this person didn't.
    if (missedNames.length < 4) {
      const nameList = missedNames.map((name) => {
        return ShortNamify(name, this.options.PlayerNicks);
      }).join(', ');

      this.collector.OnMistakeObj({
        type: type,
        blame: sourceName,
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
    this.collector.OnMistakeObj({
      type: type,
      blame: sourceName,
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
}
