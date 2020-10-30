'use strict';

[{
  zoneId: ZoneId.TheNavel,
  timelineFile: 'titan-nm.txt',
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
          };
        }
        return {
          en: 'Gaol on YOU',
        };
      },
    },
    {
      // Covers both tanks and non tanks with appropriate text
      // Needs suppression for occasions in phase 4 where rock busters
      // get pushed close together by auto attacks to avoid double triggers.
      id: 'TitanNm Rock Buster',
      netRegex: NetRegexes.ability({ id: '281', source: 'Titan' }),
      condition: (data) => data.role !== 'tank' || data.role === 'tank',
      suppressSeconds: 2,
      response: Responses.tankCleave(),
    },
  ],
}];
