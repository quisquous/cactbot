import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  seenTowers?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.DomaCastle,
  timelineFile: 'doma_castle.txt',
  triggers: [
    {
      id: 'Doma Castle Magitek Hexadrone 2-Tonze Magitek Missile',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Doma Castle Magitek Hexadrone Magitek Missiles',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ source: 'Magitek Hexadrone', id: '20A4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Magitek-Hexadrohne', id: '20A4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Hexadrone Magitek', id: '20A4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: '魔導ヘキサローラー', id: '20A4', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '魔导六轮装甲', id: '20A4', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '마도 헥사롤러', id: '20A4', capture: false }),
      infoText: (data, _matches, output) => {
        return data.seenTowers ? output.getTowers!() : output.getTower!();
      },
      run: (data) => data.seenTowers = true,
      outputStrings: {
        getTower: {
          en: 'Get Tower',
          de: 'Turm nehmen',
          fr: 'Prenez les tours', // FIXME
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 하나씩 들어가기', // FIXME
        },
        getTowers: {
          en: 'Get Towers',
          de: 'Türme nehmen',
          fr: 'Prenez les tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 하나씩 들어가기',
        },
      },
    },
    {
      id: 'Doma Castle Hypertuned Grynewaht Delay-Action Charge',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0063' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Doma Castle Hypertuned Grynewaht Thermobaric Charge',
      type: 'GainsEffect',
      // There's no 0x1B line or 0x14/0x15 target for this prox marker, only the Prey debuff.
      netRegex: NetRegexes.gainsEffect({ effectId: '4E5' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop Charge Away',
          de: 'Lege Markierung weit weg ab',
          cn: '将标记放远',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Hexadrone Bit': 'Hexadrohnen-Modul',
        'Hypertuned Grynewaht': 'hyperisiert(?:e|er|es|en) Grynewaht',
        'Magitek Chakram': 'Magitek-Chakram',
        'Magitek Hexadrone': 'Magitek-Hexadrohne',
        'Magitek Rearguard': 'Magitek-Rückendecker',
        'Rearguard Bit': 'Rückendecker-Drohne',
        'The Third Armory': 'Dritte Waffenkammer',
        'The Training Grounds': 'Exerzierplatz',
        'The Hall Of The Scarlet Swallow': 'Halle der Blutroten Schwalbe',
      },
      'replaceText': {
        '2-Tonze Magitek Missile': 'Magitek-Großrakete',
        'Bits Activate': 'Aktivierung der Module',
        'Cermet Pile': 'Cermet-Pfahl',
        'Chainsaw': 'Kettensäge',
        'Circle Of Death': 'Todeskreis',
        'Clean Cut': 'Durchschlag',
        'Delay-Action Charge': 'Zeitzünder',
        'Garlean Fire': 'Garleischer Brandsatz',
        'Gunsaw': 'Kanonensäge',
        'Hexadrone Bits': 'Hexadrohnen-Module',
        'Magitek Missiles': 'Magitek-Rakete',
        'Magitek Ray': 'Magitek-Laser',
        'Rearguard Mines': 'Rückendecker-Minen',
        'Thermobaric Charge': 'Aerosolbombe',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Hexadrone Bit': 'module d\'hexadrone',
        'Hypertuned Grynewaht': 'Grynewaht hyper-renforcé',
        'Magitek Chakram': 'chakram magitek',
        'Magitek Hexadrone': 'hexadrone magitek',
        'Magitek Rearguard': 'arrière-garde magitek',
        'Rearguard Bit': 'drone d\'arrière-garde',
        'The Third Armory': 'Arsenal A3',
        'The Training Grounds': 'Terrain de manœuvres',
        'The Hall Of The Scarlet Swallow': 'Salle de l\'Hirondelle écarlate',
      },
      'replaceText': {
        '2-Tonze Magitek Missile': 'Missiles magitek de 2 tonz',
        'Cermet Pile': 'Amas de cermet',
        'Chainsaw': 'Tronçonneuse',
        'Circle Of Death': 'Cercle de la mort',
        'Clean Cut': 'Tranchage net',
        'Delay-Action Charge': 'Charge à retardement',
        'Garlean Fire': 'Feu garlemaldais',
        'Gunsaw': 'Canon-tronçonneur',
        'Magitek Missiles': 'Missiles magitek',
        'Magitek Ray': 'Rayon magitek',
        'Thermobaric Charge': 'Charge thermobarique',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Hexadrone Bit': 'ヘキサローラー・ビット',
        'Hypertuned Grynewaht': '強化グリーンワート',
        'Magitek Chakram': '魔導チャクラム',
        'Magitek Hexadrone': '魔導ヘキサローラー',
        'Magitek Rearguard': '魔導リアガード',
        'Rearguard Bit': 'リアガード・ビット',
        'The Third Armory': '第III兵器庫',
        'The Training Grounds': '練兵場',
        'The Hall Of The Scarlet Swallow': '赤燕の間',
      },
      'replaceText': {
        '2-Tonze Magitek Missile': '大型魔導ミサイル',
        'Cermet Pile': 'サーメットパイル',
        'Chainsaw': 'チェーンソー',
        'Circle Of Death': 'サークル・オブ・デス',
        'Clean Cut': '激突',
        'Delay-Action Charge': '時限爆弾',
        'Garlean Fire': 'ガレアンファイア',
        'Gunsaw': 'ガンチェーンソー',
        'Magitek Missiles': '魔導ミサイル',
        'Magitek Ray': '魔導レーザー',
        'Thermobaric Charge': '気化爆弾',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Hexadrone Bit': '魔导六轮装甲浮游炮',
        'Hypertuned Grynewaht': '强化格林瓦特',
        'Magitek Chakram': '魔导战轮',
        'Magitek Hexadrone': '魔导六轮装甲',
        'Magitek Rearguard': '魔导后卫',
        'Rearguard Bit': '魔导后卫浮游炮',
        'The Third Armory': '第三兵器库',
        'The Training Grounds': '练兵场',
        'The Hall Of The Scarlet Swallow': '赤燕之间',
      },
      'replaceText': {
        '2-Tonze Magitek Missile': '大型魔导导弹',
        'Bits Activate': '浮游炮激活',
        'Cermet Pile': '陶瓷合金桩',
        'Chainsaw': '链锯',
        'Circle Of Death': '死亡回旋',
        'Clean Cut': '激突',
        'Delay-Action Charge': '定时炸弹',
        'Garlean Fire': '加雷马火炎',
        'Gunsaw': '链锯枪',
        'Hexadrone Bits': '魔导六轮装甲浮游炮',
        'Magitek Missiles': '魔导飞弹',
        'Magitek Ray': '魔导激光',
        'Rearguard Mines': '魔导后卫炸雷',
        'Thermobaric Charge': '气化炸弹',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Hexadrone Bit': '헥사롤러 비트',
        'Hypertuned Grynewaht': '강화된 그륀바트',
        'Magitek Chakram': '마도 차크람',
        'Magitek Hexadrone': '마도 헥사롤러',
        'Magitek Rearguard': '마도 리어가드',
        'Rearguard Bit': '리어가드 비트',
        'The Third Armory': '제III병기고',
        'The Training Grounds': '연병장',
        'The Hall Of The Scarlet Swallow': '세키엔의 방',
      },
      'replaceText': {
        '2-Tonze Magitek Missile': '대형 마도 미사일',
        'Cermet Pile': '합금 말뚝',
        'Chainsaw': '전기톱',
        'Circle Of Death': '죽음의 원',
        'Clean Cut': '격돌',
        'Delay-Action Charge': '시한폭탄',
        'Garlean Fire': '갈레안 파이어',
        'Gunsaw': '기관총',
        'Magitek Missiles': '마도 미사일',
        'Magitek Ray': '마도 레이저',
        'Thermobaric Charge': '기화폭탄',
      },
    },
  ],
};

export default triggerSet;
