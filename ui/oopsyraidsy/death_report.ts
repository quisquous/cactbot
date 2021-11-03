import { Lang } from '../../resources/languages';
import logDefinitions from '../../resources/netlog_defs';
import { OopsyMistake } from '../../types/oopsy';

import { TrackedEvent, TrackedLineEvent, TrackedLineEventType } from './effect_tracker';
import {
  kAttackFlags,
  kHealFlags,
  kShiftFlagValues,
  Translate,
  UnscrambleDamage,
} from './oopsy_common';

// TODO: lots of things left to do with death reports
// * probably include max hp as well?
// * handle DeathReason (right now it is not shown, other than in the summary line)
// * include other mistakes (simple / triggers)
//   * add log timestamps to all mistakes (not a big deal, but just a bunch of plumbing)
//   * ignore simple damage/missed buffs as those are handled separately
// * consolidate HoT/DoT (with expandable CSS)
// * show mitigation effects that are active during damage (with icons?? or at least text to start?)
//   * also need to track effects that are active prior to the set of events passed in
//   * also need to handle effects lost (and gained?!) after death
// * consolidate multiple damage that killed (e.g. Solemn Confiteor x4) into summary text
// * maybe if a player is fully healed, trim abilities before that?

const processAbilityLine = (splitLine: string[]) => {
  const flagIdx = logDefinitions.Ability.fields.flags;
  let flags = splitLine[flagIdx] ?? '';
  let damage = splitLine[flagIdx + 1] ?? '';
  if (kShiftFlagValues.includes(flags)) {
    flags = splitLine[flagIdx + 2] ?? flags;
    damage = splitLine[flagIdx + 3] ?? damage;
  }

  const amount = UnscrambleDamage(damage);
  const lowByte = `00${flags}`.substr(-2);

  return {
    amount: amount,
    lowByte: lowByte,
    flags: flags,
    isHeal: kHealFlags.includes(lowByte),
    isAttack: kAttackFlags.includes(lowByte),
  };
};

export type ParsedDeathReportLine = {
  timestamp: number;
  timestampStr: string;
  type: TrackedLineEventType;
  currentHp?: number;
  amount?: number;
  amountStr?: string;
  amountClass?: string;
  icon?: string;
  text?: string;
};

// Contains all the information to display information about a player's death.
// `events` contain the last N seconds of tracked line events that pertain to the player.
// This class's job is to sort through those raw lines and generate a subset of parsed
// lines that various views might want to display in some fashion.
export class DeathReport {
  private parsedReportLines?: ParsedDeathReportLine[];

  constructor(
    private lang: Lang,
    private baseTimestamp: number | undefined,
    public deathTimestamp: number,
    public targetId: string,
    public targetName: string,
    private events: TrackedEvent[],
  ) {
  }

  // Generates an OopsyMistake that represents this DeathReport.
  public generateMistake(): OopsyMistake {
    // Walk backward through events until we find the last damage or a death reason.
    for (let i = this.events.length - 1; i >= 0; i--) {
      const event = this.events[i];
      if (!event)
        break;
      if (event.type === 'DeathReason') {
        return {
          type: 'death',
          name: this.targetName,
          text: event.text,
          report: this,
        };
      }

      // TODO: consider combining multiple abilities that are taken in a very
      // short period of time, e.g. "A + B" or "C x4".
      if (event.type === 'Ability') {
        const ability = processAbilityLine(event.splitLine);
        if (ability.isAttack && ability.amount > 0) {
          const abilityName = event.splitLine[logDefinitions.Ability.fields.ability] ?? '???';
          const currentHp = event.splitLine[logDefinitions.Ability.fields.targetCurrentHp] ?? '???';
          const text = `${abilityName} (${ability.amount}/${currentHp})`;
          return {
            type: 'death',
            name: this.targetName,
            text: text,
            report: this,
          };
        }
      }
    }

    return {
      type: 'death',
      name: this.targetName,
      text: '???',
      report: this,
    };
  }

