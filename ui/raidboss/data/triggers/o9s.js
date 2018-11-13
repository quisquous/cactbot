'use strict';

/* O9S - Alphascape 1.0 Savage*/
[{
  zoneRegex: /^Alphascape V1.0 \(Savage\)$/,
  timelineFile: 'o9s.txt',
  triggers: [
    // General actions
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
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
        if (data.role == 'tank') {
          return {
            en: 'Tank Swap',
            de: 'Tank-Wechsel',
            fr: 'Tank Swap',
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
        } else if (data.role == 'tank') {
          return {
            en: 'tank swap',
            de: 'tenk wechsel',
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
      alertText: function(data) {
        if (data.primordialCrust) {
          return {
            en: 'Die on Front/Back -> Sides',
            de: 'Stirb Vorne/Hinten -> Seiten',
            fr: 'Devant/Derrière puis Côtés',
          };
        }
      },
      infoText: function(data) {
        return {
          en: 'Sides -> Front/Back',
          de: 'Seiten -> Vorne/Hinten',
          fr: 'Côtés puis Devant/Derrière',
        };
      },
      tts: function(data) {
        if (data.primordialCrust) {
          return {
            en: 'die on back',
            de: 'hinten dran',
            fr: 'aller derrière',
          };
        }
        return {
          en: 'go to sides',
          de: 'an die Seiten',
          fr: 'aller sur les cotés',
        };
      },
      run: function(data) {
        delete data.primordialCrust;
      },
    },
    {
      id: 'O9S Latitudinal Implosion',
      regex: /14:3173:Chaos starts using Latitudinal Implosion/,
      regexDe: /14:3173:Chaos starts using Horizontale Implosion/,
      regexFr: /14:3173:Chaos starts using Implosion Horizontale/,
      regexJa: /14:3173:カオス starts using ホリゾンタルインプロージョン/,
      alertText: function(data) {
        if (data.primordialCrust) {
          return {
            en: 'Die on Sides -> Front/Back',
            de: 'Stirb an Seiten -> Vorne/Hinten',
            fr: 'Devant/Derrière puis Côtés',
          };
        }
      },
      infoText: function(data) {
        return {
          en: 'Front/Back -> Sides',
          de: 'Vorne/Hinten -> Seiten',
          fr: 'Devant/Derrière puis Côtés',
        };
      },
      tts: function(data) {
        if (data.primordialCrust) {
          return {
            en: 'die on sides',
            de: 'an die Seiten',
            fr: 'aller sur les cotés',
          };
        }
        return {
          en: 'go to back',
          de: 'hinten dran',
          fr: 'aller derrière',
        };
      },
      run: function(data) {
        delete data.primordialCrust;
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
          de: 'Hinten dran',
          fr: 'Derrière le boss',
        };
      },
    },
    {
      id: 'O9S Orbs Fiend',
      regex: /14:317D:Chaos starts using Fiendish Orbs/,
      regexDe: /14:317D:Chaos starts using Höllenkugeln/,
      regexFr: /14:317D:Chaos starts using Ordre De Poursuite/,
      regexJa: /14:317D:カオス starts using 追尾せよ/,
      alarmText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Orb Tethers',
            de: 'Kugel-Verbindungen',
            fr: 'Récupérez l\'orbe',
          };
        }
      },
      infoText: function(data) {
        if (data.role == 'healer') {
          return {
            en: 'Orb Tethers',
            de: 'Kugel-Verbindungen',
            fr: 'Récupérez l\'orbe',
          };
        }
      },
    },

    // Fire Path
    {
      id: 'O9S Fire Phase Tracking',
      regex: / 14:3186:Chaos starts using Blaze /,
      regexDe: / 14:3186:Chaos starts using /,
      regexFr: / 14:3186:Chaos starts using /,
      regexJa: / 14:3186:カオス starts using /,
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'fire';
      },
    },
    {
      id: 'O9S Entropy Spread',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_640|Entropy) from  for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of (?:Unknown_640|Chaosflammen) from  for (\y{Float}) Seconds/,
      regexFr: /:(\y{Name}) gains the effect of (?:Unknown_640|Flammes du chaos) from  for (\y{Float}) Seconds/,
      regexJa: /:(\y{Name}) gains the effect of (?:Unknown_640|混沌の炎) from  for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      preRun: function(data) {
        data.entropyCount = data.entropyCount || 0;
        data.entropyCount += 1;
      },
      delaySeconds: function(data, matches) {
        // Warn dps earlier to stack.
        if (data.role != 'tank' && data.role != 'healer' && data.entropyCount == 2)
          return parseFloat(matches[2]) - 12;
        return parseFloat(matches[2]) - 5;
      },
      alertText: function(data) {
        if (data.phaseType == 'enrage' || data.phaseType == 'orb' || data.entropyCount == 1) {
          return {
            en: 'Spread',
            de: 'Verteilen)',
            fr: 'Ecartez-vous',
          };
        } else if (data.role == 'tank' || data.role == 'healer') {
          return {
            en: 'Spread and Stay',
            de: 'Verteilen und bleiben',
            fr: 'Ecartez-vous et rester',
          };
        }
        // DPS entropy #2
        return {
          en: 'Stack and Stay Out',
          de: 'Stack und Bleiben',
          fr: 'Empiler et rester',
        };
      },
    },
    {
      id: 'O9S Entropy Avoid Hit',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_640|Entropy) from  for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of (?:Unknown_640|Chaosflammen) from  for (\y{Float}) Seconds/,
      regexFr: /:(\y{Name}) gains the effect of (?:Unknown_640|Flammes du chaos) from  for (\y{Float}) Seconds/,
      regexJa: /:(\y{Name}) gains the effect of (?:Unknown_640|混沌の炎) from  for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me && data.phaseType == 'fire';
      },
      delaySeconds: function(data, matches) {
        // Folks get either the 24 second or the 10 second.
        // So, delay for the opposite minus 5.
        let seconds = parseFloat(matches[2]);
        // Got 24 seconds (dps)
        if (seconds > 11)
          return 5;
        // Got 10 seconds (tank)
        return 19;
      },
      infoText: {
        en: 'Hide Middle',
        de: 'Zur Mitte',
        fr: 'Allez au centre',
      },
    },
    {
      id: 'O9S Fire Big Bang',
      regex: / 14:3180:Chaos starts using Big Bang /,
      regexDe: / 14:3180:Chaos starts using /,
      regexFr: / 14:3180:Chaos starts using /,
      regexJa: / 14:3180:カオス starts using /,
      // Each big bang has its own cast, so suppress.
      suppressSeconds: 1,
      condition: function(data) {
        return data.phaseType == 'fire';
      },
      alertText: {
        en: 'Hide Middle',
        de: 'Zur Mitte',
        fr: 'Allez au centre',
      },
    },

    // Water Path
    {
      id: 'O9S Water Phase Tracking',
      regex: / 14:3187:Chaos starts using Tsunami /,
      regexDe: / 14:3187:Chaos starts using /,
      regexFr: / 14:3187:Chaos starts using /,
      regexJa: / 14:3187:カオス starts using /,
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'water';
      },
    },
    {
      id: 'O9S Dynamic Fluid 1',
      regex: /:\y{Name} gains the effect of (?:Unknown_641|Dynamic Fluid) from/,
      regexDe: /:\y{Name} gains the effect of (?:Unknown_641|Chaosspritzer) from/,
      regexFr: /:\y{Name} gains the effect of (?:Unknown_641|Eaux du chaos) from/,
      regexJa: /:\y{Name} gains the effect of (?:Unknown_641|混沌の水) from/,
      condition: function(data) {
        return data.phaseType == 'water';
      },
      suppressSeconds: 1,
      // T/H get 10s & DPS get 17s
      delaySeconds: 5,
      infoText: {
        en: 'Stack Donut',
        de: 'Sammeln Donut',
        fr: 'Empiler Donut',
      },
    },
    {
      id: 'O9S Dynamic Fluid 2',
      regex: /:\y{Name} gains the effect of (?:Unknown_641|Dynamic Fluid) from/,
      regexDe: /:\y{Name} gains the effect of (?:Unknown_641|Chaosspritzer) from/,
      regexFr: /:\y{Name} gains the effect of (?:Unknown_641|Eaux du chaos) from/,
      regexJa: /:\y{Name} gains the effect of (?:Unknown_641|混沌の水) from/,
      condition: function(data) {
        return data.phaseType == 'water';
      },
      suppressSeconds: 1,
      // T/H get 10s & DPS get 17s
      delaySeconds: 12,
      infoText: {
        en: 'Stack Donut',
        de: 'Sammeln Donut',
        fr: 'Empiler Donut',
      },
    },
    {
      id: 'O9S Dynamic Fluid 3',
      regex: /:\y{Name} gains the effect of (?:Unknown_641|Dynamic Fluid) from/,
      regexDe: /:\y{Name} gains the effect of (?:Unknown_641|Chaosspritzer) from/,
      regexFr: /:\y{Name} gains the effect of (?:Unknown_641|Eaux du chaos) from/,
      regexJa: /:\y{Name} gains the effect of (?:Unknown_641|混沌の水) from/,
      condition: function(data) {
        return data.phaseType == 'enrage';
      },
      suppressSeconds: 1,
      // enrage -> 6s
      delaySeconds: 1,
      infoText: {
        en: 'Stack Donut',
        de: 'Sammeln Donut',
        fr: 'Empiler Donut',
      },
    },
    {
      id: 'O9S Knock Down Marker',
      regex: / 1B:........:(\y{Name}):0000:0000:0057:0000:0000:0000:/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      alertText: function(data) {
        if (data.phaseType == 'water') {
          return {
            en: 'Drop Outside',
            de: 'Gehe Nord / Süd',
            fr: 'Aller Nord / Sud',
          };
        } else if (data.phaseType == 'wind') {
          return {
            en: 'Drop Outside + Knockback',
            de: 'Geh nächste Ecke nah am Tornado',
            fr: 'Aller au prochain coin près du Tornade',
          };
        }
      },
    },

    // Wind Path
    {
      id: 'O9S Wind Phase Tracking',
      regex: / 14:3188:Chaos starts using Cyclone /,
      regexDe: / 14:3188:Chaos starts using /,
      regexFr: / 14:3188:Chaos starts using /,
      regexJa: / 14:3188:カオス starts using /,
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'wind';
      },
    },
    {
      id: 'O9S Headwind',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_642|Headwind) from  for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of (?:Unknown_642|Chaosböen) from  for (\y{Float}) Seconds/,
      regexFr: /:(\y{Name}) gains the effect of (?:Unknown_642|Vent du chaos) from  for (\y{Float}) Seconds/,
      regexJa: /:(\y{Name}) gains the effect of (?:Unknown_642|混沌の風) from  for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.wind = 'head';
      },
    },
    {
      id: 'O9S Tailwind',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_643|Tailwind) from  for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of (?:Unknown_643|Chaossturm) from  for (\y{Float}) Seconds/,
      regexFr: /:(\y{Name}) gains the effect of (?:Unknown_643|Vent contraire du chaos) from  for (\y{Float}) Seconds/,
      regexJa: /:(\y{Name}) gains the effect of (?:Unknown_643|混沌の逆風) from  for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me;
      },
      run: function(data) {
        data.wind = 'tail';
      },
    },
    {
      id: 'O9S Cyclone Knockback',
      regex: / 14:318F:Chaos starts using Cyclone /,
      regexDe: / 14:318F:Chaos starts using /,
      regexFr: / 14:318F:Chaos starts using /,
      regexJa: / 14:318F:カオス starts using /,
      alarmText: function(data) {
        if (data.wind == 'head') {
          return {
            en: 'Back to Tornado',
            de: 'Rücken zum Tornado',
            fr: 'Se détourner de la tornade',
          };
        }
        if (data.wind == 'tail') {
          return {
            en: 'Face the Tornado',
            de: 'Zum Tornado hin',
            fr: 'Se tourner vers la tornade',
          };
        }
      },
      run: function(data) {
        delete data.wind;
      },
    },

    // Earth Path
    {
      id: 'O9S Earth Phase Tracking',
      regex: / 14:3189:Chaos starts using Earthquake /,
      regexDe: / 14:3189:Chaos starts using /,
      regexFr: / 14:3189:Chaos starts using /,
      regexJa: / 14:3189:カオス starts using /,
      run: function(data) {
        if (data.phaseType != 'enrage')
          data.phaseType = 'earth';
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
        if (data.phaseType != 'earth') {
          return {
            en: 'Heal All to Full',
            de: 'Alle vollheilen',
            fr: 'Soignez vie pleine tout le monde',
          };
        }
        return {
          en: 'Heal Tanks/Healers to full',
          de: 'Tanks/Heiler vollheilen',
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
        return data.me == matches[1] && data.phaseType != 'orb';
      },
      preRun: function(data, matches) {
        data.primordialCrust = true;
      },
      infoText: function(data) {
        return {
          en: 'Die on next mechanic',
          de: 'An nächster Mechanik tödlichen Schaden nehmen',
          fr: 'Mourrez sur la prochaine mécanique',
        };
      },
    },
    {
      id: 'O9S Earth Stack Marker',
      regex: / 1B:........:(\y{Name}):0000:0000:003E:0000:0000:0000:/,
      suppressSeconds: 10,
      infoText: function(data) {
        return {
          en: 'Stack with partner',
          de: 'Stacks verteilen',
          fr: 'Ecartez-vous et empiler',
        };
      },
    },

    // Orb Phase
    {
      id: 'O9S Orb Phase Tracking',
      regex: / 14:318A:Chaos starts using Bowels Of Agony /,
      regexDe: / 14:318A:Chaos starts using /,
      regexFr: / 14:318A:Chaos starts using /,
      regexJa: / 14:318A:カオス starts using /,
      preRun: function(data) {
        data.phaseType = 'orb';
      },
    },
    {
      id: 'O9S Orb Entropy',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_640|Entropy) from  for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of (?:Unknown_640|Chaosflammen) from  for (\y{Float}) Seconds/,
      regexFr: /:(\y{Name}) gains the effect of (?:Unknown_640|Flammes du chaos) from  for (\y{Float}) Seconds/,
      regexJa: /:(\y{Name}) gains the effect of (?:Unknown_640|混沌の炎) from  for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] != data.me && data.phaseType == 'orb';
      },
      suppressSeconds: 10,
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 3;
      },
      alertText: function(data) {
        if (data.head == 'wind') {
          return {
            en: 'Back to DPS',
            de: 'Rücken zum DPS',
            fr: 'Dos au DPS',
          };
        }
      },
      run: function(data) {
        delete data.wind;
      },
    },
    {
      id: 'O9S Orb Dynamic Fluid',
      regex: /:(\y{Name}) gains the effect of (?:Unknown_641|Dynamic Fluid) from  for (\y{Float}) Seconds/,
      regexDe: /:(\y{Name}) gains the effect of (?:Unknown_641|Chaosspritzer) from  for (\y{Float}) Seconds/,
      regexFr: /:(\y{Name}) gains the effect of (?:Unknown_641|Eaux du chaos) from  for (\y{Float}) Seconds/,
      regexJa: /:(\y{Name}) gains the effect of (?:Unknown_641|混沌の水) from  for (\y{Float}) Seconds/,
      condition: function(data, matches) {
        return matches[1] == data.me && data.phaseType == 'orb';
      },
      delaySeconds: function(data, matches) {
        return parseFloat(matches[2]) - 5;
      },
      infoText: function(data) {
        return {
          en: 'Hit DPS with Water',
          de: 'töte deinen DPS',
          fr: 'tuez votre DPS',
        };
      },
    },

    // Enrage Phase
    {
      id: 'O9S Enrage Phase Tracking',
      regex: / 14:3186:Chaos starts using Blaze /,
      regexDe: / 14:3186:Chaos starts using /,
      regexFr: / 14:3186:Chaos starts using /,
      regexJa: / 14:3186:カオス starts using /,
      run: function(data) {
        data.blazeCount = data.blazeCount || 0;
        data.blazeCount++;
        if (data.blazeCount >= 3)
          data.phaseType = 'enrage';
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
