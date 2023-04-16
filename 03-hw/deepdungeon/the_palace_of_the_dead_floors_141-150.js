Options.Triggers.push({
  id: 'ThePalaceOfTheDeadFloors141_150',
  zoneId: ZoneId.ThePalaceOfTheDeadFloors141_150,
  triggers: [
    // ---------------- Floor 141-149 Mobs ----------------
    {
      id: 'PotD 141-150 Deep Palace Bhoot Paralyze III',
      // inflicts Paralyze
      type: 'StartsUsing',
      netRegex: { id: '18F2', source: 'Deep Palace Bhoot' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 141-150 Deep Palace Persona Paralyze III',
      // same ability name, different mob
      // inflicts Paralyze
      type: 'StartsUsing',
      netRegex: { id: '18F4', source: 'Deep Palace Persona' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 141-150 Deep Palace Wraith Scream',
      // inflicts Terror (42)
      type: 'StartsUsing',
      netRegex: { id: '190A', source: 'Deep Palace Wraith' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 141-150 Deep Palace Succubus Void Fire IV',
      // very large AoE
      type: 'StartsUsing',
      netRegex: { id: '1B81', source: 'Deep Palace Succubus' },
      response: Responses.stunOrInterruptIfPossible(),
    },
    {
      id: 'PotD 141-150 Deep Palace Manticore Ripper Claw',
      // untelegraphed front cone AoE
      type: 'StartsUsing',
      netRegex: { id: '18FA', source: 'Deep Palace Manticore', capture: false },
      response: Responses.awayFromFront(),
    },
    {
      id: 'PotD 141-150 Onyx Dragon Evil Eye',
      // gaze, inflicts Terror (42), combos with Miasma Breath (1B82)
      type: 'StartsUsing',
      netRegex: { id: '1B83', source: 'Onyx Dragon', capture: false },
      response: Responses.lookAway('alert'),
    },
    // ---------------- Floor 150 Boss: Tisiphone ----------------
    {
      id: 'PotD 141-150 Tisiphone Blood Rain',
      // big roomwide AoE
      type: 'StartsUsing',
      netRegex: { id: '1BF1', source: 'Tisiphone', capture: false },
      response: Responses.bigAoe('alert'),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Deep Palace Bhoot': 'Katakomben-Bhut',
        'Deep Palace Manticore': 'Katakomben-Manticore',
        'Deep Palace Persona': 'Katakomben-Persona',
        'Deep Palace Succubus': 'Katakomben-Sukkubus',
        'Deep Palace Wraith': 'Katakomben-Geist',
        'Onyx Dragon': 'Onyxdrache',
        'Tisiphone': 'Tisiphone',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Deep Palace Bhoot': 'bhut des profondeurs',
        'Deep Palace Manticore': 'manticore des profondeurs',
        'Deep Palace Persona': 'persona des profondeurs',
        'Deep Palace Succubus': 'succube des profondeurs',
        'Deep Palace Wraith': 'spectre des profondeurs',
        'Onyx Dragon': 'dragon d\'onyx',
        'Tisiphone': 'Tisiphone',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Deep Palace Bhoot': 'ディープパレス・ブフート',
        'Deep Palace Manticore': 'ディープパレス・マンティコア',
        'Deep Palace Persona': 'ディープパレス・ペルソナ',
        'Deep Palace Succubus': 'ディープパレス・サキュバス',
        'Deep Palace Wraith': 'ディープパレス・レイス',
        'Onyx Dragon': 'オニキスドラゴン',
        'Tisiphone': 'ティーシポネー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Deep Palace Bhoot': '深宫浮灵',
        'Deep Palace Manticore': '深宫曼提克',
        'Deep Palace Persona': '深宫假面',
        'Deep Palace Succubus': '深宫梦魔',
        'Deep Palace Wraith': '深宫幽灵',
        'Onyx Dragon': '奥尼克斯龙',
        'Tisiphone': '提西福涅',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Deep Palace Bhoot': '깊은 궁전 브후트',
        'Deep Palace Manticore': '깊은 궁전 만티코어',
        'Deep Palace Persona': '깊은 궁전 페르소나',
        'Deep Palace Succubus': '깊은 궁전 서큐버스',
        'Deep Palace Wraith': '깊은 궁전 망령',
        'Onyx Dragon': '줄마노 드래곤',
        'Tisiphone': '티시포네',
      },
    },
  ],
});