  // A helper function to turn a timestamp into a string relative to this DeathReport.
  // The base timestamp it is relative to is generally the start of the fight.
  makeRelativeTimeString(timestamp: number): string {
    const base = this.baseTimestamp;
    if (!base)
      return '';
    const deltaMs = timestamp - base;
    const prefix = deltaMs < 0 ? '-' : '';
    const deltaTotalSeconds = Math.round(Math.abs(deltaMs) / 1000);
    const deltaSeconds = `00${deltaTotalSeconds % 60}`.substr(-2);
    const deltaMinutes = Math.floor(deltaTotalSeconds / 60);
    return `${prefix}${deltaMinutes}:${deltaSeconds}`;
  }

  // Lazily do some work to process the tracked lines from `this.events` into something that
  // can be displayed to the user.  This is the model for the live/summary views.
  public parseReportLines(): ParsedDeathReportLine[] {
    if (this.parsedReportLines)
      return this.parsedReportLines;

    this.parsedReportLines = [];

    let lastCertainHp: number | undefined = undefined;
    let currentHp: number | undefined = undefined;

    for (const event of this.events) {
      let parsed: ParsedDeathReportLine | undefined = undefined;
      if (event.type === 'Ability')
        parsed = this.processAbility(event);
      else if (event.type === 'HoTDoT')
        parsed = this.processHoTDoT(event);
      else if (event.type === 'MissedAbility' || event.type === 'MissedEffect')
        parsed = this.processMissedBuff(event);

      if (!parsed)
        continue;

      // Touch up the hp so it looks more valid.  There are only hp fields on certain
      // log lines, and more importantly it is polled from memory.  Therefore, if a
      // player takes a bunch of attacks simultaneously, the hp will be the same on
      // every line.  This looks incorrect, so do our best to fix this up.
      if (currentHp === undefined || lastCertainHp === undefined) {
        // If we haven't seen any log lines with hp yet, try to set it as an initial guess.
        currentHp = parsed.currentHp;
        lastCertainHp = parsed.currentHp;
      } else if (parsed.currentHp !== lastCertainHp) {
        // If we see a new hp value, then this is likely valid.
        currentHp = lastCertainHp = parsed.currentHp;
      } else {
        // For log lines that don't have a hitpoints line, fill in our best guess.
        // Or, we're seeing an identical hp value, so use previously adjusted amount.
        parsed.currentHp = currentHp;
      }

      // Note: parsed.amount < 0 is damage, parsed.amount > 0 is heals.
      if (currentHp !== undefined && parsed.amount !== undefined) {
        // If this attack killed somebody (or this is overkill), set an icon unless there's
        // already a mistake icon set.  Don't do this for belated heals because it looks weird.
        if (parsed.amount < 0 && currentHp + parsed.amount <= 0)
          parsed.icon ??= 'death';

        // TODO: maybe use max hp here to clamp this?
        currentHp += parsed.amount;
      }

      this.parsedReportLines.push(parsed);
    }

    return this.parsedReportLines;
  }

  processGainsEffect(event: TrackedLineEvent): ParsedDeathReportLine {
    // TODO: we also need to filter effects that we don't care about, e.g. swiftcast?
    const effectName = event.splitLine[logDefinitions.GainsEffect.fields.effect] ?? '???';

    const text = Translate(this.lang, {
      en: `Gain: ${effectName}`,
      de: `Erhalten: ${effectName}`,
      ja: `獲得: ${effectName}`,
      cn: `获得: ${effectName}`,
      ko: `얻음: ${effectName}`,
    });
    return {
      timestamp: event.timestamp,
      timestampStr: this.makeRelativeTimeString(event.timestamp),
      type: event.type,
      text: text,
    };
  }

  processLosesEffect(event: TrackedLineEvent): ParsedDeathReportLine {
    // TODO: we also need to filter effects that we don't care about, e.g. swiftcast?
    const effectName = event.splitLine[logDefinitions.LosesEffect.fields.effect] ?? '???';

    const text = Translate(this.lang, {
      en: `Lose: ${effectName}`,
      de: `Verloren: ${effectName}`,
      ja: `失う: ${effectName}`,
      cn: `失去: ${effectName}`,
      ko: `잃음: ${effectName}`,
    });
    return {
      timestamp: event.timestamp,
      timestampStr: this.makeRelativeTimeString(event.timestamp),
      type: event.type,
      text: text,
    };
  }

