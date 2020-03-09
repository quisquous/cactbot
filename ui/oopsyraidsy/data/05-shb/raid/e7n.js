'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Iconoclasm$/,
    ko: /^희망의 낙원 에덴: 공명편 \(3\)$/,
  },
  damageWarn: {
    '4C55': 'Stygian Sword', // Circle ground AoEs after False Twilight
    '4C4C': 'Strength In Numbers 1', // Large donut ground AoEs, intermission
    '4C4D': 'Strength In Numbers 2', // Large circle ground AoEs, intermission
  },
  damageFail: {
  },
  triggers: [
    {
      id: 'E7N Stygian Stake', // Laser tank buster, outside intermission phase
      damageRegex: '4C33',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      id: 'E5N Silver Shot', // Spread markers, intermission
      damageRegex: '4E7D',
      condition: function(e) {
        return e.type != '15';
      },
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, text: e.abilityName };
      },
    },
    {
      // If we don't set this up ahead of time, the Dark/Light Course triggers will fail
      // on the first two uses of Light's Course, since the Astral/Umbral properties wouldn't exist.
      id: 'E7N Debuff Setup',
      regex: Regexes.startsUsing({ source: 'The Idol Of Darkness', id: '4C2C' }),
      condition: function(e, data) {
        return !(data.hasAstral && data.hasUmbral);
      },
      run: function(e, data) {
        data.hasAstral = data.hasAstral || {};
        data.hasUmbral = data.hasUmbral || {};
      },
    },
    {
      id: 'E7N Astral Tracking',
      gainsEffectRegex: gLang.kEffect.AstralEffect,
      losesEffectRegex: gLang.kEffect.AstralEffect,
      run: function(e, data) {
        data.hasAstral[e.targetName] = e.gains;
      },
    },
    {
      id: 'E7N Umbral Tracking',
      gainsEffectRegex: gLang.kEffect.UmbralEffect,
      losesEffectRegex: gLang.kEffect.UmbralEffect,
      run: function(e, data) {
        data.hasUmbral[e.targetName] = e.gains;
      },
    },
    {
      id: 'E7N Light\'s Course',
      // Would be nice to use an array instead, as
      // damageRegex: ['4C3E', '4C40', '4C22', '4C3C', '4E63']
      // rather than this awful cup of regex soup.
      // We could instead split this out into individual triggers for each ID,
      // but that seems ridiculous.
      damageRegex: '(?:4C(?:22|40|3[CE])|4E63)',
      condition: function(e, data) {
        return !data.hasUmbral[e.targetName];
      },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName + ' wrong/no buff' };
      },
    },
    {
      id: 'E7N Darks\'s Course',
      // damageRegex: ['4C3D', '4C23', '4C41', '4C43']
      damageRegex: '4C(?:23|3D|4[13])',
      condition: function(e, data) {
        return !data.hasAstral[e.targetName];
      },
      mistake: function(e) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName + ' wrong/no buff' };
      },
    },
  ],
}];
