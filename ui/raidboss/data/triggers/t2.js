'use strict';

[{
  zoneRegex: /The Binding Coil Of Bahamut - Turn \(2\)/,
  triggers: [
    {
      id: 'T2 Silence',
      regex: / 14:4C0:.*starts using High Voltage/,
      infoText: {
        en: 'Silence',
      },
    },
    {
      id: 'T2 Ballast',
      regex: / 14:4C5:.*starts using Ballast/,
      suppressSeconds: 3,
      alertText: {
        en: 'Get Behind',
      },
    },
    {
      id: 'T2 Rot',
      regex: / 1A:(\y{Name}) gains the effect of Allagan Rot/,
      alarmText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Rot on YOU',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches[1]) {
          return {
            en: 'Rot on ' + data.ShortName(matches[1]),
          };
        }
      },
    },
  ],
}];
