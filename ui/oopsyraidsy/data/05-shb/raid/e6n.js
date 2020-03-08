'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Furor$/,
    ko: /^희망의 낙원 에덴: 공명편 \(2\)$/,
  },
  damageWarn: {
    '4BDA': 'Thorns', // AoE markers after Enumeration
    '4BDD': 'Ferostorm 1',
    '4BE0': 'Storm of Fury 1', // Circle AoE during tethers--Garuda
    '4BE2': 'Explosion', // AoE circles, Garuda orbs
    '4BE5': 'Ferostorm 2',
    '4BE6': 'Storm Of Fury 2', // Circle AoE during tethers--Raktapaksa
    '4BEC': 'Heat Burst',
    '4BEE': 'Conflag Strike', // 270-degree frontal AoE
    '4BF0': 'Spike Of Flame', // Orb explosions after Strike Spark
    '4BF2': 'Radiant Plume',
    '4BF4': 'Eruption',
  },
  damageFail: {
    '4BD5': 'Vacuum Slice', // Dark line AoE from Garuda
    '4BDB': 'Downburst', // Blue knockback circle. Actual knockback is unknown ability 4C20
  },
  triggers: [
    {
      id: 'E6N Instant Incineration',
      damageRegex: '4BED',
      condition: function(e) {
        // Double taps only
        return e.type != '15';
      },
      mistake: function(e) {
        // This is a failure because it will kill non-tanks
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    }
  ],
}];
