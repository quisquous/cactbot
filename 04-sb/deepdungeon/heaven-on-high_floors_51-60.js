Options.Triggers.push({
  id: 'HeavenOnHighFloors51_60',
  zoneId: ZoneId.HeavenOnHighFloors51_60,
  triggers: [
    // ---------------- Floor 51-59 Mobs ----------------
    {
      id: 'HoH 51-60 Heavenly Naga Calcifying Mist',
      // front cone gaze AoE
      type: 'StartsUsing',
      netRegex: { id: '306D', source: 'Heavenly Naga', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get Behind or Look Away',
          de: 'Geh hinter oder schau weg',
          cn: '去背后或看向其他方向',
          ko: '보스 뒤로 또는 뒤돌기',
        },
      },
    },
    {
      id: 'HoH 51-60 Heavenly Gowan Electromagnetism',
      type: 'StartsUsing',
      netRegex: { id: '3068', source: 'Heavenly Gowan' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    // ---------------- Floor 60 Boss: Suikazura ----------------
    {
      id: 'HoH 51-60 Suikazura Ancient Flare',
      type: 'StartsUsing',
      netRegex: { id: '2E98', source: 'Suikazura', capture: false },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Heavenly Gowan': 'Himmelssäulen-Gowan',
        'Heavenly Naga': 'Himmelssäulen-Naga',
        'Suikazura': 'Suikazura',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Heavenly Gowan': 'gôwan des Cieux',
        'Heavenly Naga': 'naga des Cieux',
        'Suikazura': 'Suikazura',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Heavenly Gowan': 'アメノ・ゴウワン',
        'Heavenly Naga': 'アメノ・ナーガ',
        'Suikazura': 'スイカズラ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Heavenly Gowan': '天之铁臂',
        'Heavenly Naga': '天之那迦',
        'Suikazura': '忍冬',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Heavenly Gowan': '천궁 힘센팔이',
        'Heavenly Naga': '천궁 나가',
        'Suikazura': '인동덩굴',
      },
    },
  ],
});
