// TODO: Narrow-rift Continual Meddling
// Continual Meddling = 6AC0, applies two of these, one 7 one 10 second, about ~1s before Empty Refrain cast:
//   7A6 = Forward March
//   7A7 = About Face
//   7A8 = Left Face
//   7A9 = Right Face
// TODO: Chi unknown tankbuster
// TODO: Chi Bunker Buster
// TODO: Chi Hellburner
// TODO: Chi Bouncing Bomb
// TODO: Chi Free-fall Bombs
// TODO: Chi Thermobaric Explosive
Options.Triggers.push({
  zoneId: ZoneId.UltimaThule,
  triggers: [
    {
      id: 'Hunt Arch-Eta Energy Wave',
      type: 'StartsUsing',
      netRegex: { id: '6A85', source: 'Arch-Eta', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Arch-Eta Sonic Howl',
      type: 'StartsUsing',
      netRegex: { id: '6A88', source: 'Arch-Eta', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Arch-Eta Tail Swipe',
      type: 'StartsUsing',
      netRegex: { id: '6A86', source: 'Arch-Eta', capture: false },
      condition: (data) => data.inCombat,
      alertText: (_data, _matches, output) => output.getFront(),
      outputStrings: {
        getFront: {
          en: 'Get Front',
          de: 'Geh nach Vorne',
          fr: 'Allez devant',
          ja: '前へ',
          cn: '去正面',
          ko: '앞으로',
        },
      },
    },
    {
      id: 'Hunt Arch-Eta Fanged Lunge',
      type: 'Ability',
      // Before Heavy Stomp (6A87) cast.
      netRegex: { id: '6A8A', source: 'Arch-Eta', capture: false },
      condition: (data) => data.inCombat,
      alarmText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Away from jump',
          de: 'Weg vom Sprung',
          fr: 'Éloignez-vous du saut',
          ja: '着地点から離れる',
          cn: '躲开跳跃',
          ko: '점프뛴 곳에서 멀리 떨어지기',
        },
      },
    },
    {
      id: 'Hunt Arch-Eta Steel Fang',
      type: 'StartsUsing',
      netRegex: { id: '6A89', source: 'Arch-Eta' },
      condition: (data) => data.inCombat,
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Fan Ail Cyclone Wing',
      type: 'StartsUsing',
      netRegex: { id: '6AF4', source: 'Fan Ail', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.aoe(),
    },
    {
      id: 'Hunt Fan Ail Plummet',
      type: 'StartsUsing',
      netRegex: { id: '6AF2', source: 'Fan Ail', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Fan Ail Divebomb',
      type: 'StartsUsing',
      netRegex: { id: '6AED', source: 'Fan Ail', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.awayFromFront(),
    },
    {
      id: 'Hunt Fan Ail Death Sentence',
      type: 'StartsUsing',
      netRegex: { id: '6AF3', source: 'Fan Ail' },
      condition: (data) => data.inCombat,
      response: Responses.tankBuster('info'),
    },
    {
      id: 'Hunt Narrow-rift Empty Promise Donut',
      type: 'StartsUsing',
      netRegex: { id: '6B60', source: 'Narrow-rift', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Hunt Narrow-rift Empty Promise Circle',
      type: 'StartsUsing',
      netRegex: { id: '6B5F', source: 'Narrow-rift', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Narrow-rift Vanishing Ray',
      type: 'Ability',
      // An unknown single-target ability that preceeds Vanishing Ray with no cast bar.
      netRegex: { id: '6AC5', source: 'Narrow-rift', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Narrow-rift Empty Refrain Out First',
      type: 'StartsUsing',
      // This is followed by a very short 6AC9 castbar.
      netRegex: { id: '6AC3', source: 'Narrow-rift', capture: false },
      response: Responses.getOutThenIn(),
    },
    {
      id: 'Hunt Narrow-rift Empty Refrain In Second',
      type: 'Ability',
      netRegex: { id: '6AC3', source: 'Narrow-rift', capture: false },
      suppressSeconds: 1,
      response: Responses.getIn('info'),
    },
    {
      id: 'Hunt Narrow-rift Empty Refrain In First',
      type: 'StartsUsing',
      // This is followed by a very short 6AC7 castbar.
      netRegex: { id: '6AC4', source: 'Narrow-rift', capture: false },
      response: Responses.getInThenOut(),
    },
    {
      id: 'Hunt Narrow-rift Empty Refrain Out Second',
      type: 'Ability',
      netRegex: { id: '6AC4', source: 'Narrow-rift', capture: false },
      suppressSeconds: 1,
      response: Responses.getOut('info'),
    },
    // ---------------- Chi Boss FATE ----------------
    {
      id: 'Hunt Chi Assault Carapace (Donut)',
      // 6561 = 4.7s cast
      // 6254 = 7.7s cast (during Bunker Buster)
      type: 'StartsUsing',
      netRegex: { id: ['6561', '6254'], source: 'Chi', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Chi Assault Carapace (Line)',
      // 6562 = 4.7s cast
      // 6255 = 7.7s cast (during Bunker Buster)
      type: 'StartsUsing',
      netRegex: { id: ['6562', '6255'], source: 'Chi', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goSides(),
    },
    {
      id: 'Hunt Chi Rear Guns',
      type: 'StartsUsing',
      netRegex: { id: '656A', source: 'Chi', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goFront(),
    },
    {
      id: 'Hunt Chi Fore Arms',
      type: 'StartsUsing',
      netRegex: { id: '6567', source: 'Chi', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Chi Rear Guns > Fore Arms 2.0',
      type: 'StartsUsing',
      netRegex: { id: '656B', source: 'Chi', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getFrontThenBack(),
    },
    {
      id: 'Hunt Chi Fore Arms > Rear Guns 2.0',
      type: 'StartsUsing',
      netRegex: { id: '6568', source: 'Chi', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBackThenFront(),
    },
    {
      id: 'Hunt Chi Carapace > Fore Arms 2.0 (Donut)',
      type: 'StartsUsing',
      netRegex: { id: '6563', source: 'Chi', capture: false },
      condition: (data) => data.inCombat,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Under => Back',
          de: 'Unter Ihn => Hinter den Boss',
          ja: '下 => 後ろ',
          cn: '下方 => 背后',
        },
      },
    },
    {
      id: 'Hunt Chi Carapace > Fore Arms 2.0 (Line)',
      type: 'StartsUsing',
      netRegex: { id: '6565', source: 'Chi', capture: false },
      condition: (data) => data.inCombat,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Sides => Back',
          de: 'Seiten => Hinter den Boss',
          ja: '横 => 後ろ',
          cn: '两侧 => 背后',
        },
      },
    },
    {
      id: 'Hunt Chi Carapace > Rear Guns 2.0 (Donut)',
      type: 'StartsUsing',
      netRegex: { id: '6564', source: 'Chi', capture: false },
      condition: (data) => data.inCombat,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Under => Front',
          de: 'Unter Ihn => Vor den Boss',
          ja: '下 => 前',
          cn: '下方 => 正面',
        },
      },
    },
    {
      id: 'Hunt Chi Carapace > Rear Guns 2.0 (Line)',
      type: 'StartsUsing',
      netRegex: { id: '6566', source: 'Chi', capture: false },
      condition: (data) => data.inCombat,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Sides => Front',
          de: 'Seiten => Vor den Boss',
          ja: '横 => 前',
          cn: '两侧 => 正面',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Arch-Eta': 'Erz-Eta',
        'Chi': 'Chi',
        'Fan Ail': 'Fan Ail',
        'Narrow-rift': 'Enger Riss',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Arch-Eta': 'Arch-Êta',
        'Chi': 'Chi',
        'Fan Ail': 'Fan Ail',
        'Narrow-rift': 'Rift-étroit',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Arch-Eta': 'アーチイータ',
        'Chi': 'カイ',
        'Fan Ail': 'ファン・アイル',
        'Narrow-rift': 'ナロー＝リフト',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Arch-Eta': '伊塔总领',
        'Chi': '希',
        'Fan Ail': '凡·艾尔',
        'Narrow-rift': '狭缝',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Arch-Eta': '아치 에타',
        'Chi': '키',
        'Fan Ail': '판 아일',
        'Narrow-rift': '내로 리프트',
      },
    },
  ],
});
