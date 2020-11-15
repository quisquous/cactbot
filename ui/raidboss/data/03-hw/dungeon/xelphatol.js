'use strict';

// Xelphatol
[{
  zoneId: ZoneId.Xelphatol,
  timelineFile: 'xelphatol.txt',
  timelineTriggers: [
    {
      id: 'Xelphatol Short Burst',
      regex: /Short Burst/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutMagical(),
      suppressSeconds: 5, // Timelines jump sometimes, so let's not be noisy.
      response: Responses.tankBuster(),
    },
    {
      // This might be better handled by collecting Swiftfeather,
      // but a timeline trigger is easy and consistent.
      id: 'Xelphatol On Low',
      regex: /On Low/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      id: 'Xelphatol Ixali Aero Buster',
      regex: /Ixali Aero \(buster\)/,
      beforeSeconds: 4,
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
  ],
  triggers: [
    {
      id: 'Xelphatol Long Burst',
      regex: Regexes.startsUsing({ id: '19C8', source: 'Nuzal Hueloc', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Xelphatol Hot Blast',
      regex: Regexes.startsUsing({ id: '19CC', source: 'Floating Turret', capture: false }),
      response: Responses.getUnder(),
    },
    {
      id: 'Xelphatol On High',
      regex: Regexes.startsUsing({ id: '19CF', source: 'Dotoli Ciloc', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'Xelphatol Dark Wings',
      netRegex: NetRegexes.headMarker({ id: '0017' }),
      condition: Conditions.targetIsYou(),
      infoText: (data, _, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Puddle on YOU',
          de: 'Fläche auf DIR',
          fr: 'Zone au sol sur VOUS',
          ja: '自分に水溜り',
          cn: '水球点名',
          ko: '장판 대상자',
        },
      },
    },
    {
      id: 'Xelphatol Ixali Aero AOE',
      regex: Regexes.startsUsing({ id: '19D5', source: 'Tozol Huatotl', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      id: 'Xelphatol Bill',
      netRegex: NetRegexes.headMarker({ id: '0046' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Xelphatol Hawk',
      netRegex: NetRegexes.headMarker({ id: '003E' }),
      response: Responses.stackMarkerOn(),
    },
  ],
}];
