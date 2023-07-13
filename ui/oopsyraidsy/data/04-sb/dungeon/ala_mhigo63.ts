import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlaMhigo63,
  damageWarn: {
    'AlaMhigo63 Magitek Ray': '24CE', // Line AoE, Legion Predator trash, before boss 1
    'AlaMhigo63 Lock On': '2047', // Homing circles, boss 1
    'AlaMhigo63 Tail Laser 1': '2049', // Frontal line AoE, boss 1
    'AlaMhigo63 Tail Laser 2': '204B', // Rear line AoE, boss 1
    'AlaMhigo63 Tail Laser 3': '204C', // Rear line AoE, boss 1
    'AlaMhigo63 Shoulder Cannon': '24D0', // Circle AoE, Legion Avenger trash, before boss 2
    'AlaMhigo63 Cannonfire': '23ED', // Environmental circle AoE, path to boss 2
    'AlaMhigo63 Aetherochemical Grenado': '205A', // Circle AoE, boss 2
    'AlaMhigo63 Integrated Aetheromodulator': '205B', // Ring AoE, boss 2
    'AlaMhigo63 Circle Of Death': '24D4', // Proximity circle AoE, Hexadrone trash, before boss 3
    'AlaMhigo63 Exhaust': '24D3', // Line AoE, Legion Colossus trash, before boss 3
    'AlaMhigo63 Grand Sword': '24D2', // Conal AoE, Legion Colossus trash, before boss 3
    'AlaMhigo63 Art Of The Storm 1': '2066', // Proximity circle AoE, pre-intermission, boss 3
    'AlaMhigo63 Art Of The Storm 2': '2587', // Proximity circle AoE, intermission, boss 3
    'AlaMhigo63 Vein Splitter 1': '24B6', // Proximity circle AoE, primary entity, boss 3
    'AlaMhigo63 Vein Splitter 2': '206C', // Proximity circle AoE, helper entity, boss 3
    'AlaMhigo63 Lightless Spark': '206B', // Conal AoE, boss 3
  },
  shareWarn: {
    'AlaMhigo63 Demimagicks': '205E',
    'AlaMhigo63 Unmoving Troika': '2060',
    'AlaMhigo63 Art Of The Sword 1': '2069',
    'AlaMhigo63 Art Of The Sword 2': '2589',
  },
  triggers: [
    {
      // It's possible players might just wander into the bad on the outside,
      // but normally people get pushed into it.
      id: 'AlaMhigo63 Art Of The Swell',
      type: 'GainsEffect',
      // Damage Down
      netRegex: NetRegexes.gainsEffect({ effectId: '2B8' }),
      mistake: (_data, matches) => {
        return {
          type: 'warn',
          blame: matches.target,
          reportId: matches.targetId,
          text: matches.effect,
        };
      },
    },
  ],
};

export default triggerSet;
