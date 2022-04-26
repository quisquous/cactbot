//import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.HaukkeManorHard,
  triggers: [
    {
      id: 'Haukke Manor Hard Stoneskin',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3F0', source: 'Manor Sentry'}),
      netRegexDe: NetRegexes.startsUsing({ id: '3F0' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3F0' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3F0' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3F0' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3F0' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'Haukke Manor Hard Beguiling Mist',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B7', source: 'Halicarnassus'}),
      netRegexDe: NetRegexes.startsUsing({ id: '6B7' }),
      netRegexFr: NetRegexes.startsUsing({ id: '6B7' }),
      netRegexJa: NetRegexes.startsUsing({ id: '6B7' }),
      netRegexCn: NetRegexes.startsUsing({ id: '6B7' }),
      netRegexKo: NetRegexes.startsUsing({ id: '6B7' }),
      condition: (data) => data.CanStun(),
      response: Responses.stun(),
    },
  ],
};

export default triggerSet;
