Options.Triggers.push({
  id: 'HeavenOnHighFloors71_80',
  zoneId: ZoneId.HeavenOnHighFloors71_80,
  triggers: [
    // ---------------- Floor 71-79 Mobs ----------------
    {
      id: 'HoH 71-80 Heavenly Ichijama Scream',
      // inflicts Terror (42)
      type: 'StartsUsing',
      netRegex: { id: '2FA3', source: 'Heavenly Ichijama' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'HoH 71-80 Heavenly Hyoga Eyeshine',
      type: 'StartsUsing',
      netRegex: { id: '2FE5', source: 'Heavenly Hyoga', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'HoH 71-80 Heavenly Mammoth Wooly Inspiration',
      // front cone AoE draw-in, follows up with Tusk Butt (instant, untelegraphed front cone AoE)
      type: 'StartsUsing',
      netRegex: { id: '2FBA', source: 'Heavenly Mammoth', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'HoH 71-80 Heavenly Tofu Golden Tongue',
      // gains Magic Damage Up (39)
      type: 'StartsUsing',
      netRegex: { id: '2FBE', source: 'Heavenly Tofu' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    // ---------------- Floor 80 Boss: Kajigakaka ----------------
    {
      id: 'HoH 71-80 Kajigakaka Lunar Cry',
      type: 'StartsUsing',
      netRegex: { id: '2ED3', source: 'Kajigakaka', capture: false },
      response: Responses.aoe(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Heavenly Hyoga': 'Himmelssäulen-Hyoga',
        'Heavenly Ichijama': 'Himmelssäulen-Ichijama',
        'Heavenly Mammoth': 'Himmelssäulen-Mammut',
        'Heavenly Tofu': 'Himmelssäulen-Tofu',
        'Kajigakaka': 'Kajigakaka',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Heavenly Hyoga': 'hyôga des Cieux',
        'Heavenly Ichijama': 'ichijama des Cieux',
        'Heavenly Mammoth': 'mammouth des Cieux',
        'Heavenly Tofu': 'tôfu des Cieux',
        'Kajigakaka': 'Kajigakaka',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Heavenly Hyoga': 'アメノ・ヒョウガ',
        'Heavenly Ichijama': 'アメノ・イチジャマ',
        'Heavenly Mammoth': 'アメノ・マンモス',
        'Heavenly Tofu': 'アメノ・トウフ',
        'Kajigakaka': 'カジガカカ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Heavenly Hyoga': '天之冰牙',
        'Heavenly Ichijama': '天之生邪魔',
        'Heavenly Mammoth': '天之长毛象',
        'Heavenly Tofu': '天之豆腐',
        'Kajigakaka': '锻冶媪',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Heavenly Hyoga': '천궁 효우가',
        'Heavenly Ichijama': '천궁 생령',
        'Heavenly Mammoth': '천궁 매머드',
        'Heavenly Tofu': '천궁 두부',
        'Kajigakaka': '카지가카카',
      },
    },
  ],
});
