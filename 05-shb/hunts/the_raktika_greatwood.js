Options.Triggers.push({
  id: 'TheRaktikaGreatwood',
  zoneId: ZoneId.TheRaktikaGreatwood,
  triggers: [
    {
      id: 'Hunt Grassman Chest Thump',
      type: 'StartsUsing',
      netRegex: { id: '45C3', source: 'Grassman', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Grassman Browbeat',
      type: 'StartsUsing',
      netRegex: { id: '45C4', source: 'Grassman' },
      condition: (data) => data.inCombat,
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Grassman Streak',
      type: 'StartsUsing',
      netRegex: { id: '45C6', source: 'Grassman', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Supay Blasphemous Howl',
      type: 'StartsUsing',
      netRegex: { id: '45C2', source: 'Supay' },
      condition: (data, matches) => data.inCombat && matches.target === data.me,
      // TODO: not sure how to say "hey if you're gonna be hit
      // by this giant aoe that's not on you, you should look away too"
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'GTFO + Look Away',
          de: 'Schnell raus + weg schauen',
          cn: '快出去 + 看向其他方向',
          ko: '멀리 빠지기 + 뒤돌기',
        },
      },
    },
    {
      id: 'Hunt Supay Petro Eyes',
      type: 'StartsUsing',
      netRegex: { id: '45C0', source: 'Supay', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.lookAway('alarm'),
    },
    {
      id: 'Hunt Ixtab Tartarean Abyss',
      type: 'StartsUsing',
      netRegex: { id: '45B8', source: 'Ixtab' },
      condition: (data) => data.inCombat,
      response: Responses.tankCleave(),
    },
    {
      id: 'Hunt Ixtab Tartarean Quake',
      type: 'StartsUsing',
      netRegex: { id: '45B9', source: 'Ixtab', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Ixtab Tartarean Meteor',
      type: 'StartsUsing',
      netRegex: { id: '45B4', source: 'Ixtab' },
      condition: (data) => data.inCombat,
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'Hunt Ixtab Tartarean Twister',
      type: 'StartsUsing',
      netRegex: { id: '4698', source: 'Ixtab' },
      condition: (data) => data.inCombat,
      response: Responses.interruptIfPossible(),
    },
    {
      id: 'Hunt Ixtab Cryptcall',
      type: 'Ability',
      netRegex: { id: '45B7', source: 'Ixtab', capture: false },
      condition: (data) => data.inCombat && (data.role === 'healer' || data.job === 'BLU'),
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Heal to Full',
          de: 'Voll heilen',
          cn: '奶满全员',
          ko: '체력 풀피로',
        },
      },
    },
    {
      id: 'Hunt Ixtab Archaic Dualcast',
      type: 'StartsUsing',
      netRegex: { id: '469D', source: 'Ixtab', capture: false },
      run: (data) => data.ixtabDualcast = true,
    },
    {
      id: 'Hunt Ixtab Tartarean Thunder',
      type: 'StartsUsing',
      netRegex: { id: '45B3', source: 'Ixtab', capture: false },
      condition: (data) => data.inCombat,
      alertText: (data, _matches, output) => {
        if (data.ixtabDualcast)
          return output.outThenIn();
        return output.out();
      },
      run: (data) => data.ixtabDualcast = false,
      outputStrings: {
        out: Outputs.out,
        outThenIn: Outputs.outThenIn,
      },
    },
    {
      id: 'Hunt Ixtab Tartarean Flame',
      type: 'StartsUsing',
      netRegex: { id: '464F', source: 'Ixtab', capture: false },
      condition: (data) => data.inCombat,
      alertText: (data, _matches, output) => {
        if (data.ixtabDualcast)
          return output.inThenOut();
        return output.in();
      },
      run: (data) => data.ixtabDualcast = false,
      outputStrings: {
        in: Outputs.in,
        inThenOut: Outputs.inThenOut,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Grassman': 'Grasmann',
        'Ixtab': 'Ixtab',
        'Supay': 'Supay',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Grassman': 'Sasquatch arboricole',
        'Ixtab': 'Ixtab',
        'Supay': 'Supay',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Grassman': 'グラスマン',
        'Ixtab': 'イシュタム',
        'Supay': 'スペイ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Grassman': '格拉斯曼',
        'Ixtab': '伊休妲',
        'Supay': '苏帕伊',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Grassman': '숲원인',
        'Ixtab': '이슈타브',
        'Supay': '수파이',
      },
    },
  ],
});
