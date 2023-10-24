import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Palace of the Dead Floors 101-110
// TODO: Deep Palace Hornet Final Sting, 99% of max HP enrage

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  id: 'ThePalaceOfTheDeadFloors101_110',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors101_110,

  triggers: [
    // ---------------- Floor 101-109 Mobs ----------------
    // intentionally blank
    // ---------------- Floor 110 Boss: Alicanto ----------------
    {
      id: 'PotD 101-110 Alicanto Aero Blast',
      // roomwide AoE plus DoT
      type: 'StartsUsing',
      netRegex: { id: '1BDC', source: 'Alicanto', capture: false },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Alicanto': 'Alicanto',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Alicanto': 'Alicanto',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Alicanto': 'アリカント',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Alicanto': '阿利坎托',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Alicanto': '알리칸토',
      },
    },
  ],
};

export default triggerSet;
