'use strict';

[{
  zoneRegex: {
    en: /Eureka Pyros/,
    cn: /涌火之地/,
  },
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Pyros Falling Asleep',
      regex: / 00:0039:5 minutes have elapsed since your last activity./,
      regexDe: / 00:0039:Seit deiner letzten Aktivität sind 5 Minuten vergangen./,
      regexFr: / 00:0039:Votre personnage est inactif depuis 5 minutes/,
      regexCn: / 00:0039:已经5分钟没有进行任何操作/,
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'REVEILLES TOI',
        cn: '醒醒！动一动！！',
      },
    },
  ],
}];
