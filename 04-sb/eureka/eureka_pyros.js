Options.Triggers.push({
  id: 'TheForbiddenLandEurekaPyros',
  zoneId: ZoneId.TheForbiddenLandEurekaPyros,
  resetWhenOutOfCombat: false,
  triggers: [
    {
      id: 'Eureka Pyros Skoll Hoarhound Halo',
      type: 'StartsUsing',
      netRegex: { id: '36E0', source: 'Skoll', capture: false },
      response: Responses.goFrontOrSides(),
    },
    {
      id: 'Eureka Pyros Skoll Heavensward Howl',
      type: 'StartsUsing',
      netRegex: { id: '46BD', source: 'Skoll', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'Eureka Pyros Falling Asleep',
      type: 'GameLog',
      netRegex: { line: '7 minutes have elapsed since your last activity..*?', capture: false },
      response: Responses.wakeUp(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '7 minutes have elapsed since your last activity..*?':
          'Seit deiner letzten Aktivität sind 7 Minuten vergangen.',
        'Skoll': 'Skalli',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '7 minutes have elapsed since your last activity.':
          'Votre personnage est inactif depuis 7 minutes',
        'Skoll': 'Sköll',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '7 minutes have elapsed since your last activity.': '操作がない状態になってから7分が経過しました。',
        'Skoll': 'スコル',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        '7 minutes have elapsed since your last activity.': '已经7分钟没有进行任何操作',
        'Skoll': '斯库尔',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        '7 minutes have elapsed since your last activity..*?': '7분 동안 아무 조작을 하지 않았습니다',
        'Skoll': '스콜',
      },
    },
  ],
});
