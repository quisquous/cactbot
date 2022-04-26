import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AmdaporKeepHard,
  triggers: [
    {
      id: 'Amdapor Keep Hard Entrance',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C65', source: 'Boogyman'}),
      netRegexDe: NetRegexes.startsUsing({ id: 'C65'}),
      netRegexFr: NetRegexes.startsUsing({ id: 'C65'}),
      netRegexJa: NetRegexes.startsUsing({ id: 'C65'}),
      response: Responses.lookAway(),
    },
    {
      id: 'Amdapor Keep Hard Boss2 Headmarker on YOU',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '000F' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go Behind Statue',
          de: '',
          fr: 'Cachez vous derriere une statue',
          ja: '',
          cn: '',
          ko: '',
        },
      },
    },
    {
      id: 'Amdapor Keep Hard Invisible',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: 'C63', source: 'Boogyman'}),
      netRegexDe: NetRegexes.startsUsing({ id: 'C63'}),
      netRegexFr: NetRegexes.startsUsing({ id: 'C63'}),
      netRegexJa: NetRegexes.startsUsing({ id: 'C63'}),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill luminescence and stay close to boss',
          de: '',
          fr: 'Tuez la Luminescence et restez près du boss',
          ja: '',
          cn: '',
          ko: '',
        },
      },
    },
    {
      id: 'Amdapor Keep Hard Imobilize',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['29B', '260'] }),
      response: Responses.killAdds(),
    },
  ],
};

export default triggerSet;
