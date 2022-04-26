//import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
//import { Responses } from '../../../../../resources/responses';
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
      netRegex: NetRegexes.ability({ id: '956', source: 'Liavinne'}),
      netRegexDe: NetRegexes.ability({ id: '956'}),
      netRegexFr: NetRegexes.ability({ id: '956'}),
      netRegexJa: NetRegexes.ability({ id: '956'}),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'DO NOT KILL ADDS! Stack up.',
          de: '',
          fr: 'Packez-vous: ne tuez pas les Adds',
          ja: '',
          cn: '',
          ko: '',
        },
      },
    },
  ],
};

export default triggerSet;
