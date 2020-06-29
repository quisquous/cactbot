'use strict';

// TODO: check tethers being cut (when they shouldn't)
// TODO: check for concussed debuff
// TODO: check for taking tankbuster with lightheaded
// TODO: check for one person taking multiple Storm Of Fury Tethers (4C01/4C08)

[{
  zoneRegex: {
    en: /^Eden's Verse: Furor \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(2\)$/,
  },
  zoneId: ZoneId.EdensVerseFurorSavage,
  damageWarn: {
    // It's common to just ignore futbol mechanics, so don't warn on Strike Spark.
    // 'Spike Of Flame': '4C13', // Orb explosions after Strike Spark

    'Thorns': '4BFA', // AoE markers after Enumeration
    'Ferostorm 1': '4BFD',
    'Ferostorm 2': '4C06',
    'Storm Of Fury 1': '4C00', // Circle AoE during tethers--Garuda
    'Storm Of Fury 2': '4C07', // Circle AoE during tethers--Raktapaksa
    'Explosion': '4C03', // AoE circles, Garuda orbs
    'Heat Burst': '4C1F',
    'Conflag Strike': '4C10', // 270-degree frontal AoE
    'Radiant Plume': '4C15',
    'Eruption': '4C17',
    'Wind Cutter': '4C02', // Tether-cutting line aoe
  },
  damageFail: {
    'Vacuum Slice': '4BF5', // Dark line AoE from Garuda
    'Downburst 1': '4BFB', // Blue knockback circle (Garuda).
    'Downburst 2': '4BFC', // Blue knockback circle (Raktapaksa).
    'Meteor Strike': '4C0F', // Frontal avoidable tank buster
  },
  shareWarn: {
    'E6S Hands of Hell': '4C0[BC]', // Tether charge
    'E6S Hands of Flame': '4C0A', // First Tankbuster
    'E6S Instant Incineration': '4C0E', // Second Tankbuster
    'E6S Blaze': '4C1B', // Flame Tornado Cleave
  },
  triggers: [
    {
      id: 'E6S Air Bump',
      damageRegex: '4BF9',
      condition: function(e, data) {
        // Needs to be taken with friends.
        // This can't tell if you have 2 or >2.
        return e.type === '15';
      },
      mistake: function(e, data) {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
}];
