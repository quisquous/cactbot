Options.Triggers.push({
  zoneId: ZoneId.StormsCrownExtreme,
  timelineFile: 'barbariccia-ex.txt',
  initData: () => {
    return {
      boldBoulderTargets: [],
      hairFlayUpbraidTargets: [],
    };
  },
  timelineTriggers: [
    {
      id: 'BarbaricciaEx Knuckle Drum',
      regex: /Knuckle Drum/,
      beforeSeconds: 5,
      response: Responses.bigAoe(),
    },
    {
      id: 'BarbaricciaEx Blow Away',
      regex: /Blow Away/,
      beforeSeconds: 5,
      response: Responses.getTogether('info'),
    },
  ],
  triggers: [
    {
      id: 'BarbaricciaEx Void Aero IV',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7570', source: 'Barbariccia', capture: false }),
      response: Responses.aoe(),
    },
    {
      // Savage Barbery has 3 casts that all start at the same time.
      // 5.7 duration: 7464, 7465, 7466, 7489, 748B, 7573 (all actual cast bar, unknown how to differentiate)
      // 6.7 duration: 7574 (donut), 757A (line)
      // 8.8 duration: 7575 (out, paired with donut), 757B (out, paired with line)
      id: 'BarbaricciaEx Savage Barbery Donut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7574', source: 'Barbariccia', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'BarbaricciaEx Savage Barbery Line',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '757A', source: 'Barbariccia', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Out and Away',
          de: 'Raus und Weg',
          fr: 'Extérieur et derrière',
          ja: '外へ',
          ko: '밖으로',
        },
      },
    },
    {
      // Hair Raid has 2 casts that start at the same time, then a slight delay for stack/spread.
      // 5.7 duration: 757C (wall), 757E (donut)
      // 7.7 duration: 757D (paired with wall), 757F (paired with donut)
      //
      // ~2.2s delay, and then:
      // 7.7 duration (Hair Spray): 75A6
      // 7.7 duration (Deadly Twist): 75A7
      id: 'BarbaricciaEx Hair Raid Donut',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '757E', source: 'Barbariccia', capture: false }),
      response: Responses.getIn(),
    },
    {
      id: 'BarbaricciaEx Hair Raid Wall',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '757C', source: 'Barbariccia', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Wall',
          de: 'Wand',
          fr: 'Mur',
          ja: '壁へ',
          ko: '벽으로',
        },
      },
    },
    {
      id: 'BarbaricciaEx Hair Spray',
      type: 'StartsUsing',
      // This spread mechanic is used later in other phases of the fight as well.
      netRegex: NetRegexes.startsUsing({ id: '75A6', source: 'Barbariccia', capture: false }),
      suppressSeconds: 1,
      response: Responses.spread(),
    },
    {
      id: 'BarbaricciaEx Deadly Twist',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75A7', source: 'Barbariccia', capture: false }),
      suppressSeconds: 2,
      infoText: (_data, _matches, output) => output.groups(),
      outputStrings: {
        groups: {
          en: 'Healer Groups',
          de: 'Heiler-Gruppen',
          fr: 'Groupes sur les heals',
          ja: 'ヒラに頭割り',
          cn: '与治疗分摊',
          ko: '힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'BarbaricciaEx Void Aero III',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7571', source: 'Barbariccia' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'BarbaricciaEx Secret Breeze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7580', source: 'Barbariccia', capture: false }),
      durationSeconds: 3,
      alertText: (_data, _matches, output) => output.protean(),
      outputStrings: {
        protean: {
          en: 'Protean',
          de: 'Himmelsrichtungen',
          fr: 'Positions',
          ja: '8方向散開',
          cn: '八方位站位',
          ko: '정해진 위치로 산개',
        },
      },
    },
    {
      id: 'BarbaricciaEx Boulder Break',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7383', source: 'Barbariccia' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'BarbaricciaEx Brittle Boulder',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker({ id: '016D', capture: false }),
      suppressSeconds: 2,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Middle => Out (Spread)',
          de: 'In der Mitte Ködern => Raus (verteilen)',
          fr: 'Posez au centre -> Écartez-vous à l\'extérieur',
          ja: '真ん中で誘導 => 8方向散開',
          cn: '中间集合然后八方分散',
          ko: '중앙에 장판 유도 => 밖으로 산개',
        },
      },
    },
    {
      // These also favor a certain order of Tank/Healer for first set then DPS second set,
      // but if people are dead anybody can get these.
      id: 'BarbaricciaEx Brutal Rush',
      type: 'Tether',
      netRegex: NetRegexes.tether({ id: '0011' }),
      condition: (data, matches) => matches.source === data.me,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Brutal Rush tether on You',
          de: 'Grausame Hatz Verbindung auf DIR',
          fr: 'Lien de Ruée brutale sur VOUS',
          ja: '自分に突進',
          cn: '拳击点名',
          ko: '나에게 선 연결',
        },
      },
    },
    {
      id: 'BarbaricciaEx Brutal Rush Move',
      type: 'Ability',
      // When the Brutal Rush hits you, the follow-up Brutal Gust has locked in.
      netRegex: NetRegexes.ability({ id: '7583', source: 'Barbariccia' }),
      condition: Conditions.targetIsYou(),
      response: Responses.moveAway(),
    },
    {
      id: 'BarbaricciaEx Hair Flay',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7413', source: 'Barbariccia' }),
      alertText: (data, matches, output) => {
        data.hairFlayUpbraidTargets.push(matches.target);
        if (data.me === matches.target)
          return output.spread();
      },
      outputStrings: {
        spread: Outputs.spread,
      },
    },
    {
      id: 'BarbaricciaEx Upbraid',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75A8', source: 'Barbariccia' }),
      alertText: (data, matches, output) => {
        data.hairFlayUpbraidTargets.push(matches.target);
        if (data.me === matches.target)
          return output.partnerStack();
      },
      outputStrings: {
        partnerStack: {
          en: 'Partner Stack',
          de: 'Mit Partner sammeln',
          fr: 'Package partenaire',
          ja: '2人で頭割り',
          ko: '2인 쉐어',
        },
      },
    },
    {
      id: 'BarbaricciaEx Upbraid Untargeted',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75A8', source: 'Barbariccia', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 2,
      alertText: (data, _matches, output) => {
        if (data.hairFlayUpbraidTargets.includes(data.me))
          return;
        return output.partnerStack();
      },
      run: (data) => data.hairFlayUpbraidTargets = [],
      outputStrings: {
        partnerStack: {
          en: 'Partner Stack (unmarked)',
          de: 'Mit Partner sammeln (nicht markiert)',
          fr: 'Package partenaire (sans marque)',
          ja: '2人で頭割り (マーカーなし)',
          ko: '2인 쉐어 (징 없음)',
        },
      },
    },
    {
      id: 'BarbaricciaEx Bold Boulder',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '759B', source: 'Barbariccia' }),
      infoText: (data, matches, output) => {
        data.boldBoulderTargets.push(matches.target);
        if (data.me === matches.target)
          return output.flareOnYou();
      },
      outputStrings: {
        flareOnYou: {
          en: 'Flare on YOU',
          de: 'Flare auf DIR',
          fr: 'Brasier sur VOUS',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
      },
    },
    {
      id: 'BarbaricciaEx Trample',
      type: 'StartsUsing',
      // There's no castbar for Trample, so use Bold Boulder and collect flares.
      // There's also an 0064 stack headmarker, but that's used elsewhere.
      netRegex: NetRegexes.startsUsing({ id: '759B', source: 'Barbariccia', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 1,
      // info to match spread and flare to not conflict during knockback
      infoText: (data, _matches, output) => {
        if (data.boldBoulderTargets.includes(data.me))
          return;
        return output.stackMarker();
      },
      run: (data) => data.boldBoulderTargets = [],
      outputStrings: {
        stackMarker: Outputs.stackMarker,
      },
    },
    {
      id: 'BarbaricciaEx Impact',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '75A0', source: 'Barbariccia' }),
      // Could also have used 75A1, full cast time is 5.9s
      delaySeconds: (_data, matches) => parseFloat(matches.castTime) - 5,
      response: Responses.knockback(),
    },
    {
      id: 'BarbaricciaEx Playstation Hair Chains',
      type: 'HeadMarker',
      netRegex: NetRegexes.headMarker(),
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        switch (matches.id) {
          case '016F':
            return output.circle();
          case '0170':
            return output.triangle();
          case '0171':
            return output.square();
          case '0172':
            return output.cross();
        }
      },
      outputStrings: {
        circle: {
          en: 'Red Circle',
          de: 'Roter Kreis',
          fr: 'Cercle rouge',
          ja: '赤まる',
          cn: '红圈',
          ko: '빨강 동그라미',
        },
        triangle: {
          en: 'Green Triangle',
          de: 'Grünes Dreieck',
          fr: 'Triangle vert',
          ja: '緑さんかく',
          cn: '绿三角',
          ko: '초록 삼각',
        },
        square: {
          en: 'Purple Square',
          de: 'Lilanes Viereck',
          fr: 'Carré violet',
          ja: '紫しかく',
          cn: '紫方块',
          ko: '보라 사각',
        },
        cross: {
          en: 'Blue X',
          de: 'Blaues X',
          fr: 'Croix bleue',
          ja: '青バツ',
          cn: '蓝叉',
          ko: '파랑 X',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Barbariccia': 'Barbarizia',
        'Stiff Breeze': 'Föhn',
      },
      'replaceText': {
        'ground': 'Boden',
        'line': 'Linie',
        'donut': 'Donut',
        'protean': 'Himmelsrichtungen',
        'Blow Away': 'Hauerwelle',
        'Blustery Ruler': 'Tosende Herrin',
        'Bold Boulder': 'Feister Fels',
        '(?<!(Brittle|Bold) )Boulder(?! Break)': 'Fels',
        'Boulder Break': 'Felsbruch',
        'Brittle Boulder': 'Feiner Fels',
        'Brush with Death': 'Haaresbreite',
        'Brutal Gust': 'Grausame Bö',
        'Brutal Rush': 'Grausame Hatz',
        'Catabasis': 'Katabasis',
        'Curling Iron': 'In Schale',
        'Deadly Twist': 'Flechtfolter',
        'Dry Blows': 'Haue',
        'Entanglement': 'Fesselnde Strähnen',
        'Fetters': 'Fesselung',
        'Hair Raid': 'Haarstreich',
        'Hair Spray': 'Wildwuchs',
        'Impact': 'Impakt',
        'Iron Out': 'Coiffure',
        'Knuckle Drum': 'Kahlhieb',
        'Maelstrom': 'Charybdis',
        'Raging Storm': 'Tobender Sturm',
        'Savage Barbery': 'Brutale Barbierei',
        'Secret Breeze': 'Heimlicher Hauch',
        '(?<!(Teasing |En))Tangle': 'Strähne',
        'Teasing Tangles': 'Sinistre Strähnen',
        'Tornado Chain': 'Kettenorkan',
        'Tousle': 'Föhn',
        'Trample': 'Trampeln',
        'Upbraid': 'Sturmfrisur',
        'Void Aero III': 'Nichts-Windga',
        'Void Aero IV': 'Nichts-Windka',
        'Voidstrom': 'Nichtssturm',
        'Winding Gale': 'Windende Winde',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Barbariccia': 'Barbariccia',
        'Stiff Breeze': 'rafale de vent',
      },
      'replaceText': {
        'Blow Away': 'Coups convulsifs',
        'Blustery Ruler': 'Despote venteux',
        'Bold Boulder': 'Grand conglomérat',
        '(?<!(Brittle|Bold) )Boulder(?! Break)': 'Conglomérat',
        'Boulder Break': 'Conglomérat pesant',
        'Brittle Boulder': 'Petit conglomérat',
        'Brush with Death': 'Brossage mortel',
        'Brutal Gust': 'Rafale brutale',
        'Brutal Rush': 'Ruée brutale',
        'Catabasis': 'Catabase',
        'Curling Iron': 'Boucle de fer',
        'Deadly Twist': 'Nœud fatal',
        'Dry Blows': 'Coups secs',
        'Entanglement': 'Enchevêtrement',
        'Fetters': 'Attache',
        'Hair Raid': 'Raid capillaire',
        'Hair Spray': 'Tresse laquée',
        'Impact': 'Impact',
        'Iron Out': 'Repassage capillaire',
        'Knuckle Drum': 'Batterie de poings',
        'Maelstrom': 'Charybde',
        'Raging Storm': 'Tempête enragée',
        'Savage Barbery': 'Barbarie sauvage',
        'Secret Breeze': 'Brise secrète',
        '(?<!(Teasing |En))Tangle': 'Emmêlement',
        'Teasing Tangles': 'Emmêlement railleur',
        'Tornado Chain': 'Chaîne de tornades',
        'Tousle': 'Ébourrifage',
        'Trample': 'Martèlement',
        'Upbraid': 'Natte sermonneuse',
        'Void Aero III': 'Méga Vent du néant',
        'Void Aero IV': 'Giga Vent du néant',
        'Voidstrom': 'Tempête du néant',
        'Winding Gale': 'Vent sinueux',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Barbariccia': 'バルバリシア',
        'Stiff Breeze': '荒風',
      },
      'replaceText': {
        'Blow Away': '拳震動地',
        'Blustery Ruler': 'ブロウルーラー',
        'Bold Boulder': '大岩礫',
        '(?<!(Brittle|Bold) )Boulder(?! Break)': '岩礫',
        'Boulder Break': '重岩礫',
        'Brittle Boulder': '小岩礫',
        'Brush with Death': '呪髪操作',
        'Brutal Gust': 'ブルータルガスト',
        'Brutal Rush': 'ブルータルラッシュ',
        'Catabasis': 'カタバシス',
        'Curling Iron': '呪髪装衣',
        'Deadly Twist': '呪髪穿',
        'Dry Blows': '拳震',
        'Entanglement': '呪髪呪縛',
        'Fetters': '拘束',
        'Hair Raid': 'ヘアレイド',
        'Hair Spray': '呪髪針',
        'Impact': '衝撃',
        'Iron Out': '髪衣還元',
        'Knuckle Drum': 'ナックルビート',
        'Maelstrom': 'ミールストーム',
        'Raging Storm': 'レイジングストーム',
        'Savage Barbery': 'サベッジバルバリー',
        'Secret Breeze': 'シークレットブリーズ',
        '(?<!(Teasing |En))Tangle': '呪髪',
        'Teasing Tangles': '呪髪拘束',
        'Tornado Chain': 'チェイントルネード',
        'Tousle': '荒風',
        'Trample': '踏みつけ',
        'Upbraid': '呪髪嵐',
        'Void Aero III': 'ヴォイド・エアロガ',
        'Void Aero IV': 'ヴォイド・エアロジャ',
        'Voidstrom': 'ヴォイドストーム',
        'Winding Gale': 'ウィンディングゲイル',
      },
    },
  ],
});
