'use strict';

// O3S - Deltascape 3.0 Savage
[{
  zoneRegex: /^Deltascape V3\.0 \(Savage\)$/,
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
      id: 'Spellblade holy counter',
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
      alarmText: function(data) {
        if (data.holyTargets[1] != data.me)
          return '';
        return {
          en: 'Stack on YOU',
          de: 'Stack auf DIR',
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
            };
          }
        }
        return {
          en: 'Stack on ' + data.holyTargets[1],
          de: 'Stack auf ' + data.holyTargets[1],
        };
      },
      infoText: function(data) {
        for (let i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'others stack on ' + data.holyTargets[1],
              de: 'andere stacken auf ' + data.holyTargets[1],
            };
          }
        }
      },
      condition: function(data, matches) {
        // Library phase stack markers behave differently.
        if (data.phase == 3)
          return false;

        data.holyTargets = data.holyTargets || [];
        data.holyTargets.push(matches.target);
        return data.holyTargets.length == 4;
      },
      tts: function(data) {
        if (data.holyTargets[1] == data.me) {
          return {
            en: 'stack on you',
            de: 'stack auf dir',
          };
        }
        for (let i = 0; i < 4; ++i) {
          if (data.holyTargets[i] == data.me) {
            return {
              en: 'get out',
              de: 'raus da',
            };
          }
        }
        return {
          en: 'stack on ' + data.holyTargets[1],
          de: 'stack auf ' + data.holyTargets[1],
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
      alertText: function(data) {
        if (data.librarySpellbladePrinted)
          return;

        data.librarySpellbladePrinted = true;
        if (data.librarySpellbladeMe == '0064') {
          return {
            en: 'Go south: stack on YOU',
            de: 'Nach Süden: stack auf DIR',
          };
        }
        if (data.librarySpellbladeMe == '0065') {
          return {
            en: 'go north',
            de: 'nach norden',
          };
        }
        return {
          en: 'go south: stack on friend',
          de: 'nach süden: stack auf freund',
        };
      },
      // Because people can be dead and there are eight marks, delay to
      // accumulate logs instead of counting marks.  Instantly print if
      // anything is on you.  The 6 triggers will all have condition=true
      // and run, but only the first one will print.
      delaySeconds: function(data, matches) {
        return matches.target == data.me ? 0 : 0.5;
      },
      condition: function(data, matches) {
        // This is only for library phase.
        if (data.phase != 3)
          return false;

        if (matches.target == data.me)
          data.librarySpellbladeMe = matches.id;

        return true;
      },
      tts: function(data) {
        if (data.librarySpellbladePrinted)
          return;

        data.librarySpellbladePrinted = true;
        if (data.librarySpellbladeMe == '0064') {
          return {
            en: 'stack outside',
            de: 'außen stacken',
          };
        }
        if (data.librarySpellbladeMe == '0065') {
          return {
            en: 'go north',
            de: 'nach norden',
          };
        }
        return {
          en: 'stack inside',
          de: 'innen stacken',
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
      alertText: {
        en: 'Ribbit: Get behind',
        de: 'Quaaak: Hinter sie',
      },
      tts: {
        en: 'ribbit',
        de: 'quak',
      },
    },
    {
      id: 'O3S Oink',
      regex: Regexes.startsUsing({ id: '22F9', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '22F9', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '22F9', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '22F9', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '22F9', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '22F9', source: '할리카르나소스', capture: false }),
      infoText: {
        en: 'Oink: Stack',
        de: 'Quiiiek: Stack',
      },
      tts: {
        en: 'oink',
        de: 'quiek',
      },
    },
    {
      id: 'O3S Squelch',
      regex: Regexes.startsUsing({ id: '22F8', source: 'Halicarnassus', capture: false }),
      regexDe: Regexes.startsUsing({ id: '22F8', source: 'Halikarnassos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '22F8', source: 'Halicarnasse', capture: false }),
      regexJa: Regexes.startsUsing({ id: '22F8', source: 'ハリカルナッソス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '22F8', source: '哈利卡纳苏斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '22F8', source: '할리카르나소스', capture: false }),
      alarmText: {
        en: 'Squelch: Look away',
        de: 'Gurrr: Wegschauen',
      },
      tts: {
        en: 'look away',
        de: 'weckschauen',
      },
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
      },
      tts: {
        en: 'books',
        de: 'bücher',
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
      },
      tts: {
        en: 'clock',
        de: 'uhr',
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
      },
      tts: {
        en: 'blue square',
        de: 'blaues feld',
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
      },
      tts: {
        en: 'tethers',
        de: 'ranken',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ancient Tome': 'Uralt[a] Foliant',
        'Apanda': 'Apanda',
        'Engage!': 'Start!',
        'Great Dragon': 'Riesendrache',
        'Halicarnassus': 'Halikarnassos',
        'Soul Reaper': 'Seelenschnitter',
        'White Flame': 'Weiß[a] Flamme',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Critical Hit': 'Kritischer Treffer',
        'Cross Reaper': 'Sensenschwung',
        'Dimensional Wave': 'Dimensionswelle',
        'Earthly Dance': 'Tanz Der Erde',
        'Enrage': 'Finalangriff',
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
        'Stench Of Death': 'Gestank Des Todes',
        'The Game': 'Spielbeginn',
        'The Playing Field': 'Spielfeld',
        'The Queen\'s Waltz': 'Tanz Der Königin',
        'Uplift': 'Erhöhung',
        'White Wind': 'Weißer Wind',
      },
      '~effectNames': {
        'About Face': 'Geistlenkung Rückwärts',
        'Briar': 'Dorngestrüpp',
        'Forced March': 'Zwangsmarsch',
        'Forward March': 'Geistlenkung Vorwärts',
        'Imp': 'Flusskobold',
        'Left Face': 'Geistlenkung Links',
        'Out Of The Action': 'Außer Gefecht',
        'Piggy': 'Schweinchen',
        'Right Face': 'Geistlenkung Rechts',
        'Stun': 'Betäubung',
        'Thorny Vine': 'Dornenranken',
        'Toad': 'Frosch',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ancient Tome': 'Volume Ancien',
        'Apanda': 'Apanda',
        'Engage!': 'À l\'attaque',
        'Great Dragon': 'Dragon Suprême',
        'Halicarnassus': 'Halicarnasse',
        'Soul Reaper': 'Faucheur D\'âmes',
        'White Flame': 'Flamme Blanche',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Critical Hit': 'Attaque Critique',
        'Cross Reaper': 'Fauchaison',
        'Dimensional Wave': 'Onde Dimensionnelle',
        'Earthly Dance': 'Danse De La Terre',
        'Enrage': 'Enrage',
        'Folio': 'Réimpression',
        'Frost Breath': 'Souffle Glacé',
        'Gusting Gouge': 'Gouge Cisaillante',
        'Haste': 'Hâte',
        'Holy Blur': 'Brume Sacrée',
        'Holy Edge': 'Taille Sacrée',
        'Magic Hammer': 'Marteau Magique',
        'Mindjack': 'Piratage Mental',
        'Oink': 'Abracadabri',
        'Panel Swap': 'Remplacement Des Cases',
        'Place Dark Token': 'Pions Obscurs En Jeu',
        'Place Token': 'Pion En Jeu',
        'Pole Shift': 'Inversion Des Pôles',
        'Pummel': 'Torgnole',
        'Ray Of White': 'Tir Blanc',
        'Ribbit': 'Coâââ',
        'Saber Dance': 'Danse Du Sabre',
        'Spellblade Blizzard III': 'Magilame Méga Glace',
        'Spellblade Fire III': 'Magilame Méga Feu',
        'Spellblade Holy': 'Magilame Miracle',
        'Spellblade Thunder III': 'Magilame Méga Foudre',
        'Squelch': 'Abracadabra',
        'Stench Of Death': 'Parfum De Mort',
        'The Game': 'Début De Partie',
        'The Playing Field': 'Plateau De Jeu',
        'The Queen\'s Waltz': 'Danse De La Reine',
        'Uplift': 'Exhaussement',
        'White Wind': 'Mistral',
      },
      '~effectNames': {
        'About Face': 'Piratage Mental: Reculer',
        'Briar': 'Ronces Sauvages',
        'Forced March': 'Marche Forcée',
        'Forward March': 'Piratage Mental: Avancer',
        'Imp': 'Kappa',
        'Left Face': 'Piratage Mental: Virage à Gauche',
        'Out Of The Action': 'Actions Bloquées',
        'Piggy': 'Porcelet',
        'Right Face': 'Piratage Mental: Virage à Droite',
        'Stun': 'Étourdissement',
        'Thorny Vine': 'Sarment De Ronces',
        'Toad': 'Crapaud',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ancient Tome': '古代書',
        'Apanda': 'アパンダ',
        'Engage!': '戦闘開始！',
        'Great Dragon': 'ドラゴングレイト',
        'Halicarnassus': 'ハリカルナッソス',
        'Soul Reaper': 'ソウルリーパー',
        'White Flame': 'ホワイトフレイム',
      },
      'replaceText': {
        'Critical Hit': 'クリティカル',
        'Cross Reaper': 'クロスリーパー',
        'Dimensional Wave': '次元波動',
        'Earthly Dance': '大地の舞い',
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
        'Uplift': '隆起',
        'White Wind': 'ホワイトウインド',
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
  ],
}];
