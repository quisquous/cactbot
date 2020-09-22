'use strict';

[{
  zoneId: ZoneId.TheForbiddenLandEurekaPyros,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Pyros Skoll Hoarhound Halo',
      netRegex: NetRegexes.startsUsing({ id: '36E0', source: 'Skoll', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '36E0', source: 'Skalli', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '36E0', source: 'Sköll', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '36E0', source: 'スコル', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '36E0', source: '斯库尔', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '36E0', source: '스콜', capture: false }),
      response: Responses.goFrontOrSides(),
    },
    {
      id: 'Eureka Pyros Skoll Heavensward Howl',
      netRegex: NetRegexes.startsUsing({ id: '46BD', source: 'Skoll', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '46BD', source: 'Skalli', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '46BD', source: 'Sköll', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '46BD', source: 'スコル', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '46BD', source: '斯库尔', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '46BD', source: '스콜', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'Eureka Pyros Falling Asleep',
      netRegex: NetRegexes.gameLog({ line: '5 minutes have elapsed since your last activity..*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 5 Minuten vergangen..*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Votre personnage est inactif depuis 5 minutes.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '已经5分钟没有进行任何操作.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '5분 동안 아무 조작을 하지 않았습니다..*?', capture: false }),
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'RÉVEILLES-TOI',
        ja: '目を覚めて',
        cn: '醒醒！动一动！！',
        ko: '강제 퇴장 5분 전',
      },
    },
  ],
}];
