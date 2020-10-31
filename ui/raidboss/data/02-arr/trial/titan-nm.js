'use strict';

[{
  zoneId: ZoneId.TheNavel,
  timelineFile: 'titan-nm.txt',
  timelineTriggers: [
    {
      // Covers both tanks and non tanks with appropriate text
      // Needs suppression for occasions in phase 4 where rock busters
      // get pushed close together by auto attacks to avoid double triggers.
      id: 'TitanNm Rock Buster',
      regex: /Rock Buster/
      condition: function (data, matches) {
      	return data.role === 'healer' || data.role === 'tank';
      },	
      beforeSeconds: 2,
      response: Responses.TankCleave(),
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
          };
        }
        return {
          en: 'Gaol on YOU',
        };
      },
    },
  ],
}];
