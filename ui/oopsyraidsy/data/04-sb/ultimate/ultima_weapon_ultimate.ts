import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// Ultima Weapon Ultimate
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheWeaponsRefrainUltimate,
  damageWarn: {
    'UWU Eye of the Storm': '2B52', // donut on the final
    'UWU Searing Wind': '2B5C', // healer explosions
    'UWU Eruption': '2B5A', // red baited ifrit circles
    'UWU Crimson Cyclone 1': '2B5F', // ifrit charge
    'UWU Crimson Cyclone 2': '2B60', // ifrit charge
    'UWU Radiant Plume': '2B61', // ifrit plumes
    'UWU Weight of the Land': '2B65', // titan puddles
    'UWU Bomb Boulder Bury': '2B69', // titan bombs dropping
    'UWU Bomb Boulder Freefire': '2B6E', // titan bombs awakening
    'UWU Bomb Boulder Burst': '2B6A', // titan bombs exploding
  },
  damageFail: {
    'UWU Great Whirlwind': '2B41', // large circle from blocking mistral song
    'UWU Slipstream': '2B53', // untelegraphed dodgeable frontal conal
    'UWU Wicked Wheel': '2B4E', // wicked wheel centered circle
    'UWU Wicked Tornado': '2B4F', // awoken wicked wheel donut
    'UWU Landslide 1': '2B70', // landslide
    'UWU Landslide 2': '2B6F', // landslide
    'UWU Landslide 3': '2B71', // landslide
    'UWU Landslide 4': '2C22', // landslide
    'UWU Landslide 5': '2B7F', // landslide from ultima
    'UWU Aetherochemical Laser 1': '2B84', // suppression yellow line laser from ultima
    'UWU Aetherochemical Laser 2': '2B85', // suppression yellow line laser from ultima
    'UWU Aetherochemical Laser 3': '2B86', // suppression yellow line laser from ultima
  },
  shareWarn: {
    'UWU Mesohigh': '2B49', // tether to garuda sister
  },
  shareFail: {
    'UWU Downburst': '2B50', // unawoken garuda tankbuster
    'UWU Incinerate': '2B56', // ifrit tankbuster
    'UWU Rock Buster': '2B62', // titan tankbuster 1
    'UWU Mountain Buster': '2B63', // titan tankbuster 2
    'UWU Viscous Aetheroplasm': '2B76', // tank debuff tankbuster
    'UWU Homing Laser': '2B7B', // second hate tankbuster
    'UWU Diffractive Laser': '2B78', // tank cleave
  },
  soloWarn: {
    'UWU Flaming Crush': '25BD', // ifrit stack marker
  },
  triggers: [
    {
      id: 'UWU Windburn',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'EB' }),
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
    {
      // Featherlance explosion.  It seems like the person who pops it is the
      // first person listed damage-wise, so they are likely the culprit.
      id: 'UWU Featherlance',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '2B43', ...playerDamageFields }),
      suppressSeconds: 5,
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.source,
        };
      },
    },
  ],
};

export default triggerSet;
