'use strict';

[{
  zoneRegex: /^The Dying Gasp$/,
  timelineFile: 'hades.txt',
  triggers: [
    {
      id: 'Hades Phase Tracker',
      regex: / 14:4180:Hades starts using Titanomachy/,
      run: function(data) {
        data.neoHades = true;
      },
    },
    {
      id: 'Hades Ravenous Assault',
      regex: / 14:4158:Hades starts using Ravenous Assault on (\y{Name})/,
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
        };
      },
    },
    {
      id: 'Hades Bad Faith Left',
      regex: / 14:4149:Hades starts using Bad Faith/,
      infoText: {
        en: 'Left',
      },
    },
    {
      id: 'Hades Bad Faith Right',
      regex: / 14:414A:Hades starts using Bad Faith/,
      infoText: {
        en: 'Right',
      },
    },
    {
      id: 'Hades Broken Faith',
      regex: / 14:414D:Hades starts using Broken Faith/,
      alertText: {
        en: 'Dodge Giant Circles',
      },
    },
    {
      id: 'Hades Echo Right',
      regex: / 14:4164:Hades starts using Echo Of The Lost/,
      infoText: {
        en: 'Right',
      },
    },
    {
      id: 'Hades Echo Left',
      regex: / 14:4163:Hades starts using Echo Of The Lost/,
      infoText: {
        en: 'Left',
      },
    },
    {
      id: 'Hades Titanomachy',
      regex: / 14:4180:Hades starts using Titanomachy/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Hades Shadow Stream',
      regex: / 14:415C:Hades starts using Shadow Stream/,
      alertText: {
        en: 'Go Outside',
        fr: 'Allez sur les côtés',
        ja: '中壊れるよ',
      },
    },
    {
      id: 'Hades Purgation',
      regex: / 14:4170:Hades starts using Polydegmon's Purgation/,
      alertText: {
        en: 'Get Middle',
        fr: 'Allez au centre',
        ja: '外壊れるよ',
      },
    },
    {
      id: 'Hades Doom',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Doom/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Cleanse Doom In Circle',
      },
    },
    {
      id: 'Hades Wail of the Lost Right',
      regex: / 14:4166:Hades starts using Wail Of The Lost/,
      infoText: {
        en: 'Right Knockback',
      },
    },
    {
      id: 'Hades Wail of the Lost Left',
      regex: / 14:4165:Hades starts using Wail Of The Lost/,
      infoText: {
        en: 'Left Knockback',
      },
    },
    {
      id: 'Hades Dual Strike Healer',
      regex: / 14:4161:Hades starts using Dual Strike/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'Tank Busters',
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
      delaySeconds: 2,
      infoText: {
        en: 'Kill Jail',
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
        'Shadow .f .he Ancients': 'Schatten der Alten',
      },
      'replaceText': {
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
        'Wail Of The Lost': 'Wehklagen der Verlorenen',
      },
    },
  ],
}];
