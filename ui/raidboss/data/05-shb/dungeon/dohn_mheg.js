'use strict';

[{
  zoneRegex: {
    en: /^Dohn Mheg$/,
    ko: /^도느 메그$/,
  },
  timelineFile: 'dohn_mheg.txt',
  timelineTriggers: [
    {
      id: 'Dohn Mheg Rake',
      regex: /Rake/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.miniBuster(),
    },
  ],
  triggers: [
    {
      id: 'Dohn Mheg Watering Wheel',
      // TODO: double check this with an import, is there a The??
      regex: Regexes.startsUsing({ id: '3DAA', source: 'Dohnfast Fuath' }),
      regexDe: Regexes.startsUsing({ id: '3DAA', source: 'Dohn-Fuath' }),
      regexFr: Regexes.startsUsing({ id: '3DAA', source: 'Fuath De Dohn Mheg' }),
      regexJa: Regexes.startsUsing({ id: '3DAA', source: 'ドォーヌ・フーア' }),
      regexCn: Regexes.startsUsing({ id: '3DAA', source: '禁园水妖' }),
      regexKo: Regexes.startsUsing({ id: '3DAA', source: '도느 푸아' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt(),
    },
    {
      id: 'Dohn Mheg Straight Punch',
      // TODO: double check this with an import, is there a The??
      regex: Regexes.startsUsing({ id: '3DAB', source: 'Dohnfast Basket' }),
      regexDe: Regexes.startsUsing({ id: '3DAB', source: 'Dohn-Blumenkorb' }),
      regexFr: Regexes.startsUsing({ id: '3DAB', source: 'Panier De Dohn Mheg' }),
      regexJa: Regexes.startsUsing({ id: '3DAB', source: 'ドォーヌ・バスケット' }),
      regexCn: Regexes.startsUsing({ id: '3DAB', source: '禁园篮筐' }),
      regexKo: Regexes.startsUsing({ id: '3DAB', source: '도느 바구니' }),
      condition: function(data) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      id: 'Dohn Mheg Proboscis',
      // TODO: double check this with an import, is there a The??
      regex: Regexes.startsUsing({ id: '3DAF', source: 'Dohnfast Etainmoth' }),
      regexDe: Regexes.startsUsing({ id: '3DAF', source: 'Dohn-Edianmotte' }),
      regexFr: Regexes.startsUsing({ id: '3DAF', source: 'Noctuétain De Dohn Mheg' }),
      regexJa: Regexes.startsUsing({ id: '3DAF', source: 'ドォーヌ・エーディンモス' }),
      regexCn: Regexes.startsUsing({ id: '3DAF', source: '禁园爱蒂恩蛾' }),
      regexKo: Regexes.startsUsing({ id: '3DAF', source: '도느 에다인나방' }),
      condition: function(data) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      id: 'Dohn Mheg Torpedo',
      // TODO: double check this with an import, is there a The??
      regex: Regexes.startsUsing({ id: '3DB5', source: 'Dohnfast Kelpie' }),
      regexDe: Regexes.startsUsing({ id: '3DB5', source: 'Dohn-Kelpie' }),
      regexFr: Regexes.startsUsing({ id: '3DB5', source: 'Kelpie De Dohn Mheg' }),
      regexJa: Regexes.startsUsing({ id: '3DB5', source: 'ドォーヌ・ケルピー' }),
      regexCn: Regexes.startsUsing({ id: '3DB5', source: '禁园凯尔派' }),
      regexKo: Regexes.startsUsing({ id: '3DB5', source: '도느 켈피' }),
      condition: function(data) {
        return data.CanStun();
      },
      response: Responses.stun('info'),
    },
    {
      id: 'Dohn Mheg Candy Cane',
      regex: Regexes.startsUsing({ id: '2299', source: 'Aenc Thon, Lord Of The Lingering Gaze' }),
      regexDe: Regexes.startsUsing({ id: '2299', source: 'Aenc Thon (?:der|die|das) Glupschäugig(?:e|er|es|en)' }),
      regexFr: Regexes.startsUsing({ id: '2299', source: 'Aenc Thon L\'Envoûtant' }),
      regexJa: Regexes.startsUsing({ id: '2299', source: '美眼のインク＝ゾン' }),
      regexCn: Regexes.startsUsing({ id: '2299', source: '美眼 因克·佐恩' }),
      regexKo: Regexes.startsUsing({ id: '2299', source: '눈이 예쁜 잉크 돈' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Dohn Mheg Landsblood',
      regex: Regexes.startsUsing({ id: '1E8E', source: 'Aenc Thon, Lord Of The Lingering Gaze', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1E8E', source: 'Aenc Thon (?:der|die|das) Glupschäugig(?:e|er|es|en)', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1E8E', source: 'Aenc Thon L\'Envoûtant', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1E8E', source: '美眼のインク＝ゾン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1E8E', source: '美眼 因克·佐恩', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1E8E', source: '눈이 예쁜 잉크 돈', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'Dohn Mheg Leap Stack',
      regex: Regexes.headMarker({ id: '003E' }),
      response: Responses.stackOn(),
    },
    {
      id: 'Dohn Mheg Timber',
      regex: Regexes.startsUsing({ id: '22D3', source: 'Griaule', capture: false }),
      regexDe: Regexes.startsUsing({ id: '22D3', source: 'Griaule', capture: false }),
      regexFr: Regexes.startsUsing({ id: '22D3', source: 'Griaule', capture: false }),
      regexJa: Regexes.startsUsing({ id: '22D3', source: 'グリオール', capture: false }),
      regexCn: Regexes.startsUsing({ id: '22D3', source: '格里奥勒', capture: false }),
      regexKo: Regexes.startsUsing({ id: '22D3', source: '그리올', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'Dohn Mheg Crippling Blow',
      regex: Regexes.startsUsing({ id: '35A4', source: 'Aenc Thon, Lord Of The Lengthsome Gait' }),
      regexDe: Regexes.startsUsing({ id: '35A4', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)' }),
      regexFr: Regexes.startsUsing({ id: '35A4', source: 'Aenc Thon Le Virtuose' }),
      regexJa: Regexes.startsUsing({ id: '35A4', source: '楽聖のインク＝ゾン' }),
      regexCn: Regexes.startsUsing({ id: '35A4', source: '乐圣 因克·佐恩' }),
      regexKo: Regexes.startsUsing({ id: '35A4', source: '대음악가 잉크 돈' }),
      condition: function(data, matches) {
        return matches.target == data.me || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      id: 'Dohn Mheg Imp Choir',
      regex: Regexes.startsUsing({ id: '34F0', source: 'Aenc Thon, Lord Of The Lengthsome Gait', capture: false }),
      regexDe: Regexes.startsUsing({ id: '34F0', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)', capture: false }),
      regexFr: Regexes.startsUsing({ id: '34F0', source: 'Aenc Thon Le Virtuose', capture: false }),
      regexJa: Regexes.startsUsing({ id: '34F0', source: '楽聖のインク＝ゾン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '34F0', source: '乐圣 因克·佐恩', capture: false }),
      regexKo: Regexes.startsUsing({ id: '34F0', source: '대음악가 잉크 돈', capture: false }),
      response: Responses.lookAway('alert'),
    },
    {
      id: 'Dohn Mheg Toad Choir',
      regex: Regexes.startsUsing({ id: '34EF', source: 'Aenc Thon, Lord Of The Lengthsome Gait', capture: false }),
      regexDe: Regexes.startsUsing({ id: '34EF', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)', capture: false }),
      regexFr: Regexes.startsUsing({ id: '34EF', source: 'Aenc Thon Le Virtuose', capture: false }),
      regexJa: Regexes.startsUsing({ id: '34EF', source: '楽聖のインク＝ゾン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '34EF', source: '乐圣 因克·佐恩', capture: false }),
      regexKo: Regexes.startsUsing({ id: '34EF', source: '대음악가 잉크 돈', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Dohn Mheg Virtuosic Cappriccio',
      regex: Regexes.startsUsing({ id: '358C', source: 'Aenc Thon, Lord Of The Lengthsome Gait', capture: false }),
      regexDe: Regexes.startsUsing({ id: '358C', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)', capture: false }),
      regexFr: Regexes.startsUsing({ id: '358C', source: 'Aenc Thon Le Virtuose', capture: false }),
      regexJa: Regexes.startsUsing({ id: '358C', source: '楽聖のインク＝ゾン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '358C', source: '乐圣 因克·佐恩', capture: false }),
      regexKo: Regexes.startsUsing({ id: '358C', source: '대음악가 잉크 돈', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
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
        'Aenc Thon, Lord of the Lingering Gaze': 'Aenc Thon der Glupschäugige',
        'Griaule': 'Griaule',
        'Painted Sapling': 'Griaules Sämling',
        'Aenc Thon, Lord of the Lengthsome Gait': 'Aenc Thon der Langbeinige',
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
        '--stun--': '--unterbrechen--',
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
        '--stun--': '--기절--',
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
  ],
}];
