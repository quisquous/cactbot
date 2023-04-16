Options.Triggers.push({
  id: 'HeavenOnHighFloors91_100',
  zoneId: ZoneId.HeavenOnHighFloors91_100,
  triggers: [
    // ---------------- Floor 91-99 Mobs ----------------
    {
      id: 'HoH 91-100 Heavenly Gozu 32-tonze Swipe',
      // untelegraphed instant front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '3005', source: 'Heavenly Gozu', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'HoH 91-100 Heavenly Mifune Valfodr',
      // charge + knockback on targeted player
      type: 'StartsUsing',
      netRegex: { id: '2F83', source: 'Heavenly Mifune' },
      condition: Conditions.targetIsYou(),
      response: Responses.knockback(),
    },
    {
      id: 'HoH 91-100 Heavenly Jaki Charybdis',
      // circle AoE on marked player, drops target to 1 HP
      type: 'StartsUsing',
      netRegex: { id: '2FF4', source: 'Heavenly Jaki' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'HoH 91-100 Heavenly Jinba Allagan Fear',
      // gaze
      type: 'StartsUsing',
      netRegex: { id: '2FF9', source: 'Heavenly Jinba', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'HoH 91-100 Heavenly Kyozo Filoplumage',
      // gains Vulnerability Down (3F) on self and nearby enemies
      type: 'StartsUsing',
      netRegex: { id: '2FFA', source: 'Heavenly Kyozo' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'HoH 91-100 Heavenly Tenma Burning Bright',
      // untelegraphed instant front line AoE
      type: 'StartsUsing',
      netRegex: { id: '3011', source: 'Heavenly Tenma', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'HoH 91-100 Heavenly Tenma Nicker',
      // large PBAoE, inflcits Confuse, goes through walls (can't LoS)
      type: 'StartsUsing',
      netRegex: { id: '3013', source: 'Heavenly Tenma' },
      response: Responses.stunOrInterruptIfPossible(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Heavenly Gozu': 'Himmelssäulen-Gozu',
        'Heavenly Jaki': 'Himmelssäulen-Jaki',
        'Heavenly Jinba': 'Himmelssäulen-Jinba',
        'Heavenly Kyozo': 'Himmelssäulen-Kyozo',
        'Heavenly Mifune': 'Himmelssäulen-Mifune',
        'Heavenly Tenma': 'Himmelssäulen-Tenma',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Heavenly Gozu': 'gozu des Cieux',
        'Heavenly Jaki': 'jaki des Cieux',
        'Heavenly Jinba': 'jinba des Cieux',
        'Heavenly Kyozo': 'kyôzô des Cieux',
        'Heavenly Mifune': 'mifune des Cieux',
        'Heavenly Tenma': 'tenma des Cieux',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Heavenly Gozu': 'アメノ・ゴズ',
        'Heavenly Jaki': 'アメノ・ジャキ',
        'Heavenly Jinba': 'アメノ・ジンバ',
        'Heavenly Kyozo': 'アメノ・キョウゾウ',
        'Heavenly Mifune': 'アメノ・ミフネ',
        'Heavenly Tenma': 'アメノ・テンマ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Heavenly Gozu': '天之牛头',
        'Heavenly Jaki': '天之邪鬼',
        'Heavenly Jinba': '天之人马',
        'Heavenly Kyozo': '天之镜像',
        'Heavenly Mifune': '天之三船',
        'Heavenly Tenma': '天之马',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Heavenly Gozu': '천궁 소머리',
        'Heavenly Jaki': '천궁 사귀',
        'Heavenly Jinba': '천궁 인마',
        'Heavenly Kyozo': '천궁 거울기사',
        'Heavenly Mifune': '천궁 미후네',
        'Heavenly Tenma': '천궁 천마',
      },
    },
  ],
});
