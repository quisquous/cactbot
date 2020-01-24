'use strict';

// O11S - Alphascape 3.0 Savage
[{
  zoneRegex: {
    en: /^Alphascape V3.0 \(Savage\)$/,
    cn: /^欧米茄零式时空狭缝 \(阿尔法幻境3\)$/,
  },
  timelineFile: 'o11s.txt',
  triggers: [
    {
      id: 'O11S Mustard Bomb',
      regex: Regexes.startsUsing({ id: '326D', source: 'Omega' }),
      regexDe: Regexes.startsUsing({ id: '326D', source: 'Omega' }),
      regexFr: Regexes.startsUsing({ id: '326D', source: 'Oméga' }),
      regexJa: Regexes.startsUsing({ id: '326D', source: 'オメガ' }),
      regexCn: Regexes.startsUsing({ id: '326D', source: '欧米茄' }),
      regexKo: Regexes.startsUsing({ id: '326D', source: '오메가' }),
      alarmText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
            cn: '死刑',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
            cn: data.ShortName(matches.target) + '吃死刑',
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
            ja: 'バスター',
            cn: '死刑',
          };
        }
      },
    },
    {
      // Ability IDs:
      // Starboard 1: 3262
      // Starboard 2: 3263
      // Larboard 1: 3264
      // Larboard 2: 3265
      // For the cannons, match #1 and #2 for the first one.  This is so
      // that if a log entry for the first is dropped for some reason, it
      // will at least say left/right for the second.
      // Starboard/Larboard Cannon cleanup.
      regex: Regexes.startsUsing({ id: '326[24]', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '326[24]', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '326[24]', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '326[24]', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '326[24]', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '326[24]', source: '오메가', capture: false }),
      delaySeconds: 15,
      run: function(data) {
        delete data.lastWasStarboard;
      },
    },
    {
      id: 'O11S Starboard Cannon 1',
      regex: Regexes.startsUsing({ id: '326[23]', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '326[23]', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '326[23]', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '326[23]', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '326[23]', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '326[23]', source: '오메가', capture: false }),
      condition: function(data) {
        return data.lastWasStarboard === undefined;
      },
      alertText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
        ja: '左',
        cn: '左',
      },
      run: function(data) {
        data.lastWasStarboard = true;
      },
    },
    {
      id: 'O11S Larboard Cannon 1',
      regex: Regexes.startsUsing({ id: '326[45]', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '326[45]', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '326[45]', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '326[45]', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '326[45]', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '326[45]', source: '오메가', capture: false }),
      condition: function(data) {
        return data.lastWasStarboard === undefined;
      },
      alertText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite',
        ja: '右',
        cn: '右',
      },
      run: function(data) {
        data.lastWasStarboard = false;
      },
    },
    {
      id: 'O11S Starboard Cannon 2',
      regex: Regexes.startsUsing({ id: '3263', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3263', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3263', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3263', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3263', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3263', source: '오메가', capture: false }),
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      alertText: function(data) {
        if (data.lastWasStarboard) {
          return {
            en: 'Move (Left)',
            de: 'Bewegen (Links)',
            fr: 'Bougez (Gauche)',
            ja: '反対へ (左)',
            cn: '移动 (左)',
          };
        }
        return {
          en: 'Stay (Left)',
          de: 'Stehenbleiben (Links)',
          fr: 'Restez ici (Gauche)',
          ja: 'そのまま (左)',
          cn: '不动 (左)',
        };
      },
    },
    {
      id: 'O11S Larboard Cannon 2',
      regex: Regexes.startsUsing({ id: '3265', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3265', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3265', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3265', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3265', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3265', source: '오메가', capture: false }),
      condition: function(data) {
        return data.lastWasStarboard !== undefined;
      },
      alertText: function(data) {
        if (data.lastWasStarboard) {
          return {
            en: 'Stay (Right)',
            de: 'Stehenbleiben (Rechts)',
            fr: 'Restez ici (Droite)',
            ja: 'そのまま (右)',
            cn: '不动 (右)',
          };
        }
        return {
          en: 'Move (Right)',
          de: 'Bewegen (Rechts)',
          fr: 'Bougez (Droite)',
          ja: '反対へ (右)',
          cn: '移动 (右)',
        };
      },
    },
    {
      id: 'O11S Starboard Surge 1',
      regex: Regexes.startsUsing({ id: '3266', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3266', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3266', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3266', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3266', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3266', source: '오메가', capture: false }),
      alertText: {
        en: 'Left (then opposite)',
        de: 'Links (dann umgekehrt)',
        fr: 'Gauche (puis Droite)',
        ja: '左 (零式)',
        cn: '左 (零式)',
      },
    },
    {
      id: 'O11S Larboard Surge 1',
      regex: Regexes.startsUsing({ id: '3268', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3268', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3268', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3268', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3268', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3268', source: '오메가', capture: false }),
      alertText: {
        en: 'Right (then opposite)',
        de: 'Rechts (dann umgekehrt)',
        fr: 'Droite (puis Gauche)',
        ja: '右 (零式)',
        cn: '右 (零式)',
      },
    },
    {
      id: 'O11S Starboard Surge 2',
      regex: Regexes.startsUsing({ id: '3266', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3266', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3266', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3266', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3266', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3266', source: '오메가', capture: false }),
      delaySeconds: 4,
      alertText: {
        en: 'Opposite (Left)',
        de: 'Umgekehrt (Links)',
        fr: 'Côté opposé (Gauche)',
        ja: '反対へ (左)',
        cn: '对面 (左)',
      },
    },
    {
      id: 'O11S Larboard Surge 2',
      regex: Regexes.startsUsing({ id: '3268', source: 'Omega', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3268', source: 'Omega', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3268', source: 'Oméga', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3268', source: 'オメガ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3268', source: '欧米茄', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3268', source: '오메가', capture: false }),
      delaySeconds: 4,
      alertText: {
        en: 'Opposite (Right)',
        de: 'Umgekehrt (Rechts)',
        fr: 'Côté opposé (Droite)',
        ja: '反対へ (右)',
        cn: '对面 (右)',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Augmented Rocket Punch': 'verstärkt(?:e|er|es|en) Raketenschlag',
        'Engage!': 'Start!',
        'Level Checker': 'Monitor',
        'Omega': 'Omega',
        'Rocket Punch': 'Raketenschlag',
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
        'Larboard Wave Cannon(?! )': 'Backbord-Wellenkanone',
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
        'Starboard Wave Cannon(?! )': 'Steuerbord-Wellenkanone',
        'Starboard Wave Cannon Surge': 'Steuerbord-Nullform-Partikelstrahl',
        'Starboard/Larboard Cannon': 'Steuerbord/Backbord Kanone',
        'Starboard/Larboard Surge': 'Steuerbord/Backbord Strahl',
        'Storage Violation': 'Speicherverletzung S',
        'Unmitigated Explosion': 'Detonation',
        'Update Program': 'Programmschleifen-Update',
        'Wave Cannon Kyrios': 'Wellenkanone P',
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
        'Augmented Rocket Punch': 'astéropoing renforcé',
        'Engage!': 'À l\'attaque !',
        'Level Checker': 'vérifiniveau',
        'Omega': 'Oméga',
        'Rocket Punch': 'Astéropoing',
      },
      'replaceText': {
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
        'Larboard Wave Cannon(?! )': 'Canon plasma bâbord',
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
        'Starboard Wave Cannon(?! )': 'Canon plasma tribord',
        'Starboard Wave Cannon Surge': 'Canon plasma absolu tribord',
        'Starboard/Larboard Cannon': 'Tribord/Bâbord',
        'Starboard/Larboard Surge': 'Tribord/Bâbord',
        'Storage Violation': 'Corruption de données S',
        'Unmitigated Explosion': 'Grosse explosion',
        'Update Program': 'Boucle de programme : mise à jour',
        'Wave Cannon Kyrios': 'Canon plasma P',
      },
      '~effectNames': {
        'Biohacked': 'Piratage',
        'Bleeding': 'Saignement',
        'Blunt Resistance Down': 'Résistance au contondant réduite',
        'Burns': 'Brûlure',
        'Chains of Memory': 'Chaîne d\'amnésie',
        'Doom': 'Glas',
        'Gradual Petrification': 'Pétrification graduelle',
        'HP Penalty': 'PV maximum réduits',
        'Kill Command': 'Boucle',
        'Live Wire': 'Charge électrique',
        'Looper': 'Boucle de programme',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Negative Charge': 'Charge négative',
        'Positive Charge': 'Charge positive',
        'Stun': 'Étourdissement',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Augmented Rocket Punch': '強化型ロケットパンチ',
        'Engage!': '戦闘開始！',
        'Level Checker': 'レベルチェッカー',
        'Omega': 'オメガ',
        'Rocket Punch': 'ロケットパンチ',
      },
      'replaceText': {
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
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
        'Enrage': 'Enrage',
        'Executable': 'プログラム実行',
        'Explosion': '爆発',
        'Ferrofluid': 'マグネット',
        'Flamethrower': '火炎放射',
        'Force Quit': '強制終了',
        'Guided Missile Kyrios': '誘導ミサイルP',
        'Iron Kiss': '着弾',
        'Larboard Wave Cannon(?! )': '左舷斉射・波動砲',
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
        'Starboard Wave Cannon(?! )': '右舷斉射・波動砲',
        'Starboard Wave Cannon Surge': '右舷斉射・零式波動砲',
        'Starboard/Larboard Cannon': '右舷/左舷・波動砲',
        'Starboard/Larboard Surge': '右舷/左舷・零式波動砲',
        'Storage Violation': '記憶汚染除去S',
        'Unmitigated Explosion': '大爆発',
        'Update Program': 'サークルプログラム更新',
        'Wave Cannon Kyrios': '波動砲P',
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
    {
      'locale': 'cn',
      'replaceSync': {
        'Augmented Rocket Punch': '强化型火箭飞拳',
        'Engage!': '战斗开始！',
        'Level Checker': '等级检测仪',
        'Omega': '欧米茄',
        'Rocket Punch': '火箭飞拳',
      },
      'replaceText': {
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Afterburner': '燃烧室排热',
        'Atomic Ray': '原子射线',
        'Ballistic Impact': '导弹命中',
        'Ballistic Missile': '导弹发射',
        'Blaster': '冲击波',
        'Charybdis': '大漩涡',
        'Condensed Wave Cannon Kyrios': '大功率波动炮P',
        'Delta Attack': '三角攻击',
        'Diffuse Wave Cannon Kyrios': '扩散波动炮P',
        'Dual Storage Violation': '清除记忆污染P',
        'Electric Slide': '欧米茄滑跃',
        'Engage Ballistics Systems': '射击总控系统启动',
        'Enrage': 'Enrage', // FIXME
        'Executable': '运行程序',
        'Explosion': '爆炸',
        'Ferrofluid': '磁铁',
        'Flamethrower': '火炎放射',
        'Force Quit': '强制结束',
        'Guided Missile Kyrios': '跟踪导弹P',
        'Iron Kiss': '钢铁之吻',
        'Larboard Wave Cannon(?! )': '左舷齐射·波动炮',
        'Larboard Wave Cannon Surge': '左舷齐射·零式波动炮',
        'Long Needle Kyrios': '大型导弹P',
        'Loop': '空翻',
        'MRV Missile Kyrios': '多弹头导弹P',
        'Magnetism': '磁力',
        'Mustard Bomb': '芥末爆弹',
        'Pantokrator': '全能之主',
        'Peripheral Synthesis': '生成外设',
        'Program Loop': '循环程序',
        'Reformat': '最优化',
        'Repel': '相斥',
        'Reset': '初始化',
        'Rush': '突进',
        'Starboard Wave Cannon(?! )': '右舷齐射·波动炮',
        'Starboard Wave Cannon Surge': '右舷齐射·零式波动炮',
        'Starboard/Larboard Cannon': 'Starboard/Larboard Cannon', // FIXME
        'Starboard/Larboard Surge': 'Starboard/Larboard Surge', // FIXME
        'Storage Violation': '清除记忆污染S',
        'Unmitigated Explosion': '大爆炸',
        'Update Program': '更新循环程序',
        'Wave Cannon Kyrios': '波动炮P',
      },
      '~effectNames': {
        'Biohacked': '入侵',
        'Bleeding': '出血',
        'Blunt Resistance Down': '打击耐性降低',
        'Burns': '火伤',
        'Chains of Memory': '连锁遗忘',
        'Doom': '死亡宣告',
        'Gradual Petrification': '渐渐石化',
        'HP Penalty': '最大体力减少',
        'Kill Command': '循环',
        'Live Wire': '电气填充',
        'Looper': '循环程序',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Negative Charge': '磁力（-）',
        'Positive Charge': '磁力（+）',
        'Stun': '眩晕',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Augmented Rocket Punch': '강화형 로켓 주먹',
        'Engage!': '전투 시작!',
        'Level Checker': '레벨 측정기',
        'Omega': '오메가',
        'Rocket Punch': '로켓 주먹',
      },
      'replaceText': {
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Afterburner': '재연소 장치',
        'Atomic Ray': '원자 파동',
        'Ballistic Impact': '미사일 착탄',
        'Ballistic Missile': '미사일 발사',
        'Blaster': '블래스터',
        'Charybdis': '대소용돌이',
        'Condensed Wave Cannon Kyrios': '고출력 파동포 P',
        'Delta Attack': '델타 공격',
        'Diffuse Wave Cannon Kyrios': '확산 파동포 P',
        'Dual Storage Violation': '기억 오염 제거 P',
        'Electric Slide': '오메가 슬라이드',
        'Engage Ballistics Systems': '사격 통제 시스템 기동',
        'Enrage': 'Enrage', // FIXME
        'Executable': '프로그램 실행',
        'Explosion': '폭발',
        'Ferrofluid': '자석',
        'Flamethrower': '화염 방사',
        'Force Quit': '강제 종료',
        'Guided Missile Kyrios': '유도 미사일 P',
        'Iron Kiss': '착탄',
        'Larboard Wave Cannon(?! )': '좌현 사격: 파동포',
        'Larboard Wave Cannon Surge': '좌현 사격: 0식 파동포',
        'Long Needle Kyrios': '대형 미사일 P',
        'Loop': '순환',
        'MRV Missile Kyrios': '다탄두 미사일 P',
        'Magnetism': '자력',
        'Mustard Bomb': '겨자 폭탄',
        'Pantokrator': '전지전능',
        'Peripheral Synthesis': '출력',
        'Program Loop': '순환 프로그램',
        'Reformat': '최적화',
        'Repel': '반발',
        'Reset': '초기화',
        'Rush': '돌진',
        'Starboard Wave Cannon(?! )': '우현 사격: 파동포',
        'Starboard Wave Cannon Surge': '우현 사격: 0식 파동포',
        'Starboard/Larboard Cannon': 'Starboard/Larboard Cannon', // FIXME
        'Starboard/Larboard Surge': 'Starboard/Larboard Surge', // FIXME
        'Storage Violation': '기억 오염 제거 S',
        'Unmitigated Explosion': '대폭발',
        'Update Program': '프로그램 업데이트',
        'Wave Cannon Kyrios': '파동포 P',
      },
      '~effectNames': {
        'Biohacked': '해킹',
        'Bleeding': '고통',
        'Blunt Resistance Down': '타격 저항 감소',
        'Burns': '화상',
        'Chains of Memory': '연쇄 망각',
        'Doom': '죽음의 선고',
        'Gradual Petrification': '서서히 석화',
        'HP Penalty': '최대 HP 감소',
        'Kill Command': '순환',
        'Live Wire': '번개 충전',
        'Looper': '순환 프로그램',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Negative Charge': '자력[-]',
        'Positive Charge': '자력[+]',
        'Stun': '기절',
      },
    },
  ],
}];
