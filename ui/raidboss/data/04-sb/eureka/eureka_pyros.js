'use strict';

[{
  zoneRegex: /(Eureka Pyros|Unknown Zone \(31B\))/,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Pyros Falling Asleep',
      regex: /00:0039:5 minutes have elapsed since your last activity./,
      regexDe: /00:0039:Seit deiner letzten Aktivität sind 5 Minuten vergangen./,
      regexFr: /00:0039:Votre personnage est inactif depuis 5 minutes/,
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'REVEILLES TOI',
      },
    },
  ],
}];
