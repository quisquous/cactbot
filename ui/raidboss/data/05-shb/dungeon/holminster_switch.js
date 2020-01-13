'use strict';

[{
  zoneRegex: /^Holminster Switch$/,
  timelineFile: 'holminster_switch.txt',
  triggers: [
    {
      id: 'Holminster Path of Light',
      regex: Regexes.startsUsing({ id: '3DC5', source: 'Forgiven Dissonance', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DC5', source: 'Geläutert(?:e|er|es|en) Widerspruch', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DC5', source: 'Dissonance Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DC5', source: 'フォーギヴン・ディソナンス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DC5', source: '得到宽恕的失调', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DC5', source: '면죄된 불화', capture: false }),
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
      id: 'Holminster Pillory',
      regex: Regexes.startsUsing({ id: '3DC4', source: 'Forgiven Dissonance' }),
      regexDe: Regexes.startsUsing({ id: '3DC4', source: 'Geläutert(?:e|er|es|en) Widerspruch' }),
      regexFr: Regexes.startsUsing({ id: '3DC4', source: 'Dissonance Pardonnée' }),
      regexJa: Regexes.startsUsing({ id: '3DC4', source: 'フォーギヴン・ディソナンス' }),
      regexCn: Regexes.startsUsing({ id: '3DC4', source: '得到宽恕的失调' }),
      regexKo: Regexes.startsUsing({ id: '3DC4', source: '면죄된 불화' }),
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
    },
    {
      id: 'Holminster Tickler',
      regex: Regexes.startsUsing({ id: '3DCF', source: 'Tesleen, The Forgiven' }),
      regexDe: Regexes.startsUsing({ id: '3DCF', source: 'Tesleen (?:der|die|das) Bekehrt(?:e|er|es|en)' }),
      regexFr: Regexes.startsUsing({ id: '3DCF', source: 'Tesleen Pardonnée' }),
      regexJa: Regexes.startsUsing({ id: '3DCF', source: 'フォーギヴン・テスリーン' }),
      regexCn: Regexes.startsUsing({ id: '3DCF', source: '得到宽恕的泰丝琳' }),
      regexKo: Regexes.startsUsing({ id: '3DCF', source: '면죄된 테슬린' }),
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
    },
    {
      id: 'Holminster Bridle',
      regex: Regexes.startsUsing({ id: '3DD0', source: 'Tesleen, The Forgiven', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DD0', source: 'Tesleen (?:der|die|das) Bekehrt(?:e|er|es|en)', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DD0', source: 'Tesleen Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DD0', source: 'フォーギヴン・テスリーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DD0', source: '得到宽恕的泰丝琳', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DD0', source: '면죄된 테슬린', capture: false }),
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
      regex: Regexes.startsUsing({ id: '3DD5', source: 'Tesleen, The Forgiven', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DD5', source: 'Tesleen (?:der|die|das) Bekehrt(?:e|er|es|en)', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DD5', source: 'Tesleen Pardonnée', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DD5', source: 'フォーギヴン・テスリーン', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DD5', source: '得到宽恕的泰丝琳', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DD5', source: '면죄된 테슬린', capture: false }),
      infoText: {
        en: 'spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'Holminster Exorcise Stack',
      regex: Regexes.headMarker({ id: '003E' }),
      alertText: function(data, matches) {
        if (matches.target == data.me) {
          return {
            en: 'Stack on YOU',
            de: 'Auf DIR sammeln',
            fr: 'Package sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          de: 'Auf ' + data.ShortName(matches.target) + ' sammeln',
          fr: 'Package sur ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'Holminster Scavenger',
      regex: Regexes.startsUsing({ id: '3DD8', source: 'Philia', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DD8', source: 'Philia', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DD8', source: 'Philia', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DD8', source: 'フィリア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DD8', source: '斐利亚', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DD8', source: '필리아', capture: false }),
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
      regex: Regexes.startsUsing({ id: '3DD7', source: 'Philia' }),
      regexDe: Regexes.startsUsing({ id: '3DD7', source: 'Philia' }),
      regexFr: Regexes.startsUsing({ id: '3DD7', source: 'Philia' }),
      regexJa: Regexes.startsUsing({ id: '3DD7', source: 'フィリア' }),
      regexCn: Regexes.startsUsing({ id: '3DD7', source: '斐利亚' }),
      regexKo: Regexes.startsUsing({ id: '3DD7', source: '필리아' }),
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
    },
    {
      id: 'Holminster Chain Down',
      regex: Regexes.headMarker({ id: '005C' }),
      condition: function(data, matches) {
        return data.me != matches.target;
      },
      infoText: function(data, matches) {
        return {
          en: 'Break chain on ' + data.ShortName(matches.target),
          de: 'Kette von ' + data.ShortName(matches.target) + ' brechen',
          fr: 'Cassez les chaînes de ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'Holminster Taphephobia',
      regex: Regexes.headMarker({ id: '008B' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Spread',
        de: 'Verteilen',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'Holminster Into The Light',
      regex: Regexes.startsUsing({ id: '4350', source: 'Philia', capture: false }),
      regexDe: Regexes.startsUsing({ id: '4350', source: 'Philia', capture: false }),
      regexFr: Regexes.startsUsing({ id: '4350', source: 'Philia', capture: false }),
      regexJa: Regexes.startsUsing({ id: '4350', source: 'フィリア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '4350', source: '斐利亚', capture: false }),
      regexKo: Regexes.startsUsing({ id: '4350', source: '필리아', capture: false }),
      infoText: {
        en: 'Line Stack',
        de: 'Sammeln in einer Linie',
        fr: 'Packez-vous en ligne',
      },
    },
    {
      id: 'Holminster Left Knout',
      regex: Regexes.startsUsing({ id: '3DE7', source: 'Philia', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DE7', source: 'Philia', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DE7', source: 'Philia', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DE7', source: 'フィリア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DE7', source: '斐利亚', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DE7', source: '필리아', capture: false }),
      alertText: {
        en: 'Right',
        de: 'Rechts',
        fr: 'Droite ',
      },
    },
    {
      id: 'Holminster Right Knout',
      regex: Regexes.startsUsing({ id: '3DE6', source: 'Philia', capture: false }),
      regexDe: Regexes.startsUsing({ id: '3DE6', source: 'Philia', capture: false }),
      regexFr: Regexes.startsUsing({ id: '3DE6', source: 'Philia', capture: false }),
      regexJa: Regexes.startsUsing({ id: '3DE6', source: 'フィリア', capture: false }),
      regexCn: Regexes.startsUsing({ id: '3DE6', source: '斐利亚', capture: false }),
      regexKo: Regexes.startsUsing({ id: '3DE6', source: '필리아', capture: false }),
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
