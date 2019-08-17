'use strict';

// O9N - Alphascape 1.0
[{
  zoneRegex: /^(Alphascape \(V1.0\)|Alphascape V1.0)$/,
  timelineFile: 'o9n.txt',
  triggers: [
    {
      id: 'O9N Chaotic Dispersion',
      regex: / 14:314F:Chaos starts using Chaotic Dispersion on (\y{Name})/,
      regexDe: / 14:314F:Chaos starts using Chaos-Dispersion on (\y{Name})/,
      regexFr: / 14:314F:Chaos starts using Dispertion Chaotique on (\y{Name})/,
      regexJa: / 14:314F:カオス starts using カオティックディスパーション on (\y{Name})/,
      alertText: function(data, matches) {
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
      id: 'O9N Orbs Fiend',
      regex: /14:315C:Chaos starts using Fiendish Orbs/,
      regexDe: /14:315C:Chaos starts using Höllenkugeln/,
      regexFr: /14:315C:Chaos starts using Ordre De Poursuite/,
      regexJa: /14:315C:カオス starts using 追尾せよ/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: function(data) {
        return {
          en: 'Orb Tethers',
          de: 'Kugel-Verbindungen',
          fr: 'Attrapez les orbes',
        };
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Chaos': 'Chaos',
        'Chaosphere': 'Chaossphäre',
        'Engage!': 'Start!',
        'dark crystal': 'dunkler Kristall',
        'YOU DARE!': 'Wie könnt ihr es wagen?!',
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
        'Enrage': 'Finalangriff',
        'Fiendish Orbs': 'Höllenkugeln',
        'Knock': 'Einschlag',
        'Knock Down': 'Niederschmettern',
        'Latitudinal Implosion': 'Horizontale Implosion',
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
        'Long/Lat Implosion': 'Horizontale/Vertikale Implosion',

        // FIXME
        '\\(ALL\\)': '(ALL)',
      },
      '~effectNames': {
        'Accretion': 'Chaossumpf',
        'Dynamic Fluid': 'Chaosspritzer',
        'Entropy': 'Chaosflammen',
        'Headwind': 'Chaosböen',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Primordial Crust': 'Chaoserde',
        'Tailwind': 'Chaossturm',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Chaos': 'Chaos',
        'Chaosphere': 'Sphère De Chaos',
        'Engage!': 'À l\'attaque',
        'Dark crystal': 'Cristal noir',
        'YOU DARE!': '... Mon cristal !? Impossible !',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Big Bang': 'Saillie',
        'Blaze': 'Flammes',
        'Bowels of Agony': 'Entrailles de l\'agonie',
        'Chaosphere': 'Sphère de chaos',
        'Chaotic Dispersion': 'Dispersion chaotique',
        'Cyclone': 'Tornade',
        'Damning Edict': 'Décret accablant',
        'Earthquake': 'Séisme',
        'Enrage': 'Enrage',
        'Fiendish Orbs': 'Ordre de poursuite',
        'Knock': 'Impact',
        'Knock Down': '\'Ordre d\'impact',
        'Latitudinal Implosion': 'Implosion horizontale',
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
        'Long/Lat Implosion': 'Implosion Hz/Vert',
        '\\(ALL\\)': '(Tous)',
      },
      '~effectNames': {
        'Accretion': 'Bourbier du chaos',
        'Dynamic Fluid': 'Eaux du chaos',
        'Entropy': 'Flammes du chaos',
        'Headwind': 'Vent du chaos',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Primordial Crust': 'Terre du chaos',
        'Tailwind': 'Vent contraire du chaos',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Chaos': 'カオス',
        'Chaosphere': 'カオススフィア',
        'Engage!': '戦闘開始！',
        'dark crystal': '黒水晶',

        // FIXME
        'YOU DARE!': 'YOU DARE!',
      },
      'replaceText': {
        'Big Bang': '突出',
        'Blaze': 'ほのお',
        'Bowels of Agony': 'バウル・オブ・アゴニー',
        'Chaosphere': 'カオススフィア',
        'Chaotic Dispersion': 'カオティックディスパーション',
        'Cyclone': 'たつまき',
        'Damning Edict': 'ダミングイーディクト',
        'Earthquake': 'じしん',
        'Fiendish Orbs': '追尾せよ',
        'Knock': '着弾',
        'Knock Down': '着弾せよ',
        'Latitudinal Implosion': 'ホリゾンタルインプロージョン',
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

        // FIXME
        'Long/Lat Implosion': 'Long/Lat Implosion',
        '\\(ALL\\)': '(ALL)',
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
  ],
}];
