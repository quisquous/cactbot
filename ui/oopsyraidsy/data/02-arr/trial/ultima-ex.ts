import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladUltimasBane,
  damageWarn: {
    'UltimaEx Mistral Song': '5ED', // Garuda wide conal
    'UltimaEx Eye of the Storm': '5EF', // Garuda donut
    'UltimaEx Radiant Plume': '5F1', // Ifrit fire eruptions
    'UltimaEx Weight of the Land': '5F2', // Titan puddles
    'UltimaEx Eruption': '5F4', // chasing Ifrit explosions
    'UltimaEx Crimson Cyclone': '5F5', // Ifrit dash
    'UltimaEx Magitek Ray 1': '5E3', // trident laser
    'UltimaEx Magitek Ray 2': '5E4', // trident laser
    'UltimaEx Magitek Ray 3': '5E5', // trident laser
    'UltimaEx Homing Aetheroplasm': '5E6', // chasing Aetheroplasm explosion
    'UltimaEx Magitek Bit Assault Cannon': '5F6', // line aoe from bits
  },
  damageFail: {
    'UltimaEx Fusion Burst': '5E9', // failing to pop orbs
  },
  shareWarn: {
    'UltimaEx Homing Lasers': '5E1', // distance? aggro? targeted circular cleave
    'UltimaEx Diffractive Laser': '5E2', // frontal conal cleave
  },
  triggers: [
    {
      id: 'UltimaEx Viscous Aetheroplasm',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '171', count: '05' }),
      mistake: (_data, matches) => {
        return {
          type: 'fail',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
  ],
};

export default triggerSet;
