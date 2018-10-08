'use strict';

// TODO: add phase tracking
// TODO: add Big Bang "get middle" for fire phase
// TODO: track primordial crust debuff, and call out lat/long differently
// TODO: move timeline triggers for stray flames to "Entropy" debuff tracking.
// TODO: add dynamic fluid vs entropy trigger for hitting your orb partner?
// TODO: stack head marker in fire phase?
// TODO: healer head markers for dropping orbs
// TODO: add headwind/tailwind debuff tracking
// TODO: handle accretion based on phase (everybody gets accretion at the end, not just T/H)

// Entropy: Unknown_640
// Dynamic Fluid: Unknown_641
// Headwind: Unknown_642
// Tailwind: Unknown_643
// Accretion: Unknown_644
// Primordial Crust: Unknown_645

/* O9S - Alphascape 1.0 Savage*/
[{
  zoneRegex: /^Alphascape V1.0 \(Savage\)$/,
  timelineFile: 'o9s.txt',
  timelineTriggers: [
    {
      id: 'O9S TH Spread',
      regex: /\(T\/H\) Stray Flames/,
      beforeSeconds: 4,
      alertText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Spread (Tanks/Healers)',
            fr: 'Ecartez-vous (Tanks/Healers)',
          };
        }
      },
      infoText: function(data) {
        if (data.role != 'tank' && data.role != 'healer') {
          return {
            en: 'Hide Middle',
            fr: 'Allez au centre',
          };
        }
      },
    },
    {
      id: 'O9S DPS Spread',
      regex: /\(DPS\) Stray Flames/,
      beforeSeconds: 4,
      alertText: function(data) {
        if (data.role != 'tank' && data.role != 'healer') {
          return {
            en: 'Spread (DPS)',
            fr: 'Ecartez-vous (DPS)',
          };
        }
      },
      infoText: function(data) {
        if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Hide Middle',
            fr: 'Allez au centre',
          };
        }
      },
    },
    {
      id: 'O9S ALL Spread',
      regex: /\(All\) Stray Flames/,
      beforeSeconds: 4,
      alertText: {
        en: 'Spread (Everyone)',
        fr: 'Ecartez-vous (Tout le monde)',
      },
    },
  ],
  triggers: [
    {
      id: 'O9S Chaotic Dispersion',
      regex: / 14:3170:Chaos starts using Chaotic Dispersion on (\y{Name})/,
      regexDe: / 14:3170:Chaos starts using Chaos-Dispersion on (\y{Name})/,
      regexFr: / 14:3170:Chaos starts using Dispersion Chaotique on (\y{Name})/,
      regexJa: / 14:3170:カオス starts using カオティックディスパーション on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Tank Swap',
            fr: 'Tank Swap',
          };
        }
        if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.ShortName(matches[1]),
            de: 'Tenkbuster auf ' + data.ShortName(matches[1]),
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
        } else if (data.role == 'tank') {
          return {
            en: 'tank swap',
            fr: 'tank swap',
          };
        }
      },
    },
    {
      id: 'O9S Longitudinal Implosion',
      regex: /14:3172:Chaos starts using Longitudinal Implosion/,
      regexDe: /14:3172:Chaos starts using Vertikale Implosion/,
      regexFr: /14:3172:Chaos starts using Implosion Verticale/,
      regexJa: /14:3172:カオス starts using ヴァーティカルインプロージョン/,
      infoText: function(data) {
        return {
          en: 'Sides -> Front/Back',
          fr: 'Côtés puis Devant/Derrière',
        };
      },
      tts: function(data) {
        return {
          en: 'go to sides',
          fr: 'aller sur les cotés',
        };
      },
    },
    {
      id: 'O9S Latitudinal Implosion',
      regex: /14:3173:Chaos starts using Latitudinal Implosion/,
      regexDe: /14:3173:Chaos starts using Horizontale Implosion/,
      regexFr: /14:3173:Chaos starts using Implosion Horizontale/,
      regexJa: /14:3173:カオス starts using ホリゾンタルインプロージョン/,
      infoText: function(data) {
        return {
          en: 'Front/Back -> Sides',
          fr: 'Devant/Derrière puis Côtés',
        };
      },
      tts: function(data) {
        return {
          en: 'go to back',
          fr: 'aller derrière',
        };
      },
    },
    {
      id: 'O9S Damning Edict',
      regex: /14:3171:Chaos starts using Damning Edict/,
      regexDe: /14:3171:Chaos starts using Verdammendes Edikt/,
      regexFr: /14:3171:Chaos starts using Décret Accablant/,
      regexJa: /14:3171:カオス starts using ダミングイーディクト/,
      infoText: function(data) {
        return {
          en: 'Get Behind',
          fr: 'Derrière le boss',
        };
      },
    },
    {
      id: 'O9S Accretion',
      regex: /:\y{Name} gains the effect of (?:Unknown_644|Accretion)/,
      regexDe: /:\y{Name} gains the effect of (?:Unknown_644|Chaossumpf)/,
      regexFr: /:\y{Name} gains the effect of (?:Unknown_644|Bourbier du chaos)/,
      regexJa: /:\y{Name} gains the effect of (?:Unknown_644|混沌の泥土)/,
      condition: function(data) {
        return data.role == 'healer';
      },
      suppressSeconds: 10,
      infoText: function(data) {
        return {
          en: 'Heal Tanks/Healers to full',
          fr: 'Soignez Heals/Tanks full vie',
        };
      },
    },
    {
      id: 'O9S Primordial Crust',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_645|Primordial Crust)/,
      regexDe: /:(\y{Name}) gains the effect of (?:Unknown_645|Chaoserde)/,
      regexFr: /:(\y{Name}) gains the effect of (?:Unknown_645|Terre du chaos)/,
      regexJa: /:(\y{Name}) gains the effect of (?:Unknown_645|混沌の土)/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: function(data) {
        return {
          en: 'Die on next mechanic',
          fr: 'Mourrez sur la prochaine mécanique',
        };
      },
    },
    {
      id: 'O9S Orbs Fiend',
      regex: /14:317D:Chaos starts using Fiendish Orbs/,
      regexDe: /14:317D:Chaos starts using Höllenkugeln/,
      regexFr: /14:317D:Chaos starts using Ordre De Poursuite/,
      regexJa: /14:317D:カオス starts using 追尾せよ/,
      condition: function(data) {
        return data.role == 'tank';
      },
      alarmText: function(data) {
        return {
          en: 'Orb Tethers',
          fr: 'Récupérez l\'orbe',
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
        'dark crystal': 'dunkl[a] Kristall',
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

        // FIXME
        'Long/Lat Implosion': 'Hz/Vert Implosion',
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
        'Knock Down': 'Ordre d\'impact',
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
