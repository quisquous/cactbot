import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

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
      mistake: (e) => {
        return { type: 'warn', blame: e.target, text: e.effect };
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
      damageRegex: '195[AB]',
      condition: (e, data) => data.hasImp[e.targetName],
      mistake: (e) => {
        return {
          type: 'warn',
          blame: e.targetName,
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
      damageRegex: '1956',
      condition: (e) => {
        // Always hits target, but if correctly resolved will deal 0 damage
        return e.damage > 0;
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'GubalHm Tornado',
      damageRegex: '195[78]',
      condition: (e) => {
        // Always hits target, but if correctly resolved will deal 0 damage
        return e.damage > 0;
      },
      mistake: (e) => {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
};
