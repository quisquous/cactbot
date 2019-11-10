'use strict';

// The Great Gubal Library--Hard
[{
  zoneRegex: /Great Gubal Library \(Hard\)/,
  timelineFile: 'gubal_library_hard.txt',
  timelineTriggers: [
    {
      id: 'Gubal Hard Triclip',
      regex: /Triclip/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      infoText: {
        en: 'Tank Buster',
        fr: 'Tankbuster',
      },
    },
    {
      id: 'Gubal Hard Searing Wind',
      regex: /Searing Wind/,
      beforeSeconds: 5,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank Cleave on you',
            fr: 'Cleave sur vous',
          };
        }
        return {
          en: 'Avoid tank cleave',
          fr: 'Evitez le cleave sur le tank',
        };
      },
    },
    {
      id: 'Gubal Hard Properties of Darkness',
      regex: /Darkness \(buster\)/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      infoText: {
        en: 'Tank Buster',
        fr: 'Tankbuster',
      },
    },
  ],
  triggers: [
    {
      id: 'Gubal Hard Bibliocide',
      regex: / 14:1945:Liquid Flame starts using Bibliocide/,
      regexFr: / 14:1945:Flamme Liquide starts using Bibliocide/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gubal Hard Ferrofluid',
      regex: / 1B:(\y{ObjectId}):(\y{Name}):....:....:(0030|0031):/,
      condition: function(data, matches) {
        return data.me == matches[2] || matches[1].slice(0, 1) == '4';
      },
      preRun: function(data, matches) {
        data.markers = data.markers || [];
        data.markers.push(matches[3]);
      },
      infoText: function(data) {
        if (data.markers.length == 2) {
          let sameMarkers = data.markers[0] == data.markers[1];
          delete data.markers;
          if (sameMarkers) {
            return {
              en: 'Away from boss',
              fr: 'Eloignez-vous du boss',
            };
          }
          return {
            en: 'Close to boss',
            fr: 'Près du boss',
          };
        }
      },
    },
    {
      id: 'Gubal Hard Slosh',
      regex: / 23:\y{ObjectId}:Liquid Flame:\y{ObjectId}:(\y{Name}):....:....:0039/,
      regexFr: / 23:\y{ObjectId}:Flamme Liquide:\y{ObjectId}:(\y{Name}):....:....:0039/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Away from boss',
        fr: 'Eloignez-vous du boss',
      },
    },
    {
      id: 'Gubal Hard Sunseal',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Sunseal/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Stand in red',
        fr: 'Restez dans le rouge',
      },
    },
    {
      id: 'Gubal Hard Moonseal',
      regex: / 1A:\y{ObjectId}:(\y{Name}) gains the effect of Moonseal/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      infoText: {
        en: 'Stand in blue',
        fr: 'Restez dans le bleu',
      },
    },
    {
      // This inflicts a vulnerability stack on the tank if not interrupted
      id: 'Gubal Hard Condensed Libra',
      regex: / 14:198D:Mechanoscribe starts using Condensed Libra on \y{Name}/,
      regexFr: / 14:198D:Mécano-scribe starts using Acuité [cC]oncentrée on \y{Name}/,
      infoText: function(data) {
        if (data.CanSilence()) {
          return {
            en: 'Interrupt Mechanoscribe',
            fr: 'Interrompez le Mécano-scribe',
          };
        }
        if (data.CanStun()) {
          return {
            en: 'Stun Mechanoscribe',
            fr: 'Etourdissez le Mécano-scribe',
          };
        }
      },
    },
    {
      id: 'Gubal Hard Properties of Quakes',
      regex: / 14:1956:Strix starts using On The Properties Of Quakes/,
      regexFr: / 14:1956:Strix starts using Des propriétés de Méga Séisme/,
      infoText: {
        en: 'Stand in light circle',
        fr: 'Restez dans le cercle blanc',
      },
    },
    {
      id: 'Gubal Hard Properties of Tornadoes',
      regex: / 14:1957:Strix starts using On The Properties Of Tornados/,
      regexFr: / 14:1957:Strix starts using Des propriétés de Tornade/,
      infoText: {
        en: 'Stand in dark circle',
        fr: 'Restez dans le cercle noir',
      },
    },
    {
      id: 'Gubal Hard Properties of Imps',
      regex: / 14:1959:Strix starts using On The Properties Of Imps/,
      regexFr: / 14:1959:Strix starts using Des propriétés de Coup du kappa/,
      infoText: {
        en: 'Cleanse in green circle',
        fr: 'Nettoyez dans le cercle vert',
      },
    },
    {
      id: 'Gubal Hard Properties of Thunder',
      regex: /14:195A:Strix starts using On The Properties Of Thunder III/,
      regexFr: /14:195A:Strix starts using Des propriétés de Méga Foudre/,
      infoText: {
        en: 'Spread',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'Gubal Hard Properties of Darkness II',
      regex: / 14:1955:Strix starts using On The Properties Of Darkness II/,
      regexFr: / 14:1955:Strix starts using Des propriétés d\'Extra Obscurité/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Gubal Hard Ecliptic Meteor',
      regex: /14:195D:Behemoth Ward starts using Ecliptic Meteor/,
      regexFr: /14:195D:Béhémoth [Cc]onjuré starts using Météore [éÉ]cliptique/,
      delaySeconds: 14, // Leaving about 10s warning to complete the LoS
      alertText: {
        en: 'Hide behind boulder',
        fr: 'Derrière le rocher',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Demon of the Tome': 'Bücherdämon',
        'Liquid Flame': 'flüssig[a] Flamme',
        // Strix is the same for DE

        'The Hall of Magicks': 'Halle der Magie',
        'The Astrology and Astromancy Camera': 'Astrologisches und Astronomisches Gewölbe',
        'The Rare Tomes Room': 'Abteilung für seltene Schriften',
      },
      'replaceText': {
        'Triclip': 'Dreischnitt',
        'Folio': 'Foliant',
        'Book Drop': 'Publizieren',
        'Issue': 'Publizieren',
        'Frightful Roar': 'Furchtbares Brüllen',
        'Discontinue': 'Druck einstellen',

        'Searing Wind': 'Versengen',
        'Bibliocide': 'Bibliozid',
        'Sea Of Flames': 'Flammenmeer',
        'Slosh': 'Durchbläuen',
        'Seal Of Night And Day': 'Siegel',
        'Magnetism': 'Magnetismus',
        'Repel': 'Abstoßung',

        'Check Out': 'Anthologie',
        'Properties Of Darkness (buster)': 'Theorie der Dunkelung',
        'Properties Of Quakes': 'Theorie des Seisga',
        'Properties Of Darkness II': 'Theorie der Dunkelung II',
        'Properties Of Tornados': 'Theorie des Tornado',
        'Properties Of Imps': 'Über Flusskobolde',
        'Properties Of Thunder III': 'Theorie des Blitzga',
        'Meteor Impact': 'Meteoreinschlag',
        'Ecliptic Meteor': 'Ekliptik-Meteor',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Demon of the Tome': 'Démon du Tome',
        'Liquid Flame': 'Flamme Liquide',
        // Strix is the same for FR

        'The Hall of Magicks will be sealed off': 'Fermeture du Puits des magies',
        'The Astrology and Astromancy Camera will be sealed off': 'Fermeture du Dôme d\'astrologie et d\'astromancie',
        'The Rare Tomes Room will be sealed off': 'Fermeture du Dôme des manuscrits rares',
        'is no longer sealed': 'Ouverture',
      },
      'replaceText': {
        // Triclip is the same for FR
        'Folio': 'Réimpression',
        'Book Drop': 'Publication',
        'Issue': 'Publication',
        'Frightful Roar': 'Rugissement effroyable',
        'Discontinue': 'Arrêt de publication',

        'Searing Wind': 'Carbonisation',
        // Bibliocide is the same for FR
        'Sea Of Flames': 'Mer de flammes',
        'Slosh': 'Ruée',
        'Seal Of Night And Day': 'Gravure',
        'Magnetism': 'Magnétisme',
        'Repel': 'Répulsion',

        'Check Out': 'Anthologie',
        'Properties Of Darkness (buster)': 'Des propriétés d\'Obscurité',
        'Properties Of Quakes': 'Des propriétés de Méga Séisme',
        'Properties Of Darkness II': 'Des propriétés d\'Extra Obscurité',
        'Properties Of Tornados': 'Des propriétés de Tornade',
        'Properties Of Imps': 'Des propriétés de Coup du kappa',
        'Properties Of Thunder III': 'Des propriétés de Méga Foudre',
        'Meteor Impact': 'Impact de météore',
        'Ecliptic Meteor': 'Météore écliptique',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Demon of the Tome': 'デモン・オブ・トーム',
        'Liquid Flame': 'リクイドフレイム',
        'Strix': 'ストリックス',

        'The Hall of Magicks': '魔書の翼廊',
        'The Astrology and Astromancy Camera': '占星学研究室',
        'The Rare Tomes Room': '思想稀覯書庫',
      },
      'replaceText': {
        'Triclip': 'トライクリップ',
        'Folio': '重版',
        'Book Drop': '刊行',
        'Issue': '刊行',
        'Frightful Roar': 'フライトフルロア',
        'Discontinue': '廃刊',

        'Searing Wind': '熱風',
        'Bibliocide': '火炎',
        'Sea Of Flames': 'シー・オブ・フレイム',
        'Slosh': '突進',
        'Seal Of Night And Day': '刻印',
        'Magnetism': '磁力',
        'Repel': '反発',

        'Check Out': '選書',
        'Properties Of Darkness (buster)': 'ダークの章',
        'Properties Of Quakes': 'クエイガの章',
        'Properties Of Darkness II': 'ダークラの章',
        'Properties Of Tornados': 'トルネドの章',
        'Properties Of Imps': 'カッパの章',
        'Properties Of Thunder III': 'サンダガの章',
        'Meteor Impact': 'メテオインパクト',
        'Ecliptic Meteor': 'エクリプスメテオ',
      },
    },
  ],
}];
