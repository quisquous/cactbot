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
}];
