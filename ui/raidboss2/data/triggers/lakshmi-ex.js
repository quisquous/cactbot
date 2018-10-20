'use strict';

// Lakshmi Extreme
[{
  zoneRegex: /^Emanation \(Extreme\)$/,
  timelineFile: 'lakshmi-ex.txt',
  timelineTriggers: [
    {
      id: 'Lakshmi Path of Light',
      regex: /Path of Light/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank';
      },
      alertText: {
        en: 'Cleave Soon',
      },
    },
  ],
  triggers: [
    {
      regex: /:Lakshmi starts using Chanchala/,
      run: function(data) {
        data.chanchala = true;
      },
    },
    {
      regex: /:Lakshmi loses the effect of Chanchala/,
      run: function(data) {
        data.chanchala = false;
      },
    },
    {
      id: 'Lakshmi Pull of Light',
      regex: /:215E:Lakshmi starts using The Pull Of Light on (\y{Name})/,
      regexDe: /:215E:Lakshmi starts using Strom Des Lichts on (\y{Name})/,
      alarmText: function(data, matches) {
        if (data.role != 'tank' && matches[1] == data.me) {
          return {
            en: 'Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        }
      },
      alertText: function(data, matches) {
        if (data.role == 'tank' && matches[1] == data.me) {
          return {
            en: 'Buster on YOU',
            de: 'Tankbuster auf DIR',
          };
        }
        if (data.role == 'healer' && matches[1] != data.me) {
          return {
            en: 'Buster on ' + matches[1],
            de: 'Tankbuster auf ' + matches[1],
          };
        }
      },
      tts: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'buster',
            de: 'Basta',
          };
        }
      },
    },
    {
      id: 'Lakshmi Divine Denial',
      regex: /:2149:Lakshmi starts using Divine Denial/,
      regexDe: /:2149:Lakshmi starts using Göttliche Leugnung/,
      alertText: {
        en: 'Vrill + Knockback',
        de: 'Vril + Rückstoß',
      },
    },
    {
      id: 'Lakshmi Divine Desire',
      regex: /:214B:Lakshmi starts using Divine Desire/,
      regexDe: /:214B:Lakshmi starts using Göttliche Lockung/,
      alertText: {
        en: 'Vrill + Be Outside',
        de: 'Vril + Außen',
      },
      tts: {
        en: 'vrill and outside',
        de: 'wriel und raus',
      },
    },
    {
      id: 'Lakshmi Divine Doubt',
      regex: /:214A:Lakshmi starts using Divine Doubt/,
      regexDe: /:214A:Lakshmi starts using Göttliche Bestürzung/,
      alertText: {
        en: 'Vrill + Pair Up',
        de: 'Vril + Pärchen bilden',
      },
      tts: {
        en: 'vrill and buddy',
        de: 'wriel und zu partner',
      },
    },
    { // Stack marker
      id: 'Lakshmi Pall of Light',
      regex: /1B:........:(\y{Name}):....:....:003E:0000:0000:0000:/,
      alertText: function(data, matches) {
        if (!data.chanchala)
          return;

        if (data.me == matches[1]) {
          return {
            en: 'Vrill + Stack on YOU',
            de: 'Vril + Stack auf DIR',
          };
        }
        return {
          en: 'Vrill + Stack',
          de: 'Vril + Stack',
        };
      },
      infoText: function(data, matches) {
        if (data.chanchala)
          return;

        if (data.me == matches[1]) {
          return {
            en: 'Stack on YOU',
            de: 'Stack auf DIR',
          };
        }
        return {
          en: 'Stack',
          de: 'Stack',
        };
      },
      tts: function(data) {
        if (data.chanchala) {
          return {
            en: 'vrill and stack',
            de: 'vril und stek',
          };
        }
        return {
          en: 'stack',
          de: 'stek',
        };
      },
    },
    {
      id: 'Lakshmi Stotram',
      regex: /:2147:Lakshmi starts using Stotram/,
      alertText: function(data) {
        if (data.chanchala) {
          return {
            en: 'Vrill for AOE',
            de: 'Vril fuer Flaechenangriff',
          };
        }
      },
    },
    { // Offtank cleave
      id: 'Lakshmi Path of Light',
      regex: /1B:........:(\y{Name}):....:....:000E:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: function(data) {
        return {
          en: (data.chanchala ? 'Vrill + ' : '') + 'Cleave on YOU',
          de: (data.chanchala ? 'Vril + ' : '') + 'Cleave auf DIR',
        };
      },
    },
    { // Cross aoe
      id: 'Lakshmi Hand of Grace',
      regex: /1B:........:(\y{Name}):....:....:006B:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: function(data) {
        return {
          en: (data.chanchala ? 'Vrill + ' : '') + 'Cross Marker',
          de: (data.chanchala ? 'Vril + ' : '') + 'Kreuz-Marker',
        };
      },
    },
    { // Flower marker (healers)
      id: 'Lakshmi Hand of Beauty',
      regex: /1B:........:(\y{Name}):....:....:006D:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: function(data) {
        return {
          en: (data.chanchala ? 'Vrill + ' : '') + 'Flower Marker',
          de: (data.chanchala ? 'Vril + ' : '') + 'Blumen-Marker',
        };
      },
    },
    { // Red marker during add phase
      id: 'Lakshmi Water III',
      regex: /1B:........:(\y{Name}):....:....:0017:0000:0000:0000:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Move Away',
        de: 'Weg da',
      },
    },
  ],
}];
