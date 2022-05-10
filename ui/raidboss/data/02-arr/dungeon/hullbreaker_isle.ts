import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.HullbreakerIsle,
  triggers: [
    {
      id: 'Hullbreaker Isle Stool Pelt',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '89E', source: 'Sasquatch', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '89E', source: 'Sasquatch', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '89E', source: 'Sasquatch', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '89E', source: 'サスカッチ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '89E', source: '大脚巨猿', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '89E', source: '사스콰치', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Hullbreaker Isle Chest Thump',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '89F', source: 'Sasquatch', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '89F', source: 'Sasquatch', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '89F', source: 'Sasquatch', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '89F', source: 'サスカッチ', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '89F', source: '大脚巨猿', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '89F', source: '사스콰치', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Shake Banana tree',
          de: 'Bananenbaum schütteln',
          fr: 'Secouez le bananier',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Sasquatch': 'Sasquatch',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Sasquatch': 'Sasquatch',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Sasquatch': 'サスカッチ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Sasquatch': '大脚巨猿',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Sasquatch': '사스콰치',
      },
    },
  ],
};

export default triggerSet;
