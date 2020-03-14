'use strict';

[{
  zoneRegex: {
    en: /^The Binding Coil Of Bahamut - Turn \(2\)$/,
    cn: /^巴哈姆特大迷宫 \(邂逅之章2\)$/,
  },
  triggers: [
    {
      id: 'T2 High Voltage',
      regex: Regexes.startsUsing({ id: '4C0' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt(),
    },
    {
      id: 'T2 Ballast',
      regex: Regexes.startsUsing({ id: '4C5', capture: false }),
      suppressSeconds: 3,
      response: Responses.getBehind(),
    },
    {
      id: 'T2 Rot',
      regex: Regexes.gainsEffect({ effect: 'Allagan Rot' }),
      regexDe: Regexes.gainsEffect({ effect: 'Allagische Fäulnis' }),
      regexFr: Regexes.gainsEffect({ effect: 'Pourriture Allagoise' }),
      regexJa: Regexes.gainsEffect({ effect: 'アラガンロット' }),
      regexCn: Regexes.gainsEffect({ effect: '亚拉戈古病毒' }),
      regexKo: Regexes.gainsEffect({ effect: '알라그 부패' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Rot on YOU',
            de: 'Fäulnis auf DIR',
            fr: 'Pourriture sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Rot on ' + data.ShortName(matches.target),
            de: 'Fäulnis auf ' + data.ShortName(matches.target),
            fr: 'Pourriture sur ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T2 Pass Rot',
      regex: Regexes.gainsEffect({ effect: 'Allagan Rot' }),
      regexDe: Regexes.gainsEffect({ effect: 'Allagische Fäulnis' }),
      regexFr: Regexes.gainsEffect({ effect: 'Pourriture Allagoise' }),
      regexJa: Regexes.gainsEffect({ effect: 'アラガンロット' }),
      regexCn: Regexes.gainsEffect({ effect: '亚拉戈古病毒' }),
      regexKo: Regexes.gainsEffect({ effect: '알라그 부패' }),
      condition: function(data, matches) {
        return data.me == matches.target;
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
          de: 'Fäulnis abgeben',
          fr: 'Passez la pourriture',
        };
      },
    },
    {
      id: 'T2 Lost Rot',
      regex: Regexes.losesEffect({ effect: 'Allagan Rot' }),
      regexDe: Regexes.losesEffect({ effect: 'Allagische Fäulnis' }),
      regexFr: Regexes.losesEffect({ effect: 'Pourriture Allagoise' }),
      regexJa: Regexes.losesEffect({ effect: 'アラガンロット' }),
      regexCn: Regexes.losesEffect({ effect: '亚拉戈古病毒' }),
      regexKo: Regexes.losesEffect({ effect: '알라그 부패' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        delete data.rot;
      },
    },
  ],
}];
