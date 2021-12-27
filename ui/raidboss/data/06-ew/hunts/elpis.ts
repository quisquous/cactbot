import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Gurangatch Octuple Slammer rotation directions
// TODO: Gurangatch Bone Shaker aoe
// TODO: Gurangatch Wild Charge gap closer

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.Elpis,
  triggers: [
    {
      id: 'Hunt Gurangatch Left Hammer Slammer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B65', source: 'Gurangatch', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6B65', source: 'Grangatch', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6B65', source: 'Gurangatch', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6B65', source: 'グランガッチ', capture: false }),
      alarmText: (_data, _matches, output) => output.rightThenLeft!(),
      outputStrings: {
        rightThenLeft: {
          en: 'Right => Left',
          de: 'Rechts => Links',
          fr: 'À droite => À gauche',
        },
      },
    },
    {
      id: 'Hunt Gurangatch Right Hammer Slammer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B66', source: 'Gurangatch', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6B66', source: 'Grangatch', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6B66', source: 'Gurangatch', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6B66', source: 'グランガッチ', capture: false }),
      alarmText: (_data, _matches, output) => output.leftThenRight!(),
      outputStrings: {
        leftThenRight: {
          en: 'Left => Right',
          de: 'Links => Rechts',
          fr: 'À gauche => À droite',
        },
      },
    },
    {
      id: 'Hunt Petalodus Marine Mayhem',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69B7', source: 'Petalodus' }),
      netRegexDe: NetRegexes.startsUsing({ id: '69B7', source: 'Petalodus' }),
      netRegexFr: NetRegexes.startsUsing({ id: '69B7', source: 'Petalodus' }),
      netRegexJa: NetRegexes.startsUsing({ id: '69B7', source: 'ペタロドゥス' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'Hunt Petalodus Tidal Guillotine',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69BC', source: 'Petalodus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69BC', source: 'Petalodus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69BC', source: 'Petalodus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69BC', source: 'ペタロドゥス', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Petalodus Ancient Blizzard',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69BD', source: 'Petalodus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '69BD', source: 'Petalodus', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '69BD', source: 'Petalodus', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '69BD', source: 'ペタロドゥス', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Petalodus Waterga IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69BB', source: 'Petalodus' }),
      netRegexDe: NetRegexes.startsUsing({ id: '69BB', source: 'Petalodus' }),
      netRegexFr: NetRegexes.startsUsing({ id: '69BB', source: 'Petalodus' }),
      netRegexJa: NetRegexes.startsUsing({ id: '69BB', source: 'ペタロドゥス' }),
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          waterOnYou: {
            en: 'GTFO with water',
            de: 'Geh mit Wasser raus',
            fr: 'Partez avec l\'eau',
          },
          waterMarker: {
            en: 'Away from water marker',
            de: 'Weg vom Wasser Marker',
            fr: 'Éloignez-vous du marquage eau',
          },
        };

        if (data.me === matches.target)
          return { alarmText: output.waterOnYou!() };
        return { alertText: output.waterMarker!() };
      },
    },
  ],
};

export default triggerSet;
