import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// O8N - Sigmascape 4.0 Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.SigmascapeV40,
  damageWarn: {
    'O8N Blizzard Blitz 1': '2918',
    'O8N Blizzard Blitz 2': '2914',
    'O8N Thrumming Thunder 1': '291D',
    'O8N Thrumming Thunder 2': '291C',
    'O8N Thrumming Thunder 3': '291B',
    'O8N Wave Cannon': '2928', // telegraphed line aoes
    'O8N Revolting Ruin': '2923', // large 180 cleave after Timely Teleport
    'O8N Intemperate Will': '292A', // east 180 cleave
    'O8N Gravitational Wave': '292B', // west 180 cleave
  },
  shareWarn: {
    'O8N Flagrant Fire Spread': '291F', // true spread markers
  },
  soloWarn: {
    'O8N Flagrant Fire Stack': '2920', // fake spread marker
  },
  triggers: [
    {
      // Look away; does damage if failed.
      id: 'O8N Indolent Will',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '292C', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
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
      // Look towards; does damage if failed.
      id: 'O8N Ave Maria',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '292B', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
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
      id: 'O8N Shockwave',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '2927' }),
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
      id: 'O8N Aero Assault',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '2924' }),
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
  ],
};

export default triggerSet;
