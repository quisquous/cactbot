'use strict';

[{
  zoneRegex: /^Eden's Gate: Inundation \(Savage\)$/,
  timelineFile: 'e3s.txt',
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
  ],
}];
