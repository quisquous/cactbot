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
      regex: Regexes.startsUsing({ id: '1945', source: 'Liquid Flame', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1945', source: 'flüssig(?:e|er|es|en) Flamme', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1945', source: 'Flamme Liquide', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1945', source: 'リクイドフレイム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1945', source: '液态火焰', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1945', source: '액체 불꽃', capture: false }),
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
      regex: Regexes.headMarker({ id: ['0030', '0031'] }),
      condition: function(data, matches) {
        return data.me == matches.target || matches.targetId.slice(0, 1) == '4';
      },
      preRun: function(data, matches) {
        data.markers = data.markers || [];
        data.markers.push(matches.id);
      },
      infoText: function(data) {
        if (data.markers.length == 2) {
          let sameMarkers = data.markers[0] == data.markers[1];
          delete data.markers;
          if (sameMarkers) {
            return {
              en: 'Close to boss',
              fr: 'Près du boss',
            };
          }
          return {
            en: 'Away from boss',
            fr: 'Eloignez-vous du boss',
          };
        }
      },
    },
    {
      id: 'Gubal Hard Slosh',
      regex: Regexes.tether({ id: '0039', source: 'Liquid Flame' }),
      regexDe: Regexes.tether({ id: '0039', source: 'Flüssig(?:e|er|es|en) Flamme' }),
      regexFr: Regexes.tether({ id: '0039', source: 'Flamme Liquide' }),
      regexJa: Regexes.tether({ id: '0039', source: 'リクイドフレイム' }),
      regexCn: Regexes.tether({ id: '0039', source: '液态火焰' }),
      regexKo: Regexes.tether({ id: '0039', source: '액체 불꽃' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Away from boss',
        fr: 'Eloignez-vous du boss',
      },
    },
    {
      id: 'Gubal Hard Sunseal',
      regex: Regexes.gainsEffect({ effect: 'Sunseal' }),
      regexDe: Regexes.gainsEffect({ effect: 'Sonnensiegel' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marque Solaire' }),
      regexJa: Regexes.gainsEffect({ effect: '太陽の刻印' }),
      regexCn: Regexes.gainsEffect({ effect: '太阳刻印' }),
      regexKo: Regexes.gainsEffect({ effect: '태양의 각인' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Stand in red',
        fr: 'Restez dans le rouge',
      },
    },
    {
      id: 'Gubal Hard Moonseal',
      regex: Regexes.gainsEffect({ effect: 'Moonseal' }),
      regexDe: Regexes.gainsEffect({ effect: 'Mondsiegel' }),
      regexFr: Regexes.gainsEffect({ effect: 'Marque Lunaire' }),
      regexJa: Regexes.gainsEffect({ effect: '月の刻印' }),
      regexCn: Regexes.gainsEffect({ effect: '月亮刻印' }),
      regexKo: Regexes.gainsEffect({ effect: '달의 각인' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      infoText: {
        en: 'Stand in blue',
        fr: 'Restez dans le bleu',
      },
    },
    {
      // This inflicts a vulnerability stack on the tank if not interrupted
      id: 'Gubal Hard Condensed Libra',
      regex: Regexes.startsUsing({ id: '198D', source: 'Mechanoscribe', capture: false }),
      regexDe: Regexes.startsUsing({ id: '198D', source: 'Mechanoscholar', capture: false }),
      regexFr: Regexes.startsUsing({ id: '198D', source: 'Mécano-Scribe', capture: false }),
      regexJa: Regexes.startsUsing({ id: '198D', source: 'メカノスクライブ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '198D', source: '自走人偶抄写员', capture: false }),
      regexKo: Regexes.startsUsing({ id: '198D', source: '기계 서기', capture: false }),
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
      regex: Regexes.startsUsing({ id: '1956', source: 'Strix', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1956', source: 'Strix', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1956', source: 'Strix', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1956', source: 'ストリックス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1956', source: '博学林鸮', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1956', source: '스트릭스', capture: false }),
      infoText: {
        en: 'Stand in light circle',
        fr: 'Restez dans le cercle blanc',
      },
    },
    {
      id: 'Gubal Hard Properties of Tornadoes',
      regex: Regexes.startsUsing({ id: '1957', source: 'Strix', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1957', source: 'Strix', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1957', source: 'Strix', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1957', source: 'ストリックス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1957', source: '博学林鸮', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1957', source: '스트릭스', capture: false }),
      infoText: {
        en: 'Stand in dark circle',
        fr: 'Restez dans le cercle noir',
      },
    },
    {
      id: 'Gubal Hard Properties of Imps',
      regex: Regexes.startsUsing({ id: '1959', source: 'Strix', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1959', source: 'Strix', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1959', source: 'Strix', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1959', source: 'ストリックス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1959', source: '博学林鸮', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1959', source: '스트릭스', capture: false }),
      infoText: {
        en: 'Cleanse in green circle',
        fr: 'Nettoyez dans le cercle vert',
      },
    },
    {
      id: 'Gubal Hard Properties of Thunder',
      regex: Regexes.startsUsing({ id: '195A', source: 'Strix', capture: false }),
      regexDe: Regexes.startsUsing({ id: '195A', source: 'Strix', capture: false }),
      regexFr: Regexes.startsUsing({ id: '195A', source: 'Strix', capture: false }),
      regexJa: Regexes.startsUsing({ id: '195A', source: 'ストリックス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '195A', source: '博学林鸮', capture: false }),
      regexKo: Regexes.startsUsing({ id: '195A', source: '스트릭스', capture: false }),
      infoText: {
        en: 'Spread',
        fr: 'Dispersez-vous',
      },
    },
    {
      id: 'Gubal Hard Properties of Darkness II',
      regex: Regexes.startsUsing({ id: '1955', source: 'Strix', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1955', source: 'Strix', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1955', source: 'Strix', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1955', source: 'ストリックス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1955', source: '博学林鸮', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1955', source: '스트릭스', capture: false }),
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
      regex: Regexes.startsUsing({ id: '195D', source: 'Behemoth Ward', capture: false }),
      regexDe: Regexes.startsUsing({ id: '195D', source: 'Buch-Behemoth', capture: false }),
      regexFr: Regexes.startsUsing({ id: '195D', source: 'Béhémoth Conjuré', capture: false }),
      regexJa: Regexes.startsUsing({ id: '195D', source: 'ベヒーモス・ワード', capture: false }),
      regexCn: Regexes.startsUsing({ id: '195D', source: '贝希摩斯护卫', capture: false }),
      regexKo: Regexes.startsUsing({ id: '195D', source: '고서의 베히모스', capture: false }),
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
