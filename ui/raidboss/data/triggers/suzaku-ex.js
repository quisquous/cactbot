'use strict';

// Suzaku Extreme
[{
  zoneRegex: /^Hells\' Kier \(Extreme\)$/,
  timelineFile: 'suzaku-ex.txt',
  triggers: [
    {
      id: 'SuzEx Cremate',
      regex: / 14:32D1:Suzaku starts using Cremate on (\y{Name})/,
      regexFr: / 14:32D1:Suzaku starts using Crématorium on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tenkbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
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
        }
      },
    },
    {
      id: 'SuzEx Phantom Flurry',
      regex: / 14:32DC:Suzaku starts using/,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      alertText: {
        en: 'Tank Buster',
        de: 'Tenkbuster',
        fr: 'Tankbuster',
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
      id: 'SuzEx Mesmerizing Melody',
      regex: / 14:32DA:Suzaku starts using Mesmerizing Melody/,
      regexFr: / 14:32DA:Suzaku starts using Mélodie Hypnotique/,
      alertText: {
        en: 'Get Out',
        fr: 'Allez au bord extérieur',
      },
    },
    {
      id: 'SuzEx Ruthless Refrain',
      regex: / 14:32DB:Suzaku starts using Ruthless Refrain/,
      regexFr: / 14:32DB:Suzaku starts using Refrain Impitoyable/,
      alertText: {
        en: 'Get In',
        fr: 'Allez au bord intérieur',
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
        'Screams Of The Damned': 'Cris Des Damnés',
        'Rout': 'Irruption',
        'Rekindle': 'Ravivement',
        'Fleeting Summer': 'Ailes Vermillon',
        'Cremate': 'Crématorium',
        'Phoenix Down': 'Queue De Phénix',
        'Wing And A Prayer': 'Prière De Pennes',
        'Eternal Flame': 'Flamme Éternelle',
        'Scarlet Hymn': 'Hymne Vermillon',
        'Scarlet Fever': 'Fièvre Écarlate',
        'Southron Star': 'Étoile Australe',
        'Mesmerizing Melody': 'Mélodie Hypnotique',
        'Well Of Flame': 'Puits Ardent',
        'Scathing Net': 'Étoiles Des Enfers',
        'Phantom Flurry': 'Frénésie Spectrale',
        'Phantom Half': 'Frénésie - Moitié de plateau',
        'Hotspot x8': 'Couleurs x8',
        'Ruthless/Mesmerizing': 'Refrain/Mélodie',
        'Close-Quarter Crescendo': 'Mélopée Fantoche',
        'Pay The Piper': 'Marche forcée',
        'Incandescent Interlude': 'Mélopée Incandescente',
        'Ruthless Refrain': 'Refrain Impitoyable',
        'Hotspot x4': 'Couleurs x4',
        'Hotspot Enrage': 'Enrage',
      },
    },
  ],
}];
