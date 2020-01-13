'use strict';

[{
  zoneRegex: /^Dohn Mheg$/,
  timelineFile: 'dohn_mheg.txt',
  timelineTriggers: [
    {
      id: 'Dohn Mheg Rake',
      regex: /Rake/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      infoText: {
        en: 'Mini Buster',
        de: 'Kleiner TankbBuster',
      },
    },
  ],
  triggers: [
    {
      id: 'Dohn Mheg Watering Wheel',
      // TODO: double check this with an import, is there a The??
      regex: Regexes.startsUsing({ id: '3DAA', source: 'Dohnfast Fuath', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DAA', source: 'Dohn-Fuath', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DAA', source: 'Fuath De Dohn Mheg', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DAA', source: 'ドォーヌ・フーア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DAA', source: '禁园水妖', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DAA', source: '도느 푸아', capture: false }),
      condition: function(data) {
        return data.CanSilence();
      },
      alertText: {
        en: 'Silence Fuath',
        de: 'Stumme Dohn-Fuath',
      },
    },
    {
      id: 'Dohn Mheg Straight Punch',
      // TODO: double check this with an import, is there a The??
      regex: Regexes.startsUsing({ id: '3DAB', source: 'Dohnfast Basket', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DAB', source: 'Dohn-Blumenkorb', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DAB', source: 'Panier De Dohn Mheg', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DAB', source: 'ドォーヌ・バスケット', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DAB', source: '禁园篮筐', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DAB', source: '도느 바구니', capture: false }),
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Basket',
        de: 'Unterbreche Dohn-Blumenkorb',
      },
    },
    {
      id: 'Dohn Mheg Proboscis',
      // TODO: double check this with an import, is there a The??
      regex: Regexes.startsUsing({ id: '3DAF', source: 'Dohnfast Etainmoth', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DAF', source: 'Dohn-Edianmotte', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DAF', source: 'Noctuétain De Dohn Mheg', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DAF', source: 'ドォーヌ・エーディンモス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DAF', source: '禁园爱蒂恩蛾', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DAF', source: '도느 에다인나방', capture: false }),
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Moth',
        de: 'Unterbreche Dohn-Edianmotte',
      },
    },
    {
      id: 'Dohn Mheg Torpedo',
      // TODO: double check this with an import, is there a The??
      regex: Regexes.startsUsing({ id: '3DB5', source: 'Dohnfast Kelpie', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DB5', source: 'Dohn-Kelpie', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DB5', source: 'Kelpie De Dohn Mheg', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DB5', source: 'ドォーヌ・ケルピー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DB5', source: '禁园凯尔派', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DB5', source: '도느 켈피', capture: false }),
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Stun Kelpie',
        de: 'Unterbreche Dohn-Kelpie',
      },
    },
    {
      id: 'Dohn Mheg Candy Cane',
      regex: Regexes.startsUsing({ id: '2299', source: 'Aenc Thon, Lord Of The Lingering Gaze' }),
      regexDe: Regexes.startsUsing({ id: '2299', source: 'Aenc Thon (?:der|die|das) Glupschäugig(?:e|er|es|en)' }),
      regexFr: Regexes.startsUsing({ id: '2299', source: 'Aenc Thon L\'Envoûtant' }),
      regexJa: Regexes.startsUsing({ id: '2299', source: '美眼のインク＝ゾン' }),
      regexCn: Regexes.startsUsing({ id: '2299', source: '美眼 因克·佐恩' }),
      regexKo: Regexes.startsUsing({ id: '2299', source: '눈이 예쁜 잉크 돈' }),
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
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
      infoText: {
        en: 'aoe',
        de: 'AoE',
      },
    },
    {
      id: 'Dohn Mheg Leap Stack',
      regex: Regexes.headMarker({ id: '003E' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
        };
      },
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
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégats de zone',
      },
    },
    {
      id: 'Dohn Mheg Crippling Blow',
      regex: Regexes.startsUsing({ id: '35A4', source: 'Aenc Thon, Lord Of The Lengthsome Gait' }),
      regexDe: Regexes.startsUsing({ id: '35A4', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)' }),
      regexFr: Regexes.startsUsing({ id: '35A4', source: 'Aenc Thon Le Virtuose' }),
      regexJa: Regexes.startsUsing({ id: '35A4', source: '楽聖のインク＝ゾン' }),
      regexCn: Regexes.startsUsing({ id: '35A4', source: '乐圣 因克·佐恩' }),
      regexKo: Regexes.startsUsing({ id: '35A4', source: '대음악가 잉크 돈' }),
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Dohn Mheg Imp Choir',
      regex: Regexes.startsUsing({ id: '34F0', source: 'Aenc Thon, Lord Of The Lengthsome Gait', capture: false }),
      regexDe: Regexes.startsUsing({ id: '34F0', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)', capture: false }),
      regexFr: Regexes.startsUsing({ id: '34F0', source: 'Aenc Thon Le Virtuose', capture: false }),
      regexJa: Regexes.startsUsing({ id: '34F0', source: '楽聖のインク＝ゾン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '34F0', source: '乐圣 因克·佐恩', capture: false }),
      regexKo: Regexes.startsUsing({ id: '34F0', source: '대음악가 잉크 돈', capture: false }),
      alertText: {
        en: 'Look Away',
        de: 'Weg schauen',
        fr: 'Regardez ailleurs',
      },
    },
    {
      id: 'Dohn Mheg Toad Choir',
      regex: Regexes.startsUsing({ id: '34EF', source: 'Aenc Thon, Lord Of The Lengthsome Gait', capture: false }),
      regexDe: Regexes.startsUsing({ id: '34EF', source: 'Aenc Thon (?:der|die|das) Langbeinig(?:e|er|es|en)', capture: false }),
      regexFr: Regexes.startsUsing({ id: '34EF', source: 'Aenc Thon Le Virtuose', capture: false }),
      regexJa: Regexes.startsUsing({ id: '34EF', source: '楽聖のインク＝ゾン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '34EF', source: '乐圣 因克·佐恩', capture: false }),
      regexKo: Regexes.startsUsing({ id: '34EF', source: '대음악가 잉크 돈', capture: false }),
      alertText: {
        en: 'Out of Front',
        de: 'Weg von vorne',
        fr: 'Ne restez pas devant',
      },
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
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégats de zone',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Teag Gye': 'Taeg Gye',
        'Aenc Thon, Lord of the Lingering Gaze': 'Aenc Thon der Glupschäugige',
        'The Atelier': 'Griaules Revier',
        'Griaule': 'Griaule',
        'Painted Sapling': 'Griaules Sämling',
        'The throne room': 'Kronsaal',
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
        'Enrage': 'Finalangriff',
        'Malaise': 'Malaise',
        'Bile Bombardment': 'Galliger Niederschlag',
        'Flailing Tentacles': 'Tentakelflegel',
        'Toad Choir': 'Froschchor',
        'Changeling\'s Fantasia': 'Wechselbalg-Fantasie',
        'Virtuosic Capriccio': 'Virtuoses Capriccio',
        'Rake': 'Prankenhieb',
      },
    },
  ],
}];
