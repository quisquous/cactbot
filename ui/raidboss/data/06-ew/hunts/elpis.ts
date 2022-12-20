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
      netRegex: { id: '6B65', source: 'Gurangatch', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goRightThenLeft('alarm'),
    },
    {
      id: 'Hunt Gurangatch Right Hammer Slammer',
      type: 'StartsUsing',
      netRegex: { id: '6B66', source: 'Gurangatch', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goLeftThenRight('alarm'),
    },
    {
      id: 'Hunt Gurangatch Bone Shaker',
      type: 'StartsUsing',
      netRegex: { id: '6B78', source: 'Gurangatch', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Petalodus Marine Mayhem',
      type: 'StartsUsing',
      netRegex: { id: '69B7', source: 'Petalodus' },
      condition: (data) => data.inCombat && data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'Hunt Petalodus Tidal Guillotine',
      type: 'StartsUsing',
      netRegex: { id: '69BC', source: 'Petalodus', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Petalodus Ancient Blizzard',
      type: 'StartsUsing',
      netRegex: { id: '69BD', source: 'Petalodus', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Petalodus Waterga IV',
      type: 'StartsUsing',
      netRegex: { id: '69BB', source: 'Petalodus' },
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
            ja: 'AOEから離れる',
            cn: '躲开水标记',
            ko: '물징에서 멀리 떨어지기',
          },
        };

        if (data.me === matches.target)
          return { alarmText: output.waterOnYou!() };
        return { alertText: output.waterMarker!() };
      },
    },
    {
      id: 'Hunt Ophioneus Scratch',
      type: 'StartsUsing',
      netRegex: { id: '6AD4', source: 'Ophioneus' },
      condition: (data) => data.inCombat,
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Ophioneus Right Maw',
      type: 'StartsUsing',
      netRegex: { id: '6AD6', source: 'Ophioneus', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goLeft(),
    },
    {
      id: 'Hunt Ophioneus Left Maw',
      type: 'StartsUsing',
      netRegex: { id: '6AD7', source: 'Ophioneus', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goRight(),
    },
    {
      id: 'Hunt Ophioneus Pyric Circle',
      type: 'StartsUsing',
      netRegex: { id: '6AD8', source: 'Ophioneus', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Ophioneus Pyric Burst',
      type: 'StartsUsing',
      netRegex: { id: '6AD9', source: 'Ophioneus', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Ophioneus Leaping Pyric Circle',
      type: 'StartsUsing',
      // Followed by a 6AD2 fast cast.
      netRegex: { id: '6ACD', source: 'Ophioneus', capture: false },
      condition: (data) => data.inCombat,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Follow Jump => Under',
          de: 'Sprung folgen => Unter den Boss',
          ja: 'ジャンプ近づく => 下へ',
          cn: '跟随跳跃 => 脚下',
          ko: '점프 따라가기 => 보스 아래로',
        },
      },
    },
    {
      id: 'Hunt Ophioneus Leaping Pyric Burst',
      type: 'StartsUsing',
      // Followed by a 6AD3 fast cast.
      netRegex: { id: '6ACE', source: 'Ophioneus', capture: false },
      condition: (data) => data.inCombat,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away From Jump',
          de: 'Weg vom Sprung',
          ja: 'ジャンプから離れる',
          cn: '远离跳跃',
          ko: '점프뛴 곳에서 멀리 떨어지기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Gurangatch': 'Gurangatch',
        'Ophioneus': 'Ophioneus',
        'Petalodus': 'Petalodus',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Gurangatch': 'Gurangatch',
        'Ophioneus': 'Ophion',
        'Petalodus': 'petalodus',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Gurangatch': 'グランガチ',
        'Ophioneus': 'オピオネウス',
        'Petalodus': 'ペタロドゥス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Gurangatch': '固兰盖奇',
        'Ophioneus': '俄菲翁尼厄斯',
        'Petalodus': '瓣齿鲨',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Gurangatch': '구랑가치',
        'Ophioneus': '오피오네우스',
        'Petalodus': '페탈로두스',
      },
    },
  ],
};

export default triggerSet;
