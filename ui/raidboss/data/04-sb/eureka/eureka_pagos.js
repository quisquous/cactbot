'use strict';

[{
  zoneRegex: {
    en: /Eureka Pagos/,
    cn: /恒冰之地/,
    ko: /^금단의 땅 에우레카: 파고스편$/,
  },
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Pagos Falling Asleep',
      regex: Regexes.gameLog({ line: '5 minutes have elapsed since your last activity.', capture: false }),
      regexDe: Regexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 5 Minuten vergangen.', capture: false }),
      regexFr: Regexes.gameLog({ line: 'Votre personnage est inactif depuis 5 minutes', capture: false }),
      regexCn: Regexes.gameLog({ line: '已经5分钟没有进行任何操作', capture: false }),
      regexKo: Regexes.gameLog({ line: '5분 동안 아무 조작을 하지 않았습니다.', capture: false }),
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'RÉVEILLES-TOI',
        cn: '醒醒！动一动！！',
        ko: '강제 퇴장 5분 전',
      },
    },
  ],
}];
