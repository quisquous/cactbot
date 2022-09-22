import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';

export default defineTriggerSet({
  zoneId: ZoneId.TheAurumVale,
  triggers: [
    {
      id: 'Aurum Vale GoldLungs/Burrs',
      type: 'GainsEffect',
      // Count `0[2-9]` here is to filter out the first stack
      netRegex: NetRegexes.gainsEffect({ effectId: ['12E', '12F'], count: '0[2-9]' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Eat Fruit',
          de: 'Frucht essen',
          fr: 'Mangez un fruit',
          cn: '吃果实',
          ko: '열매 먹기',
        },
      },
    },
  ],
});
