import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  boldBoulderTarget?: string;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.StormsCrown,
  timelineFile: 'barbariccia.txt',
  timelineTriggers: [
    {
      id: 'Barbariccia Knuckle Drum',
      regex: /Knuckle Drum/,
      beforeSeconds: 5,
      response: Responses.bigAoe(),
    },
    {
      id: 'Barbariccia Blow Away',
      regex: /Blow Away/,
      beforeSeconds: 5,
      response: Responses.getTogether('info'),
    },
  ],
  triggers: [
    {
      id: 'Barbariccia Void Aero IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75B6', source: 'Barbariccia', capture: false }),
      response: Responses.aoe(),
    },
    {
      // Savage Barbery has 3 casts that all start at the same time.
      // 6.7 duration: 7468, 748C, 748E (all actual cast bar, unknown how to differentiate)
      // 7.7 duration: 75BA (donut), 75C0 (line)
      // 9.8 duration: 75BB (out, paired with donut), 75C1 (out, paired with line)
      id: 'Barbariccia Savage Barbery Donut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75BA', source: 'Barbariccia', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Barbariccia Savage Barbery Line',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75C0', source: 'Barbariccia', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Out and Away',
        },
      },
    },
    {
      id: 'Barbariccia Hair Raid Wall',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75C2', source: 'Barbariccia', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Wall',
        },
      },
    },
    {
      id: 'Barbariccia Void Aero III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75B7', source: 'Barbariccia' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'Barbariccia Deadly Twist',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Barbariccia Hair Spray',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0175' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Barbariccia Brutal Rush Move',
      type: 'Ability',
      // When the Brutal Rush hits you, the follow-up Brutal Gust has locked in.
      netRegex: NetRegexes.ability({ id: '75C6', source: 'Barbariccia' }),
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
    {
      id: 'Barbariccia Boulder',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0160' }),
      condition: Conditions.targetIsYou(),
      response: Responses.awayFrom(),
    },
    {
      id: 'Barbariccia Boulder Break Tankbuster',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '73CF', source: 'Voidwalker', capture: false }),
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: Outputs.tankBusters,
      },
    },
    {
      id: 'Barbariccia Bold Boulder',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75D6', source: 'Barbariccia' }),
      infoText: (data, matches, output) => {
        data.boldBoulderTarget = matches.target;
        if (data.me === matches.target)
          return output.flareOnYou!();
      },
      run: (data) => delete data.boldBoulderTarget,
      outputStrings: {
        flareOnYou: {
          en: 'Flare on YOU',
          de: 'Flare auf DIR',
          fr: 'Brasier sur VOUS',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
      },
    },
    {
      id: 'Barbariccia Trample',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0064' }),
      condition: (data) => data.boldBoulderTarget !== data.me,
      delaySeconds: 0.5,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Barbariccia Touchdown',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '746D', source: 'Barbariccia' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
    },
    {
      id: 'Barbariccia Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75D8', source: 'Barbariccia' }),
      // Could also have used 75D9, full cast time is 5.9s
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback('info'), // probably used on Touchdown
    },
  ],
};

export default triggerSet;
