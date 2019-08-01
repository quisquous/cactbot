'use strict';

[{
  zoneRegex: /^Eden's Gate: Inundation \(Savage\)$/,
  timelineFile: 'e3s.txt',
  timelineTriggers: [
    {
      id: 'E3S Plunging Wave',
      regex: /Plunging Wave x5/,
      beforeSeconds: 2,
      alarmText: {
        en: 'Stack',
      },
    },
    {
      id: 'E3S Monster Wave',
      regex: /Monster Wave/,
      beforeSeconds: 2,
      infoText: {
        en: 'spread',
      },
    },
  ],
  triggers: [
    {
      id: 'E3S Tidal Wave Look',
      regex: / 14:3FF1:Leviathan starts using Tidal Wave/,
      regexFr: / 14:3FF1:Léviathan starts using Raz-De-Marée/,
      delaySeconds: 3,
      infoText: {
        en: 'Look for Wave',
        fr: 'Repérez la vague',
      },
    },
    {
      id: 'E3S Tidal Roar',
      regex: / 14:3FDC:Leviathan starts using Tidal Roar/,
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'E3S Tidal Rage',
      regex: / 14:3FDE:Leviathan starts using Tidal Rage/,
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'E3S Rip Current',
      regex: / 14:3FE0:Leviathan starts using (?:Rip Current|)/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'tank busters',
        fr: 'Tank busters',
      },
    },
    {
      id: 'E3S Outside Undersea Quake',
      regex: / 14:3FEF:Leviathan starts using Undersea Quake/,
      infoText: {
        en: 'Outside falling - GET IN',
      },
    },
    {
      id: 'E3S Inside Undersea Quake',
      regex: / 14:3FEE:Leviathan starts using Undersea Quake/,
      infoText: {
        en: 'Inside falling - GET SIDES',
      },
    },
    {
      id: 'E3S Front Left Temporary Current',
      regex: / 14:3FEB:Leviathan starts using Temporary Current/,
      infoText: {
        en: 'get front left / back right',
      },
    },
    {
      id: 'E3S Front Right Temporary Current',
      regex: / 14:3FEA:Leviathan starts using Temporary Current/,
      infoText: {
        en: 'get front right / back left',
      },
    },
    {
      id: 'E3S Drenching Pulse',
      regex: / 14:3FE2:Leviathan starts using Drenching Pulse/,
      infoText: {
        en: 'puddles',
      },
    },
    {
      id: 'E3S Stormy Horizon',
      regex: / 14:3FE9:Leviathan starts using Stormy Horizon/,
      infoText: {
        en: '4x puddles',
      },
    },
    {
      id: 'E3S Backbreaking Wave',
      regex: /Backbreaking Wave/,
      infoText: {
        en: 'flare',
      },
    },
    {
      id: 'E3S Arena',
      regex: /(That's it, Eden|This should hold for now, but be careful)!/,
      infoText: {
        en: 'arena back',
      },
    },
  ],
}];
