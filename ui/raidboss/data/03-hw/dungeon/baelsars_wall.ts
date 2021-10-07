import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.BaelsarsWall,
  timelineFile: 'baelsars_wall.txt',
  timelineTriggers: [
    {
      id: 'Baelsars Wall Magitek Cannon',
      regex: /Magitek Cannon/,
      beforeSeconds: 4,
      response: Responses.tankBuster(),
    },
    {
      id: 'Baelsars Wall Dull Blade',
      regex: /Dull Blade/,
      beforeSeconds: 4,
      response: Responses.miniBuster(),
    },
  ],
  triggers: [
    {
      id: 'Baelsars Wall Magitek Claw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CB2', source: 'Magitek Predator' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Baelsars Wall Magitek Ray',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CB3', source: 'Magitek Predator', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Baelsars Wall Needle Burst',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1DC8', source: 'Magitek Vanguard D-1' }),
      condition: (data) => data.CanStun(),
      response: Responses.stun(),
    },
    {
      id: 'Baelsars Wall Launcher',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CBC', source: 'Magitek Predator', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Baelsars Wall Dynamic Sensory Jammer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CB9', source: 'Armored Weapon', capture: false }),
      response: Responses.stopEverything(),
    },
    {
      id: 'Baelsars Wall Griffin Beak',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CC3', source: 'The Griffin', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Baelsars Wall Flash Powder',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CC4', source: 'The Griffin' }),
      response: Responses.lookAwayFromSource(),
    },
    {
      id: 'Baelsars Wall Griffin Claw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CC2', source: 'The Griffin' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Baelsars Wall Big Boot',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '1CC4' }),
      condition: Conditions.targetIsYou(),
      response: Responses.knockbackOn(),
    },
    {
      id: 'Baelsars Wall Restraint Collar',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1CC8', source: 'The Griffin' }),
      condition: Conditions.targetIsNotYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill chain on healer',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'en',
      'replaceText': {
        'Cross Of Chaos/Circle Of Chaos': 'Circle/Cross',
        'Ring Of Chaos/Cross Of Chaos': 'Cross/Ring',
        'Ring Of Chaos/Circle Of Chaos': 'Circle/Ring',
        'Hydro Pull/Hydro Push': 'Hydro Pull/Push',
        'Order To Detonate \\(cast\\)': 'Order To Detonate',
      },
    },
  ],
};

export default triggerSet;
