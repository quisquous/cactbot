Options.Triggers.push({
  zoneId: ZoneId.AbyssosTheFifthCircle,
  timelineFile: 'p5n.txt',
  initData: () => {
    return {
      topazRayDirections: [undefined, undefined],
    };
  },
  triggers: [
    {
      id: 'P5N Searing Ray',
      type: 'StartsUsing',
      netRegex: { id: '76D7', source: 'Proto-Carbuncle', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'P5N Searing Ray Reflected',
      type: 'StartsUsing',
      netRegex: { id: '76D8', source: 'Proto-Carbuncle', capture: false },
      alertText: (data, _matches, output) => {
        if (data.acid && data.numStones)
          return output.goFrontAvoid();
        return output.goFront();
      },
      outputStrings: {
        goFront: Outputs.goFront,
        goFrontAvoid: {
          en: 'Go Front (avoid puddle)',
          de: 'Geh nach Vorne (weiche Flächen aus)',
          fr: 'Allez devant (Évitez les zones au sol)',
          ja: '前へ (ゆか回避)',
          ko: '보스 앞으로 (장판 피하기)',
        },
      },
    },
    {
      id: 'P5N Ruby Glow',
      type: 'StartsUsing',
      netRegex: { id: '76D[45]', source: 'Proto-Carbuncle', capture: false },
      suppressSeconds: 1,
      response: Responses.aoe(),
    },
    {
      id: 'P5N Crunch',
      type: 'StartsUsing',
      netRegex: { id: '76F0', source: 'Proto-Carbuncle' },
      response: Responses.tankBuster(),
    },
    {
      id: 'P5N Topaz Stones Collect',
      type: 'StartsUsing',
      netRegex: { id: '76DF', source: 'Proto-Carbuncle', capture: false },
      preRun: (data) => data.numStones = (data.numStones || 0) + 1,
    },
    {
      id: 'P5N Topaz Stones',
      type: 'Ability',
      netRegex: { id: '76DE', source: 'Proto-Carbuncle', capture: false },
      infoText: (data, _matches, output) => {
        if (!data.seenStones || !data.numStones)
          return; // First time is just floor AoEs
        if (data.numStones === 2) {
          if (data.acid)
            return; // Handled in Searing Ray Reflected
          return output.getInEmptyTile();
        }
        if (data.numStones < 4)
          return output.getInEmptyTile();
        return output.moveAway();
      },
      run: (data) => data.seenStones = true,
      outputStrings: {
        getInEmptyTile: {
          en: 'Get in empty tile (no stones)',
          de: 'Geh ins leere Feld (ohne Stein)',
          fr: 'Allez dans une case vide (sans pierres)',
          ja: '石がないマスへ',
          ko: '돌이 없는 빈 칸으로',
        },
        moveAway: {
          en: 'Move away from puddles',
          de: 'Geh weg von den Flächen',
          fr: 'Éloignez-vous des zones au sol',
          ja: 'ゆかから離れる',
          ko: '장판으로부터 멀리 떨어지기',
        },
      },
    },
    {
      // Delay cleanup for a while for Topaz Stone + Searing Ray combo
      id: 'P5N Topaz Stones Cleanup',
      type: 'Ability',
      netRegex: { id: '76DE', source: 'Proto-Carbuncle', capture: false },
      delaySeconds: 9,
      run: (data) => data.numStones = 0,
    },
    {
      id: 'P5N Topaz Cluster',
      type: 'StartsUsing',
      // 76E[7-A] are casts from the Topaz Stone placeholders
      // 76E7 is 3.7s, 76EA is 9.7s
      // Callout will call to start at 76EA -> move to 76E7
      netRegex: { id: '76E[7A]', source: 'Proto-Carbuncle' },
      durationSeconds: 7,
      infoText: (data, matches, output) => {
        // Coordinates range from [92.5, 107.5]
        // Map to [-1, 1]
        const x = Math.round((parseFloat(matches.x) - 100) / 7.5);
        const y = Math.round((parseFloat(matches.y) - 100) / 7.5);
        const directions = {
          '0,1': 'dirSW',
          '1,0': 'dirSE',
          '0,-1': 'dirNE',
          '-1,0': 'dirNW',
        };
        const direction = directions[`${x},${y}`];
        if (!direction)
          return;
        if (matches.id === '76E7')
          data.topazRayDirections[0] = direction;
        if (matches.id === '76EA')
          data.topazRayDirections[1] = direction;
        if (!data.topazRayDirections[0] || !data.topazRayDirections[1])
          return;
        const dir0Str = output[data.topazRayDirections[0]]();
        const dir1Str = output[data.topazRayDirections[1]]();
        return output.text({ start: dir1Str, end: dir0Str });
      },
      outputStrings: {
        dirSW: Outputs.dirSW,
        dirSE: Outputs.dirSE,
        dirNE: Outputs.dirNE,
        dirNW: Outputs.dirNW,
        text: {
          en: 'start at ${start} -> move to ${end}',
          de: 'Starte im ${start} -> Bewegen nach ${end}',
          fr: 'Commencez à ${start} -> allez vers ${end}',
          ja: '${start}から -> ${end}へ移動',
          ko: '${start}쪽에서 시작 -> ${end}쪽으로 이동',
        },
      },
    },
    {
      id: 'P5N Topaz Cluster Cleanup',
      type: 'Ability',
      // 76E6 comes from the main Proto-Carbuncle
      netRegex: { id: '76E6', source: 'Proto-Carbuncle', capture: false },
      run: (data) => data.topazRayDirections = [undefined, undefined],
    },
    {
      id: 'P5N Sonic Howl',
      type: 'StartsUsing',
      netRegex: { id: '76F2', source: 'Proto-Carbuncle', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P5N Acidic Slaver',
      type: 'StartsUsing',
      netRegex: { id: '78EB', source: 'Proto-Carbuncle', capture: false },
      run: (data) => data.acid = true,
    },
    {
      id: 'P5N Toxic Crunch',
      type: 'StartsUsing',
      netRegex: { id: '76F1', source: 'Proto-Carbuncle' },
      response: Responses.tankBuster(),
    },
    {
      id: 'P5N Venom Rain',
      type: 'HeadMarker',
      netRegex: { id: '0178' },
      condition: Conditions.targetIsYou(),
      response: Responses.spread(),
    },
    {
      id: 'P5N Venom Pool',
      type: 'HeadMarker',
      netRegex: { id: '0064' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'P5N Starving Stampede',
      type: 'StartsUsing',
      netRegex: { id: '79E9', source: 'Proto-Carbuncle', capture: false },
      delaySeconds: 2,
      durationSeconds: 5,
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Start in middle -> move to first jump',
          de: 'Starte in der Mitte -> zum ersten Sprung bewegen',
          fr: 'Démarrez au milieu -> allez vers le 1er saut',
          ja: '真ん中 -> 1回目のジャンプへ',
          ko: '중앙으로 => 첫번째 점프한 곳으로',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Proto-Carbuncle': 'Proto-Karfunkel',
      },
      'replaceText': {
        '(?<!Toxic )Crunch': 'Quetscher',
        'Ruby Glow': 'Rubinlicht',
        'Searing Ray': 'Sengender Strahl',
        'Sonic Howl': 'Schallheuler',
        'Starving Stampede': 'Hungerstampede',
        'Topaz Cluster': 'Topasbündel',
        'Topaz Stones': 'Topasstein',
        'Toxic Crunch': 'Giftquetscher',
        'Venom Pool': 'Giftschwall',
        'Venom Rain': 'Giftregen',
        'Venom Squall': 'Giftwelle',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Proto-Carbuncle': 'Proto-Carbuncle',
      },
      'replaceText': {
        '(?<!Toxic )Crunch': 'Croqueur',
        'Ruby Glow': 'Lumière rubis',
        'Searing Ray': 'Rayon irradiant',
        'Sonic Howl': 'Hurlement sonique',
        'Starving Stampede': 'Charge affamée',
        'Topaz Cluster': 'Chaîne de topazes',
        'Topaz Stones': 'Topazes',
        'Toxic Crunch': 'Croqueur venimeux',
        'Venom Pool': 'Giclée de venin',
        'Venom Rain': 'Pluie de venin',
        'Venom Squall': 'Crachat de venin',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Proto-Carbuncle': 'プロトカーバンクル',
      },
      'replaceText': {
        '(?<!Toxic )Crunch': 'クランチ',
        'Ruby Glow': 'ルビーの光',
        'Searing Ray': 'シアリングレイ',
        'Sonic Howl': 'ソニックハウル',
        'Starving Stampede': 'スターヴィング・スタンピード',
        'Topaz Cluster': 'トパーズクラスター',
        'Topaz Stones': 'トパーズストーン',
        'Toxic Crunch': 'ベノムクランチ',
        'Venom Pool': 'ベノムスプラッシュ',
        'Venom Rain': 'ベノムレイン',
        'Venom Squall': 'ベノムスコール',
      },
    },
  ],
});
