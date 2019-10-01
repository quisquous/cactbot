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
      regex: / 14:3DAA:Dohnfast Fuath starts using Watering Wheel/,
      regexDe: / 14:3DAA:Dohn-Fuath starts using Wasserrad/,
      regexFr: / 14:3DAA:Fuath de Dohn Mheg starts using Arrosage/,
      regexJa: / 14:3DAA:ドォーヌ・フーア starts using 水やり/,
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
      regex: / 14:3DAB:Dohnfast [bB]asket starts using Straight Punch/,
      regexDe: / 14:3DAB:Dohn-Blumenkorb starts using Gerade/,
      regexFr: / 14:3DAB:panier de Dohn Mheg starts using Direct/,
      regexJa: / 14:3DAB:ドォーヌ・バスケット starts using ボーンブレイカー/,
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
      regex: / 14:3DAF:Dohnfast Etainmoth starts using Proboscis/,
      regexDe: / 14:3DAF:Dohn-Edianmotte starts using Rüssel/,
      regexFr: / 14:3DAF:noctuétain de Dohn Mheg starts using Proboscis/,
      regexJa: / 14:3DAF:ドォーヌ・エーディンモス starts using プロボシス/,
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
      regex: / 14:3DB5:Dohnfast Kelpie starts using Torpedo/,
      regexDe: / 14:3DB5:Dohn-Kelpie starts using Torpedo/,
      regexFr: / 14:3DB5:kelpie de Dohn Mheg starts using Ruée aqueuse/,
      regexJa: / 14:3DB5:ドォーヌ・ケルピー starts using トルペド/,
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
      regex: / 14:2299:Aenc Thon, Lord [Oo]f [Tt]he Lingering Gaze starts using Candy Cane on (\y{Name})/,
      regexDe: / 14:2299:Aenc Thon der Glupschäugige starts using Quietschehammer on (\y{Name})/,
      regexFr: / 14:2299:Aenc Thon l'envoûtant starts using Canne en sucre d'orge on (\y{Name})/,
      regexJa: / 14:2299:美眼のインク＝ゾン starts using キャンディケーン on (\y{Name})/,
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
      regex: / 14:1E8E:Aenc Thon, Lord [Oo]f [Tt]he Lingering Gaze starts using Landsblood/,
      regexDe: / 14:1E8E:Aenc Thon der Glupschäugige starts using Erdblut/,
      regexFr: / 14:1E8E:Aenc Thon l'envoûtant starts using Pulsation phréatique/,
      regexJa: / 14:1E8E:美眼のインク＝ゾン starts using 水脈乱打/,
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
      regex: / 1B:........:(\y{Name}):....:....:003E:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Dohn Mheg Timber',
      regex: / 14:22D3:Griaule starts using Tiiimbeeer/,
      regexDe: / 14:22D3:Griaule starts using Fääällt/,
      regexFr: / 14:22D3:Griaule starts using Ça tooombe !/,
      regexJa: / 14:22D3:グリオール starts using ティーンバー/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
      },
    },
    {
      id: 'Dohn Mheg Crippling Blow',
      regex: / 14:35A4:Aenc Thon, Lord [Oo]f [Tt]he Lengthsome Gait starts using Crippling Blow on (\y{Name})/,
      regexDe: / 14:35A4:Aenc Thon der Langbeinige starts using Verkrüppelnder Schlag on (\y{Name})/,
      regexFr: / 14:35A4:Aenc Thon le virtuose starts using Coup handicapant on (\y{Name})/,
      regexJa: / 14:35A4:楽聖のインク＝ゾン starts using 痛打 on (\y{Name})/,
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
      regex: / 14:34F0:Aenc Thon, Lord [Oo]f [Tt]he Lengthsome Gait starts using Imp Choir/,
      regexDe: / 14:34F0:Aenc Thon der Langbeinige starts using Koboldchor/,
      regexFr: / 14:34F0:Aenc Thon le virtuose starts using Mélodie du kappa/,
      regexJa: / 14:34F0:楽聖のインク＝ゾン starts using カッパの調べ/,
      alertText: {
        en: 'Look Away',
        de: 'Weg schauen',
      },
    },
    {
      id: 'Dohn Mheg Toad Choir',
      regex: / 14:34EF:Aenc Thon, Lord [Oo]f [Tt]he Lengthsome Gait starts using Toad Choir/,
      regexDe: / 14:34EF:Aenc Thon der Langbeinige starts using Froschchor/,
      regexFr: / 14:34EF:Aenc Thon le virtuose starts using Mélodie du crapeau/,
      regexJa: / 14:34EF:楽聖のインク＝ゾン starts using カエルの調べ/,
      alertText: {
        en: 'Out of Front',
        de: 'Weg von vorne',
      },
    },
    {
      id: 'Dohn Mheg Virtuosic Cappriccio',
      regex: / 14:358C:Aenc Thon, Lord [Oo]f [Tt]he Lengthsome Gait starts using Virtuosic Capriccio/,
      regexDe: / 14:358C:Aenc Thon der Langbeinige starts using Virtuoses Capriccio/,
      regexFr: / 14:358C:Aenc Thon le virtuose starts using Capriccio effréné/,
      regexJa: / 14:358C:楽聖のインク＝ゾン starts using 苛烈なるカプリッチョ/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
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
