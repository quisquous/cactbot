import logDefinitions from '../../resources/netlog_defs';

import { MissableAbility, MissableEffect } from './buff_map';

// Abilities seem roughly instant.
// Observation: up to ~1.2 seconds for an effect to roll through the party.
const defaultCollectSeconds = 0.5;

export type CollectedBuff = {
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
export class MissedBuffCollector {
  private buffs: { [sourceId: string]: { [buffId: string]: CollectedBuff } } = {};

  constructor(
    private requestTimestampCallback: RequestTimestampCallback,
    private collectedBuffCallback: CollectedBuffCallback,
  ) {
  }

  // TODO: call something like this on zone change, etc?
  ExpireBuffsIfNeeded(timestamp: number): void {
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
