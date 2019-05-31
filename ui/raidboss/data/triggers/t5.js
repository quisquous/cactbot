'use strict';

[{
  zoneRegex: /The Binding Coil Of Bahamut - Turn \(5\)/,
  timelineFile: 't5.txt',
  triggers: [
    {
      id: 'T5 Death Sentence',
      regex: / 14:5B2:Twintania starts using Death Sentence on (\y{Name})\./,
      condition: function(data, matches) {
        return data.me == matches[1] || data.role == 'healer' || data.job == 'BLU';
      },
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (matches[1] != data.me) {
          return {
            en: 'Tank Buster on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T5 Death Sentence Warning',
      regex: / 14:5B2:Twintania starts using Death Sentence/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer' || data.job == 'BLU';
      },
      delaySeconds: 30,
      suppressSeconds: 5,
      infoText: {
        en: 'Death Sentence Soon',
      },
    },
    {
      id: 'T5 Liquid Hell',
      regex: / 14:4DB:The Scourge Of Meracydia starts using Liquid Hell/,
      infoText: {
        en: 'Fireball',
      },
    },
    {
      id: 'T5 Phase 2',
      regex: /:Twintania HP at 85%/,
      sound: 'Long',
    },
    {
      id: 'T5 Fireball',
      regex: / 15:\y{ObjectId}:Twintania:5AC:Fireball:\y{ObjectId}:(\y{Name}):/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Fireball on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Fireball on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T5 Conflag',
      regex: / 15:\y{ObjectId}:Twintania:5AB:Firestorm:\y{ObjectId}:(\y{Name}):/,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Conflag on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Conflag on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'T5 Phase 3',
      regex: /:Twintania HP at 55%/,
      sound: 'Long',
    },
    {
      id: 'T5 Divebomb',
      regex: / 15:\y{ObjectId}:Twintania:5B0:Divebomb:/,
      alertText: {
        en: 'DIVEBOMB',
      },
    },
    {
      id: 'T5 Divebomb Set Two',
      regex: / 15:\y{ObjectId}:Twintania:5B0:Divebomb:/,
      delaySeconds: 60,
      suppressSeconds: 5000,
      infoText: {
        en: 'Divebombs Soon',
      },
    },
    {
      id: 'T5 Dreadknight',
      regex: / 15:\y{ObjectId}:Twintania:4E3:Unwoven Will:\y{ObjectId}:(\y{Name}):/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Knight on YOU',
          };
        }
        return {
          en: 'Knight on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'T5 Twister',
      regex: / 14:4E1:Twintania starts using Twister/,
      alertText: {
        en: 'Twister!',
      },
    },
    {
      id: 'T5 Phase 4',
      regex: /:Twintania HP at 29%/,
      sound: 'Long',
    },
    {
      id: 'T5 Hatch',
      regex: / 15:\y{ObjectId}:Twintania:5AD:Hatch Will:\y{ObjectId}:(\y{Name}):/,
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Hatch on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Hatch on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
  ],
}];
