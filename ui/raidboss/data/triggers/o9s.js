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
      regexFr: / 14:3170:Chaos starts using Dispersion Chaotique on (\y{Name})/,
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
      regexFr: /14:3172:Chaos starts using Implosion Verticale/,
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
      regexFr: /14:3173:Chaos starts using Implosion Horizontale/,
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
      regexFr: /14:3171:Chaos starts using Décret Accablant/,
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
      regexFr: /:\y{Name} gains the effect of (?:Unknown_644|Bourbier du chaos)/,
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
      regexFr: /:\y{Name} gains the effect of (?:Unknown_645|Terre du chaos)/,
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
      regexFr: /14:317D:Chaos starts using Ordre De Poursuite/,
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
      'locale': 'fr',
      'replaceSync': {
        'Engage!': 'À l\'attaque',
      },
      'replaceText': {
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Enrage': 'Enrage',
        'Damning Edict': 'Décret Accablant',
        'Blaze': 'Flammes',
        '\(T/H\) Stray Flames': 'Flammes Du Chaos \(T/H\)',
        'Long/Lat Implosion': 'Implosion Hz/Vert',
        '\(DPS\) Stray Flames': 'Flammes du chaos \(DPS\)',
        'Chaotic Dispersion': 'Dispersion Chaotique',
        'Knock': 'Impact',
        'Big Bang': 'Saillie',
        'Fiendish Orbs': 'Ordre De Poursuite',
        'Cyclone': 'Tornade',
        'Umbra Smash': 'Fracas Ombral',
        'Bowels Of Agony': 'Entrailles De L\'agonie',
        'Soul Of Chaos': 'Âme Du Chaos',
        'Tsunami': 'Raz-De-Marée',
        '\(T/H\) Stray Spray': 'Eaux Du Chaos \(T/H\)',
        '\(DPS\) Stray Spray': 'Eaux Du Chaos \(DPS\)',
        'Earthquake': 'Séisme',
        '\(ALL\) Stray Flames': 'Flammes Du Chaos \(Tous\)',
        '\(ALL\) Stray Spray': 'Eaux Du Chaos \(Tous\)',
        'Stray Gusts': 'Rafales Du Chaos',
        'Stray Earth': 'Terre Du Chaos',
      },
    },
  ],
}];

