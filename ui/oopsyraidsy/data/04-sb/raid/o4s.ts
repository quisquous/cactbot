import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

// TODO: taking the wrong color white/black antilight

export interface Data extends OopsyData {
  isDecisiveBattleElement?: boolean;
  isNeoExdeath?: boolean;
  hasBeyondDeath?: { [name: string]: boolean };
  doubleAttackMatches?: NetMatches['Ability'][];
}

// O4S - Deltascape 4.0 Savage
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DeltascapeV40Savage,
  damageWarn: {
    'O4S Vine Clearout': '240C', // circle of vines
    'O4S Zombie Breath': '240B', // tree exdeath conal
    'O4S Vacuum Wave': '23FE', // circle centered on exdeath

    'O4S Neo Vacuum Wave': '241D', // "out of melee"
    'O4S Death Bomb': '2431', // failed acceleration bomb
    'O4S Emptiness 1': '2421', // exaflares initial
    'O4S Emptiness 2': '2422', // exaflares moving
  },
  damageFail: {
    'O4S Black Hole Black Spark': '2407', // black hole catching you

    'O4S Edge Of Death': '2415', // standing between the two color lasers
    'O4S Inner Antilight': '244C', // inner laser
    'O4S Outer Antilight': '2410', // outer laser
  },
  shareWarn: {
    'O4S Fire III': '23F6', // spread explosion
  },
  shareFail: {
    'O4S Thunder III Tankbuster': '23FA', // tankbuster
  },
  triggers: [
    {
      id: 'O4S Decisive Battle',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '2408', capture: false }),
      run: (data) => {
        data.isDecisiveBattleElement = true;
      },
    },
    {
      id: 'O4S Vacuum Wave Tracker',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '23FE', capture: false }),
      run: (data) => {
        data.isDecisiveBattleElement = false;
      },
    },
    {
      id: 'O4S Almagest',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '2417', capture: false }),
      run: (data) => {
        data.isNeoExdeath = true;
      },
    },
    {
      id: 'O4S Blizzard III',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '23F8', ...playerDamageFields }),
      // Ignore unavoidable raid aoe Blizzard III.
      condition: (data) => !data.isDecisiveBattleElement,
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      id: 'O4S Thunder III',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '23FD', ...playerDamageFields }),
      // Only consider this during random mechanic after decisive battle.
      condition: (data) => data.isDecisiveBattleElement,
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      id: 'O4S Petrified',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '262' }),
      mistake: (data, matches) => {
        // On Neo, being petrified is because you looked at Shriek, so your fault.
        if (data.isNeoExdeath)
          return {
            type: 'fail',
            blame: matches.target,
            reportId: matches.targetId,
            text: matches.effect,
          };
        // On normal ExDeath, this is due to White Hole.
        return {
          type: 'warn',
          name: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
    {
      id: 'O4S Forked Lightning',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '242E', ...playerDamageFields }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      id: 'O4S Beyond Death Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      run: (data, matches) => {
        data.hasBeyondDeath ??= {};
        data.hasBeyondDeath[matches.target] = true;
      },
    },
    {
      id: 'O4S Beyond Death Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '566' }),
      run: (data, matches) => {
        data.hasBeyondDeath ??= {};
        data.hasBeyondDeath[matches.target] = false;
      },
    },
    {
      id: 'O4S Beyond Death',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '566' }),
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 0.5,
      deathReason: (data, matches) => {
        if (!data.hasBeyondDeath)
          return;
        if (!data.hasBeyondDeath[matches.target])
          return;
        return {
          id: matches.targetId,
          name: matches.target,
          text: matches.effect,
        };
      },
    },
    {
      id: 'O4S Double Attack Collect',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '241C', ...playerDamageFields }),
      run: (data, matches) => {
        data.doubleAttackMatches = data.doubleAttackMatches || [];
        data.doubleAttackMatches.push(matches);
      },
    },
    {
      id: 'O4S Double Attack',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '241C', ...playerDamageFields }),
      mistake: (data) => {
        const arr = data.doubleAttackMatches;
        if (!arr)
          return;
        if (arr.length <= 2)
          return;
        // Hard to know who should be in this and who shouldn't, but
        // it should never hit 3 people.
        return { type: 'fail', text: `${arr[0]?.ability ?? ''} x ${arr.length}` };
      },
      run: (data) => delete data.doubleAttackMatches,
    },
  ],
};

export default triggerSet;
