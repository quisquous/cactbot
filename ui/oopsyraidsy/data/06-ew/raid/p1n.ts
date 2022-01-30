import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export interface Data extends OopsyData {
  spell?: { [name: string]: 'cold' | 'hot' };
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheFirstCircle,
  damageWarn: {
    'P1N Gaoler\'s Flail 1': '6DA2', // left/right 180 cleave
    'P1N Gaoler\'s Flail 2': '6DA3', // left/right 180 cleave
    'P1N Powerful Light': '65ED', // light explosion during fire/light
    'P1N Powerful Fire': '65EC', // fire explosion during fire/light
  },
  damageFail: {
    'P1N Painful Flux': '65F2', // standing in cross between hot/cold sections
  },
  soloWarn: {
    'P1N True Holy': '65E7', // Pitiless Flail stack marker
  },
  triggers: [
    {
      id: 'P1N Cold Spell Track',
      type: 'GainsEffect',
      // No need to track this falling off or deleting it.
      // When the next round comes along, it will reassign and give it to somebody.
      // TODO: not sure if somebody dies if this falls off and so maybe we should track losing it?
      netRegex: NetRegexes.gainsEffect({ effectId: 'AB3' }),
      run: (data, matches) => (data.spell ??= {})[matches.target] = 'cold',
    },
    {
      id: 'P1N Hot Spell Track',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'AB4' }),
      run: (data, matches) => (data.spell ??= {})[matches.target] = 'hot',
    },
    {
      id: 'P1N Cold Spell',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '65F1' }),
      condition: (data, matches) => data.spell?.[matches.target] === 'cold',
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
      id: 'P1N Hot Spell',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '65F0' }),
      condition: (data, matches) => data.spell?.[matches.target] === 'hot',
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
      id: 'P1N Pitiless Flail Knockback',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '65E5' }),
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
