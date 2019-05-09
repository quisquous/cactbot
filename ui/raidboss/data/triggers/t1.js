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
        en: 'Slime on YOU',
      },
    },
    {
      id: 'T1 Split',
      regex: / 03:Added new combatant Caduceus/,
      condition: function(data) {
        return data.started;
      },
      alertText: {
        en: 'Split',
      },
    },
  ],
}];
