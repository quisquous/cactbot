Options.Triggers.push({
  zoneId: ZoneId.EurekaOrthosFloors21_30,
  triggers: [
    // ---------------- Floor 21-29 Mobs ----------------
    {
      id: 'EO 21-30 Lesser Orthos Dragon Swinge',
      type: 'StartsUsing',
      netRegex: { id: '7EA5', source: 'Lesser Orthos Dragon', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'EO 21-30 Orthoknight Electromagnetism',
      type: 'StartsUsing',
      netRegex: { id: '7E9D', source: 'Orthoknight', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 21-30 Orthos Vanara Scythe Tail',
      type: 'StartsUsing',
      netRegex: { id: '7EAC', source: 'Orthos Vanara', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'EO 21-30 Orthoshelled Dragon Diamondback',
      type: 'StartsUsing',
      netRegex: { id: '7EAF', source: 'Orthoshelled Dragon' },
      response: Responses.interruptIfPossible(),
    },
    // ---------------- Floor 30 Boss: Tiamat Clone ----------------
    {
      id: 'EO 21-30 Tiamat Clone Dark Wyrmwing',
      type: 'StartsUsing',
      netRegex: { id: '7C65', source: 'Tiamat Clone', capture: false },
      response: Responses.goMiddle(),
    },
    {
      id: 'EO 21-30 Tiamat Clone Dark Wyrmtail',
      type: 'StartsUsing',
      netRegex: { id: '7C63', source: 'Tiamat Clone', capture: false },
      response: Responses.goSides(),
    },
    {
      id: 'EO 21-30 Tiamat Clone Whei Morn',
      type: 'HeadMarker',
      netRegex: { id: '00C5' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, outputs) => outputs.text(),
      outputStrings: {
        text: {
          en: '5x chasing puddles on you!',
          de: '5x verfolgende Flächen auf dir!',
          fr: '5x zones au sol chainées sur vous !',
          ja: '5連続AOE回避',
          cn: '5连追踪AOE点名!',
          ko: '따라오는 5연속 장판 피하기!',
        },
      },
    },
  ],
});
