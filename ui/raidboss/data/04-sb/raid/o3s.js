'use strict';

// O3S - Deltascape 3.0 Savage
[{
  zoneRegex: {
    en: /^Deltascape V3\.0 \(Savage\)$/,
    cn: /^欧米茄零式时空狭缝 \(德尔塔幻境3\)$/,
  },
  timelineFile: 'o3s.txt',
  triggers: [
    {
      id: 'O3S Phase Counter',
      regex: Regexes.startsUsing({ id: '2304', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2304', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2304', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2304', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2304', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2304', source: '할리카르나소스', capture: false }),
      run: function(data) {
        data.phase = (data.phase || 0) + 1;
        delete data.seenHolyThisPhase;
      },
    },
    {
      // Look for spellblade holy so that the last noisy waltz
      // books message in the library phase can be ignored.
      id: 'O3S Spellblade Holy Counter',
      regex: Regexes.ability({ id: '22EF', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.ability({ id: '22EF', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.ability({ id: '22EF', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.ability({ id: '22EF', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.ability({ id: '22EF', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.ability({ id: '22EF', source: '할리카르나소스', capture: false }),
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
      regex: Regexes.headMarker({ id: ['0064', '0065'] }),
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
              cn: '出去',
            };
          }
        }
        return {
          en: 'Stack on ' + data.holyTargets[1],
          de: 'Stack auf ' + data.holyTargets[1],
          cn: '分摊' + data.holyTargets[1],
        };
      },
      infoText: function(data) {
        for (let i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'others stack on ' + data.holyTargets[1],
              de: 'andere stacken auf ' + data.holyTargets[1],
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
            cn: '分摊点名',
          };
        }
        for (let i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'get out',
              de: 'raus da',
              cn: '出去',
            };
          }
        }
        return {
          en: 'stack on ' + data.holyTargets[1],
          de: 'stack auf ' + data.holyTargets[1],
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
      regex: Regexes.headMarker({ id: ['0064', '0065'] }),
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
            cn: '去南边分摊点名',
          };
        }
        if (data.librarySpellbladeMe == '0065') {
          return {
            en: 'go north',
            de: 'nach norden',
            cn: '去南边',
          };
        }
        return {
          en: 'go south: stack on friend',
          de: 'nach süden: stack auf freund',
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
            cn: '去外面分摊',
          };
        }
        if (data.librarySpellbladeMe == '0065') {
          return {
            en: 'go north',
            de: 'nach norden',
            cn: '去南边',
          };
        }
        return {
          en: 'stack inside',
          de: 'innen stacken',
          cn: '去里面分摊',
        };
      },
    },
    {
      id: 'O3S Right Face',
      regex: Regexes.gainsEffect({ effect: 'Right Face' }),
      regexDe: Regexes.gainsEffect({ effect: 'Geistlenkung Rechts' }),
      regexFr: Regexes.gainsEffect({ effect: 'Contrainte Mentale: Virage À Droite' }),
      regexJa: Regexes.gainsEffect({ effect: '移動命令：右' }),
      regexCn: Regexes.gainsEffect({ effect: '移动命令：右' }),
      regexKo: Regexes.gainsEffect({ effect: '이동 명령: 우' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Right',
        de: 'Geistlenkung: Rechts',
        cn: '右',
      },
    },
    {
      id: 'O3S Forward March',
      regex: Regexes.gainsEffect({ effect: 'Forward March' }),
      regexDe: Regexes.gainsEffect({ effect: 'Geistlenkung Vorwärts' }),
      regexFr: Regexes.gainsEffect({ effect: 'Contrainte Mentale: Avancer' }),
      regexJa: Regexes.gainsEffect({ effect: '移動命令：前' }),
      regexCn: Regexes.gainsEffect({ effect: '移动命令：前' }),
      regexKo: Regexes.gainsEffect({ effect: '이동 명령: 전' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Forward',
        de: 'Geistlenkung: Vorwärts',
        cn: '前',
      },
    },
    {
      id: 'O3S Left Face',
      regex: Regexes.gainsEffect({ effect: 'Left Face' }),
      regexDe: Regexes.gainsEffect({ effect: 'Geistlenkung Links' }),
      regexFr: Regexes.gainsEffect({ effect: 'Contrainte Mentale: Virage À Gauche' }),
      regexJa: Regexes.gainsEffect({ effect: '移動命令：左' }),
      regexCn: Regexes.gainsEffect({ effect: '移动命令：左' }),
      regexKo: Regexes.gainsEffect({ effect: '이동 명령: 좌' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Left',
        de: 'Geistlenkung: Links',
        cn: '左',
      },
    },
    {
      id: 'O3S About Face',
      regex: Regexes.gainsEffect({ effect: 'About Face' }),
      regexDe: Regexes.gainsEffect({ effect: 'Geistlenkung Rückwärts' }),
      regexFr: Regexes.gainsEffect({ effect: 'Contrainte Mentale: Reculer' }),
      regexJa: Regexes.gainsEffect({ effect: '移動命令：後' }),
      regexCn: Regexes.gainsEffect({ effect: '移动命令：后' }),
      regexKo: Regexes.gainsEffect({ effect: '이동 명령: 후' }),
      condition: function(data, matches) {
        return matches.target == data.me;
      },
      durationSeconds: 8,
      infoText: {
        en: 'Mindjack: Back',
        de: 'Geistlenkung: Zurück',
        cn: '后',
      },
    },
    {
      id: 'O3S Ribbit',
      regex: Regexes.startsUsing({ id: '22F7', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '22F7', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '22F7', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '22F7', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '22F7', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '22F7', source: '할리카르나소스', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'O3S Oink',
      regex: Regexes.startsUsing({ id: '22F9', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '22F9', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '22F9', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '22F9', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '22F9', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '22F9', source: '할리카르나소스', capture: false }),
      response: Responses.stack(),
    },
    {
      id: 'O3S Squelch',
      regex: Regexes.startsUsing({ id: '22F8', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '22F8', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '22F8', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '22F8', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '22F8', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '22F8', source: '할리카르나소스', capture: false }),
      response: Responses.lookAway(),
    },
    {
      id: 'O3S The Queen\'s Waltz: Books',
      regex: Regexes.startsUsing({ id: '230E', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '230E', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '230E', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '230E', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '230E', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '230E', source: '할리카르나소스', capture: false }),
      condition: function(data) {
        // Deliberately skip printing the waltz message for the
        // spellblade holy -> waltz that ends the library phase.
        return data.phase != 3 || !data.seenHolyThisPhase;
      },
      alertText: {
        en: 'The Queen\'s Waltz: Books',
        de: 'Tanz der Königin: Bücher',
        cn: '中间两排分格站位',
      },
      tts: {
        en: 'books',
        de: 'bücher',
        cn: '书',
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Clock',
      regex: Regexes.startsUsing({ id: '2306', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2306', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2306', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2306', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2306', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2306', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'The Queen\'s Waltz: Clock',
        de: 'Tanz der Königin: Uhr',
        cn: '万变水波站位',
      },
      tts: {
        en: 'clock',
        de: 'uhr',
        cn: '万变水波',
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Crystal Square',
      regex: Regexes.startsUsing({ id: '230A', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '230A', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '230A', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '230A', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '230A', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '230A', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'The Queen\'s Waltz: Crystal Square',
        de: 'Tanz der Königin: Kristallfeld',
        cn: '站在蓝地板',
      },
      tts: {
        en: 'blue square',
        de: 'blaues feld',
        cn: '蓝地板',
      },
    },
    {
      id: 'O3S The Queen\'s Waltz: Tethers',
      regex: Regexes.startsUsing({ id: '2308', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '2308', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '2308', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '2308', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '2308', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '2308', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'The Queen\'s Waltz: Tethers',
        de: 'Tanz der Königin: Ranken',
        cn: '先集中后扯线',
      },
      tts: {
        en: 'tethers',
        de: 'ranken',
        cn: '扯线',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ancient Tome': 'uralt(?:e|er|es|en) Foliant',
        'Apanda': 'Apanda',
        'Great Dragon': 'Riesendrache',
        'Halicarnassus': 'Halikarnassos',
        'Soul Reaper': 'Seelenschnitter',
        'White Flame': 'weiß(?:e|er|es|en) Flamme',
      },
      'replaceText': {
        'Blizzard': 'Eis',
        'Critical Hit': 'Kritischer Treffer',
        'Cross Reaper': 'Sensenschwung',
        'Dimensional Wave': 'Dimensionswelle',
        'Earthly Dance': 'Tanz der Erde',
        'Fire': 'Feuer',
        'Folio': 'Foliant',
        'Frost Breath': 'Frostiger Atem',
        'Gusting Gouge': 'Meißelstoß',
        'Haste': 'Hast',
        'Holy Blur': 'Heiliger Nebel',
        'Holy Edge': 'Heiliger Grat',
        'Magic Hammer': 'Zauberhammer',
        'Mindjack': 'Geistlenkung',
        'Oink': 'Quiiiek',
        'Panel Swap': 'Neuaufstellung',
        'Place Dark Token': 'Todesspielstein',
        'Place Token': 'Spielstein',
        'Pole Shift': 'Umpolung',
        'Pummel': 'Deftige Dachtel',
        'Ray Of White': 'Weißer Strahl',
        'Ribbit': 'Quaaak',
        'Saber Dance': 'Schwerttanz',
        'Spellblade Blizzard III': 'Magieklinge Eisga',
        'Spellblade Fire III': 'Magieklinge Feuga',
        'Spellblade Holy': 'Magieklinge Sanctus',
        'Spellblade Thunder III': 'Magieklinge Blitzga',
        'Squelch': 'Gurrr',
        'Stench Of Death': 'Gestank des Todes',
        'The Game': 'Spielbeginn',
        'The Playing Field': 'Spielfeld',
        'The Queen\'s Waltz': 'Tanz der Königin',
        'Thunder': 'Blitz',
        'Uplift': 'Erhöhung',
        'White Wind': 'Weißer Wind',
      },
      '~effectNames': {
        'About Face': 'Geistlenkung rückwärts',
        'Briar': 'Dorngestrüpp',
        'Forced March': 'Zwangsmarsch',
        'Forward March': 'Geistlenkung vorwärts',
        'Imp': 'Flusskobold',
        'Left Face': 'Geistlenkung links',
        'Out Of The Action': 'Außer Gefecht',
        'Piggy': 'Schweinchen',
        'Right Face': 'Geistlenkung rechts',
        'Stun': 'Betäubung',
        'Thorny Vine': 'Dornenranken',
        'Toad': 'Frosch',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ancient Tome': 'volume ancien',
        'Apanda': 'apanda',
        'Great Dragon': 'dragon suprême',
        'Halicarnassus': 'Halicarnasse',
        'Soul Reaper': 'faucheur d\'âmes',
        'White Flame': 'flamme blanche',
      },
      'replaceText': {
        'Blizzard': 'Glace',
        'Critical Hit': 'Attaque critique',
        'Cross Reaper': 'Fauchaison',
        'Dimensional Wave': 'Onde dimensionnelle',
        'Earthly Dance': 'Danse de la terre',
        'Fire': 'Feu',
        'Folio': 'Réimpression',
        'Frost Breath': 'Souffle glacé',
        'Gusting Gouge': 'Gouge cisaillante',
        'Haste': 'Hâte',
        'Holy Blur': 'Brume sacrée',
        'Holy Edge': 'Taille sacrée',
        'Magic Hammer': 'Marteau magique',
        'Mindjack': 'Contrainte mentale',
        'Oink': 'Abracadabri',
        'Panel Swap': 'Remplacement des cases',
        'Place Dark Token': 'Pions obscurs en jeu',
        'Place Token': 'Pion en jeu',
        'Pole Shift': 'Inversion des pôles',
        'Pummel': 'Torgnole',
        'Ray Of White': 'Tir blanc',
        'Ribbit': 'Coâââ',
        'Saber Dance': 'Danse du sabre',
        'Spellblade Blizzard III': 'Magilame Méga Glace',
        'Spellblade Fire III': 'Magilame Méga Feu',
        'Spellblade Holy': 'Magilame Miracle',
        'Spellblade Thunder III': 'Magilame Méga Foudre',
        'Squelch': 'Abracadabra',
        'Stench Of Death': 'Parfum de mort',
        'The Game': 'Début de partie',
        'The Playing Field': 'Plateau de jeu',
        'The Queen\'s Waltz': 'Danse de la reine',
        'Thunder': 'Foudre',
        'Uplift': 'Exhaussement',
        'White Wind': 'Vent blanc',
      },
      '~effectNames': {
        'About Face': 'Contrainte mentale: reculer',
        'Briar': 'Ronces sauvages',
        'Forced March': 'Marche forcée',
        'Forward March': 'Contrainte mentale: avancer',
        'Imp': 'Kappa',
        'Left Face': 'Contrainte mentale: virage à gauche',
        'Out Of The Action': 'Actions bloquées',
        'Piggy': 'Porcelet',
        'Right Face': 'Contrainte mentale: virage à droite',
        'Stun': 'Étourdissement',
        'Thorny Vine': 'Sarment de ronces',
        'Toad': 'Crapaud',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ancient Tome': '古代書',
        'Apanda': 'アパンダ',
        'Great Dragon': 'ドラゴングレイト',
        'Halicarnassus': 'ハリカルナッソス',
        'Soul Reaper': 'ソウルリーパー',
        'White Flame': 'ホワイトフレイム',
      },
      'replaceText': {
        'Blizzard': 'ブリザド',
        'Critical Hit': 'クリティカル',
        'Cross Reaper': 'クロスリーパー',
        'Dimensional Wave': '次元波動',
        'Earthly Dance': '大地の舞い',
        'Fire': 'ファイア',
        'Folio': '重版',
        'Frost Breath': 'フロストブレス',
        'Gusting Gouge': 'ガスティンググージ',
        'Haste': 'ヘイスト',
        'Holy Blur': 'ホーリーミスト',
        'Holy Edge': 'ホーリーエッジ',
        'Magic Hammer': 'マジックハンマー',
        'Mindjack': 'マインドジャック',
        'Oink': 'ポルルルル！',
        'Panel Swap': 'パネルシャッフル',
        'Place Dark Token': 'サモンデストークン',
        'Place Token': 'サモントークン',
        'Pole Shift': '磁場転換',
        'Pummel': '殴打',
        'Ray Of White': 'ホワイトショット',
        'Ribbit': 'クルルルル！',
        'Saber Dance': '剣の舞い',
        'Spellblade Blizzard III': '魔法剣ブリザガ',
        'Spellblade Fire III': '魔法剣ファイガ',
        'Spellblade Holy': '魔法剣ホーリー',
        'Spellblade Thunder III': '魔法剣サンダガ',
        'Squelch': 'カルルルル！',
        'Stench Of Death': '死の気配',
        'The Game': 'ゲームスタート',
        'The Playing Field': 'ゲームボード',
        'The Queen\'s Waltz': '女王の舞い',
        'Thunder': 'サンダー',
        'Uplift': '隆起',
        'White Wind': 'ホワイトウィンド',
      },
      '~effectNames': {
        'About Face': '移動命令：後',
        'Briar': '野茨',
        'Forced March': '強制移動',
        'Forward March': '移動命令：前',
        'Imp': 'カッパ',
        'Left Face': '移動命令：左',
        'Out Of The Action': 'アクション実行不可',
        'Piggy': 'ポーキー',
        'Right Face': '移動命令：右',
        'Stun': 'スタン',
        'Thorny Vine': '茨の蔓',
        'Toad': 'トード',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ancient Tome': '古代书',
        'Apanda': '阿班达',
        'Great Dragon': '巨龙',
        'Halicarnassus': '哈利卡纳苏斯',
        'Soul Reaper': '灵魂收割者',
        'White Flame': '白焰',
      },
      'replaceText': {
        '--Apanda Spawns--': '--阿班达出现--',
        '--Great Dragon Spawns--': '--巨龙出现--',
        '--Ninjas \\+ Giant Spawn--': '--忍者 + 巨人出现--',
        '--White Flame Spawns--': '--白焰出现--',
        'Blizzard': '冰结',
        'Critical Hit': '暴击',
        'Cross Reaper': '交叉斩击',
        'DPS Morph': 'DPS变形',
        'Dimensional Wave': '次元波动',
        'Dragon Conal AoE': '龙圆锥AOE',
        'Earthly Dance': '大地之舞',
        'Fire': '火炎',
        'Folio': '再版',
        'Frost Breath': '寒霜吐息',
        'Gusting Gouge': '削风',
        'Haste': '加速',
        'Healers Morph': '治疗变形',
        'Holy Blur': '神圣雾',
        'Holy Edge': '神圣刃',
        'Magic Hammer': '魔法锤',
        'Mindjack': '精神控制',
        'Oink': '哼哼哼哼哼！',
        'Panel Swap': '刷新盘面',
        'Place Dark Token': '召唤死形',
        'Place Token': '召唤魔形',
        'Pole Shift': '磁场转换',
        'Pummel': '殴打',
        '(The )?Queen\'s Waltz': '女王之舞',
        'Random Elemental': '随机元灵',
        'Ray Of White': '苍白射击',
        'Ribbit': '呱呱呱呱呱！',
        'Saber Dance': '剑舞',
        'Spellblade Blizzard III': '魔法剑·冰封',
        'Spellblade Fire III': '魔法剑·爆炎',
        'Spellblade Holy': '魔法剑·神圣',
        'Spellblade Thunder III': '魔法剑·暴雷',
        'Squelch': '喀喀喀喀喀！',
        'Stench Of Death': '死亡气息',
        'Tanks Morph': '坦克变形',
        'Tethers': '连线',
        'The Game': '游戏开始',
        'The Playing Field': '游戏盘面',
        'Thunder': '闪雷',
        'Uplift': '隆起',
        'White Wind': '白风',
      },
      '~effectNames': {
        'About Face': '移动命令：后',
        'Briar': '荆棘',
        'Forced March': '强制移动',
        'Forward March': '移动命令：前',
        'Imp': '河童',
        'Left Face': '移动命令：左',
        'Out Of The Action': '无法发动技能',
        'Piggy': '波奇',
        'Right Face': '移动命令：右',
        'Stun': '眩晕',
        'Thorny Vine': '荆棘丛生',
        'Toad': '蛙变',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ancient Tome': '고대의 책',
        'Apanda': '아판다',
        'Great Dragon': '거대 드래곤',
        'Halicarnassus': '할리카르나소스',
        'Soul Reaper': '영혼 수확자',
        'White Flame': '하얀 불꽃',
      },
      'replaceText': {
        'Blizzard': '블리자드',
        'Critical Hit': '극대화',
        'Cross Reaper': '사신의 낫',
        'Dimensional Wave': '차원 파동',
        'Earthly Dance': '대지의 춤',
        'Fire': '파이어',
        'Folio': '증쇄',
        'Frost Breath': '서리 숨결',
        'Gusting Gouge': '칼날 돌풍',
        'Haste': '헤이스트',
        'Holy Blur': '성스러운 안개',
        'Holy Edge': '성스러운 칼날',
        'Magic Hammer': '마법 망치',
        'Mindjack': '정신 장악',
        'Oink': '꿀꿀꿀꿀!',
        'Panel Swap': '판 바꾸기',
        'Place Dark Token': '죽음의 토큰 소환',
        'Place Token': '토큰 소환',
        'Pole Shift': '자기장 전환',
        'Pummel': '구타',
        'Ray Of White': '하얀 사격',
        'Ribbit': '개굴개굴!',
        'Saber Dance': '검무',
        'Spellblade Blizzard III': '마법검 블리자가',
        'Spellblade Fire III': '마법검 파이가',
        'Spellblade Holy': '마법검 홀리',
        'Spellblade Thunder III': '마법검 선더가',
        'Squelch': '보글보글!',
        'Stench Of Death': '죽음의 기척',
        'The Game': '게임 시작',
        'The Playing Field': '게임판',
        'The Queen\'s Waltz': '여왕의 춤',
        'Thunder': '선더',
        'Uplift': '융기',
        'White Wind': '하얀 바람',
      },
      '~effectNames': {
        'About Face': '이동 명령: 후',
        'Briar': '가시밭',
        'Forced March': '강제 이동',
        'Forward March': '이동 명령: 전',
        'Imp': '물요정',
        'Left Face': '이동 명령: 좌',
        'Out Of The Action': '기술 실행 불가',
        'Piggy': '아기 돼지',
        'Right Face': '이동 명령: 우',
        'Stun': '기절',
        'Thorny Vine': '가시덩굴',
        'Toad': '두꺼비',
      },
    },
  ],
}];
