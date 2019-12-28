'use strict';

[{
  zoneRegex: /^The Final Coil Of Bahamut - Turn \(4\)$/,
  timelineFile: 't13.txt',
  timelineTriggers: [
    {
      id: 'T13 Dive Warning',
      regex: /Megaflare Dive/,
      beforeSeconds: 5,
      infoText: {
        en: 'Stack Center for Dives',
        fr: 'Packé au centre pour les dives',
      },
    },
  ],
  triggers: [
    {
      id: 'T13 Gigaflare Phase Change',
      regex: / 14:BB9:Bahamut Prime starts using Gigaflare/,
      regexDe: / 14:BB9:Prim-Bahamut starts using Gigaflare/,
      regexFr: / 14:BB9:Primo-Bahamut starts using Gigabrasier/,
      regexJa: / 14:BB9:バハムート・プライム starts using ギガフレア/,
      condition: function(data) {
        // Only the first two gigas are phase changes, the rest are in final phase.
        return !(data.gigaflare > 1);
      },
      sound: 'Long',
      infoText: function(data) {
        if (data.gigaflare) {
          return {
            en: 'Stack Center for Dives',
            fr: 'Packé au centre pour les dives',
          };
        }
      },
      run: function(data) {
        data.gigaflare = data.gigaflare || 0;
        data.gigaflare++;
      },
    },
    {
      id: 'T13 Flatten',
      regex: / 14:BAE:Bahamut Prime starts using Flatten on (\y{Name})\./,
      regexDe: / 14:BAE:Prim-Bahamut starts using Einebnen on (\y{Name})\./,
      regexFr: / 14:BAE:Primo-Bahamut starts using Compression on (\y{Name})\./,
      regexJa: / 14:BAE:バハムート・プライム starts using フラッテン on (\y{Name})\./,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Flatten on YOU',
            fr: 'Applatissement sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        if (data.role == 'healer' || data.job == 'BLU') {
          return {
            en: 'Flatten on ' + data.ShortName(matches[1]),
            fr: 'Applatissement sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T13 Megaflare Share',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0027:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Megaflare Stack',
        fr: 'MégaBrasier package',
      },
    },
    {
      id: 'T13 Earthshaker',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0028:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Earthshaker on YOU',
        fr: 'Secousse sur VOUS',
      },
    },
    {
      id: 'T13 Tempest Wing',
      regex: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Bahamut Prime:....:....:0004:/,
      regexDe: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Prim-Bahamut:....:....:0004:/,
      regexFr: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:Primo-Bahamut:....:....:0004:/,
      regexJa: / 23:\y{ObjectId}:(\y{Name}):\y{ObjectId}:バハムート・プライム:....:....:0004:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Tempest Tether on YOU',
        fr: 'Liens de tempête sur VOUS',
      },
    },
    {
      id: 'T13 Akh Morn',
      regex: / 14:BC2:Bahamut Prime starts using Akh Morn on (\y{Name})\./,
      regexDe: / 14:BC2:Prim-Bahamut starts using Akh Morn on (\y{Name})\./,
      regexFr: / 14:BC2:Primo-Bahamut starts using Akh Morn on (\y{Name})\./,
      regexJa: / 14:BC2:バハムート・プライム starts using アク・モーン on (\y{Name})\./,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Akh Morn on YOU',
            fr: 'Akh Morn sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Akh Morn on ' + data.ShortName(matches[1]),
            fr: 'Akh Morn sur ' + data.ShortName(matches[1]),
          };
        }
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Bahamut Prime': 'Prim-Bahamut',
        'Engage!': 'Start!',
        'The Storm of Meracydia': 'Sturm von Meracydia',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Blood Add': 'Blood Add', // FIXME
        'Dark Aether': 'Dunkeläther',
        'Double Dive': 'Doppelschwinge',
        'Earth Shaker': 'Erdstoß',
        'Enrage': 'Finalangriff',
        'Flare Breath': 'Flare-Atem',
        'Flare Star': 'Flare-Stern',
        'Flatten': 'Einstampfen',
        'Gigaflare': 'Gigaflare',
        'Gust Add': 'Gust Add', // FIXME
        'MF Pepperoni': 'MF Pepperoni', // FIXME
        'MF Share': 'MF Share', // FIXME
        'MF Spread': 'MF Spread', // FIXME
        'MF Tower': 'MF Tower', // FIXME
        'Megaflare': 'Megaflare',
        'Pain Add': 'Pain Add', // FIXME
        'Rage Of Bahamut': 'Bahamuts Zorn',
        'Shadow Add': 'Shadow Add', // FIXME
        'Sin Add': 'Sin Add', // FIXME
        'Storm Add': 'Storm Add', // FIXME
        'Tempest Wing': 'Sturm-Schwinge',
        'Teraflare': 'Teraflare',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Bahamut Prime': 'Primo-Bahamut',
        'Engage!': 'À l\'attaque !',
        'The Storm of Meracydia': 'Tempête de Méracydia',
      },
      'replaceText': {
        'Akh Morn': 'Akh Morn',
        'Blood Add': 'Add Sang',
        'Dark Aether': 'éther sombre',
        'Double Dive': 'Plongeon double',
        'Earth Shaker': 'Secousse',
        'Enrage': 'Enrage',
        'Flare Breath': 'Souffle brasier',
        'Flare Star': 'Astre flamboyant',
        'Flatten': 'Aplatissement',
        'Gigaflare': 'GigaBrasier',
        'Gust Add': 'Add Bourrasque',
        'MF Pepperoni': 'MF Pepperoni', // FIXME
        'MF Share': 'MégaBrasier Partage',
        'MF Spread': 'MégaBrasier Dispersion',
        'MF Tower': 'MégaBrasier Tour',
        'Megaflare': 'MégaBrasier',
        'Pain Add': 'Add Douleur',
        'Rage Of Bahamut': 'Courroux de Bahamut',
        'Shadow Add': 'Add Ombre',
        'Sin Add': 'Add Péché',
        'Storm Add': 'Add Tempête',
        'Tempest Wing': 'Aile de tempête',
        'Teraflare': 'TéraBrasier',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Bahamut Prime': 'バハムート・プライム',
        'Engage!': '戦闘開始！',
        'The Storm of Meracydia': 'メラシディアン・ストーム',
      },
      'replaceText': {
        'Akh Morn': 'アク・モーン',
        'Blood Add': 'Blood Add', // FIXME
        'Dark Aether': 'ダークエーテル',
        'Double Dive': 'ダブルダイブ',
        'Earth Shaker': 'アースシェイカー',
        'Enrage': 'Enrage',
        'Flare Breath': 'フレアブレス',
        'Flare Star': 'フレアスター',
        'Flatten': '押しつぶす',
        'Gigaflare': 'ギガフレア',
        'Gust Add': 'Gust Add', // FIXME
        'MF Pepperoni': 'MF Pepperoni', // FIXME
        'MF Share': 'MF Share', // FIXME
        'MF Spread': 'MF Spread', // FIXME
        'MF Tower': 'MF Tower', // FIXME
        'Megaflare': 'メガフレア',
        'Pain Add': 'Pain Add', // FIXME
        'Rage Of Bahamut': '龍神の咆吼',
        'Shadow Add': 'Shadow Add', // FIXME
        'Sin Add': 'Sin Add', // FIXME
        'Storm Add': 'Storm Add', // FIXME
        'Tempest Wing': 'テンペストウィング',
        'Teraflare': 'テラフレア',
      },
    },
  ],
}];
