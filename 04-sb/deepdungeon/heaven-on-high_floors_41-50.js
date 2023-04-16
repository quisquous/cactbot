Options.Triggers.push({
  id: 'HeavenOnHighFloors41_50',
  zoneId: ZoneId.HeavenOnHighFloors41_50,
  triggers: [
    // ---------------- Floor 41-49 Mobs ----------------
    // intentionally blank
    // ---------------- Floor 50 Boss: Gozu ----------------
    {
      id: 'HoH 41-50 Gozu Rusting Claw',
      // untelegraphed front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '2E8F', source: 'Gozu', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'HoH 41-50 Gozu Words of Woe',
      // untelegraphed front line AoE
      type: 'StartsUsing',
      netRegex: { id: '2E90', source: 'Gozu', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'HoH 41-50 Gozu Eye of the Fire',
      // gaze, inflicts Confusion
      type: 'StartsUsing',
      netRegex: { id: '2E92', source: 'Gozu', capture: false },
      response: Responses.lookAway('alert'),
    },
    // {
    //   id: 'HoH 41-50 Gozu The Spin',
    //   // spawns several Glooms (orbs) around the arena
    //   // does a roomwide proximity AoE while the Glooms pulse PBAoEs
    //   type: 'StartsUsing',
    //   netRegex: { id: '', source: 'Gozu', capture: false },
    //   alertText: (_data, _matches, output) => output.text!(),
    //   outputStrings: {
    //     text: {
    //       en: 'Away from boss and orbs',
    //     },
    //   },
    // },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Gozu': 'Gozu',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Gozu': 'Gozu',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Gozu': 'ゴズ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Gozu': '牛头',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Gozu': '소머리',
      },
    },
  ],
});
