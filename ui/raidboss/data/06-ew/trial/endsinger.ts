import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// @TODO:
// Interstellar - Position here can be gotten quicker via getCombatants on the chat line 'Tis so lonely between the stars'
// current trigger doesn't give much time at all to dodge
// Add phase triggers
// Final phase triggers

export interface Data extends RaidbossData {
  storedStar?: { x: number; y: number };
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheFinalDay,
  timelineFile: 'endsinger.txt',
  triggers: [
    {
      id: 'Endsinger Doomed Stars AoE',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['662E', '6634'], source: 'Doomed Stars', capture: true }),
      alertText: (data, matches, output) => {
        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);

        data.storedStar = { x, y };

        if (x < 100) {
          if (y < 100)
            return output.se?.();

          return output.ne?.();
        }
        if (y < 100)
          return output.sw?.();

        return output.nw?.();
      },
      outputStrings: {
        ne: Outputs.northeast,
        nw: Outputs.northwest,
        se: Outputs.southeast,
        sw: Outputs.southwest,
      },
    },
    {
      id: 'Endsinger Elegeia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['662C', '6682'], source: 'The Endsinger', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Endsinger Fatalism',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6632', source: 'The Endsinger', capture: false }),
      condition: (data) => data.storedStar?.x !== undefined,
      delaySeconds: 15,
      alertText: (data, _matches, output) => {
        const x = data.storedStar?.x;
        const y = data.storedStar?.y;

        delete data.storedStar;
        if (!x || !y)
          return undefined;

        if (x < 100) {
          if (y < 100)
            return output.se?.();

          return output.ne?.();
        }
        if (y < 100)
          return output.sw?.();

        return output.nw?.();
      },
      outputStrings: {
        ne: Outputs.northeast,
        nw: Outputs.northwest,
        se: Outputs.southeast,
        sw: Outputs.southwest,
      },
    },
    {
      id: 'Endsinger Galaxias',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6C69', source: 'The Endsinger', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'Endsinger Elenchos Middle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6644', source: 'The Endsinger', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Endsinger Elenchos Outsides',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6642', source: 'The Endsinger', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Endsinger Death\'s Embrace',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6649', source: 'The Endsinger', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'Endsinger Death\'s Embrace Feathers',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6649', source: 'The Endsinger', capture: false }),
      delaySeconds: 5.7,
      response: Responses.moveAway(),
    },
    {
      id: 'Endsinger Death\'s Aporrhoia',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '663D', source: 'The Endsinger', capture: false }),
      infoText: (_data, _matches, output) => {
        return output.awayFromHead?.();
      },
      outputStrings: {
        awayFromHead: {
          en: 'Away from head',
        },
      },
    },
    {
      id: 'Endsinger Hubris',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6652', source: 'The Endsinger', capture: true }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Endsinger Epigonoi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6646', source: 'The Endsinger', capture: true }),
      condition: (_data, matches) => {
        return matches.x !== '100' && matches.y !== '100';
      },
      suppressSeconds: 3,
      infoText: (_data, matches, output) => {
        if (matches.x === '100' || matches.y === '100')
          return output.intercardinal?.();

        return output.cardinal?.();
      },
      outputStrings: {
        cardinal: {
          en: 'Cardinal edge',
        },
        intercardinal: {
          en: 'Intercardinal edge',
        },
      },
    },
    {
      id: 'Endsinger Interstellar',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '664D', source: 'The Endsinger', capture: true }),
      alertText: (_data, matches, output) => {
        const x = parseFloat(matches.x);
        const y = parseFloat(matches.y);

        // Handle cardinals the easy way
        if (x === 100) {
          return output.direction!({
            dir1: output.east!(),
            dir2: output.west!(),
          });
        }
        if (y === 100) {
          return output.direction!({
            dir1: output.north!(),
            dir2: output.south!(),
          });
        }

        if (x < 100) {
          if (y < 100) {
            return output.direction!({
              dir1: output.northeast!(),
              dir2: output.southwest!(),
            });
          }
          return output.direction!({
            dir1: output.northwest!(),
            dir2: output.southeast!(),
          });
        }
        if (y < 100) {
          return output.direction!({
            dir1: output.northwest!(),
            dir2: output.southeast!(),
          });
        }
        return output.direction!({
          dir1: output.northeast!(),
          dir2: output.southwest!(),
        });
      },
      outputStrings: {
        north: Outputs.north,
        northeast: Outputs.northeast,
        east: Outputs.east,
        southeast: Outputs.southeast,
        south: Outputs.south,
        southwest: Outputs.southwest,
        west: Outputs.west,
        northwest: Outputs.northwest,
        direction: {
          en: '${dir1} / ${dir2}',
        },
      },
    },
    {
      id: 'Endsinger Nemesis',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '664E', source: 'The Endsinger', capture: true }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
};

export default triggerSet;
