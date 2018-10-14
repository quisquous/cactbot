'use strict';

// O11N - Alphascape 3.0
[{
  zoneRegex: /^(Alphascape \(V3.0\)|Alphascape V3.0)$/,
  timelineFile: 'o11n.txt',
  timelineTriggers: [
    {
      id: 'O11N Blaster',
      regex: /Blaster/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'tank';
      },
      infoText: {
        en: 'Tank Tether',
      },
    },
  ],
  triggers: [
    {
      id: 'O11N Mustard Bomb',
      regex: / 14:3287:Omega starts using Mustard Bomb on (\y{Name})/,
      regexDe: / 14:3287:Omega starts using Senfbombe on (\y{Name})/,
      regexFr: / 14:3287:Oméga starts using Obus D\'ypérite on (\y{Name})/,
      regexJa: / 14:3287:オメガ starts using マスタードボム on (\y{Name})/,
      alarmText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tankbuster auf ' + data.ShortName(matches[1]),
            fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
          };
        }
      },
      tts: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      // Ability IDs:
      // Starboard 1: 3281
      // Starboard 2: 3282
      // Larboard 1: 3283
      // Larboard 2: 3284
      // For the cannons, match #1 and #2 for the first one.  This is so
      // that if a log entry for the first is dropped for some reason, it
      // will at least say left/right for the second.
      // Starboard/Larboard Cannon cleanup.
      regex: / 14:328[13]:Omega starts using/,
      regexDe: / 14:328[13]:Omega starts using/,
      regexFr: / 14:328[13]:Oméga starts using/,
      regexJa: / 14:328[13]:オメガ starts using/,
      delaySeconds: 15,
      run: function(data) {
        delete data.lastWasStarboard;
      },
    },
    {
      id: 'O11N Starboard Cannon 1',
      regex: / 14:328[12]:Omega starts using Starboard Wave Cannon/,
      regexDe: / 14:328[12]:Omega starts using Steuerbord-Wellenkanone/,
      regexFr: / 14:328[12]:Oméga starts using Salve De Tribord/,
      regexJa: / 14:328[12]:オメガ starts using 右舷斉射・波動砲/,
      condition: function(data) {
        return data.lastWasStarboard === undefined;
      },
      alertText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
      },
      run: function(data) {
        data.lastWasStarboard = true;
      },
    },
    {
      id: 'O11N Larboard Cannon 1',
      regex: / 14:328[34]:Omega starts using Larboard Wave Cannon/,
      regexDe: / 14:328[34]:Omega starts using Backbord-Wellenkanone/,
      regexFr: / 14:328[34]:Oméga starts using Salve De Bâbord/,
      regexJa: / 14:328[34]:オメガ starts using 左舷斉射・波動砲/,
      condition: function(data) {
        return data.lastWasStarboard === undefined;
      },
      alertText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
      },
      run: function(data) {
        data.lastWasStarboard = false;
      },
    },
    {
      id: 'O11N Starboard Cannon 2',
      regex: / 14:3282:Omega starts using Starboard Wave Cannon/,
      regexDe: / 14:3282:Omega starts using Steuerbord-Wellenkanone/,
      regexFr: / 14:3282:Oméga starts using Salve De Tribord/,
      regexJa: / 14:3282:オメガ starts using 右舷斉射・波動砲/,
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      alertText: function(data) {
        if (data.lastWasStarboard) {
          return {
            en: 'Move (Left)',
            de: 'Bewegen (Links)',
            fr: 'Bougez (Gauche)',
          };
        }
        return {
          en: 'Stay (Left)',
          de: 'Stehenbleiben (Links)',
          fr: 'Restez ici (Gauche)',
        };
      },
    },
    {
      id: 'O11N Larboard Cannon 2',
      regex: / 14:3284:Omega starts using Larboard Wave Cannon/,
      regexDe: / 14:3284:Omega starts using Backbord-Wellenkanone/,
      regexFr: / 14:3284:Oméga starts using Salve De Bâbord/,
      regexJa: / 14:3284:オメガ starts using 左舷斉射・波動砲/,
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      alertText: function(data) {
        if (data.lastWasStarboard) {
          return {
            en: 'Stay (Right)',
            de: 'Stehenbleiben (Rechts)',
            fr: 'Restez ici (Droite)',
          };
        }
        return {
          en: 'Move (Right)',
          de: 'Bewegen (Rechts)',
          fr: 'Bougez (droite)',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Engage!': 'Start!',
        'Level Checker': 'Monitor',
        'Omega': 'Omega',
        'Augmented Rocket Punch': 'verstärkter Raketenschlag',
        'Rocket Punch': 'Raketenschlag',
        'Engaging Delta Attack protocol': 'Reinitialisiere Deltaprotokoll',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Afterburner': 'Nachbrenner',
        'Atomic Ray': 'Atomstrahlung',
        'Ballistic Impact': 'Ballistischer Einschlag',
        'Ballistic Missile': 'Ballistische Rakete',
        'Blaster': 'Blaster',
        'Charybdis': 'Charybdis',
        'Condensed Wave Cannon Kyrios': 'Hochleistungswellenkanone P',
        'Delta Attack': 'Delta-Attacke',
        'Diffuse Wave Cannon Kyrios': 'Streuende Wellenkanone P',
        'Dual Storage Violation': 'Speicherverletzung P',
        'Electric Slide': 'Elektrosturz',
        'Engage Ballistics Systems': 'Feuerleitsystem-Initiierung',
        'Enrage': 'Finalangriff',
        'Executable': 'Programmstart',
        'Explosion': 'Explosion',
        'Ferrofluid': 'Ferrofluid',
        'Flamethrower': 'Flammenwerfer',
        'Force Quit': 'Erzwungenes Herunterfahren',
        'Guided Missile Kyrios': 'Lenkrakete P',
        'Iron Kiss': 'Einschlag',
        'Larboard Wave Cannon': 'Backbord-Wellenkanone',
        'Larboard Wave Cannon Surge': 'Backbord-Nullform-Partikelstrahl',
        'Long Needle Kyrios': 'Großes Kaliber P',
        'Loop': 'Schleife',
        'MRV Missile Kyrios': 'Multisprengkopf-Rakete P',
        'Magnetism': 'Magnetismus',
        'Mustard Bomb': 'Senfbombe',
        'Pantokrator': 'Pantokrator',
        'Peripheral Synthesis': 'Ausdrucken',
        'Program Loop': 'Programmschleife',
        'Reformat': 'Optimierung',
        'Repel': 'Repulsion',
        'Reset': 'Zurücksetzen',
        'Rush': 'Stürmen',
        'Starboard Wave Cannon': 'Steuerbord-Wellenkanone',
        'Starboard Wave Cannon Surge': 'Steuerbord-Nullform-Partikelstrahl',
        'Storage Violation': 'Speicherverletzung S',
        'Unmitigated Explosion': 'Detonation',
        'Update Program': 'Programmschleifen-Update',
        'Wave Cannon Kyrios': 'Wellenkanone P',

        'Starboard/Larboard Cannon': 'Steuerbord/Backbord',
        'Starboard/Larboard Surge': 'Steuerbord/Backbord',
      },
      '~effectNames': {
        'Biohacked': 'Nervenschock',
        'Bleeding': 'Blutung',
        'Blunt Resistance Down': 'Schlagresistenz -',
        'Burns': 'Brandwunde',
        'Chains of Memory': 'Kette des Vergessens',
        'Doom': 'Verhängnis',
        'Gradual Petrification': 'Steinwerdung',
        'HP Penalty': 'LP-Malus',
        'Kill Command': 'Löschen',
        'Live Wire': 'Elektrische Ladung',
        'Looper': 'Programmschleife',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Negative Charge': 'Negative Ladung',
        'Positive Charge': 'Positive Ladung',
        'Stun': 'Betäubung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
        'Level Checker': 'Vérifiniveau',
        'Omega': 'Oméga',
        'Augmented Rocket Punch': 'Astéropoing Renforcé',
        'Rocket Punch': 'Astéropoing',
        'Engaging Delta Attack protocol': 'Nécessité d\'utiliser l\'attaque Delta',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Afterburner': 'Postcombustion',
        'Atomic Ray': 'Rayon atomique',
        'Ballistic Impact': 'Impact de missile',
        'Ballistic Missile': 'Tir de missile',
        'Blaster': 'Électrochoc',
        'Charybdis': 'Charybde',
        'Condensed Wave Cannon Kyrios': 'Canon plasma surchargé P',
        'Delta Attack': 'Attaque Delta',
        'Diffuse Wave Cannon Kyrios': 'Canon plasma diffuseur P',
        'Dual Storage Violation': 'Corruption de données P',
        'Electric Slide': 'Glissement Oméga',
        'Engage Ballistics Systems': 'Contrôle de tir activé',
        'Enrage': 'Enrage',
        'Executable': 'Exécution de programme',
        'Explosion': 'Explosion',
        'Ferrofluid': 'Ferrofluide',
        'Flamethrower': 'Lance-flammes',
        'Force Quit': 'Interruption forcée',
        'Guided Missile Kyrios': 'Missile guidé P',
        'Iron Kiss': 'Impact',
        'Larboard Wave Cannon': 'Canon plasma bâbord',
        'Larboard Wave Cannon Surge': 'Canon plasma absolu bâbord',
        'Long Needle Kyrios': 'Gros missile P',
        'Loop': 'Boucle',
        'MRV Missile Kyrios': 'Missile multitêtes P',
        'Magnetism': 'Magnétisme',
        'Mustard Bomb': 'Obus d\'ypérite',
        'Pantokrator': 'Pantokrator',
        'Peripheral Synthesis': 'Impression',
        'Program Loop': 'Boucle de programme',
        'Reformat': 'Optimisation',
        'Repel': 'Répulsion',
        'Reset': 'Réinitialisation',
        'Rush': 'Ruée',
        'Starboard Wave Cannon': 'Canon plasma tribord',
        'Starboard Wave Cannon Surge': 'Canon plasma absolu tribord',
        'Storage Violation': 'Corruption de données S',
        'Unmitigated Explosion': 'Grosse explosion',
        'Update Program': 'Boucle de programme : mise à jour',
        'Wave Cannon Kyrios': 'Canon plasma P',
        'Starboard/Larboard Cannon': 'Tribord/Bâbord',
        'Starboard/Larboard Surge': 'Tribord/Bâbord',
      },
      '~effectNames': {
        'Biohacked': 'Piratage',
        'Bleeding': 'Saignant',
        'Blunt Resistance Down': 'Résistance Au Contondant Réduite',
        'Burns': 'Brûlure',
        'Chains of Memory': 'Chaîne d\'amnésie',
        'Doom': 'Glas',
        'Gradual Petrification': 'Pétrification graduelle',
        'HP Penalty': 'PV Maximum Réduits',
        'Kill Command': 'Boucle',
        'Live Wire': 'Charge électrique',
        'Looper': 'Boucle de programme',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Negative Charge': 'Charge Négative',
        'Positive Charge': 'Charge Positive',
        'Stun': 'Étourdissement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Engage!': '戦闘開始！',
        'Level Checker': 'レベルチェッカー',
        'Omega': 'オメガ',
        'Augmented Rocket Punch': '強化型ロケットパンチ',
        'Rocket Punch': 'ロケットパンチ',

        // FIXME
        'Engaging Delta Attack protocol': 'Engaging Delta Attack protocol',
      },
      'replaceText': {
        'Afterburner': 'アフターバーナー',
        'Atomic Ray': 'アトミックレイ',
        'Ballistic Impact': 'ミサイル着弾',
        'Ballistic Missile': 'ミサイル発射',
        'Blaster': 'ブラスター',
        'Charybdis': 'ミールストーム',
        'Condensed Wave Cannon Kyrios': '高出力波動砲P',
        'Delta Attack': 'デルタアタック',
        'Diffuse Wave Cannon Kyrios': '拡散波動砲P',
        'Dual Storage Violation': '記憶汚染除去P',
        'Electric Slide': 'オメガスライド',
        'Engage Ballistics Systems': '射撃統制システム起動',
        'Executable': 'プログラム実行',
        'Explosion': '爆発',
        'Ferrofluid': 'マグネット',
        'Flamethrower': '火炎放射',
        'Force Quit': '強制終了',
        'Guided Missile Kyrios': '誘導ミサイルP',
        'Iron Kiss': '着弾',
        'Larboard Wave Cannon': '左舷斉射・波動砲',
        'Larboard Wave Cannon Surge': '左舷斉射・零式波動砲',
        'Long Needle Kyrios': '大型ミサイルP',
        'Loop': 'サークル',
        'MRV Missile Kyrios': '多弾頭ミサイルP',
        'Magnetism': '磁力',
        'Mustard Bomb': 'マスタードボム',
        'Pantokrator': 'パントクラトル',
        'Peripheral Synthesis': 'プリントアウト',
        'Program Loop': 'サークルプログラム',
        'Reformat': '最適化',
        'Repel': '反発',
        'Reset': '初期化',
        'Rush': '突進',
        'Starboard Wave Cannon': '右舷斉射・波動砲',
        'Starboard Wave Cannon Surge': '右舷斉射・零式波動砲',
        'Storage Violation': '記憶汚染除去S',
        'Unmitigated Explosion': '大爆発',
        'Update Program': 'サークルプログラム更新',
        'Wave Cannon Kyrios': '波動砲P',

        // FIXME
        'Starboard/Larboard Cannon': 'Starboard/Larboard Cannon',
        'Starboard/Larboard Surge': 'Starboard/Larboard Surge',
      },
      '~effectNames': {
        'Biohacked': 'ハッキング',
        'Bleeding': 'ペイン',
        'Blunt Resistance Down': '打属性耐性低下',
        'Burns': '火傷',
        'Chains of Memory': '連鎖忘却',
        'Doom': '死の宣告',
        'Gradual Petrification': '徐々に石化',
        'HP Penalty': '最大ＨＰダウン',
        'Kill Command': 'サークル',
        'Live Wire': '雷気充填',
        'Looper': 'サークルプログラム',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Negative Charge': '磁力【－】',
        'Positive Charge': '磁力【＋】',
        'Stun': 'スタン',
      },
    },
  ],
}];
