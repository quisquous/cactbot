import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// Note: Gaoler's Flail 6F56-6601 can hit people but doesn't do damage.
//       Presumably this is the animation/weapon dropping on the ground?

// TODO: shackles could probably be handled with more nuance than just "was it shared"
//       but this is the most common failure mode and is easy to write.

export interface Data extends OopsyData {
  spell?: { [name: string]: 'cold' | 'hot' };
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFirstCircleSavage,
  damageWarn: {
    'P1S Gaoler\'s Flail 1': '6DA6', // go left first
    'P1S Gaoler\'s Flail 2': '6DA7', // go right first
    'P1S Gaoler\'s Flail 3': '6DA8', // go out first
    'P1S Gaoler\'s Flail 4': '6DA9', // go in first
    'P1S Gaoler\'s Flail 5': '6DAA', // go left second
    'P1S Gaoler\'s Flail 6': '6DAB', // go right second
    'P1S Gaoler\'s Flail 7': '6DAC', // go out second
    'P1S Gaoler\'s Flail 8': '6DAD', // go in second
    'P1S Powerful Fire': '661A', // fire explosion during fire/light
    'P1S Powerful Light': '661B', // light explosion during fire/light
    'P1S Intemperate Flames': '6C75', // missed fire temperature square
    'P1S Intemperate Ice': '6C76', // missed ice temperature square
    'P1S Inevitable Flame': '6EC1', // sharing the color with the shackles of time person
    'P1S Inevitable Light': '6EC2', // sharing the color with the shackles of time person
  },
  damageFail: {
    'P1S Disastrous Spell': '6623', // the purple middle blocks during Intemperate
    'P1S Painful Flux': '6624', // standing between temperature squares
  },
  shareFail: {
    'P1S Chain Pain 1': '6627', // close/far shackles
    'P1S Chain Pain 2': '6628', // close/far shackles
  },
  soloFail: {
    'P1S True Holy': '6612', // Pitiless Flail of Grace stack marker
  },
  triggers: [
    {
      id: 'P1S Cold Spell Track',
      type: 'GainsEffect',
      // No need to track this falling off or deleting it.
      // When the next round comes along, it will reassign and give it to somebody.
      // TODO: not sure if somebody dies if this falls off and so maybe we should track losing it?
      netRegex: NetRegexes.gainsEffect({ effectId: 'AB3' }),
      run: (data, matches) => (data.spell ??= {})[matches.target] = 'cold',
    },
    {
      id: 'P1S Hot Spell Track',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AB4' }),
      run: (data, matches) => (data.spell ??= {})[matches.target] = 'hot',
    },
    {
      id: 'P1S Cold Spell',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6622' }),
      condition: (data, matches) => data.spell?.[matches.target] === 'cold',
      mistake: (_data, matches) => {
        return {
          type: 'damage',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      id: 'P1S Hot Spell',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6621' }),
      condition: (data, matches) => data.spell?.[matches.target] === 'hot',
      mistake: (_data, matches) => {
        return {
          type: 'damage',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.ability,
        };
      },
    },
    {
      id: 'P1S Pitiless Flail Knockback',
      type: 'Ability',
      // 660E = grace, 660F = purgation
      netRegex: NetRegexes.ability({ id: ['660E', '660F'] }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed into wall',
            de: 'Rückstoß in die Wand',
            fr: 'Poussé(e) dans le mur',
            ja: '壁へノックバック',
            cn: '击退至墙',
            ko: '벽으로 넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
