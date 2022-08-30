Options.Triggers.push({
  zoneId: ZoneId.AbyssosTheSeventhCircle,
  timelineFile: 'p7n.txt',
  initData: () => {
    return {
      busterTargets: [],
    };
  },
  timelineTriggers: [
    {
      id: 'P7N Burst',
      regex: /Burst/,
      beforeSeconds: 4,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get towers',
          de: 'Türme nehmen',
          ja: '塔へ',
          ko: '기둥 들어가기',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'P7N Bough Of Attis Out',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '77F9', source: 'Agdistis', capture: false }),
      response: Responses.getOut(),
    },
    {
      id: 'P7N Bough Of Attis In',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '77FE', source: 'Agdistis', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'P7N Bough Of Attis Left',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '77FC', source: 'Agdistis', capture: false }),
      response: Responses.goLeft(),
    },
    {
      id: 'P7N Bough Of Attis Right',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '77FB', source: 'Agdistis', capture: false }),
      response: Responses.goRight(),
    },
    {
      id: 'P7N Hemitheos Holy Spread',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '0137' }),
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P7N Hemitheos Glare',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79FA', source: 'Agdistis', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Move center when safe',
          de: 'Geh in die Mitte, wenn es sicher ist',
          ja: '安置になったら入る',
          ko: '중앙 바닥이 생기면 들어가기',
        },
      },
    },
    {
      id: 'P7N Immortals Obol',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '77F5', source: 'Agdistis', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get to edge (in circle)',
          de: 'Geh zum Rand (in den Kreisen)',
          ja: '角へ (円の中)',
          ko: '구석으로 (원 안으로)',
        },
      },
    },
    {
      id: 'P7N Hemitheos Aero II Collect',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '016C' }),
      run: (data, matches) => data.busterTargets.push(matches.target),
    },
    {
      id: 'P7N Hemitheos Aero II Call',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '016C', capture: false }),
      delaySeconds: 0.3,
      suppressSeconds: 5,
      alertText: (data, _matches, output) => {
        if (data.busterTargets.includes(data.me))
          return output.markerYou();
        return output.avoid();
      },
      outputStrings: {
        markerYou: Outputs.tankCleave,
        avoid: Outputs.avoidTankCleave,
      },
    },
    {
      id: 'P7N Hemitheos Aero II Cleanup',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '016C', capture: false }),
      delaySeconds: 5,
      run: (data) => data.busterTargets = [],
    },
    {
      id: 'P7N Spark Of Life',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '780B', source: 'Agdistis', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P7N Static Moon',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7802', source: 'Immature Io', capture: false }),
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Behemoths',
          de: 'Behemoths ausweichen',
          ja: 'ベヒーモスから離れる',
          ko: '베히모스 피하기',
        },
      },
    },
    {
      id: 'P7N Stymphalian Strike',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7803', source: 'Immature Stymphalide', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid line dashes',
          de: 'Linien Anstürme ausweichen',
          ja: '突進回避',
          ko: '선 돌진 피하기',
        },
      },
    },
    {
      id: 'P7N Blades Of Attis',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7805', source: 'Agdistis', capture: false }),
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Exaflares',
          de: 'Exaflares ausweichen',
          ja: 'エクサプレア',
          ko: '엑사플레어 피하기',
        },
      },
    },
    {
      id: 'P7N Hemitheos Aero IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7840', source: 'Agdistis' }),
      // The cast time is slightly longer than Arm's Length/Surecast's duration.
      // Don't risk someone being too fast.
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 6,
      response: Responses.knockback('info'), // avoid collisions with Forbidden Fruit triggers.
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Agdistis': 'Agdistis',
        'Immature Io': 'unreif(?:e|er|es|en) Io',
        'Immature Stymphalide': 'unreif(?:e|er|es|en) Stymphalides',
      },
      'replaceText': {
        'lines': 'Linien',
        'trianngle': 'Dreieck',
        'Blades of Attis': 'Schwertblatt des Attis',
        'Bough of Attis': 'Ast des Attis',
        'Burst': 'Explosion',
        'Forbidden Fruit': 'Frucht des Lebens',
        'Hemitheos\'s Aero II': 'Hemitheisches Windra',
        'Hemitheos\'s Aero IV': 'Hemitheisches Windka',
        'Hemitheos\'s Glare III': 'Hemitheisches Blendga',
        'Hemitheos\'s Holy': 'Hemitheisches Sanctus',
        'Immortal\'s Obol': 'Leitstab des Lebens',
        'Shadow of Attis': 'Lichttropfen des Attis',
        'Spark of Life': 'Schein des Lebens',
        'Static Moon': 'Statischer Mond',
        'Stymphalian Strike': 'Vogelschlag',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Agdistis': 'Agdistis',
        'Immature Io': 'io immature',
        'Immature Stymphalide': 'stymphalide immature',
      },
      'replaceText': {
        'Blades of Attis': 'Lames d\'Attis',
        'Bough of Attis': 'Grandes branches d\'Attis',
        'Burst': 'Explosion',
        'Forbidden Fruit': 'Fruits de la vie',
        'Hemitheos\'s Aero II': 'Extra Vent d\'hémithéos',
        'Hemitheos\'s Aero IV': 'Giga Vent d\'hémithéos',
        'Hemitheos\'s Glare III': 'Méga Chatoiement d\'hémithéos',
        'Hemitheos\'s Holy': 'Miracle d\'hémithéos',
        'Immortal\'s Obol': 'Branche de vie et de mort',
        'Shadow of Attis': 'Rai d\'Attis',
        'Spark of Life': 'Étincelle de vie',
        'Static Moon': 'Lune statique',
        'Stymphalian Strike': 'Assaut stymphalide',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Agdistis': 'アグディスティス',
        'Immature Io': 'イマチュア・イーオー',
        'Immature Stymphalide': 'イマチュア・ステュムパリデス',
      },
      'replaceText': {
        'Blades of Attis': 'アッティスの刃葉',
        'Bough of Attis': 'アッティスの巨枝',
        'Burst': '爆発',
        'Forbidden Fruit': '生命の果実',
        'Hemitheos\'s Aero II': 'ヘーミテオス・エアロラ',
        'Hemitheos\'s Aero IV': 'ヘーミテオス・エアロジャ',
        'Hemitheos\'s Glare III': 'ヘーミテオス・グレアガ',
        'Hemitheos\'s Holy': 'ヘーミテオス・ホーリー',
        'Immortal\'s Obol': '生滅の導枝',
        'Shadow of Attis': 'アッティスの光雫',
        'Spark of Life': '生命の光芒',
        'Static Moon': 'スタティックムーン',
        'Stymphalian Strike': 'バードストライク',
      },
    },
  ],
});
