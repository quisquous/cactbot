import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  zoneId: ZoneId.AsphodelosTheThirdCircle,
  timelineFile: 'p3n.txt',
  triggers: [
    {
      id: 'P3N Experimental Fireplume 1',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6698', source: 'Phoinix', capture: false }),
      alertText: (_data, _matches, output) => {
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'dodge rotating ground aoe then out',
        },
      },
    },
    {
      id: 'P3N Experimental Fireplume 2',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6696', source: 'Phoinix', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'P3N Scorched Exaltation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B8', source: 'Phoinix', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P3N Heat of Condemnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B2', source: 'Phoinix' }),
      suppressSeconds: 1,
      response: Responses.tankBuster(),
    },
    {
      id: 'P3N Darkened Fire Aoe',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['010[C-F]'] }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => {
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Go to add',
        },
      },
    },
  ],
};

export default triggerSet;
