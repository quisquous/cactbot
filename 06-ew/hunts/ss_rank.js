// TODO:
// Ancient Flare is probably 6FB6?, Pyretic debuff effect is ?
// Whispered Incantation + Whispers Manifest
// Handle Mirrored Incantation + Interments
Options.Triggers.push({
  zoneId: [
    ZoneId.Labyrinthos,
    ZoneId.Thavnair,
    ZoneId.Garlemald,
    ZoneId.MareLamentorum,
    ZoneId.Elpis,
    ZoneId.UltimaThule,
  ],
  triggers: [
    {
      id: 'Hunt Ker Heliovoid',
      type: 'StartsUsing',
      netRegex: { id: '6BF4', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.outOfMelee(),
    },
    {
      id: 'Hunt Ker Ancient Blizzard III',
      type: 'StartsUsing',
      netRegex: { id: '6BF5', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getUnder(),
    },
    {
      id: 'Hunt Ker Eternal Damnation',
      type: 'StartsUsing',
      netRegex: { id: '6BFF', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.lookAway(),
    },
    {
      id: 'Hunt Ker Ancient Holy',
      type: 'StartsUsing',
      netRegex: { id: '6BFE', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getOut(),
    },
    {
      id: 'Hunt Ker Fore Interment',
      type: 'StartsUsing',
      netRegex: { id: '6BF9', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.getBehind(),
    },
    {
      id: 'Hunt Ker Rear Interment',
      type: 'StartsUsing',
      netRegex: { id: '6BFA', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goFront(),
    },
    {
      id: 'Hunt Ker Right Interment',
      type: 'StartsUsing',
      netRegex: { id: '6BFB', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goRight(),
    },
    {
      id: 'Hunt Ker Left Interment',
      type: 'StartsUsing',
      netRegex: { id: '6BFC', source: 'Ker', capture: false },
      condition: (data) => data.inCombat,
      response: Responses.goRight(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ker': 'Ker',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ker': 'Kèr',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ker': 'ケール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ker': '克尔',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ker': '케르',
      },
    },
  ],
});
