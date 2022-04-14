import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.UltimasBaneUnreal,
  damageWarn: {
    'UltimaEx Mistral Song': '6EFC', // Garuda wide conal
    'UltimaEx Eye of the Storm': '6EFE', // Garuda donut
    'UltimaEx Radiant Plume': '6F00', // Ifrit fire eruptions
    'UltimaEx Weight of the Land': '6F01', // Titan puddles
    'UltimaEx Eruption': '6F03', // chasing Ifrit explosions
    'UltimaEx Crimson Cyclone': '6F04', // Ifrit dash
    'UltimaEx Magitek Ray 1': '6EF2', // trident laser
    'UltimaEx Magitek Ray 2': '6EF3', // trident laser
    'UltimaEx Magitek Ray 3': '6EF4', // trident laser
    'UltimaEx Homing Aetheroplasm': '6EF5', // chasing Aetheroplasm explosion
    'UltimaEx Magitek Bit Assault Cannon': '6F05', // line aoe from bits
  },
  damageFail: {
    'UltimaEx Fusion Burst': '6EF8', // failing to pop orbs
  },
  shareWarn: {
    'UltimaEx Homing Lasers': '6EF0', // distance? aggro? targeted circular cleave
    'UltimaEx Diffractive Laser': '6EF1', // frontal conal cleave
  },
  triggers: [
    {
      id: 'UltimaEx Viscous Aetheroplasm',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '171', count: '05' }),
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.target, reportId: matches.targetId, text: matches.effect };
      },
    },
  ],
};

export default triggerSet;