  private processAbility(event: TrackedLineEvent): ParsedDeathReportLine | undefined {
    const splitLine = event.splitLine;
    const ability = processAbilityLine(splitLine);

    // Zero damage abilities can be noisy and don't contribute much information, so skip.
    if (ability.amount === 0)
      return;

    let amount;

    let amountClass: string | undefined;
    let amountStr: string | undefined;
    if (ability.isHeal) {
      amountClass = 'heal';
      amountStr = ability.amount > 0 ? `+${ability.amount.toString()}` : ability.amount.toString();
      amount = ability.amount;
    } else if (ability.isAttack) {
      amountClass = 'damage';
      amountStr = ability.amount > 0 ? `-${ability.amount.toString()}` : ability.amount.toString();
      amount = -1 * ability.amount;
    }

    // Ignore abilities that are not damage or heals.  Any important abilities should generate an
    // effect.
    if (amountClass === undefined || amountStr === undefined)
      return;

    const abilityName = splitLine[logDefinitions.Ability.fields.ability] ?? '???';
    const currentHpStr = splitLine[logDefinitions.Ability.fields.targetCurrentHp];
    const currentHp = currentHpStr !== undefined ? parseInt(currentHpStr) : 0;
    return {
      timestamp: event.timestamp,
      timestampStr: this.makeRelativeTimeString(event.timestamp),
      type: event.type,
      currentHp: currentHp,
      amount: amount,
      amountStr: amountStr,
      amountClass: amountClass,
      icon: event.mistake,
      text: abilityName,
    };
  }

  private processHoTDoT(event: TrackedLineEvent): ParsedDeathReportLine | undefined {
    const which = event.splitLine[logDefinitions.NetworkDoT.fields.which];
    const isHeal = which === 'HoT';

    // Note: this amount is just raw bytes, and not the UnscrambleDamage version.
    let amount = parseInt(event.splitLine[logDefinitions.NetworkDoT.fields.damage] ?? '', 16);
    if (amount <= 0)
      return;

    let amountClass: string;
    let amountStr: string;
    if (isHeal) {
      amountClass = 'heal';
      amountStr = amount > 0 ? `+${amount.toString()}` : amount.toString();
    } else {
      amountClass = 'damage';
      amountStr = amount > 0 ? `-${amount.toString()}` : amount.toString();
      amount *= -1;
    }

    const currentHpStr = event.splitLine[logDefinitions.NetworkDoT.fields.currentHp];
    const currentHp = currentHpStr !== undefined ? parseInt(currentHpStr) : 0;

    // TODO: this line has an effect id, but we don't have an id -> string mapping for all ids.
    // We could consider looking this up in effects to try to find a name, but common ones
    // like Regen or Asylum aren't mapped there.
    return {
      timestamp: event.timestamp,
      timestampStr: this.makeRelativeTimeString(event.timestamp),
      type: event.type,
      currentHp: currentHp,
      amount: amount,
      amountStr: amountStr,
      amountClass: amountClass,
      text: which,
    };
  }

  private processMissedBuff(event: TrackedLineEvent): ParsedDeathReportLine | undefined {
    let buffName: string | undefined;
    let sourceName: string | undefined;

    if (event.type === 'MissedAbility') {
      buffName = event.splitLine[logDefinitions.Ability.fields.ability];
      sourceName = event.splitLine[logDefinitions.Ability.fields.source];
    } else if (event.type === 'MissedEffect') {
      buffName = event.splitLine[logDefinitions.GainsEffect.fields.effect];
      sourceName = event.splitLine[logDefinitions.GainsEffect.fields.source];
    }

    if (!buffName || !sourceName)
      return;

    const text = Translate(this.lang, {
      en: `Missed ${buffName} (${sourceName})`,
      de: `${buffName} verfehlte (${sourceName})`,
      ja: `${buffName}をミスした (${sourceName}から)`,
      cn: `没吃到 ${buffName} (来自${sourceName})`,
      ko: `${buffName} 놓침 (${sourceName})`,
    });
    return {
      timestamp: event.timestamp,
      timestampStr: this.makeRelativeTimeString(event.timestamp),
      type: event.type,
      icon: 'heal',
      text: Translate(this.lang, text),
    };
  }
}
