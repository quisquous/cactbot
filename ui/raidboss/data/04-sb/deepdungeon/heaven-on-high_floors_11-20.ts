import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Heaven-on-High Floors 11-20
// TODO: Heavenly Hand Wash Away, high damage + knockback enrage, can stun or interrupt

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.HeavenOnHighFloors11_20,

  triggers: [
    // ---------------- Floor 11-19 Mobs ----------------
    {
      id: 'HoH 11-20 Heavenly Otokage Nightmarish Light',
      // gaze, inflicts Seduction, immediately combos with Garish Light (inflicts Minimum)
      type: 'StartsUsing',
      netRegex: { id: '3022', source: 'Heavenly Otokage', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 20 Boss: Beccho ----------------
    {
      id: 'HoH 11-20 Beccho Neuro Squama',
      // gaze, inflicts Hysteria, combos with Psycho Squama (2E7B) and Fragility (2E7D)
      type: 'StartsUsing',
      netRegex: { id: '2E7C', source: 'Beccho', capture: false },
      response: Responses.lookAway('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Beccho': 'Beccho',
        'Heavenly Otokage': 'Himmelssäulen-Otokage',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Beccho': 'Becchô',
        'Heavenly Otokage': 'ô-tokage des Cieux',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Beccho': 'ベッチョウ',
        'Heavenly Otokage': 'アメノ・オオトカゲ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Beccho': '别蝶',
        'Heavenly Otokage': '天之巨蜥',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Beccho': '벳쵸',
        'Heavenly Otokage': '천궁 왕도마뱀',
      },
    },
  ],
};

export default triggerSet;
