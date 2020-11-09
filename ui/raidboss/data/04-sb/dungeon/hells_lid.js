'use strict';

[{
  zoneId: ZoneId.HellsLid,
  timelineFile: 'hells_lid.txt',
  timelineTriggers: [
    {
      id: 'Hells Lid Stone Cudgel',
      regex: /Stone Cudgel/,
      beforeSeconds: 4,
      suppressSeconds: 10,
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from club/shield',
          cn: '远离棍棍和盾盾',
        },
      },
    },
    {
      id: 'Hells Lid Whittret',
      regex: /Whipping Whittret/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'Hells Lid Caduceus',
      regex: /Caduceus/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      id: 'Hells Lid Swing',
      netRegex: NetRegexes.startsUsing({ id: '27BE', source: 'Otake-Manu', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'Hells Lid Targeted Leap',
      netRegex: NetRegexes.headMarker({ id: '0001' }),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.targetText();
        return output.otherText();
      },
      outputStrings: {
        targetText: {
          en: 'Boss chasing--GET AWAY',
          cn: 'BOSS追逐点名———快跑鸭',
        },
        otherText: {
          en: 'Avoid boss',
          cn: '远离BOSS',
        },
      },
    },
    {
      id: 'Hells Lid Circling Winds',
      netRegex: NetRegexes.startsUsing({ id: '27C8', source: 'Kamaitachi', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'Hells Lid Rolling Winds',
      netRegex: NetRegexes.startsUsing({ id: '27C9', source: 'Kamaitachi', capture: false }),
      response: Responses.goSides(),
    },
    {
      id: 'Hells Lid Sinister Tide',
      netRegex: NetRegexes.startsUsing({ id: '27D4', source: 'Genbu', capture: false }),
      alertText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid water orb',
          cn: '躲避水球移动路径',
        },
      },
    },
    {
      id: 'Hells Lid Hell Of Waste',
      netRegex: NetRegexes.headMarker({ id: '002B' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Hells Lid Hell Of Waves',
      netRegex: NetRegexes.startsUsing({ id: '27D3', source: 'Genbu', capture: false }),
      response: Responses.knockback(),
    },
  ],
}];
