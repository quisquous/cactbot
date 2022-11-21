import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// Heaven-on-High Floors 61-70
// TODO: Heavenly Shitaibana unknown untelegraphed cone AoE, inflicts Poison

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.HeavenOnHighFloors61_70,

  triggers: [
    // ---------------- Floor 61-69 Mobs ----------------
    {
      id: 'HoH 61-70 Heavenly Hashiri-dokoro Frond Fatale',
      type: 'StartsUsing',
      netRegex: { id: '3080', source: 'Heavenly Hashiri-dokoro', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 70 Boss: Kenko ----------------
    {
      id: 'HoH 61-70 Kenko Predator Claws',
      // untelegraphed front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '2FAD', source: 'Kenko', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'HoH 61-70 Kenko Innerspace',
      // leaves puddle that inflicts Minimum (1B6)
      type: 'StartsUsing',
      netRegex: { id: '2FAF', source: 'Kenko', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Puddle',
        },
      },
    },
    {
      id: 'HoH 61-70 Kenko Ululation',
      // roomwide AoE, fatal if Minimum (1B6)
      type: 'StartsUsing',
      netRegex: { id: '2FB0', source: 'Kenko', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'HoH 61-70 Kenko Hound out of Hell',
      // charge AoE, fatal if not Minimum (1B6)
      type: 'StartsUsing',
      netRegex: { id: '2FAE', source: 'Kenko' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get In Puddle',
          de: 'Geh in die Flächen',
          fr: 'Prenez une zone au sol',
          cn: '进入圈圈',
          ko: '장판 밟기',
        },
      },
    },
  ],
};

export default triggerSet;
