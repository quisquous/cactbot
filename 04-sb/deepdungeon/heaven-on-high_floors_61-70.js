Options.Triggers.push({
  id: 'HeavenOnHighFloors61_70',
  zoneId: ZoneId.HeavenOnHighFloors61_70,
  triggers: [
    // ---------------- Floor 61-69 Mobs ----------------
    {
      id: 'HoH 61-70 Heavenly Hashiri-dokoro Atropine Spore',
      type: 'StartsUsing',
      netRegex: { id: '307F', source: 'Heavenly Hashiri-dokoro', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'HoH 61-70 Heavenly Hashiri-dokoro Frond Fatale',
      type: 'StartsUsing',
      netRegex: { id: '3080', source: 'Heavenly Hashiri-dokoro', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 70 Boss: Kenko ----------------
    {
      id: 'HoH 61-70 Kenko Predator Claws',
      // untelegraphed front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '2FAD', source: 'Kenko', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'HoH 61-70 Kenko Innerspace',
      // leaves puddle that inflicts Minimum (1B6)
      type: 'StartsUsing',
      netRegex: { id: '2FAF', source: 'Kenko', capture: false },
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Avoid Puddle',
          de: 'Flächen vermeiden',
          cn: '躲避圈圈',
          ko: '장판 피하기',
        },
      },
    },
    {
      id: 'HoH 61-70 Kenko Ululation',
      // roomwide AoE, fatal if Minimum (1B6)
      type: 'StartsUsing',
      netRegex: { id: '2FB0', source: 'Kenko', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'HoH 61-70 Kenko Hound out of Hell',
      // charge AoE, fatal if not Minimum (1B6)
      type: 'StartsUsing',
      netRegex: { id: '2FAE', source: 'Kenko' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Get In Puddle',
          de: 'Geh in die Flächen',
          fr: 'Prenez une zone au sol',
          cn: '进入圈圈',
          ko: '장판 밟기',
        },
      },
    },
    {
      id: 'HoH 61-70 Kenko Devour',
      // immediately after Devour, get out of puddle so not Minimum for follow-up Ululation
      type: 'Ability',
      netRegex: { id: '2FAC', source: 'Kenko' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Out of Puddle',
          de: 'Raus aus der Fläche',
          cn: '离开圈圈',
          ko: '장판 밖으로',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Heavenly Hashiri-dokoro': 'Himmelssäulen-Hashiri-Dokoro',
        'Kenko': 'Kenko',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Heavenly Hashiri-dokoro': 'hashidokoro des Cieux',
        'Kenko': 'Kenko',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Heavenly Hashiri-dokoro': 'アメノ・ハシリドコロ',
        'Kenko': 'ケンコ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Heavenly Hashiri-dokoro': '天之东莨菪',
        'Kenko': '犬蛊',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Heavenly Hashiri-dokoro': '천궁 미치광이풀',
        'Kenko': '켄코',
      },
    },
  ],
});
