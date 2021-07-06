import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

export { OopsyData as Data } from '../../../../../types/data';

const triggerSet: SimpleOopsyTriggerSet = {
  zoneId: ZoneId.EdensVerseFuror,
  damageWarn: {
    'E6N Thorns': '4BDA', // AoE markers after Enumeration
    'E6N Ferostorm 1': '4BDD',
    'E6N Ferostorm 2': '4BE5',
    'E6N Storm Of Fury 1': '4BE0', // Circle AoE during tethers--Garuda
    'E6N Storm Of Fury 2': '4BE6', // Circle AoE during tethers--Raktapaksa
    'E6N Explosion': '4BE2', // AoE circles, Garuda orbs
    'E6N Heat Burst': '4BEC',
    'E6N Conflag Strike': '4BEE', // 270-degree frontal AoE
    'E6N Spike Of Flame': '4BF0', // Orb explosions after Strike Spark
    'E6N Radiant Plume': '4BF2',
    'E6N Eruption': '4BF4',
  },
  damageFail: {
    'E6N Vacuum Slice': '4BD5', // Dark line AoE from Garuda
    'E6N Downburst': '4BDB', // Blue knockback circle. Actual knockback is unknown ability 4C20
  },
  shareFail: {
    // Kills non-tanks who get hit by it.
    'E6N Instant Incineration': '4BED',
  },
};

export default triggerSet;
