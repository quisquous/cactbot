'use strict';

// TODO: should the post-staff "spread" happen unconditionally prior to marker?

[{
  zoneRegex: {
    en: /^Akh Afah Amphitheatre \(Hard\)$/,
  },
  zoneId: ZoneId.AkhAfahAmphitheatreHard,
  timelineFile: 'shiva-hm.txt',
  timelineTriggers: [
    {
      id: 'ShivaHm Absolute Zero',
      regex: /Absolute Zero/,
      beforeSeconds: 5,
      condition: Conditions.caresAboutAOE(),
      // These are usually doubled, so avoid spamming.
      suppressSeconds: 10,
      response: Responses.aoe(),
    },
    {
      id: 'ShivaHm Icebrand',
      regex: /Icebrand/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
  ],
  triggers: [
    {
      id: 'ShivaHm Hailstorm Marker',
      netRegex: NetRegexes.headMarker({ id: '001D' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread('alert'),
    },
    {
      id: 'ShivaHm Glacier Bash',
      netRegex: NetRegexes.startsUsing({ id: '9A1', capture: false }),
      response: Responses.getBehind('info'),
    },
    {
      id: 'ShivaHm Permafrost',
      netRegex: NetRegexes.startsUsing({ id: '999', capture: false }),
      response: Responses.stopMoving('alert'),
    },
    {
      id: 'ShivaHm Ice Boulder',
      netRegex: NetRegexes.ability({ id: '9A3' }),
      condition: Conditions.targetIsNotYou(),
      infoText: function(data, matches) {
        return {
          en: 'Free ' + data.ShortName(matches.target),
        };
      },
    },
  ],
}];
