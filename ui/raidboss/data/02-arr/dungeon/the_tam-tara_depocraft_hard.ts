import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheTamTaraDeepcroftHard,
  triggers: [
    {
      id: 'Tam-Tara Hard Inhumanity',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '956', source: 'Liavinne', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'DO NOT KILL ADDS! Stack up.',
          fr: 'Packez-vous: ne tuez pas les Adds',
        },
      },
    },
  ],
};

export default triggerSet;
