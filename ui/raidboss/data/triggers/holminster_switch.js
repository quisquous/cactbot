'use strict';

[{
  zoneRegex: /^Holminster Switch$/,
  timelineFile: 'holminster_switch.txt',
  triggers: [
    {
      id: 'Holminster Path of Light',
      regex: / 14:3DC5:Forgiven Dissonance starts using Path Of Light/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
    {
      id: 'Holminster Pillory',
      regex: / 14:3DC4:Forgiven Dissonance starts using Pillory on (\y{Name})/,
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
      regexFR: / 14:3DCF:Tesleen Pardonnée starts using Chatouillement on (\y{Name})/,
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
      regexFr: / 14:3DD0:Tesleen Pardonnée starts using Bride-Bavarde/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Holminster Flagellation',
      regex: / 14:3DD5:Tesleen, [tT]he Forgiven starts using Flagellation/,
      regexFr: / 14:3DD5:Tesleen Pardonnée starts using Flagellation/,
      infoText: {
        en: 'spread',
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
            fr: 'Package sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
          fr: 'Package sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Holminster Scavenger',
      regex: / 14:3DD8:Philia starts using Scavenger's Daughter/,
      regexFr: / 14:3DD8:Philia starts using Fille Du Boueur/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Holminster Head Crusher',
      regex: / 14:3DD7:Philia starts using Head Crusher on (\y{Name})/,
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
          fr: 'Cassez les chaînes de ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'Holminster Taphephobia',
      regex: /1B:........:(\y{Name}):....:....:008B:/,
      infoText: {
        en: 'Spread',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'Holminster Into The Light',
      regex: / 14:4350:Philia starts using Into The Light/,
      regexFr: / 14:4350:Philia starts using Dans La Lumière/,
      infoText: {
        en: 'Line Stack',
        fr: 'Packez-vous en ligne',
      },
    },
    {
      id: 'Holminster Left Knout',
      regex: / 14:3DE7:Philia starts using Left Knout/,
      regexFr: / 14:3DE7:Philia starts using Knout Gauche/,
      alertText: {
        en: 'Right',
        fr: 'Droite ',
      },
    },
    {
      id: 'Holminster Right Knout',
      regex: / 14:3DE6:Philia starts using Right Knout/,
      regexFr: / 14:3DE6:Philia starts using Knout Droit/,
      alertText: {
        en: 'Left',
        fr: 'Gauche',
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'fr',
      replaceSync: {
        'The Wound will be sealed off': 'Fermeture de La Talure',
        'The Auction will be sealed off': 'Fermeture de la place du Cheptel',
        'The manor house will be sealed off': 'Fermeture de l\'esplanade du Manoir',
        'is no longer sealed': 'Ouverture de',
        'Tesleen, the Forgiven': 'Tesleen pardonnée',
      },
      replaceText: {
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
