'use strict';

[{
  zoneRegex: /^The Dying Gasp$/,
  timelineFile: 'hades.txt',
  triggers: [
    {
      id: 'Hades Phase Tracker',
      regex: / 14:4180:Hades starts using Titanomachy/,
      regexDe: / 14:4180:Hades starts using Titanomachie/,
      regexFr: / 14:4180:Hadès starts using Titanomachie/,
      regexJa: / 14:4180:ハーデス starts using ティタノマキア/,
      run: function(data) {
        data.neoHades = true;
      },
    },
    {
      id: 'Hades Ravenous Assault',
      regex: / 14:4158:Hades starts using Ravenous Assault on (\y{Name})/,
      regexDe: / 14:4158:Hades starts using Fegefeuer der Helden on (\y{Name})/,
      regexFr: / 14:4158:Hadès starts using Assaut [aA]charné on (\y{Name})/,
      regexJa: / 14:4158:ハーデス starts using ラヴェナスアサルト on (\y{Name})/,
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
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        return {
          en: 'Away From ' + data.ShortName(matches[1]),
          de: 'Weg von ' + data.ShortName(matches[1]),
          fr: 'Loin de ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Hades Bad Faith Left',
      regex: / 14:4149:Hades starts using Bad Faith/,
      regexDe: / 14:4149:Hades starts using Maske des Grolls/,
      regexFr: / 14:4149:Hadès starts using Mauvaise [fF]oi/,
      regexJa: / 14:4149:ハーデス starts using バッドフェイス/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
      },
    },
    {
      id: 'Hades Bad Faith Right',
      regex: / 14:414A:Hades starts using Bad Faith/,
      regexDe: / 14:414A:Hades starts using Maske des Grolls/,
      regexFr: / 14:414A:Hadès starts using Mauvaise [fF]oi/,
      regexJa: / 14:414A:ハーデス starts using バッドフェイス/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
      },
    },
    {
      id: 'Hades Broken Faith',
      regex: / 14:414D:Hades starts using Broken Faith/,
      regexDe: / 14:414D:Hades starts using Maske der Trauer/,
      regexFr: / 14:414D:Hadès starts using Foi [bB]risée/,
      regexJa: / 14:414D:ハーデス starts using ブロークンフェイス/,
      alertText: {
        en: 'Dodge Giant Circles',
        de: 'Weiche dem großen Kreis aus',
        fr: 'Evitez les cercles géants',
      },
    },
    {
      id: 'Hades Echo Right',
      regex: / 14:4164:Hades starts using Echo of the Lost/,
      regexDe: / 14:4164:Hades starts using Echo der Verlorenen/,
      regexFr: / 14:4164:Hadès starts using Écho [dD]es [dD]isparus/,
      regexJa: / 14:4164:ハーデス starts using エコー・オブ・ザ・ロスト/,
      infoText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Gauche',
      },
    },
    {
      id: 'Hades Echo Left',
      regex: / 14:4163:Hades starts using Echo of the Lost/,
      regexDe: / 14:4163:Hades starts using Echo der Verlorenen/,
      regexFr: / 14:4163:Hadès starts using Écho [dD]es [dD]isparus/,
      regexJa: / 14:4163:ハーデス starts using エコー・オブ・ザ・ロスト/,
      infoText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
      },
    },
    {
      id: 'Hades Titanomachy',
      regex: / 14:4180:Hades starts using Titanomachy/,
      regexDe: / 14:4180:Hades starts using Titanomachie/,
      regexFr: / 14:4180:Hadès starts using Titanomachie/,
      regexJa: / 14:4180:ハーデス starts using ティタノマキア/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Hades Shadow Stream',
      regex: / 14:415C:Hades starts using Shadow Stream/,
      regexDe: / 14:415C:Hades starts using Schattenstrom/,
      regexFr: / 14:415C:Hadès starts using Flux [dD]e Ténèbres/,
      regexJa: / 14:415C:ハーデス starts using シャドウストリーム/,
      alertText: {
        en: 'Go Outside',
        de: 'Raus gehen',
        fr: 'Allez sur les côtés',
        ja: '中壊れるよ',
      },
    },
    {
      id: 'Hades Purgation',
      regex: / 14:4170:Hades starts using Polydegmon's Purgation/,
      regexDe: / 14:4170:Hades starts using Schlag des Polydegmon/,
      regexFr: / 14:4170:Hadès starts using Assaut [dD]u Polydegmon/,
      regexJa: / 14:4170:ハーデス starts using ポリデグモンストライク/,
      alertText: {
        en: 'Get Middle',
        de: 'In die Mitte gehen',
        fr: 'Allez au centre',
        ja: '外壊れるよ',
      },
    },
    {
      id: 'Hades Doom',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Doom/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Verhängnis/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Glas/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of 死の宣告/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Cleanse Doom In Circle',
        de: 'Entferne Verhängnis mit den Kreisen',
        fr: 'Dispell le Glas',
      },
    },
    {
      id: 'Hades Wail of the Lost Right',
      regex: / 14:4166:Hades starts using Wail of the Lost/,
      regexDe: / 14:4166:Hades starts using Wehklagen der Verlorenen/,
      regexFr: / 14:4166:Hadès starts using Lamentation [dD]es [dD]isparus/,
      regexJa: / 14:4166:ハーデス starts using ウエイル・オブ・ザ・ロスト/,
      infoText: {
        en: 'Right Knockback',
        de: 'Rechter Knockback',
        fr: 'Poussée à droite',
      },
    },
    {
      id: 'Hades Wail of the Lost Left',
      regex: / 14:4165:Hades starts using Wail of the Lost/,
      regexDe: / 14:4165:Hades starts using Wehklagen der Verlorenen/,
      regexFr: / 14:4165:Hadès starts using Lamentation [dD]es [dD]isparus/,
      regexJa: / 14:4165:ハーデス starts using ウエイル・オブ・ザ・ロスト/,
      infoText: {
        en: 'Left Knockback',
        de: 'Linker Knockback',
        fr: 'Poussée à gauche',
      },
    },
    {
      id: 'Hades Dual Strike Healer',
      regex: / 14:4161:Hades starts using Dual Strike/,
      regexDe: / 14:4161:Hades starts using Doppelschlag/,
      regexFr: / 14:4161:Hadès starts using Frappe [rR]edoublée/,
      regexJa: / 14:4161:ハーデス starts using デュアルストライク/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'Tank Busters',
        de: 'Tank Buster',
        fr: 'Tank busters',
        ja: 'タンクバスター',
      },
    },
    {
      id: 'Hades Dual Strike',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0060:/,
      condition: function(data, matches) {
        return data.neoHades && data.me == matches[1];
      },
      alertText: {
        en: 'Tank Buster Spread',
        de: 'Tank Buster verteilen',
        fr: 'Tankbuster, séparez-vous',
      },
    },
    {
      id: 'Hades Hellborn Yawp',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0028:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Drop Marker Outside',
        de: 'Marker ausen ablegen',
        fr: 'Posez la marque à l\'extérieur',
      },
    },
    {
      id: 'Hades Fetters',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0078:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Fetters on YOU',
      },
    },
    {
      id: 'Hades Gaol',
      regex: / 15:\y{ObjectId}:Hades:417F:/,
      regexDe: / 15:\y{ObjectId}:Hades:417F:/,
      regexFr: / 15:\y{ObjectId}:Hadès:417F:/,
      regexJa: / 15:\y{ObjectId}:ハーデス:417F:/,
      delaySeconds: 2,
      infoText: {
        en: 'Kill Jail',
        de: 'Gefängniss zerstören',
        fr: 'Dégommez la prison',
      },
    },
    {
      id: 'Hades Nether Blast / Dark Eruption',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:008B:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'Hades Ancient Darkness',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0060:/,
      condition: function(data, matches) {
        return !data.neoHades && data.me == matches[1];
      },
      alertText: {
        en: 'Spread (Don\'t Stack!)',
        de: 'Verteilen (Ohne stacken)',
        fr: 'Dispersez-vous (non packé)',
      },
    },
    {
      id: 'Hades Ancient Water III',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:003E:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Stack on YOU',
        de: 'Sammeln auf DIR',
        fr: 'Package sur VOUS',
      },
    },
    {
      id: 'Hades Ancient Collect',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:(0060|003E):/,
      condition: function(data) {
        return !data.neoHades;
      },
      run: function(data, matches) {
        data.ancient = data.ancient || {};
        data.ancient[matches[1]] = matches[2];
      },
    },
    {
      id: 'Hades Ancient No Marker',
      regex: / 1B:\y{ObjectId}:\y{Name}:....:....:003E:/,
      delaySeconds: 0.5,
      infoText: function(data) {
        if (data.ancient[data.me])
          return;
        let name = Object.keys(data.ancient).find((key) => data.ancient[key] === '003E');
        return {
          en: 'Stack on ' + data.ShortName(name),
          de: 'Sammeln auf ' + data.ShortName(name),
          fr: 'Package sur ' + data.ShortName(name),
        };
      },
    },
    {
      id: 'Hades Ancient Cleanup',
      regex: / 1B:\y{ObjectId}:\y{Name}:....:....:003E:/,
      delaySeconds: 10,
      run: function(data, matches) {
        delete data.ancient;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Hades': 'Hades',
        'Engage!': 'Start!',
        'Shadow .f .he Ancients': 'Schatten der Alten',
      },
      'replaceText': {
        'Adds': 'Adds',
        'Gaol Add': 'Gefängniss Add',
        'Ancient Aero': 'Wind der Alten',
        'Ancient Dark IV': 'Neka der Alten',
        'Ancient Darkness': 'Dunkelung der Alten',
        'Ancient Water III': 'Aquaga der Alten',
        'Bad Faith': 'Maske des Grolls',
        'Black Cauldron': 'Schwarzer Kessel',
        'Broken Faith': 'Maske der Trauer',
        'Captivity': 'Gefangenschaft',
        'Chorus Of The Lost': 'Chor der Verlorenen',
        'Dark Eruption': 'Dunkle Eruption',
        'Doom': 'Verhängnis',
        'Double': 'Doppel',
        'Dual Strike': 'Doppelschlag',
        'Echo Of The Lost': 'Echo der Verlorenen',
        'Enrage': 'Finalangriff',
        'Hellborn Yawp': 'Höllenschrei',
        'Life In Captivity': 'Leben in Gefangenschaft',
        'Nether Blast': 'Schattenböe',
        'Polydegmon\'s Purgation': 'Schlag des Polydegmon',
        'Ravenous Assault': 'Fegefeuer der Helden',
        'Shadow Spread': 'Dunkle Schatten',
        'Shadow Stream': 'Schattenstrom',
        'Stream/Purgation?': 'Schattenstrom/Schlag des Polydegmon',
        '--targetable--': '--anvisierbar--',
        'The Dark Devours': 'Fressende Finsternis',
        'Titanomachy': 'Titanomachie',
        '--untargetable--': '--nicht anvisierbar--',
        '--fetters--': '--fesseln--',
        'Wail Of The Lost': 'Wehklagen der Verlorenen',
      },
    },
  ],
}];
