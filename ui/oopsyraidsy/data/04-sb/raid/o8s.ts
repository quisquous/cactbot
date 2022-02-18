import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// TODO: failing meteor towers?

// O8S - Sigmascape 4.0 Savage
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.SigmascapeV40Savage,
  damageWarn: {
    'O8S1 Thrumming Thunder 1': '28CB',
    'O8S1 Thrumming Thunder 2': '28CC',
    'O8S1 Thrumming Thunder 3': '28CD',
    'O8S1 Thrumming Thunder 4': '2B31',
    'O8S1 Thrumming Thunder 5': '2B2F',
    'O8S1 Thrumming Thunder 6': '2B30',
    'O8S1 Blizzard Blitz 1': '28C4',
    'O8S1 Blizzard Blitz 2': '2BCA',
    'O8S1 Inexorable Will': '28DA', // ground circles
    'O8S1 Revolting Ruin': '28D5', // large 180 cleave after Timely Teleport
    'O8S1 Intemperate Will': '28DF', // east 180 cleave
    'O8S1 Gravitational Wave': '28DE', // west 180 cleave
    'O8S2 Blizzard III 1': '2908', // celestriad center circle
    'O8S2 Blizzard III 2': '2909', // celestriad donut
    'O8S2 Thunder III': '290A', // celestriad cross lines
    'O8S2 Trine 1': '290E', // eating the golden dorito
    'O8S2 Trine 2': '290F', // eating the big golden dorito
    'O8S2 Meteor': '2903', // chasing puddles during 2nd forsaken (Meteor 2904 = tower)
    'O8S2 All Things Ending 1': '28F0', // Futures Numbered followup
    'O8S2 All Things Ending 2': '28F2', // Pasts Forgotten followup
    'O8S2 All Things Ending 3': '28F6', // Future's End followup
    'O8S2 All Things Ending 4': '28F9', // Past's End followup
    'O8S2 Wings Of Destruction 1': '28FF', // half cleave
    'O8S2 Wings Of Destruction 2': '28FE', // half cleave
  },
  damageFail: {
    'O8S2 The Mad Head Big Explosion': '28FD', // not touching skull
  },
  shareWarn: {
    'O8S1 Vitrophyre': '28E2', // yellow right tether that must be solo (or knockback)
    'O8S1 Flagrant Fire Spread': '28CF',
    'O8S2 Fire III Spread': '290B', // celestriad spread
    'O8S2 The Mad Head Explosion': '28FC', // skull tethers
  },
  shareFail: {
    'O8S1 Hyperdrive': '28E8', // phase 1 tankbuster
    'O8S2 Hyperdrive': '229128E8', // phase 2 tankbuster
    'O8S2 Wings Of Destruction': '2901', // close/far tank busters
  },
  soloWarn: {
    'O8S1 Flagrant Fire Stack': '28D0',
    'O8S1 Gravitas': '28E0', // purple left tether that must be shared, leaving a puddle
    'O8S1 Indomitable Will': '28D9', // 4x stack markers
    'O8S2 Fire III Stack': '290C', // celestriad stack
  },
  triggers: [
    {
      // Look away; does damage if failed.
      id: 'O8S Indolent Will',
      type: 'AbilityFull',
      netRegex: NetRegexes.abilityFull({ id: '28E4', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
    {
      // Look towards; does damage if failed.
      id: 'O8S Ave Maria',
      type: 'AbilityFull',
      netRegex: NetRegexes.abilityFull({ id: '28E3', ...playerDamageFields }),
      condition: (data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_data, matches) => {
        return { type: 'warn', blame: matches.target, reportId: matches.targetId, text: matches.ability };
      },
    },
    {
      id: 'O8S Shockwave',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '28DB' }),
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
      id: 'O8S Aero Assault',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '28D6' }),
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
