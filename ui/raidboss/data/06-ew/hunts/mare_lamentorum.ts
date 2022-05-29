import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.MareLamentorum,
  triggers: [
    {
      id: 'Hunt Lunatender Queen Away With You',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE5', source: 'Lunatender Queen', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Lunatender Queen Away With You Whim',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AEB', source: 'Lunatender Queen', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Lunatender Queen You May Approach',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE4', source: 'Lunatender Queen', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Lunatender Queen You May Approach Whim',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AEA', source: 'Lunatender Queen', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Lunatender Queen Avert Your Eyes',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE3', source: 'Lunatender Queen', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'Hunt Lunatender Queen Avert Your Eyes Whim',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE9', source: 'Lunatender Queen', capture: false }),
      response: Responses.lookTowards(),
    },
    {
      id: 'Hunt Lunatender Queen 999,000 Needles',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AE6', source: 'Lunatender Queen', capture: false }),
      response: Responses.outOfMelee(),
    },
    {
      id: 'Hunt Mousse Princess Rightward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B18', source: 'Mousse Princess', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Right Flank',
          de: 'Weg von der rechten Flanke',
          fr: 'Éloignez-vous du flanc droit',
          cn: '远离右侧',
          ko: '보스 오른쪽 피하기',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Backward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B1A', source: 'Mousse Princess', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Back',
          de: 'Weg von hinter ihr',
          fr: 'Éloignez-vous de l\'arrière',
          cn: '远离后方',
          ko: '보스 뒤 피하기',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Leftward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B19', source: 'Mousse Princess', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Left Flank',
          de: 'Weg von der linker Flanke',
          fr: 'Éloignez-vous du flanc gauche',
          cn: '远离左侧',
          ko: '보스 왼쪽 피하기',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Forward Whimsy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: 'B8E', source: 'Mousse Princess', capture: false }),
      durationSeconds: 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Away from Front',
          de: 'Weg von Vorne',
          fr: 'Éloignez-vous du devant',
          cn: '远离前方',
          ko: '보스 앞 피하기',
        },
      },
    },
    {
      id: 'Hunt Mousse Princess Banish',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6ABB', source: 'Mousse Princess' }),
      // Doesn't cleave (I think?).
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Mousse Princess Amorphic Flail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6AB9', source: 'Mousse Princess', capture: false }),
      response: Responses.outOfMelee(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Lunatender Queen': 'Lunatender-Königin',
        'Mousse Princess': 'Mousse-Prinzessin',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Lunatender Queen': 'pampa sélénienne reine',
        'Mousse Princess': 'princesse mousse',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Lunatender Queen': 'ルナテンダー・クイーン',
        'Mousse Princess': 'ムースプリンセス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Lunatender Queen': '月面仙人刺女王',
        'Mousse Princess': '慕斯公主',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Lunatender Queen': '루나텐더 여왕',
        'Mousse Princess': '무스 공주',
      },
    },
  ],
};

export default triggerSet;
