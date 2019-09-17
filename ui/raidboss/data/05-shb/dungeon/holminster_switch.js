'use strict';

[{
  zoneRegex: /^Holminster Switch$/,
  timelineFile: 'holminster_switch.txt',
  triggers: [
    {
      id: 'Holminster Path of Light',
      regex: / 14:3DC5:Forgiven Dissonance starts using Path Of Light/,
      regexDe: / 14:3DC5:Geläuterter Widerspruch starts using Pfad Des Lichts/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
      },
    },
    {
      id: 'Holminster Pillory',
      regex: / 14:3DC4:Forgiven Dissonance starts using Pillory on (\y{Name})/,
      regexDe: / 14:3DC4:Geläuterter Widerspruch starts using Herzreißer on (\y{Name})/,
      regexFr: / 14:3DC4:Dissonance Pardonnée starts using Pilori on (\y{Name})/,
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
    },
    {
      id: 'Holminster Tickler',
      regex: / 14:3DCF:Tesleen, [tT]he Forgiven starts using The Tickler on (\y{Name})/,
      regexDe: / 14:3DCF:Tesleen die Bekehrte starts using Handauflegung on (\y{Name})/,
      regexFr: / 14:3DCF:Tesleen Pardonnée starts using Chatouillement on (\y{Name})/,
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
    },
    {
      id: 'Holminster Bridle',
      regex: / 14:3DD0:Tesleen, [tT]he Forgiven starts using Scold's Bridle/,
      regexDe: / 14:3DD0:Tesleen die Bekehrte starts using Schandmal/,
      regexFr: / 14:3DD0:Tesleen Pardonnée starts using Bride-Bavarde/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Holminster Flagellation',
      regex: / 14:3DD5:Tesleen, [tT]he Forgiven starts using Flagellation/,
      regexDe: / 14:3DD5:Tesleen die Bekehrte starts using Grimmige Geißelung/,
      regexFr: / 14:3DD5:Tesleen Pardonnée starts using Flagellation/,
      infoText: {
        en: 'spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'Holminster Exorcise Stack',
      regex: /1B:........:(\y{Name}):....:....:003E:/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          de: 'Auf ' + data.ShortName(matches[1]) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Holminster Scavenger',
      regex: / 14:3DD8:Philia starts using Scavenger's Daughter/,
      regexDe: / 14:3DD8:Philia starts using Radebrechen/,
      regexFr: / 14:3DD8:Philia starts using Fille Du Boueur/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        de: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Holminster Head Crusher',
      regex: / 14:3DD7:Philia starts using Head Crusher on (\y{Name})/,
      regexDe: / 14:3DD7:Philia starts using Knochenmalmer on (\y{Name})/,
      regexFr: / 14:3DD7:Philia starts using Écraseur De Tête on (\y{Name})/,
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
    },
    {
      id: 'Holminster Chain Down',
      regex: /1B:........:(\y{Name}):....:....:005C:/,
      condition: function(data, matches) {
        return data.me != matches[1];
      },
      infoText: function(data, matches) {
        return {
          en: 'Break chain on ' + data.ShortName(matches[1]),
          de: 'Kette von ' + data.ShortName(matches[1]) + ' brechen',
          fr: 'Cassez les chaînes de ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Holminster Taphephobia',
      regex: /1B:........:(\y{Name}):....:....:008B:/,
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'Holminster Into The Light',
      regex: / 14:4350:Philia starts using Into The Light/,
      regexDe: / 14:4350:Philia starts using Läuterndes Licht/,
      regexFr: / 14:4350:Philia starts using Dans La Lumière/,
      infoText: {
        en: 'Line Stack',
        de: 'Sammeln in einer Linie',
        fr: 'Packez-vous en ligne',
      },
    },
    {
      id: 'Holminster Left Knout',
      regex: / 14:3DE7:Philia starts using Left Knout/,
      regexDe: / 14:3DE7:Philia starts using Linker Staupenschlag/,
      regexFr: / 14:3DE7:Philia starts using Knout Gauche/,
      alertText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite ',
      },
    },
    {
      id: 'Holminster Right Knout',
      regex: / 14:3DE6:Philia starts using Right Knout/,
      regexDe: / 14:3DE6:Philia starts using Rechter Staupenschlag/,
      regexFr: / 14:3DE6:Philia starts using Knout Droit/,
      alertText: {
        en: 'Left',
        de: 'Links',
        fr: 'Gauche',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Wound': 'Lavendellichtung',
        'Forgiven Dissonance': 'Geläuterter Widerspruch',
        'The Auction': 'Viehmarkt',
        'Tesleen, the Forgiven': 'Tesleen die Bekehrte',
        'The manor': 'Garten des Herrenhauses',
        'Philia': 'Philia',
      },
      'replaceText': {
        'Aethersup': 'Ätherfresser',
        'Brazen Bull': 'Garotte',
        'Chain Down': 'Schneidende Fesseln',
        'Exorcise': 'Ikonenschreck',
        'Fevered Flagellation': 'Grimmige Geißelung',
        'Fierce Beating': 'Gnadenlose Geißel',
        'Gibbet Cage': 'Eiserne Jungfrau',
        'Head Crusher': 'Knochenmalmer',
        'Heretic\'s Fork': 'Ketzerspieß',
        'Holy Water': 'Segenszeichen',
        'Into The Light': 'Läuterndes Licht',
        'Left/Right Knout': 'Linker/Rechter Staupenschlag',
        'Light Shot': 'Lichtschuss',
        'Pendulum': 'Grube und Pendel',
        'Pillory': 'Herzreißer',
        'Right/Left Knout': 'Rechter/Linker Staupenschlag',
        'Scavenger\'s Daughter': 'Radebrechen',
        'Scold\'s Bridle': 'Schandmal',
        'Taphephobia': 'Taphephobie',
        'The Path Of Light': 'Pfad des Lichts',
        'The Tickler': 'Handauflegung',
        'Thumbscrew': 'Pfählung',
        'Wooden Horse': 'Estrapade',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The Wound will be sealed off': 'Fermeture de La Talure',
        'The Auction will be sealed off': 'Fermeture de la place du Cheptel',
        'The manor house will be sealed off': 'Fermeture de l\'esplanade du Manoir',
        'is no longer sealed': 'Ouverture de',
        'Tesleen, the Forgiven': 'Tesleen pardonnée',
      },
      'replaceText': {
        'Engage!': 'À l\'attaque',
        '--Reset--': '--Réinitialisation--',
        '--sync--': '--Synchronisation--',
        '--targetable--': '--Ciblable--',
        '--untargetable--': '--Impossible à cibler--',
        'Enrage': 'Enrage',
        'The Path Of Light': 'Voie de lumière',
        'Brazen Bull': 'Taureau d\'airain',
        'Gibbet Cage': 'Gibet de fer',
        'Thumbscrew': 'Ecraseur à vis',
        'Heretic\'s Fork': 'Fourche hérétique',
        'Light Shot': 'Tir de lumière',
        'Wooden Horse': 'Chevalet',
        'Pillory': 'Pilori',
        'The Tickler': 'Chatouillement',
        'Scold\'s Bridle': 'Bride-Bavarde',
        'Fevered Flagellation': 'Flagellation frénétique',
        'Exorcise': 'Exorcisme',
        'Holy Water': 'Eau bénite',
        'Into The Light': 'Dans la lumière',
        'Pendulum Tank': 'Lame pendulaire Tank',
        'Pendulum Center': 'Lame pendulaire Centre',
        'Left/Right Knout': 'Knout Gauche/Droit',
        'Right/Left Knout': 'Knout Droit/Gauche',
        'Chain Down': 'Enchaînement',
        'Aethersup': 'Sapement éthéréen',
        'Scavenger\'s Daughter': 'Fille du Boueur',
        'Head Crusher': 'Ecraseur de tête',
        'Fierce Beating': 'Raclée brutale',
        'Taphephobia': 'Taphophobie',
      },
    },
  ],
}];
