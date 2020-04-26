'use strict';

[{
  zoneRegex: {
    en: /Eureka Pyros/,
    cn: /涌火之地/,
    ko: /^금단의 땅 에우레카: 피로스편$/,
  },
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Pyros Skoll Hoarhound Halo',
      regex: Regexes.startsUsing({ id: '36E0', source: 'Skoll', capture: false }),
      regexKo: Regexes.startsUsing({ id: '36E0', source: '스콜', capture: false }),
      response: Responses.awayFromBack(),
    },
    {
      id: 'Eureka Pyros Skoll Heavensward Howl',
      regex: Regexes.startsUsing({ id: '46BD', source: 'Skoll', capture: false }),
      regexKo: Regexes.startsUsing({ id: '46BD', source: '스콜', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Eureka Pyros Falling Asleep',
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
