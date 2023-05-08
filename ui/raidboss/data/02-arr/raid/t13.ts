import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  gigaflare: number;
}

const triggerSet: TriggerSet<Data> = {
  id: 'TheFinalCoilOfBahamutTurn4',
  zoneId: ZoneId.TheFinalCoilOfBahamutTurn4,
  timelineFile: 't13.txt',
  initData: () => {
    return {
      gigaflare: 0,
    };
  },
  timelineTriggers: [
    {
      id: 'T13 Dive Warning',
      regex: /Megaflare Dive/,
      beforeSeconds: 5,
      response: Responses.stackMiddle(),
    },
  ],
  triggers: [
    {
      id: 'T13 Gigaflare Phase Change',
      type: 'StartsUsing',
      netRegex: { id: 'BB9', source: 'Bahamut Prime', capture: false },
      // Only the first two gigas are phase changes, the rest are in final phase.
      condition: (data) => data.gigaflare <= 2,
      sound: 'Long',
      infoText: (data, _matches, output) => {
        if (data.gigaflare !== 0)
          return output.text!();
      },
      run: (data) => data.gigaflare++,
      outputStrings: {
        text: {
          en: 'Stack Center for Dives',
          de: 'In der Mitte sammeln für Sturzbombe',
          fr: 'Packez-vous au centre pour les plongeons',
          ja: '中央待機、メガフレアダイブを待つ',
          cn: '中间集合等待俯冲',
          ko: '기가플레어 집합',
        },
      },
    },
    {
      id: 'T13 Flatten',
      type: 'StartsUsing',
      netRegex: { id: 'BAE', source: 'Bahamut Prime' },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.flattenOnYou!();
      },
      infoText: (data, matches, output) => {
        if (matches.target === data.me)
          return;
        return output.flattenOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        flattenOn: {
          en: 'Flatten on ${player}',
          de: 'Einebnen auf ${player}',
          fr: 'Compression sur ${player}',
          ja: '${player}にフラッテン',
          cn: '死刑点${player}',
          ko: '짓뭉개기 ${player}',
        },
        flattenOnYou: {
          en: 'Flatten on YOU',
          de: 'Einebnen auf DIR',
          fr: 'Compression sur VOUS',
          ja: '自分にフラッテン',
          cn: '死刑',
          ko: '짓뭉개기',
        },
      },
    },
    {
      id: 'T13 Megaflare Share',
      type: 'HeadMarker',
      netRegex: { id: '0027' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Megaflare Stack',
          de: 'Megaflare Sammeln',
          fr: 'MégaBrasier, Packez-vous',
          ja: 'メガフレア、集合',
          cn: '百万核爆集合',
          ko: '메가플레어 쉐어',
        },
      },
    },
    {
      id: 'T13 Earthshaker',
      type: 'HeadMarker',
      netRegex: { id: '0028' },
      condition: Conditions.targetIsYou(),
      response: Responses.earthshaker(),
    },
    {
      id: 'T13 Tempest Wing',
      type: 'Tether',
      netRegex: { id: '0004', target: 'Bahamut Prime' },
      condition: (data, matches) => data.me === matches.source,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tempest Tether on YOU',
          de: 'Sturm Verbindung auf DIR',
          fr: 'Liens de tempête sur VOUS',
          ja: '自分にテンペストウィング',
          cn: '风圈点名',
          ko: '폭풍 줄 대상자',
        },
      },
    },
    {
      id: 'T13 Akh Morn',
      type: 'StartsUsing',
      netRegex: { id: 'BC2', source: 'Bahamut Prime' },
      alertText: (data, matches, output) => {
        if (matches.target === data.me)
          return output.akhMornOnYou!();
      },
      infoText: (data, matches, output) => {
        if (matches.target !== data.me)
          return output.akhMornOn!({ player: data.ShortName(matches.target) });
      },
      outputStrings: {
        akhMornOn: {
          en: 'Akh Morn on ${player}',
          de: 'Akh Morn auf ${player}',
          fr: 'Akh Morn sur ${player}',
          ja: '${player}にアク・モーン',
          cn: '死亡轮回点${player}',
          ko: '"${player}" 아크몬',
        },
        akhMornOnYou: {
          en: 'Akh Morn on YOU',
          de: 'Akh Morn auf DIR',
          fr: 'Akh Morn sur VOUS',
          ja: '自分にアク・モーン',
          cn: '死亡轮回点名',
          ko: '아크몬 대상자',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bahamut Prime': 'Prim-Bahamut',
        'The Storm of Meracydia': 'Sturm von Meracydia',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Blood': 'Blut',
        'Dark Aether': 'Dunkeläther',
        'Double Dive': 'Doppelschwinge',
        'Earth Shaker': 'Erdstoß',
        'Flare Breath': 'Flare-Atem',
        'Flare Star': 'Flare-Stern',
        'Flatten': 'Einebnen',
        'Gigaflare': 'Gigaflare',
        'Gust Add': 'Wind Add',
        'MF Pepperoni': 'MF Fläche',
        'MF Share': 'MF Sammeln',
        'MF Spread': 'MF Verteilen',
        'MF Tower\\(s\\)': 'MF Türme',
        'MF Tower(?!\\(s)': 'MF Turm',
        'Megaflare': 'Megaflare',
        'Pain Add': 'Schmerz Add',
        'Rage Of Bahamut': 'Bahamuts Zorn',
        'Shadow Add': 'Schatten Add',
        'Sin Add': 'Sünde Add',
        'Storm Add': 'Sturm Add',
        'Tempest Wing': 'Sturm-Schwinge',
        'Teraflare': 'Teraflare',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bahamut Prime': 'Primo-Bahamut',
        'The Storm of Meracydia': 'Tempête De Méracydia',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        '(?<! )Blood Add': 'Add Sang',
        'Blood, Pain Adds': 'Adds Sang, Douleur',
        '1x Dark Aether Orb': '1x Orbe d\'éther sombre',
        'Dark Aether Orbs': 'Orbes d\'éther sombre',
        'Double Dive': 'Plongeon double',
        'Earth Shaker Marker': 'Marquage Secousse',
        'Earth Shaker(?! Marker)': 'Secousse',
        'Flare Breath': 'Souffle brasier',
        'Flare Star': 'Astre flamboyant',
        'Flatten': 'Compression',
        'Gigaflare': 'GigaBrasier',
        '2x Gust Adds': 'Adds 2x Bourrasque',
        '3x Gust Adds': 'Adds 3x Bourrasque',
        'MF Pepperoni': 'MB Zones au sol',
        'MF Share': 'MB Partagez',
        'MF Spread': 'MB Dispersez-vous',
        'MF Tower': 'MB Tour',
        'Megaflare Dive': 'Plongeon Mégabrasier',
        'Megaflare(?! Dive)': 'MégaBrasier',
        '(?<! )Pain Add': 'Add Douleur',
        'Rage Of Bahamut': 'Courroux de Bahamut',
        'Shadow Add': 'Add Ombre',
        '(?<! )Sin Add': 'Add Péché',
        '2x Sin Adds': 'Adds 2x Péché',
        'Storm Add': 'Add Tempête',
        'Tempest Wing Tethers': 'Liens Aile de tempête',
        'Tempest Wing(?! Tethers)': 'Aile de tempête',
        'Teraflare': 'TéraBrasier',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bahamut Prime': 'バハムート・プライム',
        'The Storm of Meracydia': 'メラシディアン・ストーム',
      },
      'replaceText': {
        'Akh Morn': 'アク・モーン',
        '(?<! )Blood Add': '雑魚: ブラッド',
        'Blood, Pain Adds': '雑魚: ブラッド + ペイン',
        '1x Dark Aether Orb': '1x ダークエーテル',
        'Dark Aether Orbs': 'ダークエーテル',
        'Double Dive': 'ダブルダイブ',
        'Earth Shaker': 'アースシェイカー',
        'Flare Breath': 'フレアブレス',
        'Flare Star': 'フレアスター',
        'Flatten': 'フラッテン',
        'Gigaflare': 'ギガフレア',
        '2x Gust Adds': '雑魚: 2x ガスト',
        '3x Gust Adds': '雑魚: 3x ガスト',
        '(?<= )Marker': 'マーカー',
        'MF Pepperoni': 'メガ: AoE',
        'MF Share': 'メガ: 頭割り',
        'MF Spread': 'メガ: 散開',
        'MF Tower(\\(s\\))?': 'メガ: 塔',
        'Megaflare': 'メガフレア',
        '(?<! )Pain Add': '雑魚: ペイン',
        'Rage Of Bahamut': '龍神の咆吼',
        'Shadow Add': '雑魚: シャドウ',
        '(?<! )Sin Add': '雑魚: シン',
        '2x Sin Adds': '雑魚: 2x シン',
        'Storm Add': '雑魚: ストーム',
        'Tempest Wing Tethers': 'テンペストウィング・線',
        'Tempest Wing(?! Tethers)': 'テンペストウィング',
        'Teraflare': 'テラフレア',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Bahamut Prime': '至尊巴哈姆特',
        'The Storm of Meracydia': '美拉西迪亚的怒雨',
      },
      'replaceText': {
        'Akh Morn': '死亡轮回',
        '(?<! )Blood Add': '血仇出现',
        'Blood, Pain Adds': '血仇, 苦痛出现',
        '1x Dark Aether Orb': '1x暗以太',
        'Dark Aether Orbs': '暗以太',
        'Double Dive': '双重俯冲',
        'Earth Shaker Marker': '大地摇动点名',
        'Earth Shaker(?! Marker)': '大地摇动',
        'Flare Breath': '核爆吐息',
        'Flare Star': '耀星',
        'Flatten': '夷为平地',
        'Gigaflare': '十亿核爆',
        '2x Gust Adds': '2x悲风出现',
        '3x Gust Adds': '3x悲风出现',
        'MF Pepperoni': '百万核爆放粑粑',
        'MF Share': '百万核爆分摊',
        'MF Spread': '百万核爆分散',
        'MF Tower': '百万核爆踩塔',
        'Megaflare Dive': '百万核爆冲',
        'Megaflare(?! Dive)': '百万核爆',
        '(?<! )Pain Add': '苦痛出现',
        'Rage Of Bahamut': '龙神咆哮',
        'Shadow Add': '怨影出现',
        '(?<! )Sin Add': '罪恶出现',
        '2x Sin Adds': '2x罪恶出现',
        'Storm Add': '怒雨出现',
        'Tempest Wing Tethers': '风暴之翼连线',
        'Tempest Wing(?! Tethers)': '风暴之翼',
        'Teraflare': '万亿核爆',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Bahamut Prime': '바하무트 프라임',
        'The Storm of Meracydia': '메라시디아의 폭풍',
      },
      'replaceText': {
        'Akh Morn': '아크 몬',
        'Blood, Pain Adds': '선혈, 고통 쫄',
        'Blood Add': '선혈 쫄',
        'Sin Add(s)?': '원죄 쫄',
        '(?<! )Pain Add': '고통 쫄',
        'Storm Add': '폭풍 쫄',
        'Shadow Add': '그림자 쫄',
        'Gust Add(s)?': '돌풍 쫄',
        'Dark Aether Orb(s)?': '어둠의 에테르 구슬',
        'Double Dive': '이중 강하',
        'Earth Shaker': '요동치는 대지',
        'Flare Breath': '타오르는 숨결',
        'Flare Star': '타오르는 별',
        'Flatten': '짓뭉개기',
        'Gigaflare': '기가플레어',
        'Megaflare(?! Dive)': '메가플레어',
        'Megaflare Dive': '메가플레어 다이브',
        'MF Pepperoni': '메가플레어 원형 장판',
        'MF Share': '메가플레어 쉐어',
        'MF Spread': '메가플레어 산개',
        'MF Tower(\\(s\\))?': '메가플레어 기둥',
        'Marker': '징',
        'Tethers': '선',
        'Rage Of Bahamut': '용신의 포효',
        'Tempest Wing': '폭풍우 날개',
        'Teraflare': '테라플레어',
      },
    },
  ],
};

export default triggerSet;
