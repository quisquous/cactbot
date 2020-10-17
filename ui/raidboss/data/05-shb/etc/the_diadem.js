'use strict';

[{
  zoneId: [ZoneId.TheDiadem, ZoneId.TheDiadem521],
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Diadem Falling Asleep',
      netRegex: NetRegexes.gameLog({ line: '7 minutes have elapsed since your last activity..*?', capture: false }),
      netRegexDe: NetRegexes.gameLog({ line: 'Seit deiner letzten Aktivität sind 7 Minuten vergangen..*?', capture: false }),
      netRegexFr: NetRegexes.gameLog({ line: 'Votre personnage est inactif depuis 7 minutes.*?', capture: false }),
      netRegexCn: NetRegexes.gameLog({ line: '已经7分钟没有进行任何操作.*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '7분 동안 아무 조작을 하지 않았습니다..*?', capture: false }),
      alarmText: {
        en: 'WAKE UP',
        de: 'AUFWACHEN',
        fr: 'RÉVEILLES-TOI',
        ja: '目を覚めて',
        cn: '醒醒！动一动！！',
        ko: '강제 퇴장 3분 전',
      },
    },
    {
      id: 'Diadem Found Gather Point',
      netRegex: NetRegexes.gameLog({ line: 'You sense a grade .* clouded (?:mineral deposit|rocky outcrop|mature tree|lush vegetation patch).*?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '(?:동|서|남|북)+쪽에 레벨 80 환상의 (?:광맥|바위터|성목|약초밭)(?:이|가) 있습니다!.*?', capture: false }),
      alertText: {
        en: 'Found clouded gather point',
        ko: '환상의 광맥/성목 발견',
      },
    },
    {
      id: 'Diadem Flag Alert',
      netRegex: NetRegexes.gameLog({ line: '.*\ue0bbThe Diadem *?', capture: false }),
      netRegexKo: NetRegexes.gameLog({ line: '.*\ue0bb디아뎀 제도 .*?', capture: false }),
      infoText: {
        en: 'Check coordinate on chat',
        ko: '디아뎀 좌표 채팅 올라옴',
      },
    },
  ],
}];
