import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export type Data = RaidbossData;

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.SaintMociannesArboretumHard,
  timelineFile: 'st_mocianne_hard.txt',
  timelineTriggers: [
    {
      id: 'St Mocianne Hard Quickmire',
      regex: /Quickmire/,
      beforeSeconds: 7, // This is approximately when the sewage surge begins.
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Be On A Platform',
          de: 'BSei auf einer Plattform',
          fr: 'Restez sur une plateforme ',
          ja: '円形床の上へ',
          cn: '站台子上',
          ko: '원형 바닥 위로',
        },
      },
    },
  ],
  triggers: [
    {
      // Trash mob gaze attack
      id: 'St Mocianne Hard Frond Fatale',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '31A4', source: 'Withered Belladonna' }),
      netRegexDe: NetRegexes.startsUsing({ id: '31A4', source: 'Verwittert(?:e|er|es|en) Belladonna' }),
      netRegexFr: NetRegexes.startsUsing({ id: '31A4', source: 'Belladone Flétrie' }),
      netRegexJa: NetRegexes.startsUsing({ id: '31A4', source: 'ウィザード・ベラドンナ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '31A4', source: '枯萎剧毒美人' }),
      netRegexKo: NetRegexes.startsUsing({ id: '31A4', source: '시든 벨라돈나' }),
      condition: (data) => data.CanSilence(),
      response: Responses.interrupt(),
    },
    {
      id: 'St Mocianne Hard Vine Whip',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2E48', source: 'Nullchu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2E48', source: 'Nullchu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2E48', source: 'Nullchu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2E48', source: 'ヌルチュー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2E48', source: '泥口花' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2E48', source: '누루츄' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'St Mocianne Hard Sludge Bomb',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0001' }),
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Sludge puddle on YOU',
          de: 'Schlammfläche auf DIR',
          fr: 'Zone de poison au sol sur VOUS',
          ja: '自分にスラッジボム',
          cn: '泥浆炸弹点名',
          ko: '독장판 대상자',
        },
      },
    },
    {
      id: 'St Mocianne Hard Fault Warren',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      suppressSeconds: 5, // There are two (!!) simultaneous head markers on the same target here.
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'St Mocianne Hard Taproot',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '008D' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'St Mocianne Hard Devour',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '2E4F', source: 'Nullchu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2E4F', source: 'Nullchu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2E4F', source: 'Nullchu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2E4F', source: 'ヌルチュー', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2E4F', source: '泥口花', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2E4F', source: '누루츄', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get behind flower',
          de: 'Geh hinter die Blume',
          fr: 'Passez derrière la plante',
          ja: 'ボスの後ろへ',
          cn: '躲背后',
          ko: '꽃 뒤로',
        },
      },
    },
    {
      id: 'St Mocianne Hard Stone II',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '312A', source: 'Lakhamu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '312A', source: 'Lakhamu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '312A', source: 'Lakhamu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '312A', source: 'ラハム' }),
      netRegexCn: NetRegexes.startsUsing({ id: '312A', source: '拉哈穆' }),
      netRegexKo: NetRegexes.startsUsing({ id: '312A', source: '라하무' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'St Mocianne Hard Tectonics',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '312C', source: 'Lakhamu', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '312C', source: 'Lakhamu', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '312C', source: 'Lakhamu', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '312C', source: 'ラハム', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '312C', source: '拉哈穆', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '312C', source: '라하무', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'St Mocianne Hard Landslip',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3132', source: 'Silt Golem' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3132', source: 'Schlickgolem' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3132', source: 'Golem De Bourbe' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3132', source: 'シルトゴーレム' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3132', source: '淤泥巨像' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3132', source: '실트 골렘' }),
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 6,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Conveyors: Avoid Golem Lines',
          de: 'Transportbänder: Weiche den Golemlinien aus',
          fr: 'Transporteurs : Évitez les lignes des golems',
          ja: '強制移動: ゴーレムの直線を避ける',
          cn: '传送: 注意躲开巨像的直线AoE',
          ko: '넉백: 골렘이 있는 줄 피하기',
        },
      },
    },
    {
      id: 'St Mocianne Hard Eath Shaker',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0028' }),
      condition: Conditions.targetIsYou(),
      response: Responses.earthshaker(),
    },
    {
      id: 'St Mocianne Empty Gaze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '312B', source: 'Lakhamu' }),
      netRegexDe: NetRegexes.startsUsing({ id: '312B', source: 'Lakhamu' }),
      netRegexFr: NetRegexes.startsUsing({ id: '312B', source: 'Lakhamu' }),
      netRegexJa: NetRegexes.startsUsing({ id: '312B', source: 'ラハム' }),
      netRegexCn: NetRegexes.startsUsing({ id: '312B', source: '拉哈穆' }),
      netRegexKo: NetRegexes.startsUsing({ id: '312B', source: '라하무' }),
      response: Responses.lookAwayFromSource(),
    },
    {
      id: 'St Mocianne Mudsling',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3135', source: 'Tokkapchi' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3135', source: 'Tokkapchi' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3135', source: 'Tokkapchi' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3135', source: 'トカップチ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3135', source: '枯腐泥妖' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3135', source: '진흙장사' }),
      response: Responses.tankBuster(),
    },
    {
      id: 'St Mocianne Hard Quagmire',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '008B' }),
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread + Stay Off Platforms',
          de: 'Verteilen + runter von den Plattformen',
          fr: 'Dispersion + Restez hors des platesformes',
          ja: '散開、円形床に落とさないよう',
          cn: '分散，出台子',
          ko: '산개, 초록 장판 피하기',
        },
      },
    },
    {
      id: 'St Mocianne Hard Mud Pie',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '3137', source: 'Tokkapchi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '3137', source: 'Tokkapchi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '3137', source: 'Tokkapchi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '3137', source: 'トカップチ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '3137', source: '枯腐泥妖', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '3137', source: '진흙장사', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Push Mud Pie On Platform',
          de: 'Schiebe Schlammklumpen auf eine Plattform',
          fr: 'Poussez la Boule de boue sur la platesforme',
          ja: 'スライムを円形床に吹き飛ばす',
          cn: '把小怪推到台子上',
          ko: '진흙 슬라임 초록 장판으로',
        },
      },
    },
    {
      id: 'St Mocianne Hard Feculent Flood',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '313C', source: 'Tokkapchi', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '313C', source: 'Tokkapchi', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '313C', source: 'Tokkapchi', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '313C', source: 'トカップチ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '313C', source: '枯腐泥妖', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '313C', source: '진흙장사', capture: false }),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Push Mud Pie Out Of Cone',
          de: 'Schiebe Schlammklumpen aus der Kegel-AoE',
          fr: 'Poussez la Boule de boue hors du cône',
          ja: 'スライムを範囲外へ吹き飛ばす',
          cn: '把小怪推出AoE',
          ko: '진흙 슬라임 초록 장판 바깥으로',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Kingsloam': 'Hort des Schlammkönigs',
        'Lakhamu': 'Lakhamu',
        'Nullchu': 'Nullchu',
        'Silt Golem': 'Schlickgolem',
        'The Soil Bed': 'Das Beet',
        'Tokkapchi': 'Tokkapchi',
        'Zymology': 'Zymologie',
        'Withered Belladonna': 'verwittert(?:e|er|es|en) Belladonna',
      },
      'replaceText': {
        'Bog Bequest': 'Maliziöser Modder',
        'Devour': 'Verschlingen',
        'Earth Shaker': 'Erdstoß',
        'Earthquake': 'Erdbeben',
        'Empty Gaze': 'Stierer Blick',
        'Fault Warren': 'Pfahlwurzel',
        'Feculent Flood': 'Modrige Flut',
        'From Mud': 'Schlammgeburt',
        'Landslip': 'Einsturz',
        'Mud Pie': 'Schlammklumpen',
        'Mudsling': 'Schlammschleuder',
        'Odious Air': 'Abstoßender Odem',
        'Odious Atmosphere': 'Abstoßende Atmosphäre',
        'Quagmire': 'Morast',
        'Quickmire': 'Schlammspritzer',
        'Rockslide': 'Erdrutsch',
        'Sludge Bomb': 'Schlammbombe',
        'Stone II': 'Steinra',
        'Taproot': 'Pfahlwurzel',
        'Tectonics': 'Tektonik',
        'Vine Whip': 'Rankenpeitsche',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Kingsloam': 'Salle d\'audience du roi fangeux',
        'Lakhamu': 'Lakhamu',
        'Nullchu': 'nullchu',
        'Silt Golem': 'golem de bourbe',
        'The Soil Bed': 'La Litière',
        'Tokkapchi': 'Tokkapchi',
        'Zymology': 'Zymologie',
        'Withered Belladonna': 'belladone flétrie',
      },
      'replaceText': {
        '\\?': ' ?',
        'Bog Bequest': 'Sotomusô-gadoue',
        'Devour': 'Dévoration',
        'Earth Shaker': 'Secousse',
        'Earthquake': 'Grand séisme',
        'Empty Gaze': 'Œil terne',
        'Fault Warren': 'Faille des élus',
        'Feculent Flood': 'Sukuinage-gadoue',
        'From Mud': 'Yobidashi-gadoue',
        'Landslip': 'Sol mouvant',
        'Mud Pie': 'Boule de boue',
        'Mudsling': 'Mandale bourbeuse',
        'Odious Air': 'Pestilence',
        'Odious Atmosphere': 'Air vicié',
        'Quagmire': 'Bourbe',
        'Quickmire': 'Jaillissement de bourbe',
        'Rockslide': 'Éboulement',
        'Sludge Bomb': 'Bombe de vase',
        'Stone II': 'Extra Terre',
        'Taproot': 'Racine pivotante',
        'Tectonics': 'Diastrophisme',
        'Vine Whip': 'Fouet de vigne',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Kingsloam': '汚泥王の謁見室',
        'Lakhamu': 'ラハム',
        'Nullchu': 'ヌルチュー',
        'Silt Golem': 'シルトゴーレム',
        'The Soil Bed': '沃土の寝室',
        'Tokkapchi': 'トカップチ',
        'Zymology': '腐臭の庭',
        'Withered Belladonna': 'ウィザード・ベラドンナ',
      },
      'replaceText': {
        'Bog Bequest': 'ドロドロ外無双',
        'Devour': '捕食',
        'Earth Shaker': 'アースシェイカー',
        'Earthquake': '大地震',
        'Empty Gaze': '虚無の瞳',
        'Fault Warren': 'フォルトウォーレン',
        'Feculent Flood': 'ドロドロ掬い投げ',
        'From Mud': 'ドロドロ呼び出し',
        'Landslip': '地滑り',
        'Mud Pie': '泥団子',
        'Mudsling': 'ドロドロ突っ張り',
        'Odious Air': 'オディアスエアー',
        'Odious Atmosphere': 'オディアスアトモスフィアー',
        'Quagmire': '汚泥',
        'Quickmire': '汚泥噴出',
        'Rockslide': 'ロックスライド',
        'Sludge Bomb': 'スラッジボム',
        'Stone II': 'ストンラ',
        'Taproot': 'タップルート',
        'Tectonics': '地殻変動',
        'Vine Whip': 'ヴァインウィップ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Kingsloam': '污泥王谒见室',
        'Lakhamu': '拉哈穆',
        'Nullchu': '泥口花',
        'Silt Golem': '淤泥巨像',
        'The Soil Bed': '沃土寝室',
        'Tokkapchi': '枯腐泥妖',
        'Zymology': '腐臭庭园',
        'Withered Belladonna': '枯萎剧毒美人',
      },
      'replaceText': {
        'Bog Bequest': '污泥外无双',
        'Devour': '捕食',
        'Earth Shaker': '大地摇动',
        'Earthquake': '大地震',
        'Empty Gaze': '空洞之瞳',
        'Fault Warren': '地层穿刺',
        'Feculent Flood': '污泥破散',
        'From Mud': '污泥呼唤',
        'Landslip': '滑坡',
        'Mud Pie': '泥丸子',
        'Mudsling': '污泥猛抽',
        'Odious Air': '恶意毒气',
        'Odious Atmosphere': '恶意毒境',
        'Quagmire': '污泥',
        'Quickmire': '污泥喷出',
        'Rockslide': '岩石崩溃',
        'Sludge Bomb': '泥浆炸弹',
        'Stone II': '坚石',
        'Taproot': '主根',
        'Tectonics': '地壳变动',
        'Vine Whip': '藤鞭',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Kingsloam': '진흙왕의 알현실',
        'Lakhamu': '라하무',
        'Nullchu': '누루츄',
        'Silt Golem': '실트 골렘',
        'The Soil Bed': '비옥토 침실',
        'Tokkapchi': '진흙장사',
        'Zymology': '썩은 내 정원',
        'Withered Belladonna': '시든 벨라돈나',
      },
      'replaceText': {
        'Bog Bequest': '흙흙 밭다리',
        'Devour': '포식',
        'Earth Shaker': '요동치는 대지',
        'Earthquake': '요동치는 대지',
        'Empty Gaze': '허무한 눈동자',
        'Fault Warren': '촉수 융기',
        'Feculent Flood': '흙흙 배지기',
        'From Mud': '흙흙 불러내기',
        'Landslip': '흐르는 대지',
        'Mud Pie': '흙경단',
        'Mudsling': '흙흙 때리기',
        'Odious Air': '끔찍한 공기',
        'Odious Atmosphere': '끔찍한 대기',
        'Quagmire': '진흙탕',
        'Quickmire': '진흙 분출',
        'Rockslide': '낙석',
        'Sludge Bomb': '진흙 폭탄',
        'Stone II': '스톤라',
        'Taproot': '원뿌리',
        'Tectonics': '지각 변동',
        'Vine Whip': '덩굴 채찍',
      },
    },
  ],
};

export default triggerSet;
