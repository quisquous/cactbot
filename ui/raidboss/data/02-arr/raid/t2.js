'use strict';

[{
  zoneRegex: /^The Binding Coil Of Bahamut - Turn \(2\)$/,
  triggers: [
    {
      id: 'T2 Silence',
      regex: / 14:4C0:.* starts using High Voltage/,
      regexDe: / 14:4C0:.* starts using Hochstrom/,
      regexFr: / 14:4C0:.* starts using Haute Tension/,
      regexJa: / 14:4C0:.* starts using 高圧電流/,
      condition: function(data) {
        return data.CanSilence();
      },
      infoText: {
        en: 'Silence',
      },
    },
    {
      id: 'T2 Ballast',
      regex: / 14:4C5:.* starts using Ballast/,
      regexDe: / 14:4C5:.* starts using Ballast/,
      regexFr: / 14:4C5:.* starts using Lest/,
      regexJa: / 14:4C5:.* starts using バラスト/,
      suppressSeconds: 3,
      alertText: {
        en: 'Get Behind',
      },
    },
    {
      id: 'T2 Rot',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Allagan Rot/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Allagische Fäulnis/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Pourriture Allagoise/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of アラガンロット/,
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
    {
      id: 'T2 Pass Rot',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Allagan Rot/,
      regexDe: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Allagische Fäulnis/,
      regexFr: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Pourriture Allagoise/,
      regexJa: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of アラガンロット/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      preRun: function(data) {
        data.rot = true;
      },
      delaySeconds: 11,
      alertText: function(data) {
        if (!data.rot)
          return;
        return {
          en: 'Pass Rot',
        };
      },
    },
    {
      id: 'T2 Lost Rot',
      regex: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Allagan Rot/,
      regexDe: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Allagische Fäulnis/,
      regexFr: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of Pourriture Allagoise/,
      regexJa: / 1E:\y{ObjectId}:(\y{Name}) loses the effect of アラガンロット/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      run: function(data) {
        delete data.rot;
      },
    },
  ],
}];
