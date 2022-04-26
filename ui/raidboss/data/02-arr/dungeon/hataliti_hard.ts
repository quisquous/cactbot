//import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
//import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.HalataliHard,
  triggers: [
    {
      id: 'Hataliti Hard Demon Eye',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '833', source: 'Catoblepas'}),
      netRegexDe: NetRegexes.startsUsing({ id: '833'}),
      netRegexFr: NetRegexes.startsUsing({ id: '833'}),
      netRegexJa: NetRegexes.startsUsing({ id: '833'}),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use the Orb',
          de: '',
          fr: 'Utilisez l\'Orb',
          ja: '',
          cn: '',
          ko: '',
        },
      },
    },
    {
      id: 'Hataliti Hard Standstill',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '84F', source: 'Mumuepo the Beholden'}),
      netRegexDe: NetRegexes.startsUsing({ id: '84F'}),
      netRegexFr: NetRegexes.startsUsing({ id: '84F'}),
      netRegexJa: NetRegexes.startsUsing({ id: '84F'}),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use the Nail',
          de: '',
          fr: 'Utilisez L\'Epine',
          ja: '',
          cn: '',
          ko: '',
        },
      },
    },
  ],
};

export default triggerSet;
