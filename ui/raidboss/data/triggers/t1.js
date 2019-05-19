'use strict';

[{
  zoneRegex: /The Binding Coil Of Bahamut - Turn \(1\)/,
  triggers: [
    {
      id: 'T1 Silence',
      regex: / 14:5A7:Ads starts using High Voltage/,
      alertText: {
        en: 'Silence',
      },
    },
    {
      id: 'T1 Initiated',
      regex: / 15:\y{ObjectId}:Caduceus:4B8:Hood Swing/,
      run: function(data) {
        data.started = true;
      },
    },
    {
      regex: / 1[56]:\y{ObjectId}:Caduceus:4BA:Regorge:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Spit on YOU',
      },
    },
    {
      id: 'T1 Split',
      regex: / 03:Added new combatant Caduceus/,
      suppressSeconds: 5,
      condition: function(data) {
        return data.started;
      },
      alertText: {
        en: 'Split',
      },
    },
    {
      id: 'T1 Hood Swing',
      regex: / 1[56]:\y{ObjectId}:Caduceus:4B8:Hood Swing:\y{ObjectId}:(\y{Name}):/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      delaySeconds: 8,
      suppressSeconds: 5,
      infoText: {
        en: 'Hood Swing in 10',
      },
    },
    {
      id: 'T1 Slime Timer First',
      regex: / 00:0839:The Allagan megastructure will be sealed off/,
      delaySeconds: 35,
      suppressSeconds: 5,
      infoText: {
        en: 'Slime Soon',
      },
    },
    {
      id: 'T1 Slime Timer',
      regex: / 03:Added new combatant Dark Matter Slime/,
      delaySeconds: 35,
      suppressSeconds: 5,
      infoText: {
        en: 'Slime Soon',
      },
    },
  ],
}];
