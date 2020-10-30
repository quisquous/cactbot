'use strict';

[{
  zoneId: ZoneId.TheNavel,
  timelineFile: 'titan-nm.txt',
  triggers: [
    {
      id: 'TitanNm Tumult',
      netRegex: NetRegexes.ability({ id: '282', source: 'Titan', capture: false }),
      condition: (data) => data.role === 'healer' || data.CanAddle(),
      suppressSeconds: 2,
      response: Responses.aoe(),
    },
    {
      // Gaol callout for both yourself and others
      id: 'TitanNm Gaols',
      netRegex: NetRegexes.gainsEffect({ effectId: '124' }),
      condition: (data) => data.role === 'healer',
      alertText: function(data, matches) {
        if (matches.target !== data.me) {
          return {
            en: 'Break Gaol on ' + data.ShortName(matches.target),
          };
        }
        return {
          en: 'Gaol on YOU',
        };
      },
    },
  ],
}];
