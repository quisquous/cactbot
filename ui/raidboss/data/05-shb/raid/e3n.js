import Conditions from '../../../../../resources/conditions.ts';
import NetRegexes from '../../../../../resources/netregexes.ts';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.EdensGateInundation,
  timelineFile: 'e3n.txt',
  triggers: [
    {
      id: 'E3N Tidal Roar',
      netRegex: NetRegexes.startsUsing({ id: '3FC4', source: 'Leviathan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3FC4', source: 'Leviathan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3FC4', source: 'Léviathan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3FC4', source: 'リヴァイアサン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3FC4', source: '利维亚桑', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3FC4', source: '리바이어선', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'E3N Rip Current',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: function(data, matches) {
        return matches.target === data.me || data.role === 'tank' || data.role === 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'E3N Tidal Wave Look',
      netRegex: NetRegexes.startsUsing({ id: '3FD2', source: 'Leviathan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3FD2', source: 'Leviathan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3FD2', source: 'Léviathan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3FD2', source: 'リヴァイアサン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3FD2', source: '利维亚桑', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3FD2', source: '리바이어선', capture: false }),
      delaySeconds: 3,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Look for Wave',
          de: 'Nach der Welle schauen',
          fr: 'Repérez la vague',
          ja: 'つなみ来るよ',
          cn: '看浪',
          ko: '해일 위치 확인',
        },
      },
    },
    {
      id: 'E3N Tidal Wave Knockback',
      netRegex: NetRegexes.startsUsing({ id: '3FD2', source: 'Leviathan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3FD2', source: 'Leviathan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3FD2', source: 'Léviathan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3FD2', source: 'リヴァイアサン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3FD2', source: '利维亚桑', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3FD2', source: '리바이어선', capture: false }),
      // 3 seconds of cast, 10 seconds of delay.
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: 8,
      response: Responses.knockback(),
    },
    {
      id: 'E3N Undersea Quake Outside',
      netRegex: NetRegexes.startsUsing({ id: '3FD0', source: 'Leviathan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3FD0', source: 'Leviathan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3FD0', source: 'Léviathan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3FD0', source: 'リヴァイアサン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3FD0', source: '利维亚桑', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3FD0', source: '리바이어선', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Middle',
          de: 'In die Mitte gehen',
          fr: 'Allez au milieu',
          ja: '中心へ',
          cn: '中间',
          ko: '중앙으로',
        },
      },
    },
    {
      id: 'E3N Undersea Quake Inside',
      netRegex: NetRegexes.startsUsing({ id: '3FCF', source: 'Leviathan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3FCF', source: 'Leviathan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3FCF', source: 'Léviathan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3FCF', source: 'リヴァイアサン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3FCF', source: '利维亚桑', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3FCF', source: '리바이어선', capture: false }),
      response: Responses.goSides('alarm'),
    },
    {
      id: 'E3N Maelstrom',
      netRegex: NetRegexes.startsUsing({ id: '3FD8', source: 'Leviathan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3FD8', source: 'Leviathan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3FD8', source: 'Léviathan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3FD8', source: 'リヴァイアサン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3FD8', source: '利维亚桑', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3FD8', source: '리바이어선', capture: false }),
      delaySeconds: 8,
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Puddles and Dives',
          de: 'Flächen und Leviathan ausweichen',
          fr: 'Évitez les zones au sol et les piqués',
          ja: '円範囲から離れる',
          cn: '躲圈闪避',
          ko: '돌진이랑 장판 피하세요',
        },
      },
    },
    {
      id: 'E3N Drenching Pulse Spread',
      netRegex: NetRegexes.headMarker({ id: '00A9' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'E3N Tsunami',
      netRegex: NetRegexes.startsUsing({ id: '3FD4', source: 'Leviathan', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3FD4', source: 'Leviathan', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3FD4', source: 'Léviathan', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3FD4', source: 'リヴァイアサン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3FD4', source: '利维亚桑', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3FD4', source: '리바이어선', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // Crashing Pulse and Smothering Waters
      id: 'E3N Stack',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'E3N Surging Waters Marker',
      netRegex: NetRegexes.headMarker({ id: '00AD' }),
      response: Responses.knockbackOn(),
    },
    {
      id: 'E3N Splashing Waters Spread',
      netRegex: NetRegexes.headMarker({ id: '0082' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'E3N Swirling Waters Donut',
      netRegex: NetRegexes.headMarker({ id: '0099' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Donut on YOU',
          de: 'Donut auf DIR',
          fr: 'Donut sur VOUS',
          ja: '自分にドーナツ範囲',
          cn: '月环点名',
          ko: '도넛장판 대상자',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Leviathan': 'Leviathan',
      },
      'replaceText': {
        'Crashing Pulse': 'Stürmische Wogen',
        'Drenching Pulse': 'Tosende Wogen',
        'Freak Wave': 'Gigantische Welle',
        'Killer Wave': 'Tödliche Welle',
        'Maelstrom': 'Mahlstrom',
        'Monster Wave': 'Monsterwelle',
        'Rip Current': 'Brandungsrückstrom',
        'Smothering Tsunami': 'Ertränkende Sturzflut',
        'Spinning Dive': 'Drehsprung',
        'Splashing Tsunami': 'Stürmende Sturzflut',
        'Surging Tsunami': 'Erdrückende Sturzflut',
        'Swirling Tsunami': 'Wirbelnde Sturzflut',
        'Temporary Current': 'Unstete Gezeiten',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Tidal Wave': 'Flutwelle',
        '(?<! )Tsunami': 'Sturzflut',
        'Undersea Quake': 'Unterwasserbeben',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Leviathan': 'Léviathan',
      },
      'replaceText': {
        'Crashing Pulse': 'Pulsation déchaînée',
        'Drenching Pulse': 'Pulsation sauvage',
        'Freak Wave': 'Vague gigantesque',
        'Killer Wave': 'Vague meutrière',
        'Maelstrom': 'Maelström',
        'Monster Wave': 'Vague monstrueuse',
        'Rip Current': 'Courant d\'arrachement',
        'Smothering Tsunami': 'Tsunami submergeant',
        'Spinning Dive': 'Piqué tournant',
        'Splashing Tsunami': 'Tsunami déferlant',
        'Surging Tsunami': 'Tsunami écrasant',
        'Swirling Tsunami': 'Tsunami tournoyant',
        'Temporary Current': 'Courant évanescent',
        'Tidal Roar': 'Vague rugissante',
        'Tidal Wave': 'Raz-de-marée',
        '(?<! )Tsunami': 'Tsunami',
        'Undersea Quake': 'Séisme sous-marin',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Leviathan': 'リヴァイアサン',
      },
      'replaceText': {
        'Crashing Pulse': '激烈なる波動',
        'Drenching Pulse': '猛烈なる波動',
        'Freak Wave': 'フリークウェイブ',
        'Killer Wave': 'キラーウェイブ',
        'Maelstrom': 'メイルシュトローム',
        'Monster Wave': 'モンスターウェイブ',
        'Rip Current': 'リップカレント',
        'Smothering Tsunami': '溺没の大海嘯',
        'Spinning Dive': 'スピニングダイブ',
        'Splashing Tsunami': '強風の大海嘯',
        'Surging Tsunami': '強圧の大海嘯',
        'Swirling Tsunami': '渦動の大海嘯',
        'Temporary Current': 'テンポラリーカレント',
        'Tidal Roar': 'タイダルロア',
        'Tidal Wave': 'タイダルウェイブ',
        '(?<! )Tsunami': '大海嘯',
        'Undersea Quake': 'アンダーシークエイク',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Leviathan': '利维亚桑',
      },
      'replaceText': {
        'Crashing Pulse': '激烈波动',
        'Drenching Pulse': '猛烈波动',
        'Freak Wave': '畸形波',
        'Killer Wave': '杀人浪',
        'Maelstrom': '巨漩涡',
        'Monster Wave': '疯狗浪',
        'Rip Current': '裂流',
        'Smothering Tsunami': '溺没大海啸',
        'Spinning Dive': '旋转下潜',
        'Splashing Tsunami': '强风大海啸',
        'Surging Tsunami': '强压大海啸',
        'Swirling Tsunami': '涡动大海啸',
        'Temporary Current': '临时洋流',
        'Tidal Roar': '怒潮咆哮',
        'Tidal Wave': '巨浪',
        '(?<! )Tsunami': '大海啸',
        'Undersea Quake': '海底地震',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Leviathan': '리바이어선',
      },
      'replaceText': {
        'Crashing Pulse': '격렬한 파동',
        'Drenching Pulse': '맹렬한 파동',
        'Freak Wave': '기괴한 물결',
        'Killer Wave': '치명적인 물결',
        'Maelstrom': '대격동',
        'Monster Wave': '마물의 물결',
        'Rip Current': '이안류',
        'Smothering Tsunami': '익몰의 대해일',
        'Spinning Dive': '고속 돌진',
        'Splashing Tsunami': '강풍의 대해일',
        'Surging Tsunami': '강압의 대해일',
        'Swirling Tsunami': '와동의 대해일',
        'Temporary Current': '순간 해류',
        'Tidal Roar': '바다의 포효',
        'Tidal Wave': '해일',
        '(?<! )Tsunami': '대해일',
        'Undersea Quake': '해저 지진',
      },
    },
  ],
};
