Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors41_50',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors41_50,
  triggers: [
    // ---------------- Floor 041-049 Mobs ----------------
    {
      id: 'PotD 041-050 Nightmare Bhoot Paralyze III',
      // inflicts Paralyze
      type: 'StartsUsing',
      netRegex: { id: '18F2', source: 'Nightmare Bhoot' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 041-050 Nightmare Persona Paralyze III',
      // same ability name, different mob
      // inflicts Paralyze
      type: 'StartsUsing',
      netRegex: { id: '18F4', source: 'Nightmare Persona' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 041-050 Nightmare Wraith Scream',
      // inflicts Terror (42)
      type: 'StartsUsing',
      netRegex: { id: '190A', source: 'Nightmare Wraith' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 041-050 Nightmare Manticore Ripper Claw',
      // untelegraphed front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '18FA', source: 'Nightmare Manticore', capture: false },
      response: Responses.awayFromFront(),
    },
    // ---------------- Floor 050 Boss: Edda Blackbosom ----------------
    {
      id: 'PotD 041-050 Edda Blackbosom In Health (PBAoE)',
      // large PBAoE, increases damage of Black Honeymoon if hit
      type: 'StartsUsing',
      netRegex: { id: '18FE', source: 'Edda Blackbosom', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'PotD 041-050 Edda Blackbosom In Health (Donut)',
      // Donut AoE, increases damage of Black Honeymoon if hit
      type: 'StartsUsing',
      netRegex: { id: '18FF', source: 'Edda Blackbosom', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'PotD 041-050 Edda Blackbosom Black Honeymoon',
      // roomwide AoE, does more damage increased based on how many players hit by In Health
      type: 'StartsUsing',
      netRegex: { id: '1902', source: 'Edda Blackbosom', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'PotD 041-050 Edda Blackbosom Cold Feet',
      // gaze, inflicts Confusion
      type: 'StartsUsing',
      netRegex: { id: '1903', source: 'Edda Blackbosom', capture: false },
      response: Responses.lookAway('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Edda Blackbosom': 'Edda Schwarzherz',
        'Nightmare Bhoot': 'Albtraum-Bhut',
        'Nightmare Manticore': 'Albtraum-Manticore',
        'Nightmare Persona': 'Albtraum-Persona',
        'Nightmare Wraith': 'Albtraum-Geist',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Edda Blackbosom': 'Edda Cœur-noir',
        'Nightmare Bhoot': 'bhut du cauchemar',
        'Nightmare Manticore': 'manticore du cauchemar',
        'Nightmare Persona': 'persona du cauchemar',
        'Nightmare Wraith': 'spectre du cauchemar',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Edda Blackbosom': '漆黒のエッダ',
        'Nightmare Bhoot': 'ナイトメア・ブフート',
        'Nightmare Manticore': 'ナイトメア・マンティコア',
        'Nightmare Persona': 'ナイトメア・ペルソナ',
        'Nightmare Wraith': 'ナイトメア・レイス',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Edda Blackbosom': '漆黑的艾达',
        'Nightmare Bhoot': '噩梦浮灵',
        'Nightmare Manticore': '噩梦曼提克',
        'Nightmare Persona': '噩梦假面',
        'Nightmare Wraith': '噩梦幽灵',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Edda Blackbosom': '칠흑의 에다',
        'Nightmare Bhoot': '악몽 브후트',
        'Nightmare Manticore': '악몽 만티코어',
        'Nightmare Persona': '악몽 페르소나',
        'Nightmare Wraith': '악몽 망령',
      },
    },
  ],
});
