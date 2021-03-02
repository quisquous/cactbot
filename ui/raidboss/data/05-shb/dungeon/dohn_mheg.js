import Conditions from '../../../../../resources/conditions';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses.js';
import ZoneId from '../../../../../resources/zone_id.js';

export default {
  zoneId: ZoneId.DohnMheg,
  timelineFile: 'dohn_mheg.txt',
  timelineTriggers: [
    {
      id: 'Dohn Mheg Rake',
      regex: /Rake/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role === 'tank' || data.role === 'healer';
      },
      response: Responses.miniBuster(),
    },
  ],
  triggers: [
    {
      id: 'Dohn Mheg Watering Wheel',
      // TODO: double check this with an import, is there a The??
      netRegex: NetRegexes.startsUsing({ id: '3DAA', source: 'Dohnfast Fuath' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3DAA', source: 'Dohn-Fuath' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3DAA', source: 'Fuath De Dohn Mheg' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3DAA', source: 'ドォーヌ・フーア' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3DAA', source: '禁园水妖' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3DAA', source: '도느 푸아' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt(),
    },
    {
      id: 'Dohn Mheg Straight Punch',
      // TODO: double check this with an import, is there a The??
      netRegex: NetRegexes.startsUsing({ id: '3DAB', source: 'Dohnfast Basket' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3DAB', source: 'Dohn-Blumenkorb' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3DAB', source: 'Panier De Dohn Mheg' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3DAB', source: 'ドォーヌ・バスケット' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3DAB', source: '禁园篮筐' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3DAB', source: '도느 바구니' }),
      condition: function(data) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      id: 'Dohn Mheg Proboscis',
      // TODO: double check this with an import, is there a The??
      netRegex: NetRegexes.startsUsing({ id: '3DAF', source: 'Dohnfast Etainmoth' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3DAF', source: 'Dohn-Edianmotte' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3DAF', source: 'Noctuétain De Dohn Mheg' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3DAF', source: 'ドォーヌ・エーディンモス' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3DAF', source: '禁园爱蒂恩蛾' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3DAF', source: '도느 에다인나방' }),
      condition: function(data) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      id: 'Dohn Mheg Torpedo',
      // TODO: double check this with an import, is there a The??
      netRegex: NetRegexes.startsUsing({ id: '3DB5', source: 'Dohnfast Kelpie' }),
      netRegexDe: NetRegexes.startsUsing({ id: '3DB5', source: 'Dohn-Kelpie' }),
      netRegexFr: NetRegexes.startsUsing({ id: '3DB5', source: 'Kelpie De Dohn Mheg' }),
      netRegexJa: NetRegexes.startsUsing({ id: '3DB5', source: 'ドォーヌ・ケルピー' }),
      netRegexCn: NetRegexes.startsUsing({ id: '3DB5', source: '禁园凯尔派' }),
      netRegexKo: NetRegexes.startsUsing({ id: '3DB5', source: '도느 켈피' }),
      condition: function(data) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      id: 'Dohn Mheg Candy Cane',
      netRegex: NetRegexes.startsUsing({ id: '2299', source: 'Aenc Thon, Lord Of The Lingering Gaze' }),
      netRegexDe: NetRegexes.startsUsing({ id: '2299', source: 'Aenc Thon (?:der|die|das) Glupschäugig(?:e|er|es|en)' }),
      netRegexFr: NetRegexes.startsUsing({ id: '2299', source: 'Aenc Thon L\'Envoûtant' }),
      netRegexJa: NetRegexes.startsUsing({ id: '2299', source: '美眼のインク＝ゾン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '2299', source: '美眼 因克·佐恩' }),
      netRegexKo: NetRegexes.startsUsing({ id: '2299', source: '눈이 예쁜 잉크 돈' }),
      condition: function(data, matches) {
        return matches.target === data.me || data.role === 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Dohn Mheg Landsblood',
      netRegex: NetRegexes.startsUsing({ id: '1E8E', source: 'Aenc Thon, Lord Of The Lingering Gaze', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1E8E', source: 'Aenc Thon (?:der|die|das) Glupschäugig(?:e|er|es|en)', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1E8E', source: 'Aenc Thon L\'Envoûtant', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1E8E', source: '美眼のインク＝ゾン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1E8E', source: '美眼 因克·佐恩', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1E8E', source: '눈이 예쁜 잉크 돈', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Dohn Mheg Leap Stack',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Dohn Mheg Timber',
      netRegex: NetRegexes.startsUsing({ id: '22D3', source: 'Griaule', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '22D3', source: 'Griaule', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '22D3', source: 'Griaule', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '22D3', source: 'グリオール', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '22D3', source: '格里奥勒', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '22D3', source: '그리올', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Dohn Mheg Crippling Blow',
      netRegex: NetRegexes.startsUsing({ id: '35A4', source: 'Aenc Thon, Lord Of The Lengthsome Gait' }),
      netRegexDe: NetRegexes.startsUsing({ id: '35A4', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)' }),
      netRegexFr: NetRegexes.startsUsing({ id: '35A4', source: 'Aenc Thon Le Virtuose' }),
      netRegexJa: NetRegexes.startsUsing({ id: '35A4', source: '楽聖のインク＝ゾン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '35A4', source: '乐圣 因克·佐恩' }),
      netRegexKo: NetRegexes.startsUsing({ id: '35A4', source: '대음악가 잉크 돈' }),
      condition: function(data, matches) {
        return matches.target === data.me || data.role === 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Dohn Mheg Imp Choir',
      netRegex: NetRegexes.startsUsing({ id: '34F0', source: 'Aenc Thon, Lord Of The Lengthsome Gait', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '34F0', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '34F0', source: 'Aenc Thon Le Virtuose', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '34F0', source: '楽聖のインク＝ゾン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '34F0', source: '乐圣 因克·佐恩', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '34F0', source: '대음악가 잉크 돈', capture: false }),
      response: Responses.lookAway('alert'),
    },
    {
      id: 'Dohn Mheg Toad Choir',
      netRegex: NetRegexes.startsUsing({ id: '34EF', source: 'Aenc Thon, Lord Of The Lengthsome Gait', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '34EF', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '34EF', source: 'Aenc Thon Le Virtuose', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '34EF', source: '楽聖のインク＝ゾン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '34EF', source: '乐圣 因克·佐恩', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '34EF', source: '대음악가 잉크 돈', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Dohn Mheg Virtuosic Cappriccio',
      netRegex: NetRegexes.startsUsing({ id: '358C', source: 'Aenc Thon, Lord Of The Lengthsome Gait', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '358C', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '358C', source: 'Aenc Thon Le Virtuose', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '358C', source: '楽聖のインク＝ゾン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '358C', source: '乐圣 因克·佐恩', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '358C', source: '대음악가 잉크 돈', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Teag Gye': 'Taeg Gye',
        'The Atelier': 'Griaules Revier',
        'The throne room': 'Garten des Kronsaal',
        'Aenc Thon, Lord of the Lingering Gaze': 'Aenc Thon (?:der|die|das) Glupschäugig(?:e|er|es|en)',
        'Griaule': 'Griaule',
        'Painted Sapling': 'Griaules Sämling',
        'Aenc Thon, Lord of the Lengthsome Gait': 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)',
        'Shade of Fear': 'Schatten der Angst',
      },
      'replaceText': {
        'Swinge': 'Brutaler Odem',
        'Fodder': 'Hungriges Gebrüll',
        'Tiiimbeeer': 'Baum fääällt',
        'Feeding Time': 'Fütterungszeit',
        'Coiling Ivy': 'Verschlungener Efeu',
        'Crippling Blow': 'Verkrüppelnder Schlag',
        'Imp Choir': 'Koboldchor',
        'Corrosive Bile': 'Ätzende Galle',
        'Geyser': 'Geysir',
        'Hydrofall': 'Hydro-Sturz',
        'Laughing Leap': 'Freudensprung',
        'Landsblood': 'Erdblut',
        'Candy Cane': 'Quietschehammer',
        'Funambulist\'s Fantasia': 'Seiltanz-Fantasie',
        'Malaise': 'Malaise',
        'Bile Bombardment': 'Galliger Niederschlag',
        'Flailing Tentacles': 'Tentakelflegel',
        'Toad Choir': 'Froschchor',
        'Changeling\'s Fantasia': 'Wechselbalg-Fantasie',
        'Virtuosic Capriccio': 'Virtuoses Capriccio',
        'Rake': 'Prankenhieb',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aenc Thon, Lord of the Lengthsome Gait': 'Aenc Thon Le Virtuose',
        'Aenc Thon, Lord of the Lingering Gaze': 'Aenc Thon L\'Envoûtant',
        'Griaule': 'Griaule',
        'Painted Sapling': 'Pousse de Griaule',
        'Shade of Fear': 'Illusion terrifiante',
        'Teag Gye': 'la Teag Gye',
        'The Atelier': 'Repos de Griaule',
        'The throne room': 'la salle du trésor',
      },
      'replaceText': {
        'Bile Bombardment': 'Bombardement bilieux',
        'Candy Cane': 'Canne en sucre d\'orge',
        'Changeling\'s Fantasia': 'Fantaisie du changelin',
        'Coiling Ivy': 'Étreinte de lierre',
        'Corrosive Bile': 'Bile corrosive',
        'Crippling Blow': 'Coup handicapant',
        'Feeding Time': 'Moisson',
        'Flailing Tentacles': 'Tentacules flagellants',
        'Fodder': 'Culture',
        'Funambulist\'s Fantasia': 'Fantaisie du funambule',
        'Geyser': 'Geyser',
        'Hydrofall': 'Pilonnage hydrique',
        'Imp Choir': 'Mélodie du kappa',
        'Landsblood': 'Pulsation phréatique',
        'Laughing Leap': 'Bond soudain',
        'Malaise': 'Malaise',
        'Rake': 'Griffes',
        'Swinge': 'Brutalité',
        'Tiiimbeeer': 'Ça tooombe',
        'Toad Choir': 'Mélodie du crapeau',
        'Virtuosic Capriccio': 'Capriccio effréné',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aenc Thon, Lord of the Lengthsome Gait': '楽聖のインク＝ゾン',
        'Aenc Thon, Lord of the Lingering Gaze': '美眼のインク＝ゾン',
        'Griaule': 'グリオール',
        'Painted Sapling': 'グリオール・サップリング',
        'Shade of Fear': '恐怖の幻影',
        'Teag Gye': '微睡みの泉',
        'The Atelier': 'グリオールの寝床',
        'The throne room': '王冠の間',
      },
      'replaceText': {
        'Bile Bombardment': '蟲毒飛散',
        'Candy Cane': 'キャンディケーン',
        'Changeling\'s Fantasia': '自己変異のファンタジア',
        'Coiling Ivy': '絡みつく蔦',
        'Corrosive Bile': 'コロシヴバイル',
        'Crippling Blow': '痛打',
        'Feeding Time': '養分献上',
        'Flailing Tentacles': '蠢く触手',
        'Fodder': '養分召喚',
        'Funambulist\'s Fantasia': '一本橋のファンタジア',
        'Geyser': '噴出',
        'Hydrofall': 'ハイドロフォール',
        'Imp Choir': 'カッパの調べ',
        'Landsblood': '水脈乱打',
        'Laughing Leap': '飛びかかり',
        'Malaise': '蟲毒瘴',
        'Rake': 'ひっかき',
        'Swinge': 'スイング',
        'Tiiimbeeer': 'ティーンバー',
        'Toad Choir': 'カエルの調べ',
        'Virtuosic Capriccio': '苛烈なるカプリッチョ',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Teag Gye': '선잠의 샘',
        'The Atelier': '그리올의 침상',
        'The throne room': '왕관의 방',
        'Aenc Thon, Lord of the Lingering Gaze': '눈이 예쁜 잉크 돈',
        'Griaule': '그리올',
        'Painted Sapling': '그리올 묘목',
        'Aenc Thon, Lord of the Lengthsome Gait': '대음악가 잉크 돈',
        'Shade of Fear': '공포의 환영',
      },
      'replaceText': {
        'Swinge': '징벌',
        'Fodder': '양분 소환',
        'Tiiimbeeer': '쓰러진다아아',
        'Feeding Time': '양분 헌상',
        'Coiling Ivy': '휘감는 덩굴',
        'Crippling Blow': '통타',
        'Imp Choir': '물요정의 음률',
        'Corrosive Bile': '부식성 담즙',
        'Geyser': '분출',
        'Hydrofall': '물 쏟기',
        'Laughing Leap': '달려들기',
        'Landsblood': '수맥 난타',
        'Candy Cane': '막대사탕',
        'Funambulist\'s Fantasia': '외나무다리 환상곡',
        'Malaise': '벌레독',
        'Bile Bombardment': '벌레독 살포',
        'Flailing Tentacles': '꿈틀대는 촉수',
        'Toad Choir': '개구리의 음률',
        'Changeling\'s Fantasia': '자기 변이 환상곡',
        'Virtuosic Capriccio': '가열찬 광상곡',
        'Rake': '할퀴기',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Teag Gye': '微睡之泉',
        'The Atelier': '格里奥勒的睡床',
        'The throne room': '王冠之间',
        'Aenc Thon, Lord of the Lingering Gaze': '美眼 因克·佐恩',
        'Griaule': '格里奥勒',
        'Painted Sapling': '格里奥勒花苗',
        'Aenc Thon, Lord of the Lengthsome Gait': '乐圣 因克·佐恩',
        'Shade of Fear': '恐怖幻影',
      },
      'replaceText': {
        'Swinge': '重击',
        'Fodder': '召唤养分',
        'Tiiimbeeer': '震木',
        'Feeding Time': '献上养分',
        'Coiling Ivy': '缠绕藤蔓',
        'Crippling Blow': '痛击',
        'Imp Choir': '河童歌唱队',
        'Corrosive Bile': '腐蚀咬',
        'Geyser': '幻水泉',
        'Hydrofall': '水瀑',
        'Laughing Leap': '飞扑',
        'Landsblood': '水脉乱打',
        'Candy Cane': '糖果手杖',
        'Funambulist\'s Fantasia': '独木桥幻想曲',
        'Malaise': '虫毒瘴',
        'Bile Bombardment': '虫毒飞散',
        'Flailing Tentacles': '触手轰击',
        'Toad Choir': '青蛙歌唱队',
        'Changeling\'s Fantasia': '自身变异幻想曲',
        'Virtuosic Capriccio': '残酷狂想曲',
        'Rake': '利爪',
      },
    },
  ],
};
