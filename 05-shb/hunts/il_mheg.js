Options.Triggers.push({
  id: 'IlMheg',
  zoneId: ZoneId.IlMheg,
  triggers: [
    {
      id: 'Hunt Pauldia Rusting Claw',
      type: 'StartsUsing',
      netRegex: { id: '41BE', source: 'O Poorest Pauldia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Pauldia Words of Woe',
      type: 'StartsUsing',
      netRegex: { id: '41C0', source: 'O Poorest Pauldia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Pauldia Tail Drive',
      type: 'StartsUsing',
      netRegex: { id: '41BF', source: 'O Poorest Pauldia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goFront(),
    },
    {
      id: 'Hunt Pauldia The Spin',
      type: 'StartsUsing',
      netRegex: { id: '41C1', source: 'O Poorest Pauldia', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Mudman Royal Flush',
      type: 'StartsUsing',
      netRegex: { id: '41BA', source: 'The Mudman', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Mudman Bog Bequest',
      type: 'StartsUsing',
      netRegex: { id: '41BB', source: 'The Mudman', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Mudman Gravity Force',
      type: 'StartsUsing',
      netRegex: { id: '41BD', source: 'The Mudman' },
      condition: (data) => data.inCombat,
      response: Responses.interruptIfPossible(),
    },
    {
      id: 'Hunt Aglaope Ancient Aero III',
      type: 'StartsUsing',
      netRegex: { id: '4688', source: 'Aglaope', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.knockback(),
    },
    {
      id: 'Hunt Aglaope Fourfold Suffering',
      type: 'StartsUsing',
      netRegex: { id: '41B3', source: 'Aglaope', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getIn(),
    },
    {
      id: 'Hunt Aglaope Song of Torment',
      type: 'StartsUsing',
      netRegex: { id: '41B9', source: 'Aglaope' },
      condition: (data) => data.inCombat,
      response: Responses.interruptIfPossible(),
    },
    {
      id: 'Hunt Aglaope Seductive Sonata',
      type: 'StartsUsing',
      netRegex: { id: '41B8', source: 'Aglaope', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut('alarm'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Aglaope': 'Aglaope',
        'O Poorest Pauldia': 'gepeinigt(?:e|er|es|en) Pauldia',
        'The Mudman': 'Matschklops',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Aglaope': 'Aglaope',
        'O Poorest Pauldia': 'Pauldia',
        'The Mudman': 'tas de boue',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Aglaope': 'アグラオペ',
        'O Poorest Pauldia': 'ポールディア',
        'The Mudman': '泥人',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Aglaope': '阿格拉俄珀',
        'O Poorest Pauldia': '保尔迪雅',
        'The Mudman': '泥人',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Aglaope': '아글라오페',
        'O Poorest Pauldia': '폴디아',
        'The Mudman': '진흙인간',
      },
    },
  ],
});
