import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

// Susano Normal
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.ThePoolOfTribute,
  timelineFile: 'susano.txt',
  timelineTriggers: [
    {
      id: 'Susano Assail',
      regex: /Assail/,
      beforeSeconds: 6,
      response: Responses.miniBuster(),
    },
  ],
  triggers: [
    {
      id: 'Susano Brightstorm',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Susano Seasplitter',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Knockback on YOU',
          de: 'Rückstoß auf DIR',
          fr: 'Poussée sur VOUS',
          cn: '击退点名',
        },
      },
    },
    {
      id: 'Susano Ukehi',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Susano', id: '2026', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Susano', id: '2026', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Susano', id: '2026', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スサノオ', id: '2026', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '须佐之男', id: '2026', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '스사노오', id: '2026', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'Susano Stormsplitter',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Susano', id: '2023' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Susano', id: '2023' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Susano', id: '2023' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'スサノオ', id: '2023' }),
      netRegexCn: NetRegexes.startsUsing({ source: '须佐之男', id: '2023' }),
      netRegexKo: NetRegexes.startsUsing({ source: '스사노오', id: '2023' }),
      response: Responses.tankCleave('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ama-No-Iwato': 'Ama no Iwato',
        'Dark Cloud': 'dunkl(?:e|er|es|en) Wolke',
        'Susano': 'Susano',
      },
      'replaceText': {
        'Ame-No-Murakumo': 'Ame no Murakumo',
        'Assail': 'Anstürmen',
        'Brightstorm': 'Heller Sturm',
        'Dark Levin': 'violett(?:e|er|es|en) Blitz',
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Seespalter',
        'Stormsplitter': 'Sturmspalter',
        'The Hidden Gate': 'Verschwundenes Tor',
        'The Parting Clouds': 'Wolkenriss',
        'The Sealed Gate': 'Versiegeltes Tor',
        'Ukehi': 'Ukehi',
        'Yasakani-No-Magatama': 'Yasakani no Magatama',
        'Yata-No-Kagami': 'Yata no Kagami',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ama-No-Iwato': 'ama no iwato',
        'Dark Cloud': 'nuage sombre',
        'Susano': 'Susano',
      },
      'replaceText': {
        'Ame-No-Murakumo': 'Ame no Murakumo',
        'Assail': 'Ordre de couverture',
        'Brightstorm': 'Claire tempête',
        'Dark Levin': 'foudre violette',
        'Rasen Kaikyo': 'Rasen Kaikyo',
        'Seasplitter': 'Fendeur de mers',
        'Stormsplitter': 'Fendeur de tempêtes',
        'The Hidden Gate': 'Porte cachée',
        'The Parting Clouds': 'Dispersion de nuages',
        'The Sealed Gate': 'Porte scellée',
        'Ukehi': 'Ukehi',
        'Yasakani-No-Magatama': 'Yasakani no Magatama',
        'Yata-No-Kagami': 'Yata no Kagami',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ama-No-Iwato': '天岩戸',
        'Dark Cloud': '暗雲',
        'Susano': 'スサノオ',
      },
      'replaceText': {
        'Ame-No-Murakumo': 'アメノムラクモ',
        'Assail': '攻撃指示',
        'Brightstorm': '晴嵐',
        'Dark Levin': '紫電',
        'Rasen Kaikyo': '螺旋海峡',
        'Seasplitter': '海割り',
        'Stormsplitter': '海嵐斬',
        'The Hidden Gate': '岩戸隠れ',
        'The Parting Clouds': '雲間放電',
        'The Sealed Gate': '岩戸閉め',
        'Ukehi': '宇気比',
        'Yasakani-No-Magatama': 'ヤサカニノマガタマ',
        'Yata-No-Kagami': 'ヤタノカガミ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ama-No-Iwato': '天之岩户',
        'Dark Cloud': '暗云',
        'Susano': '须佐之男',
      },
      'replaceText': {
        'Ame-No-Murakumo': '天之丛云',
        'Assail': '攻击指示',
        'Brightstorm': '晴岚',
        'Dark Levin': '紫电',
        'Rasen Kaikyo': '螺旋海峡',
        'Seasplitter': '断海',
        'Stormsplitter': '破浪斩',
        'The Hidden Gate': '岩户隐',
        'The Parting Clouds': '云间放电',
        'The Sealed Gate': '岩户闭合',
        'Ukehi': '祈请',
        'Yasakani-No-Magatama': '八尺琼勾玉',
        'Yata-No-Kagami': '八咫镜',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ama-No-Iwato': '신의 바위',
        'Dark Cloud': '암운',
        'Susano': '스사노오',
      },
      'replaceText': {
        'Ame-No-Murakumo': '아메노무라쿠모',
        'Assail': '공격 지시',
        'Brightstorm': '산바람',
        'Dark Levin': '번갯불',
        'Rasen Kaikyo': '나선 해협',
        'Seasplitter': '바다 가르기',
        'Stormsplitter': '해풍참',
        'The Hidden Gate': '바위 숨기기',
        'The Parting Clouds': '구름 방전',
        'The Sealed Gate': '바위 조이기',
        'Ukehi': '내기 선언',
        'Yasakani-No-Magatama': '야사카니의 곡옥',
        'Yata-No-Kagami': '야타의 거울',
      },
    },
  ],
};

export default triggerSet;
