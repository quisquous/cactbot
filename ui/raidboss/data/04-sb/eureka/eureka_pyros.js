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
      regex: Regexes.gameLog({ line: '5 minutes have elapsed since your last activity.', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 5 Minuten vergangen.', capture: false }),
      regexFr: Regexes.gameLog({ line: 'Votre personnage est inactif depuis 5 minutes', capture: false }),
      regexCn: Regexes.gameLog({ line: '已经5分钟没有进行任何操作', capture: false }),
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'RÉVEILLES-TOI',
        cn: '醒醒！动一动！！',
      },
    },
  ],
}];
