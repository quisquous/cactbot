import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheSunkenTempleOfQarn,
  triggers: [
    {
      id: 'Sunken Quarn Doom',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'D2' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Step on Glowing Plate',
          de: 'Auf der leuchtende Platte stehen',
          fr: 'Marchez sur la plaque qui brille',
          cn: '踩发光地板',
          ko: '빛나는 발판 밟기',
        },
      },
    },
  ],
};

export default triggerSet;
