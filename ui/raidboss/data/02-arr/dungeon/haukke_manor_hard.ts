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
      netRegex: NetRegexes.startsUsing({ id: '3F0', source: 'Manor Sentry' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'Haukke Manor Hard Beguiling Mist',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B7', source: 'Halicarnassus' }),
      condition: (data) => data.CanStun(),
      response: Responses.stun(),
    },
  ],
};

export default triggerSet;
