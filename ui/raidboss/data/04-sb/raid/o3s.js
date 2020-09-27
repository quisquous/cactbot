'use strict';

// O3S - Deltascape 3.0 Savage
[{
  zoneId: ZoneId.DeltascapeV30Savage,
  timelineNeedsFixing: true,
  timelineFile: 'o3s.txt',
  triggers: [
    {
      id: 'O3S Phase Counter',
      netRegex: NetRegexes.startsUsing({ id: '2304', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2304', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2304', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2304', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2304', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2304', source: '할리카르나소스', capture: false }),
      run: function(data) {
        data.phase = (data.phase || 0) + 1;
        delete data.seenHolyThisPhase;
      },
    },
    {
      // Look for spellblade holy so that the last noisy waltz
      // books message in the library phase can be ignored.
      id: 'O3S Spellblade Holy Counter',
      netRegex: NetRegexes.ability({ id: '22EF', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '22EF', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '22EF', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '22EF', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '22EF', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '22EF', source: '할리카르나소스', capture: false }),
      run: function(data) {
        // In case something went awry, clean up any holy targets
        // so the next spellblade holy can start afresh.
        delete data.holyTargets;
        data.seenHolyThisPhase = true;
      },
    },
    {
      // Normal spellblade holy with tethers and one stack point.
      // "64" is a stack marker.  "65" is the prey marker.
      // The debuff order in the logs is:
      //   (1) stack marker (tethered to #2)
      //   (2) prey marker (tethered to #1)
      //   (3) prey marker (tethered to #4)
      //   (4) prey marker (tethered to #3)
      // So, #2 is the person everybody should stack on.
      id: 'O3S Spellblade Holy',
      netRegex: NetRegexes.headMarker({ id: ['0064', '0065'] }),
      condition: function(data, matches) {
        // Library phase stack markers behave differently.
        if (data.phase == 3)
          return false;

        data.holyTargets = data.holyTargets || [];
        data.holyTargets.push(matches.target);
        return data.holyTargets.length == 4;
      },
      alarmText: function(data) {
        if (data.holyTargets[1] != data.me)
          return '';
        return {
          en: 'Stack on YOU',
          de: 'Stack auf DIR',
          ja: '自分に頭割り',
          cn: '分摊点名',
        };
      },
      alertText: function(data) {
        if (data.holyTargets[1] == data.me)
          return;

        for (let i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'Get out',
              de: 'Raus da',
              ja: '出て',
              cn: '出去',
            };
          }
        }
        return {
          en: 'Stack on ' + data.holyTargets[1],
          de: 'Stack auf ' + data.holyTargets[1],
          ja: data.holyTargets[1] + 'に頭割り',
          cn: '分摊' + data.holyTargets[1],
        };
      },
      infoText: function(data) {
        for (let i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'others stack on ' + data.holyTargets[1],
              de: 'andere stacken auf ' + data.holyTargets[1],
              ja: '他は' + data.holyTargets[1] + 'に頭割り',
              cn: '其他分摊' + data.holyTargets[1],
            };
          }
        }
      },
      tts: function(data) {
        if (data.holyTargets[1] == data.me) {
          return {
            en: 'stack on you',
            de: 'stack auf dir',
            ja: '自分に頭割り',
            cn: '分摊点名',
          };
        }
        for (let i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'get out',
              de: 'raus da',
              ja: '出ていて',
              cn: '出去',
            };
          }
        }
        return {
          en: 'stack on ' + data.holyTargets[1],
          de: 'stack auf ' + data.holyTargets[1],
          ja: data.holyTargets[1] + 'に頭割り',
          cn: '分摊' + data.holyTargets[1],
        };
      },
      run: function(data) {
        delete data.holyTargets;
      },
    },
    {
      // Library phase spellblade holy with 2 stacks / 4 preys / 2 unmarked.
      id: 'O3S Library Spellblade',
      netRegex: NetRegexes.headMarker({ id: ['0064', '0065'] }),
      condition: function(data, matches) {
        // This is only for library phase.
        if (data.phase != 3)
          return false;

        if (matches.target == data.me)
          data.librarySpellbladeMe = matches.id;

        return true;
      },
      // Because people can be dead and there are eight marks, delay to
      // accumulate logs instead of counting marks.  Instantly print if
      // anything is on you.  The 6 triggers will all have condition=true
      // and run, but only the first one will print.
      delaySeconds: function(data, matches) {
        return matches.target == data.me ? 0 : 0.5;
      },
      alertText: function(data) {
        if (data.librarySpellbladePrinted)
          return;

        data.librarySpellbladePrinted = true;
        if (data.librarySpellbladeMe == '0064') {
          return {
            en: 'Go south: stack on YOU',
            de: 'Nach Süden: stack auf DIR',
            ja: '南へ: 自分に頭割り',
            cn: '去南边分摊点名',
          };
        }
        if (data.librarySpellbladeMe == '0065') {
          return {
            en: 'go north',
            de: 'nach norden',
            ja: '南へ',
            cn: '去南边',
          };
        }
        return {
          en: 'go south: stack on friend',
          de: 'nach süden: stack auf freund',
          ja: '南へ: 頭割り',
          cn: '去南边分摊',
        };
      },
      tts: function(data) {
        if (data.librarySpellbladePrinted)
          return;

        data.librarySpellbladePrinted = true;
        if (data.librarySpellbladeMe == '0064') {
          return {
            en: 'stack outside',
            de: 'außen stacken',
            ja: '外へ: 頭割り',
            cn: '去外面分摊',
          };
        }
        if (data.librarySpellbladeMe == '0065') {
          return {
            en: 'go north',
            de: 'nach norden',
            ja: '南へ',
            cn: '去南边',
          };
        }
        return {
          en: 'stack inside',
          de: 'innen stacken',
          ja: '中へ: 頭割り',
          cn: '去里面分摊',
        };
      },
    },
    {
      id: 'O3S Right Face',
      netRegex: NetRegexes.gainsEffect({ effectId: '510' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Right',
        de: 'Geistlenkung: Rechts',
        ja: 'マインドジャック: 右折',
        cn: '右',
      },
    },
    {
      id: 'O3S Forward March',
      netRegex: NetRegexes.gainsEffect({ effectId: '50D' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Forward',
        de: 'Geistlenkung: Vorwärts',
        ja: 'マインドジャック: 前進',
        cn: '前',
      },
    },
    {
      id: 'O3S Left Face',
      netRegex: NetRegexes.gainsEffect({ effectId: '50F' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Left',
        de: 'Geistlenkung: Links',
        ja: 'マインドジャック: 左折',
        cn: '左',
      },
    },
    {
      id: 'O3S About Face',
      netRegex: NetRegexes.gainsEffect({ effectId: '50E' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Back',
        de: 'Geistlenkung: Zurück',
        ja: 'マインドジャック: 後退',
        cn: '后',
      },
    },
    {
      id: 'O3S Ribbit',
      netRegex: NetRegexes.startsUsing({ id: '22F7', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '22F7', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '22F7', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '22F7', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '22F7', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '22F7', source: '할리카르나소스', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'O3S Oink',
      netRegex: NetRegexes.startsUsing({ id: '22F9', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '22F9', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '22F9', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '22F9', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '22F9', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '22F9', source: '할리카르나소스', capture: false }),
      response: Responses.stack(),
    },
    {
      id: 'O3S Squelch',
      netRegex: NetRegexes.startsUsing({ id: '22F8', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '22F8', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '22F8', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '22F8', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '22F8', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '22F8', source: '할리카르나소스', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'O3S The Queen\'s Waltz: Books',
      netRegex: NetRegexes.startsUsing({ id: '230E', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '230E', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '230E', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '230E', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '230E', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '230E', source: '할리카르나소스', capture: false }),
      condition: function(data) {
        // Deliberately skip printing the waltz message for the
        // spellblade holy -> waltz that ends the library phase.
        return data.phase != 3 || !data.seenHolyThisPhase;
      },
      alertText: {
        en: 'The Queen\'s Waltz: Books',
        de: 'Tanz der Königin: Bücher',
        ja: '女王の舞い: 本',
        cn: '中间两排分格站位',
      },
      tts: {
        en: 'books',
        de: 'bücher',
        ja: '本',
        cn: '书',
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Clock',
      netRegex: NetRegexes.startsUsing({ id: '2306', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2306', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2306', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2306', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2306', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2306', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'The Queen\'s Waltz: Clock',
        de: 'Tanz der Königin: Uhr',
        ja: '女王の舞い: 散開',
        cn: '万变水波站位',
      },
      tts: {
        en: 'clock',
        de: 'uhr',
        ja: '散開',
        cn: '万变水波',
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Crystal Square',
      netRegex: NetRegexes.startsUsing({ id: '230A', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '230A', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '230A', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '230A', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '230A', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '230A', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'The Queen\'s Waltz: Crystal Square',
        de: 'Tanz der Königin: Kristallfeld',
        ja: '女王の舞い: 床',
        cn: '站在蓝地板',
      },
      tts: {
        en: 'blue square',
        de: 'blaues feld',
        ja: '青い床',
        cn: '蓝地板',
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Tethers',
      netRegex: NetRegexes.startsUsing({ id: '2308', source: 'Halicarnassus', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '2308', source: 'Halikarnassos', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '2308', source: 'Halicarnasse', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '2308', source: 'ハリカルナッソス', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '2308', source: '哈利卡纳苏斯', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '2308', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'The Queen\'s Waltz: Tethers',
        de: 'Tanz der Königin: Ranken',
        ja: '女王の舞い: 茨',
        cn: '先集中后扯线',
      },
      tts: {
        en: 'tethers',
        de: 'ranken',
        ja: '茨を引く',
        cn: '扯线',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Halicarnassus': 'Halikarnassos',
      },
      'replaceText': {
        '--Apanda Spawns--': '--Apanda erscheint--',
        '--Great Dragon Spawns--': '--Riesendrache erscheint--',
        '--Ninjas \\+ Giant Spawn--': '--Ninjas + Riese erscheint--',
        '--White Flame Spawns--': '--weiße Flamme erscheint--',
        'Blizzard': 'Eis',
        'Books': 'Bücher',
        'Clock': 'Positions',
        'Critical Hit': 'Kritischer Treffer',
        'Crystals': 'Kristalle',
        'DPS Morph': 'DPS-Verwandlung',
        'Dimensional Wave': 'Dimensionswelle',
        'Dragon Conal AoE': 'Drachen-Kegel-AoE',
        'Fire': 'Feuer',
        'Haste': 'Hast',
        'Healers Morph': 'Heiler-Verwandlung',
        'Magic Hammer': 'Zauberhammer',
        'Mindjack': 'Geistlenkung',
        'Oink': 'Quiiiek',
        'Panel Swap': 'Neuaufstellung',
        'Place Dark Token': 'Todesspielstein',
        'Place Token': 'Spielstein',
        'Random Elemental': 'Zufälliges Elementar',
        'Ribbit': 'Quaaak',
        'Spellblade Holy': 'Magieklinge Sanctus',
        'Squelch': 'Gurrr',
        'Tanks Morph': 'Tank-Verwandlung',
        'Tethers': 'Verbindungen',
        'The Game': 'Spielbeginn',
        'The Playing Field': 'Spielfeld',
        '(The )?Queen\'s Waltz': 'Tanz Der Königin',
        'Thunder': 'Blitz',
        'Ultimate': 'Ultimatum',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Halicarnassus': 'Halicarnasse',
      },
      'replaceText': {
        'Blizzard': 'Glace',
        'Critical Hit': 'Attaque critique',
        'Dimensional Wave': 'Onde dimensionnelle',
        'Fire': 'Feu',
        'Haste': 'Hâte',
        'Magic Hammer': 'Marteau magique',
        'Mindjack': 'Contrainte mentale',
        'Oink': 'Abracadabri',
        'Panel Swap': 'Remplacement des cases',
        'Place Dark Token': 'Pions obscurs en jeu',
        'Place Token': 'Pion en jeu',
        'Ribbit': 'Coâââ',
        'Spellblade Holy': 'Magilame Miracle',
        'Squelch': 'Abracadabra',
        'The Game': 'Début de partie',
        'The Playing Field': 'Plateau de jeu',
        '(The )?Queen\'s Waltz': 'Danse de la reine',
        'Thunder': 'Foudre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Halicarnassus': 'ハリカルナッソス',
      },
      'replaceText': {
        '--Apanda Spawns--': '--雑魚: アパンダ--',
        '--Great Dragon Spawns--': '--雑魚: ドラゴン--',
        '--Ninjas \\+ Giant Spawn--': '--雑魚: ニンジャ + 鉄巨人--',
        '--White Flame Spawns--': '--雑魚: ホワイトフレイム--',
        '(?<=\\()Apanda(?=\\))': 'アパンダ',
        'Blizzard': 'ブリザド',
        'Books': '本',
        'Clock': '散開',
        'Critical Hit': 'クリティカル',
        'Crystals': '床',
        'DPS Morph': '受け持ち: DPSの番',
        'Dimensional Wave': '次元波動',
        'Dragon Conal AoE': 'ドラゴン フロストバイト',
        'Fire': 'ファイア',
        'Haste': 'ヘイスト',
        'Healers Morph': '受け持ち: ヒーラーの番',
        'Magic Hammer': 'マジックハンマー',
        'Mindjack': 'マインドジャック',
        'Ninjas/Giant': 'ニンジャ / 鉄巨人',
        'Oink': 'ポルルルル！',
        'Panel Swap': 'パネルシャッフル',
        'Place Dark Token': 'サモンデストークン',
        'Place Token': 'サモントークン',
        '(?<=\\()Random(?=\\))': 'ランダム',
        'Random Elemental': '魔法剣 (ランダム)',
        'Ribbit': 'クルルルル！',
        'Spellblade Holy': '魔法剣ホーリー',
        'Squelch': 'カルルルル！',
        'Tanks Morph': '受け持ち: タンクの番',
        'Tethers': '茨',
        'The Game': 'ゲームスタート',
        'The Playing Field': 'ゲームボード',
        '(The )?Queen\'s Waltz': '女王の舞い',
        'Thunder': 'サンダー',
        'Ultimate': 'アルテマ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Halicarnassus': '哈利卡纳苏斯',
      },
      'replaceText': {
        '--Apanda Spawns--': '--阿班达出现--',
        '--Great Dragon Spawns--': '--巨龙出现--',
        '--Ninjas \\+ Giant Spawn--': '--忍者 + 巨人出现--',
        '--White Flame Spawns--': '--白焰出现--',
        'Blizzard': '冰结',
        'Critical Hit': '暴击',
        'DPS Morph': 'DPS变形',
        'Dimensional Wave': '次元波动',
        'Dragon Conal AoE': '龙圆锥AOE',
        'Fire': '火炎',
        'Haste': '加速',
        'Healers Morph': '治疗变形',
        'Magic Hammer': '魔法锤',
        'Mindjack': '精神控制',
        'Oink': '哼哼哼哼哼！',
        'Panel Swap': '刷新盘面',
        'Place Dark Token': '召唤死形',
        'Place Token': '召唤魔形',
        '(The )?Queen\'s Waltz': '女王之舞',
        'Random Elemental': '随机元灵',
        'Ribbit': '呱呱呱呱呱！',
        'Spellblade Holy': '魔法剑·神圣',
        'Squelch': '喀喀喀喀喀！',
        'Tanks Morph': '坦克变形',
        'Tethers': '连线',
        'The Game': '游戏开始',
        'The Playing Field': '游戏盘面',
        'Thunder': '闪雷',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Halicarnassus': '할리카르나소스',
      },
      'replaceText': {
        'Blizzard': '블리자드',
        'Critical Hit': '극대화',
        'Dimensional Wave': '차원 파동',
        'Fire': '파이어',
        'Haste': '헤이스트',
        'Magic Hammer': '마법 망치',
        'Mindjack': '정신 장악',
        'Oink': '꿀꿀꿀꿀!',
        'Panel Swap': '판 바꾸기',
        'Place Dark Token': '죽음의 토큰 소환',
        'Place Token': '토큰 소환',
        'Ribbit': '개굴개굴!',
        'Spellblade Holy': '마법검 홀리',
        'Squelch': '보글보글!',
        'The Game': '게임 시작',
        'The Playing Field': '게임판',
        '(The )?Queen\'s Waltz': '여왕의 춤',
        'Thunder': '선더',
      },
    },
  ],
}];
