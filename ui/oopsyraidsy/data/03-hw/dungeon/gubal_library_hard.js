'use strict';

// Great Gubal Library (Hard)
[{
  zoneRegex: {
    en: /Great Gubal Library \(Hard\)/,
    ko: /^구브라 환상도서관\(어려움\)$/,
  },
  zoneId: ZoneId.TheGreatGubalLibraryHard,
  damageWarn: {
    'Gubal Hard Terror Eye': '930', // Circle AoE, Spine Breaker trash
    'Gubal Hard Batter': '198A', // Circle AoE, trash before boss 1
    'Gubal Hard Condemnation': '390', // Conal AoE, Bibliovore trash
    'Gubal Hard Discontinue 1': '1943', // Falling book shadow, boss 1
    'Gubal Hard Discontinue 2': '1940', // Rush AoE from ends, boss 1
    'Gubal Hard Discontinue 3': '1942', // Rush AoE across, boss 1
    'Gubal Hard Frightful Roar': '193B', // Get-Out AoE, boss 1
    'Gubal Hard Issue 1': '193D', // Initial end book warning AoE, boss 1
    'Gubal Hard Issue 2': '193F', // Initial end book warning AoE, boss 1
    'Gubal Hard Issue 3': '1941', // Initial side book warning AoE, boss 1
    'Gubal Hard Desolation': '198C', // Line AoE, Biblioclast trash
    'Gubal Hard Double Smash': '26A', // Conal AoE, Biblioclast trash
    'Gubal Hard Darkness': '3A0', // Conal AoE, Inkstain trash
    'Gubal Hard Firewater': '3BA', // Circle AoE, Biblioclast trash
    'Gubal Hard Elbow Drop': 'CBA', // Conal AoE, Biblioclast trash
    'Gubal Hard Dark': '19DF', // Large circle AoE, Inkstain trash
    'Gubal Hard Seals': '194A', // Sun/Moonseal failure, boss 2
    'Gubal Hard Water III': '1C67', // Large circle AoE, Porogo Pegist trash
    'Gubal Hard Raging Axe': '1703', // Small conal AoE, Mechanoservitor trash
    'Gubal Hard Magic Hammer': '1990', // Large circle AoE, Apanda mini-boss
    'Gubal Hard Properties Of Gravity': '1950', // Circle AoE from gravity puddles, boss 3
    'Gubal Hard Properties Of Levitation': '194F', // Circle AoE from levitation puddles, boss 3
    'Gubal Hard Comet': '1969', // Small circle AoE, intermission, boss 3
  },
  damageFail: {
    'Gubal Hard Ecliptic Meteor': '195C', // LoS mechanic, boss 3
  },
  shareWarn: {
    'Gubal Hard Searing Wind': '1944', // Tank cleave, boss 2
    'Gubal Hard Thunder': '19[AB]', // Spread marker, boss 3
  },
  triggers: [
    {
      id: 'Gubal Hard Burns', // Fire gate in hallway to boss 2, magnet failure on boss 2
      gainsEffectRegex: gLang.kEffect.Burns,
      mistake: function(e, data) {
        return { type: 'warn', blame: e.targetName, text: e.effectName };
      },
    },
    {
      // Helper for Thunder 3 failures
      id: 'Gubal Hard Imp Tracking',
      gainsEffectRegex: gLang.kEffect.Imp,
      losesEffectRegex: gLang.kEffect.Imp,
      run: function(e, data) {
        data.hasImp = data.hasImp || {};
        data.hasImp[e.targetName] = e.gains;
      },
    },
    {
      // Targets with Imp when Thunder III resolves receive a vulnerability stack and brief stun
      id: 'Gubal Hard Imp Thunder',
      damageRegex: '195[AB]',
      condition: function(e, data) {
        return data.hasImp[e.targetName];
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: 'Shocked Imp' };
      },
    },
    {
      id: 'Gubal Hard Quake',
      damageRegex: '1956',
      condition: function(e) {
        // Always hits target, but if correctly resolved will deal 0 damage
        return e.damage > 0;
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'Gubal Hard Tornado',
      damageRegex: '195[78]',
      condition: function(e) {
        // Always hits target, but if correctly resolved will deal 0 damage
        return e.damage > 0;
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
