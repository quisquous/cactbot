'use strict';

// O9N - Alphascape 1.0
[{
  zoneRegex: /^Alphascape \(V1\.0\)$/,
  timelineFile: 'o9n.txt',
  triggers: [
    {
      id: 'O9N Chaotic Dispersion',
      regex: Regexes.startsUsing({ id: '314F', source: 'Chaos' }),
      regexDe: Regexes.startsUsing({ id: '314F', source: 'Chaos' }),
      regexFr: Regexes.startsUsing({ id: '314F', source: 'Chaos' }),
      regexJa: Regexes.startsUsing({ id: '314F', source: 'カオス' }),
      regexCn: Regexes.startsUsing({ id: '314F', source: '卡奥斯' }),
      regexKo: Regexes.startsUsing({ id: '314F', source: '카오스' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches.target),
            de: 'Tankbuster auf ' + data.ShortName(matches.target),
            fr: 'Tankbuster sur ' + data.ShortName(matches.target),
          };
        }
      },
      tts: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'buster',
            de: 'basta',
            fr: 'tankbuster',
          };
        }
      },
    },
    {
      id: 'O9N Orbs Fiend',
      regex: Regexes.startsUsing({ id: '315C', source: 'Chaos', capture: false }),
      regexDe: Regexes.startsUsing({ id: '315C', source: 'Chaos', capture: false }),
      regexFr: Regexes.startsUsing({ id: '315C', source: 'Chaos', capture: false }),
      regexJa: Regexes.startsUsing({ id: '315C', source: 'カオス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '315C', source: '卡奥斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '315C', source: '카오스', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: {
        en: 'Orb Tethers',
        de: 'Kugel-Verbindungen',
        fr: 'Attrapez les orbes',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Chaos': 'Chaos',
        'Chaosphere': 'Chaossphäre',
        'YOU DARE!': 'Wie könnt ihr es wagen?!',
        'dark crystal': 'dunkl(?:e|er|es|en) Kristall',
      },
      'replaceText': {
        '--targetable--': '--anvisierbar--',
        '--untargetable--': '--nich anvisierbar--',
        'Big Bang': 'Quantengravitation',
        'Blaze': 'Flamme',
        'Bowels of Agony': 'Quälende Eingeweide',
        'Chaosphere': 'Chaossphäre',
        'Chaotic Dispersion': 'Chaos-Dispersion',
        'Cyclone': 'Tornado',
        'Damning Edict': 'Verdammendes Edikt',
        'Earthquake': 'Erdbeben',
        'Fiendish Orbs': 'Höllenkugeln',
        'Knock Down': 'Niederschmettern',
        'Knock(?! )': 'Einschlag',
        'Latitudinal Implosion': 'Horizontale Implosion',
        'Long/Lat Implosion': 'Horizontale/Vertikale Implosion',
        'Longitudinal Implosion': 'Vertikale Implosion',
        'Orbshadow': 'Kugelschatten',
        'Shockwave': 'Schockwelle',
        'Soul of Chaos': 'Chaosseele',
        'Stray Earth': 'Chaoserde',
        'Stray Flames': 'Chaosflammen',
        'Stray Gusts': 'Chaosböen',
        'Stray Spray': 'Chaosspritzer',
        'Tsunami': 'Tsunami',
        'Umbra Smash': 'Schattenschlag',
        '\\(ALL\\)': '\\(ALL\\)', // FIXME
      },
      '~effectNames': {
        'Accretion': 'Chaossumpf',
        'Dynamic Fluid': 'Chaosspritzer',
        'Entropy': 'Chaosflammen',
        'Headwind': 'Chaosböen',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Physical Vulnerability Up': 'Erhöhte physische Verwundbarkeit',
        'Primordial Crust': 'Chaoserde',
        'Tailwind': 'Chaossturm',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chaos': 'Chaos',
        'Chaosphere': 'Sphère de chaos',
        'YOU DARE!': '... Mon cristal !? Impossible !',
        'dark crystal': 'cristal noir',
      },
      'replaceText': {
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Big Bang': 'Saillie',
        'Blaze': 'Fournaise',
        'Bowels of Agony': 'Entrailles de l\'agonie',
        'Chaosphere': 'Sphère de chaos',
        'Chaotic Dispersion': 'Dispersion chaotique',
        'Cyclone': 'Tornade',
        'Damning Edict': 'Décret accablant',
        'Earthquake': 'Grand séisme',
        'Fiendish Orbs': 'Ordre de poursuite',
        'Knock Down': 'Ordre d\'impact',
        'Knock(?! )': 'Impact',
        'Latitudinal Implosion': 'Implosion horizontale',
        'Long/Lat Implosion': 'Implosion Hz/Vert',
        'Longitudinal Implosion': 'Implosion verticale',
        'Orbshadow': 'Poursuite',
        'Shockwave': 'Onde de choc',
        'Soul of Chaos': 'Âme du chaos',
        'Stray Earth': 'Terre du chaos',
        'Stray Flames': 'Flammes du chaos',
        'Stray Gusts': 'Vent du chaos',
        'Stray Spray': 'Eaux du chaos',
        'Tsunami': 'Raz-de-marée',
        'Umbra Smash': 'Fracas ombral',
        '\\(ALL\\)': '(Tous)',
      },
      '~effectNames': {
        'Accretion': 'Bourbier du chaos',
        'Dynamic Fluid': 'Eaux du chaos',
        'Entropy': 'Flammes du chaos',
        'Headwind': 'Vent du chaos',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Physical Vulnerability Up': 'Vulnérabilité physique augmentée',
        'Primordial Crust': 'Terre du chaos',
        'Tailwind': 'Vent contraire du chaos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chaos': 'カオス',
        'Chaosphere': 'カオススフィア',
        'YOU DARE!': 'YOU DARE!', // FIXME
        'dark crystal': '黒水晶',
      },
      'replaceText': {
        '--targetable--': '--targetable--',
        '--untargetable--': '--untargetable--',
        'Big Bang': '突出',
        'Blaze': 'ほのお',
        'Bowels of Agony': 'バウル・オブ・アゴニー',
        'Chaosphere': 'カオススフィア',
        'Chaotic Dispersion': 'カオティックディスパーション',
        'Cyclone': 'たつまき',
        'Damning Edict': 'ダミングイーディクト',
        'Earthquake': 'じしん',
        'Fiendish Orbs': '追尾せよ',
        'Knock Down': '着弾せよ',
        'Knock(?! )': '着弾',
        'Latitudinal Implosion': 'ホリゾンタルインプロージョン',
        'Long/Lat Implosion': 'Long/Lat Implosion', // FIXME
        'Longitudinal Implosion': 'ヴァーティカルインプロージョン',
        'Orbshadow': '追尾',
        'Shockwave': '衝撃波',
        'Soul of Chaos': 'ソウル・オブ・カオス',
        'Stray Earth': '混沌の土',
        'Stray Flames': '混沌の炎',
        'Stray Gusts': '混沌の風',
        'Stray Spray': '混沌の水',
        'Tsunami': 'つなみ',
        'Umbra Smash': 'アンブラスマッシュ',
        '\\(ALL\\)': '\\(ALL\\)', // FIXME
      },
      '~effectNames': {
        'Accretion': '混沌の泥土',
        'Dynamic Fluid': '混沌の水',
        'Entropy': '混沌の炎',
        'Headwind': '混沌の風',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Primordial Crust': '混沌の土',
        'Tailwind': '混沌の逆風',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Chaos': '混沌',
        'Chaosphere': '混沌晶球',
        'YOU DARE!': 'YOU DARE!', // FIXME
        'dark crystal': '黑水晶',
      },
      'replaceText': {
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Big Bang': '돌출',
        'Blaze': '炎爆',
        'Bowels of Agony': '深层痛楚',
        'Chaosphere': '混沌晶球',
        'Chaotic Dispersion': '散布混沌',
        'Cyclone': '龙卷风',
        'Damning Edict': '诅咒敕令',
        'Earthquake': '大地震',
        'Fiendish Orbs': '追踪',
        'Knock Down': '中弹',
        'Knock(?! )': 'Knock', // FIXME
        'Latitudinal Implosion': '纬度聚爆',
        'Long/Lat Implosion': 'Long/Lat Implosion', // FIXME
        'Longitudinal Implosion': '经度聚爆',
        'Orbshadow': '追踪',
        'Shockwave': '冲击波',
        'Soul of Chaos': '混沌之魂',
        'Stray Earth': '混沌之土',
        'Stray Flames': '混沌之炎',
        'Stray Gusts': '混沌之风',
        'Stray Spray': '混沌之水',
        'Tsunami': '海啸',
        'Umbra Smash': '本影爆碎',
        '\\(ALL\\)': '\\(ALL\\)', // FIXME
      },
      '~effectNames': {
        'Accretion': '混沌之泥土',
        'Dynamic Fluid': '混沌之水',
        'Entropy': '混沌之炎',
        'Headwind': '混沌之风',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Physical Vulnerability Up': '物理受伤加重',
        'Primordial Crust': '混沌之土',
        'Tailwind': '混沌之逆风',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Chaos': '혼돈',
        'Chaosphere': '혼돈의 구체',
        'YOU DARE!': 'YOU DARE!', // FIXME
        'dark crystal': '흑수정',
      },
      'replaceText': {
        '--targetable--': '--targetable--', // FIXME
        '--untargetable--': '--untargetable--', // FIXME
        'Big Bang': '顶起',
        'Blaze': '화염',
        'Bowels of Agony': '고통의 심핵',
        'Chaosphere': '혼돈의 구체',
        'Chaotic Dispersion': '혼돈 유포',
        'Cyclone': '회오리',
        'Damning Edict': '파멸 포고',
        'Earthquake': '대지진',
        'Fiendish Orbs': '추격하라',
        'Knock Down': '착탄하라',
        'Knock(?! )': 'Knock', // FIXME
        'Latitudinal Implosion': '가로 내파',
        'Long/Lat Implosion': 'Long/Lat Implosion', // FIXME
        'Longitudinal Implosion': '세로 내파',
        'Orbshadow': '추격',
        'Shockwave': '충격파',
        'Soul of Chaos': '혼돈의 영혼',
        'Stray Earth': '혼돈의 흙',
        'Stray Flames': '혼돈의 불',
        'Stray Gusts': '혼돈의 바람',
        'Stray Spray': '혼돈의 물',
        'Tsunami': '해일',
        'Umbra Smash': '그림자 타격',
        '\\(ALL\\)': '\\(ALL\\)', // FIXME
      },
      '~effectNames': {
        'Accretion': '혼돈의 진흙',
        'Dynamic Fluid': '혼돈의 물',
        'Entropy': '혼돈의',
        'Headwind': '혼돈의',
        'Magic Vulnerability Up': '받는 마법 피해량 증가',
        'Physical Vulnerability Up': '받는 물리 피해량 증가',
        'Primordial Crust': '혼돈의 흙',
        'Tailwind': '혼돈의 역풍',
      },
    },
  ],
}];
