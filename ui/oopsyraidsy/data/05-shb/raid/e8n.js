'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Refulgence$/,
    ko: /^희망의 낙원 에덴: 공명편 \(4\)$/,
  },
  zoneId: ZoneId.EdensVerseRefulgence,
  damageWarn: {
    'Biting Frost': '4DDB', // 270-degree frontal AoE, Shiva
    'Driving Frost': '4DDC', // Rear cone AoE, Shiva
    'Frigid Stone': '4E66', // Small spread circles, phase 1
    'Reflected Axe Kick': '4E00', // Large circle AoE, Frozen Mirror
    'Reflected Scythe Kick': '4E01', // Donut AoE, Frozen Mirror
    'Frigid Eruption': '4E09', // Small circle AoE puddles, phase 1
    'Icicle Impact': '4E0A', // Large circle AoE puddles, phase 1
    'Axe Kick': '4DE2', // Large circle AoE, Shiva
    'Scythe Kick': '4DE3', // Donut AoE, Shiva
    'Reflected Biting Frost': '4DFE', // 270-degree frontal AoE, Frozen Mirror
    'Reflected Driving Frost': '4DFF', // Cone AoE, Frozen Mirror
  },
  damageFail: {
  },
  triggers: [
    {
      id: 'E8N Shining Armor',
      gainsEffectRegex: gLang.kEffect.Stun,
      mistake: function(e) {
        return { type: 'warn', blame: e.targetName, reason: gLang.kEffect.Stun };
      },
    },
    {
      id: 'E8N Heavenly Strike',
      damageRegex: '4DD8',
      deathReason: function(e) {
        return { type: 'fail', name: e.targetName, reason: { en: 'Pushed off!' } };
      },
    },
    {
      id: 'E8N Frost Armor',
      gainsEffectRegex: gLang.kEffect.ThinIce,
      deathReason: function(e) {
        return { type: 'fail', name: e.targetName, reason: { en: 'Slid off!' } };
      },
    },
  ],
}];
