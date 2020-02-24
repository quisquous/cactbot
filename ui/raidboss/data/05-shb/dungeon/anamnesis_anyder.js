'use strict';

[{
  zoneRegex: {
    en: /^Anamnesis Anyder$/,
  },
  timelineFile: 'anamnesis_anyder.txt',
  timelineTriggers: [
  ],
  triggers: [
    {
      id: 'AnAnyder Fetid Fang',
      regex: Regexes.startsUsing({ source: 'Unknown', id: '4B69' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'AnAnyder Scrutiny',
      regex: Regexes.startsUsing({ source: 'Unknown', id: '4E25', capture: false }),
      delaySeconds: 3,
      durationSeconds: 7,
      infoText: {
        en: 'Avoid Arrow',
        ko: '화살표 피하기',
      },
    },
    {
      id: 'AnAnyder Inscrutability',
      regex: Regexes.startsUsing({ source: 'Unknown', id: '4B6A', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'AnAnyder Luminous Ray',
      regex: Regexes.startsUsing({ source: 'Unknown', id: '4E27', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'AnAnyder The Final Verse',
      regex: Regexes.startsUsing({ source: 'Kyklops', id: '4B58', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'AnAnyder 2,000-Mina Swing',
      regex: Regexes.startsUsing({ source: 'Kyklops', id: '4B55', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'AnAnyder Eye Of The Cyclone',
      regex: Regexes.startsUsing({ source: 'Kyklops', id: '4B57', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'AnAnyder 2,000-Mina Swipe',
      regex: Regexes.startsUsing({ source: 'Kyklops', id: '4B54', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'AnAnyder Raging Glower',
      regex: Regexes.startsUsing({ source: 'Kyklops', id: '4B56', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'AnAnyder Open Hearth',
      regex: Regexes.headMarker({ id: '003E' }),
      response: Responses.stackOn(),
    },
    {
      id: 'AnAnyder Bonebreaker',
      regex: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B8C' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'AnAnyder Falling Water',
      regex: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B7E' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'AnAnyder Flying Fount',
      regex: Regexes.headMarker({ id: '003E' }),
      suppressSeconds: 1,
      response: Responses.stackOn(),
    },
    {
      id: 'AnAnyder Depth Grip',
      regex: Regexes.startsUsing({ source: 'Rukshs Dheem', id: '4B84', capture: false }),
      infoText: {
        en: 'Avoid Hands',
        ko: '손 피하기',
      },
    },
  ],
  timelineReplace: [
  ],
}];
