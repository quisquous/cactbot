import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

import { playerDamageFields } from '../../../oopsy_common';

export default {
  zoneId: ZoneId.TheGreatGubalLibraryHard,
  damageWarn: {
    'GubalHm Terror Eye': '930', // Circle AoE, Spine Breaker trash
    'GubalHm Batter': '198A', // Circle AoE, trash before boss 1
    'GubalHm Condemnation': '390', // Conal AoE, Bibliovore trash
    'GubalHm Discontinue 1': '1943', // Falling book shadow, boss 1
    'GubalHm Discontinue 2': '1940', // Rush AoE from ends, boss 1
    'GubalHm Discontinue 3': '1942', // Rush AoE across, boss 1
    'GubalHm Frightful Roar': '193B', // Get-Out AoE, boss 1
    'GubalHm Issue 1': '193D', // Initial end book warning AoE, boss 1
    'GubalHm Issue 2': '193F', // Initial end book warning AoE, boss 1
    'GubalHm Issue 3': '1941', // Initial side book warning AoE, boss 1
    'GubalHm Desolation': '198C', // Line AoE, Biblioclast trash
    'GubalHm Double Smash': '26A', // Conal AoE, Biblioclast trash
    'GubalHm Darkness': '3A0', // Conal AoE, Inkstain trash
    'GubalHm Firewater': '3BA', // Circle AoE, Biblioclast trash
    'GubalHm Elbow Drop': 'CBA', // Conal AoE, Biblioclast trash
    'GubalHm Dark': '19DF', // Large circle AoE, Inkstain trash
    'GubalHm Seals': '194A', // Sun/Moonseal failure, boss 2
    'GubalHm Water III': '1C67', // Large circle AoE, Porogo Pegist trash
    'GubalHm Raging Axe': '1703', // Small conal AoE, Mechanoservitor trash
    'GubalHm Magic Hammer': '1990', // Large circle AoE, Apanda mini-boss
    'GubalHm Properties Of Gravity': '1950', // Circle AoE from gravity puddles, boss 3
    'GubalHm Properties Of Levitation': '194F', // Circle AoE from levitation puddles, boss 3
    'GubalHm Comet': '1969', // Small circle AoE, intermission, boss 3
  },
  damageFail: {
    'GubalHm Ecliptic Meteor': '195C', // LoS mechanic, boss 3
  },
  shareWarn: {
    'GubalHm Searing Wind': '1944', // Tank cleave, boss 2
    'GubalHm Thunder': '19[AB]', // Spread marker, boss 3
  },
  triggers: [
    {
      // Fire gate in hallway to boss 2, magnet failure on boss 2
      id: 'GubalHm Burns',
      netRegex: NetRegexes.gainsEffect({ effectId: '10B' }),
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.effect };
      },
    },
    {
      // Helper for Thunder 3 failures
      id: 'GubalHm Imp Gain',
      netRegex: NetRegexes.gainsEffect({ effectId: '46E' }),
      run: (_e, data, matches) => {
        data.hasImp = data.hasImp || {};
        data.hasImp[matches.target] = true;
      },
    },
    {
      id: 'GubalHm Imp Lose',
      netRegex: NetRegexes.losesEffect({ effectId: '46E' }),
      run: (_e, data, matches) => {
        data.hasImp = data.hasImp || {};
        data.hasImp[matches.target] = false;
      },
    },
    {
      // Targets with Imp when Thunder III resolves receive a vulnerability stack and brief stun
      id: 'GubalHm Imp Thunder',
      netRegex: NetRegexes.abilityFull({ id: '195[AB]', ...playerDamageFields }),
      condition: (_e, data, matches) => data.hasImp[matches.target],
      mistake: (_e, _data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          text: {
            en: 'Shocked Imp',
            de: 'Schockierter Imp',
            ja: 'カッパを解除しなかった',
            cn: '河童状态吃了暴雷',
          },
        };
      },
    },
    {
      id: 'GubalHm Quake',
      netRegex: NetRegexes.abilityFull({ id: '1956', ...playerDamageFields }),
      // Always hits target, but if correctly resolved will deal 0 damage
      condition: (_e, data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
    {
      id: 'GubalHm Tornado',
      netRegex: NetRegexes.abilityFull({ id: '195[78]', ...playerDamageFields }),
      // Always hits target, but if correctly resolved will deal 0 damage
      condition: (_e, data, matches) => data.DamageFromMatches(matches) > 0,
      mistake: (_e, _data, matches) => {
        return { type: 'warn', blame: matches.target, text: matches.ability };
      },
    },
  ],
};
