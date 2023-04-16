// TODO: Lucky Sphinx abilities
const excitatronOutputStrings = {
  spawn: {
    en: '${name} spawned!',
    de: '${name} erscheint!',
    ja: '${name} 現れる！',
    cn: '已生成 ${name}!',
    ko: '${name} 등장!',
  },
};
Options.Triggers.push({
  id: 'TheExcitatron6000',
  zoneId: ZoneId.TheExcitatron6000,
  triggers: [
    // ---------------- random treasure mobs ----------------
    {
      id: 'Excitatron Rainbow Golem Spawn',
      // 10834 = Rainbow Golem
      type: 'AddedCombatant',
      netRegex: { npcNameId: '10834' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn({ name: matches.name }),
      outputStrings: {
        spawn: excitatronOutputStrings.spawn,
      },
    },
    {
      id: 'Excitatron Golden Supporter Spawn',
      // 10833 = Golden Supporter
      type: 'AddedCombatant',
      netRegex: { npcNameId: '10833' },
      suppressSeconds: 1,
      infoText: (_data, matches, output) => output.spawn({ name: matches.name }),
      outputStrings: {
        spawn: excitatronOutputStrings.spawn,
      },
    },
    {
      id: 'Excitatron Exciting Mandragoras Spawn',
      // 10835 = Exciting Onion
      // 10836 = Exciting Egg
      // 10837 = Exciting Garlic
      // 10838 = Exciting Tomato
      // 10839 = Exciting Queen
      type: 'AddedCombatant',
      netRegex: { npcNameId: '1083[5-9]', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Exciting Mandragoras spawned, kill in order!',
          de: 'Mandragoras erscheinen, in Reihenfolge besiegen!',
          ja: 'マンドラゴラ！順番に倒して！',
          cn: '已生成 惊奇蔓德拉战队, 依次击杀!',
          ko: '만드라즈 등장, 순서대로 잡기',
        },
      },
    },
    // ---------------- final chamber boss: Lucky Face ----------------
    {
      id: 'Excitatron Right in the Dark',
      type: 'StartsUsing',
      netRegex: { id: '6D57', source: 'Lucky Face', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Excitatron Left in the Dark',
      type: 'StartsUsing',
      netRegex: { id: '6D55', source: 'Lucky Face', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Excitatron Heart on Fire IV',
      type: 'StartsUsing',
      netRegex: { id: '6D4D', source: 'Lucky Face' },
      response: Responses.tankBuster(),
    },
    {
      id: 'Excitatron Quake Me Away',
      type: 'StartsUsing',
      netRegex: { id: '6D5F', source: 'Lucky Face', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Excitatron Quake in Your Boots',
      type: 'StartsUsing',
      netRegex: { id: '6D5D', source: 'Lucky Face', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Excitatron Right in the Dark Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, certain attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '6D5B', source: 'Lucky Face', capture: false },
      response: Responses.goRight(),
    },
    {
      id: 'Excitatron Left in the Dark Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, certain attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '6D59', source: 'Lucky Face', capture: false },
      response: Responses.goLeft(),
    },
    {
      id: 'Excitatron Quake Me Away Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, certain attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '6DBB', source: 'Lucky Face', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'Excitatron Quake in Your Boots Reversed',
      // when Lucky Face casts Merry Go-round (6D4F, 6D51) and gains the Revolutionary (B59) buff, certain attacks are reversed
      // reversed attacks have different ids so we don't need to check for the buff
      type: 'StartsUsing',
      netRegex: { id: '6DBA', source: 'Lucky Face', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Excitatron Heart on Fire III',
      // baited aoe on 2 players
      type: 'StartsUsing',
      netRegex: { id: '6D62', source: 'Lucky Face' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'Excitatron Temper\'s Flare',
      type: 'StartsUsing',
      netRegex: { id: '6D4E', source: 'Lucky Face', capture: false },
      response: Responses.aoe(),
    },
    // ---------------- alternate final chamber boss: Lucky Sphinx ----------------
    {
      id: 'Excitatron Icewind Twister',
      type: 'StartsUsing',
      netRegex: { id: '6D69', source: 'Lucky Sphinx', capture: false },
      response: Responses.getIn(),
    },
    {
      id: 'Excitatron Riddle of Frost',
      // inflicts Freezing Up (9EC) for 3s at end of cast
      // Freezing Up becomes Deep Freeze (4E6) if not continuously moving until debuff expires
      type: 'StartsUsing',
      netRegex: { id: '6D65', source: 'Lucky Sphinx' },
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 2,
      durationSeconds: 5,
      response: Responses.moveAround('alert'),
    },
    {
      id: 'Excitatron Icebomb Burst',
      type: 'StartsUsing',
      netRegex: { id: '6D67', source: 'Lucky Sphinx', capture: false },
      response: Responses.getOut(),
    },
    // Riddle of Flame - Pyretic on every player
    // Gold Thunder - stack donut on 1 player, deals high damge outside center safe-spot
    // Firedrop Blast - aoes under 4? players + aoe marker on 1 player, leaves burns on marked player if other players hit?
    // Superheat - tankbuster
    // Crackling Current - roomwide aoe
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Lucky Face': 'Gesicht des Glücks',
        'Lucky Sphinx': 'Sphinx des Glücks',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Lucky Face': 'visage chanceux',
        'Lucky Sphinx': 'sphinx chanceux',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Lucky Face': 'ラッキー・フェイス',
        'Lucky Sphinx': 'ラッキー・スフィンクス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Lucky Face': '幸运石面',
        'Lucky Sphinx': '幸运斯芬克斯',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Lucky Face': '행운의 얼굴',
        'Lucky Sphinx': '행운의 스핑크스',
      },
    },
  ],
});
