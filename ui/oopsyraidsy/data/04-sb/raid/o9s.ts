import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export interface Data extends OopsyData {
  hasHeadwind?: { [name: string]: boolean };
  hasPrimordial?: { [name: string]: boolean };
}

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlphascapeV10Savage,
  damageWarn: {
    'O9S Shockwave': '3174', // Longitudinal/Latiudinal Implosion
    'O9S Damning Edict': '3171', // huge 180 frontal cleave
    'O9S Knockdown Big Bang': '3181', // big circle where Knockdown marker dropped
    'O9S Fire Big Bang': '3180', // ground circles during fire phase
    'O9S Chaosphere Fiendish Orbs Orbshadow 1': '3183', // line aoes from Earth phase orbs
    'O9S Chaosphere Fiendish Orbs Orbshadow 2': '3184', // line aoes from Earth phase orbs
  },
  triggers: [
    {
      // Facing the wrong way for Headwind/Tailwaind
      id: 'O9S Cyclone Knocked Off',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '318F' }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Knocked off',
            de: 'Runtergefallen',
            fr: 'Renversé(e)',
            ja: 'ノックバック',
            cn: '击退坠落',
            ko: '넉백',
          },
        };
      },
    },
    {
      id: 'O9S Headwind Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '642' }),
      run: (data, matches) => (data.hasHeadwind ??= {})[matches.target] = true,
    },
    {
      id: 'O9S Headwind Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '642' }),
      run: (data, matches) => (data.hasHeadwind ??= {})[matches.target] = false,
    },
    {
      id: 'O9S Primordial Gain',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '645' }),
      run: (data, matches) => (data.hasPrimordial ??= {})[matches.target] = true,
    },
    {
      id: 'O9S Primordial Lose',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: '645' }),
      run: (data, matches) => (data.hasPrimordial ??= {})[matches.target] = false,
    },
    {
      // Entropy debuff circle explosion.
      // During the midphase, tanks/healers need to clear headwind with Entropy circle and
      // dps need to clear Primordial Crust with Dynamic Fluid donut.  In case there's
      // some other strategy, just check both debuffs.
      id: 'O9S Stray Flames',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '318C' }),
      condition: (data, matches) => {
        return !data.hasHeadwind?.[matches.target] && !data.hasPrimordial?.[matches.target];
      },
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
    {
      // Dynamic Fluid debuff donut explosion.
      // See Stray Flames note above.
      id: 'O9S Stray Spray',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '318D' }),
      condition: (data, matches) => {
        return !data.hasHeadwind?.[matches.target] && !data.hasPrimordial?.[matches.target];
      },
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
