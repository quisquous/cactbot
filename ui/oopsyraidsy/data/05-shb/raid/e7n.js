'use strict';

let wrongBuff = (str) => {
  return {
    en: str + ' (wrong buff)',
    de: str + ' (falscher Buff)',
    fr: str + ' (mauvais buff)',
  };
};

let noBuff = (str) => {
  return {
    en: str + ' (no buff)',
    de: str + ' (kein Buff)',
    fr: str + ' (pas de buff)',
  };
};

[{
  zoneRegex: {
    en: /^Eden's Verse: Iconoclasm$/,
    ko: /^희망의 낙원 에덴: 공명편 \(3\)$/,
  },
  zoneId: ZoneId.EdensVerseIconoclasm,
  damageWarn: {
    'Stygian Sword': '4C55', // Circle ground AoEs after False Twilight
    'Strength In Numbers Donut': '4C4C', // Large donut ground AoEs, intermission
    'Strength In Numbers 2': '4C4D', // Large circle ground AoEs, intermission
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
      id: 'E7N Astral Tracking',
      gainsEffectRegex: gLang.kEffect.AstralEffect,
      losesEffectRegex: gLang.kEffect.AstralEffect,
      run: function(e, data) {
        data.hasAstral = data.hasAstral || {};
        data.hasAstral[e.targetName] = e.gains;
      },
    },
    {
      id: 'E7N Umbral Tracking',
      gainsEffectRegex: gLang.kEffect.UmbralEffect,
      losesEffectRegex: gLang.kEffect.UmbralEffect,
      run: function(e, data) {
        data.hasUmbral = data.hasUmbral || {};
        data.hasUmbral[e.targetName] = e.gains;
      },
    },
    {
      id: 'E7N Light\'s Course',
      damageRegex: ['4C3E', '4C40', '4C22', '4C3C', '4E63'],
      condition: function(e, data) {
        return !data.hasUmbral || !data.hasUmbral[e.targetName];
      },
      mistake: function(e, data) {
        if (data.hasAstral && data.hasAstral[e.targetName])
          return { type: 'fail', blame: e.targetName, text: wrongBuff(e.abilityName) };
        return { type: 'warn', blame: e.targetName, text: noBuff(e.abilityName) };
      },
    },
    {
      id: 'E7N Darks\'s Course',
      damageRegex: ['4C3D', '4C23', '4C41', '4C43'],
      condition: function(e, data) {
        return !data.hasAstral || !data.hasAstral[e.targetName];
      },
      mistake: function(e) {
        if (data.hasUmbral && data.hasUmbral[e.targetName])
          return { type: 'fail', blame: e.targetName, text: wrongBuff(e.abilityName) };
        // This case is probably impossible, as the debuff ticks after death,
        // but leaving it here in case there's some rez or disconnect timing
        // that could lead to this.
        return { type: 'warn', blame: e.targetName, text: noBuff(e.abilityName) };
      },
    },
  ],
}];
