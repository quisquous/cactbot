import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Gurangatch Octuple Slammer rotation directions
// TODO: Gurangatch Wild Charge (6B77) gap closer, but appears to have no cast?

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.Elpis,
  triggers: [
    {
      id: 'Hunt Gurangatch Left Hammer Slammer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B65', source: 'Gurangatch', capture: false }),
      condition: (data) => data.inCombat,
      alarmText: (_data, _matches, output) => output.rightThenLeft!(),
      outputStrings: {
        rightThenLeft: {
          en: 'Right => Left',
          de: 'Rechts => Links',
          fr: 'À droite => À gauche',
          ja: '右 => 左',
          cn: '右 => 左',
          ko: '오른쪽 => 왼쪽',
        },
      },
    },
    {
      id: 'Hunt Gurangatch Right Hammer Slammer',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B66', source: 'Gurangatch', capture: false }),
      condition: (data) => data.inCombat,
      alarmText: (_data, _matches, output) => output.leftThenRight!(),
      outputStrings: {
        leftThenRight: {
          en: 'Left => Right',
          de: 'Links => Rechts',
          fr: 'À gauche => À droite',
          ja: '左 => 右',
          cn: '左 => 右',
          ko: '왼쪽 => 오른쪽',
        },
      },
    },
    {
      id: 'Hunt Gurangatch Bone Shaker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B78', source: 'Gurangatch', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Petalodus Marine Mayhem',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69B7', source: 'Petalodus' }),
      condition: (data) => data.inCombat && data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'Hunt Petalodus Tidal Guillotine',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69BC', source: 'Petalodus', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Petalodus Ancient Blizzard',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69BD', source: 'Petalodus', capture: false }),
      condition: (data) => data.inCombat,
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Petalodus Waterga IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '69BB', source: 'Petalodus' }),
      condition: (data) => data.inCombat,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          waterOnYou: {
            en: 'GTFO with water',
            de: 'Geh mit Wasser raus',
            fr: 'Partez avec l\'eau',
            ja: 'ボスから離れる',
            cn: '快躲开水',
            ko: '나에게 물징 멀리 빠지기',
          },
          waterMarker: {
            en: 'Away from water marker',
            de: 'Weg vom Wasser Marker',
            fr: 'Éloignez-vous du marquage eau',
            cn: '躲开水标记',
            ko: '물징에서 멀리 떨어지기',
          },
        };

        if (data.me === matches.target)
          return { alarmText: output.waterOnYou!() };
        return { alertText: output.waterMarker!() };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Gurangatch': 'Gurangatch',
        'Petalodus': 'Petalodus',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Gurangatch': 'Gurangatch',
        'Petalodus': 'petalodus',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Gurangatch': 'グランガチ',
        'Petalodus': 'ペタロドゥス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Gurangatch': '固兰盖奇',
        'Petalodus': '瓣齿鲨',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Gurangatch': '구랑가치',
        'Petalodus': '페탈로두스',
      },
    },
  ],
};

export default triggerSet;
