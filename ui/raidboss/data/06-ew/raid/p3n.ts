import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  ashenEyeDirections?: string[];
}

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
      alertText: (_data, _matches, output) => {
        return output.outOfMiddle!();
      },
      outputStrings: {
        outOfMiddle: {
          en: 'Out Of Middle',
          de: 'Raus aus der Mitte',
          ja: '横へ',
          cn: '远离中间',
          ko: '가운데 피하기',
        },
      },
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
    {
      id: 'P3N Right Cinderwing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B4', source: 'Phoinix', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'P3N Left Cinderwing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B5', source: 'Phoinix', capture: false }),
      response: Responses.goRight(),
    },
    {
      // Could check the log line's x y coordinate to determine from where to where it charges, npc at charge target casts 66AF?
      id: 'P3N Trail of Condemnation',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66AD', source: 'Phoinix', capture: false }),
      alertText: (_data, _matches, output) => {
        return output.avoidCharge!();
      },
      outputStrings: {
        avoidCharge: {
          en: 'Avoid Charge',
          de: 'Charge ausweichen',
          fr: 'Évitez les charges',
          ja: '突進避けて',
          cn: '躲避冲锋',
          ko: '돌진을 피하세요',
        },
      },
    },
    {
      id: 'P3N Sunbird Spawn',
      type: 'AddedCombatant',
      netRegex: NetRegexes.addedCombatant({ name: 'Sunbird', capture: false }),
      suppressSeconds: 1,
      response: Responses.killAdds(),
    },
    {
      id: 'P3N Fore/Rear Carve',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66A[78]', source: 'Sunbird', capture: false }),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => {
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Dodge Add Cleave',
        },
      },
    },
    {
      id: 'P3N Dead Rebirth',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66A9', source: 'Phoinix', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P3N Ashen Eye',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66AB', source: 'Sparkfledged' }),
      alertText: (data, matches, output) => {
        if (!data.ashenEyeDirections)
          data.ashenEyeDirections = [];
        switch (matches.heading) {
          case '-3.14':
            data.ashenEyeDirections.push('north');
            break;
          case '-1.57':
            data.ashenEyeDirections.push('west');
            break;
          case '0.00':
            data.ashenEyeDirections.push('south');
            break;
          case '1.57':
            data.ashenEyeDirections.push('east');
            break;
          default:
            console.error('Ashen Eye: Got unforeseen ashen eye direction', matches.heading);
            break;
        }
        if (data.ashenEyeDirections.length === 2) {
          const dir = data.ashenEyeDirections[1];
          switch (dir) {
            case 'north':
              return output.s!();
            case 'west':
              return output.e!();
            case 'south':
              return output.n!();
            case 'east':
              return output.w!();
          }
        } else if (data.ashenEyeDirections.length === 4) {
          const dir = data.ashenEyeDirections[0];
          switch (dir) {
            case 'north':
              return output.n!();
            case 'west':
              return output.w!();
            case 'south':
              return output.s!();
            case 'east':
              return output.e!();
          }
        }
      },
      outputStrings: {
        n: outputs.north,
        e: outputs.east,
        w: outputs.west,
        s: outputs.south,
      },
    },
    {
      id: 'P3N Experimental Charplume',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '669C', source: 'Phoinix', capture: false }),
      response: Responses.spread(),
    },
    {
      id: 'P3N Devouring Brand',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '669E', source: 'Phoinix', capture: false }),
      alertText: (_data, _matches, output) => {
        return output.text!();
      },
      outputStrings: {
        text: {
          en: 'Split Intercardinals',
        },
      },
    },
    {
      id: 'P3N Searing Breeze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '66B6', source: 'Phoinix', capture: false }),
      response: Responses.stackThenSpread(),
    },
    {
      id: 'P3N Spread Marker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: ['008B'] }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
  ],
};

export default triggerSet;
