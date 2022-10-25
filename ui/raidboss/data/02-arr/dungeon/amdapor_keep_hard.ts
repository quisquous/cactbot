import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AmdaporKeepHard,
  triggers: [
    {
      id: 'Amdapor Keep Hard Entrance',
      type: 'StartsUsing',
      netRegex: { id: 'C65', source: 'Boogyman', capture: false },
      response: Responses.lookAway(),
    },
    {
      id: 'Amdapor Keep Hard Boss2 Headmarker on YOU',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '000F' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Go Behind Statue',
          de: 'Geh hinter die Statue',
          fr: 'Cachez vous derriere une statue',
          cn: '躲在雕像后',
          ko: '조각상 뒤에 숨기',
        },
      },
    },
    {
      id: 'Amdapor Keep Hard Invisible',
      type: 'StartsUsing',
      netRegex: { id: 'C63', source: 'Boogyman', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Kill luminescence and stay close to boss',
          de: 'Besiege die Photosphäre und steh nahe am Boss',
          fr: 'Tuez la Luminescence et restez près du boss',
          cn: '击杀幻光球, 靠近BOSS',
          ko: '빛구슬을 잡고 보스와 가까이 붙기',
        },
      },
    },
    {
      id: 'Amdapor Keep Hard Imobilize',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: ['29B', '260'], capture: false }),
      response: Responses.killAdds(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Boogyman': 'Butzemann',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Boogyman': 'croque-mitaine',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Boogyman': 'ボギーマン',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Boogyman': '夜魔人',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Boogyman': '부기맨',
      },
    },
  ],
};

export default triggerSet;
