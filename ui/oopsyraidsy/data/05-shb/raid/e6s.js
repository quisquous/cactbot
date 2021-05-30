import ZoneId from '../../../../../resources/zone_id';

// TODO: check tethers being cut (when they shouldn't)
// TODO: check for concussed debuff
// TODO: check for taking tankbuster with lightheaded
// TODO: check for one person taking multiple Storm Of Fury Tethers (4C01/4C08)

export default {
  zoneId: ZoneId.EdensVerseFurorSavage,
  damageWarn: {
    // It's common to just ignore futbol mechanics, so don't warn on Strike Spark.
    // 'Spike Of Flame': '4C13', // Orb explosions after Strike Spark

    'E6S Thorns': '4BFA', // AoE markers after Enumeration
    'E6S Ferostorm 1': '4BFD',
    'E6S Ferostorm 2': '4C06',
    'E6S Storm Of Fury 1': '4C00', // Circle AoE during tethers--Garuda
    'E6S Storm Of Fury 2': '4C07', // Circle AoE during tethers--Raktapaksa
    'E6S Explosion': '4C03', // AoE circles, Garuda orbs
    'E6S Heat Burst': '4C1F',
    'E6S Conflag Strike': '4C10', // 270-degree frontal AoE
    'E6S Radiant Plume': '4C15',
    'E6S Eruption': '4C17',
    'E6S Wind Cutter': '4C02', // Tether-cutting line aoe
  },
  damageFail: {
    'E6S Vacuum Slice': '4BF5', // Dark line AoE from Garuda
    'E6S Downburst 1': '4BFB', // Blue knockback circle (Garuda).
    'E6S Downburst 2': '4BFC', // Blue knockback circle (Raktapaksa).
    'E6S Meteor Strike': '4C0F', // Frontal avoidable tank buster
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
      condition: (e) => {
        // Needs to be taken with friends.
        // This can't tell if you have 2 or >2.
        return e.type === '15';
      },
      mistake: (e) => {
        return { type: 'fail', blame: e.targetName, text: e.abilityName };
      },
    },
  ],
};
