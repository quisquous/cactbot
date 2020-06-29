'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Furor$/,
    ko: /^희망의 낙원 에덴: 공명편 \(2\)$/,
  },
  zoneId: ZoneId.EdensVerseFuror,
  damageWarn: {
    'Thorns': '4BDA', // AoE markers after Enumeration
    'Ferostorm 1': '4BDD',
    'Ferostorm 2': '4BE5',
    'Storm Of Fury 1': '4BE0', // Circle AoE during tethers--Garuda
    'Storm Of Fury 2': '4BE6', // Circle AoE during tethers--Raktapaksa
    'Explosion': '4BE2', // AoE circles, Garuda orbs
    'Heat Burst': '4BEC',
    'Conflag Strike': '4BEE', // 270-degree frontal AoE
    'Spike Of Flame': '4BF0', // Orb explosions after Strike Spark
    'Radiant Plume': '4BF2',
    'Eruption': '4BF4',
  },
  damageFail: {
    'Vacuum Slice': '4BD5', // Dark line AoE from Garuda
    'Downburst': '4BDB', // Blue knockback circle. Actual knockback is unknown ability 4C20
  },
  shareFail: {
    // Kills non-tanks who get hit by it.
    'E6N Instant Incineration': '4BED',
  },
}];
