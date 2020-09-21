'use strict';

[{
  zoneId: ZoneId.TheBindingCoilOfBahamutTurn2,
  triggers: [
    {
      id: 'T2 High Voltage',
      netRegex: NetRegexes.startsUsing({ id: '4C0' }),
      condition: function(data) {
        return data.CanSilence();
      },
      response: Responses.interrupt(),
    },
    {
      id: 'T2 Ballast',
      netRegex: NetRegexes.startsUsing({ id: '4C5', capture: false }),
      suppressSeconds: 3,
      response: Responses.getBehind(),
    },
    {
      // Allagan Rot
      id: 'T2 Rot',
      netRegex: NetRegexes.gainsEffect({ effectId: '14D' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Rot on YOU',
            de: 'Fäulnis auf DIR',
            fr: 'Pourriture sur VOUS',
            ja: '自分にアラガンロット',
            cn: '毒点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Rot on ' + data.ShortName(matches.target),
            de: 'Fäulnis auf ' + data.ShortName(matches.target),
            fr: 'Pourriture sur ' + data.ShortName(matches.target),
            ja: '自分に' + data.ShortName(matches.target),
            cn: '毒点 ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T2 Pass Rot',
      netRegex: NetRegexes.gainsEffect({ effectId: '14D' }),
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
          ja: 'ロットを移す',
          cn: '传毒',
        };
      },
    },
    {
      id: 'T2 Lost Rot',
      netRegex: NetRegexes.losesEffect({ effectId: '14D' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      run: function(data) {
        delete data.rot;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Allagan Rot': 'Allagische Fäulnis',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Allagan Rot': 'Pourriture Allagoise',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Allagan Rot': 'アラガンロット',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Allagan Rot': '亚拉戈古病毒',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Allagan Rot': '알라그 부패',
      },
    },
  ],
}];
