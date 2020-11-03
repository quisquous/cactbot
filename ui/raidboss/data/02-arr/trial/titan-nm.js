'use strict';

[{
  zoneId: ZoneId.TheNavel,
  timelineFile: 'titan-nm.txt',
  timelineTriggers: [
    {
      // Early Callout for Tank Cleave
      id: 'TitanNm Rock Buster',
      regex: /Rock Buster/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'TitanNm Tumult',
      netRegex: NetRegexes.ability({ id: '282', source: 'Titan', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '282', source: '泰坦', capture: false }),
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 2,
      response: Responses.aoe(),
    },
    {
      // Gaol callout for both yourself and others
      id: 'TitanNm Gaols',
      netRegex: NetRegexes.gainsEffect({ effectId: '124' }),
      alertText: function(data, matches) {
        if (matches.target !== data.me) {
          return {
            en: 'Break Gaol on ' + data.ShortName(matches.target),
            cn: '石牢点' + data.ShortName(matches.target),
          };
        }
        return {
          en: 'Gaol on YOU',
          cn: '石牢点名',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'cn',
      'replaceSync': {
        'Titan': '泰坦',
        'Earthen Fury': '大地之怒',
      },
      'replaceText': {
        'Earthen Fury': '大地之怒',
        'Geocrush': '大地粉碎',
        'Landslide': '地裂',
        'Rock Buster': '碎岩',
        'Rock Throw': '花岗岩牢狱',
        'Tumult': '怒震',
        'Weight Of The Land': '大地之重',
      },
    },
  ],
}];
