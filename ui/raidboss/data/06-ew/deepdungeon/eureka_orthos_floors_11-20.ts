import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Eureka Orthos Floors 11-20
// TODO: Cloning Node cone AoE safe-spots?

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'EurekaOrthosFloors11_20',
  zoneId: ZoneId.EurekaOrthosFloors11_20,

  triggers: [
    // ---------------- Floor 11-19 Mobs ----------------
    {
      id: 'EO 11-20 Orthos Sawtooth Mean Thrash',
      type: 'StartsUsing',
      netRegex: { id: '7E93', source: 'Orthos Sawtooth', capture: false },
      response: Responses.goFront(),
    },
    // ---------------- Floor 20 Boss: Cloning Node ----------------
    // intentionally blank
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Orthos Sawtooth': 'Orthos-Sägezahn',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Orthos Sawtooth': 'dentata Orthos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Orthos Sawtooth': 'オルト・ソウトゥース',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Orthos Sawtooth': '正统锯齿花',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Orthos Sawtooth': '오르토스 톱날이빨',
      },
    },
  ],
};

export default triggerSet;
