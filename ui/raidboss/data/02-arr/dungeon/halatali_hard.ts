import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.HalataliHard,
  triggers: [
    {
      id: 'Hataliti Hard Demon Eye',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '833', source: 'Catoblepas', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use the Orb',
          de: 'Orb benutzen',
          fr: 'Utilisez l\'Orbe',
          cn: '使用幽暗珠',
          ko: '구슬 사용하기',
        },
      },
    },
    {
      id: 'Hataliti Hard Standstill',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '84F', source: 'Mumuepo the Beholden', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Use the Nail',
          de: 'Nagel benutzen',
          fr: 'Utilisez L\'Épine',
          cn: '使用咒具',
          ko: '주술도구 사용하기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Catoblepas': 'Catblepus',
        'Mumuepo the Beholden': 'Ex-Bischof Mumuepo ',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Catoblepas': 'catoblépas',
        'Mumuepo the Beholden': 'Mumuepo le prêtre déchu',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Catoblepas': 'カトブレパス',
        'Mumuepo the Beholden': '廃司教 ムムエポ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Catoblepas': '卡托布莱帕斯',
        'Mumuepo the Beholden': '退位主教 穆穆埃珀',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Catoblepas': '카토블레파스',
        'Mumuepo the Beholden': '폐주교 무무에포',
      },
    },
  ],
};

export default triggerSet;
