import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: 0x3B8, // @TODO: change to zoneid entry when available
  triggers: [
    {
      id: 'ToZ Cinduruva Isitva Siddhi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62A9', source: 'Cinduruva', capture: true }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'ToZ Sanduruva Isitva Siddhi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '62C0', source: 'Sanduruva', capture: true }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    // Trash mob tankbuster
    {
      id: 'ToZ Wheel',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5E52', source: 'Zot Roader', capture: true }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
  ],
};

export default triggerSet;
