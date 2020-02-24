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
        'Behemoth Ward': 'Buch-Behemoth',
        'Demon of the Tome': 'Bücherdämon',
        'Liquid Flame': 'flüssig(?:e|er|es|en) Flamme',
        'Meteor': 'Meteo',
        'Middle Shelf Tome': 'Pappband',
        'Strix': 'Strix',
        'The Astrology and Astromancy Camera': 'Astrologisches und Astronomisches Gewölbe',
        'The Hall of Magicks': 'Halle der Magie',
        'The Rare Tomes Room': 'Abteilung für seltene Schriften',
        'Top Shelf Tome': 'Prachtband',
      },
      'replaceText': {
        'Bibliocide': 'Bibliozid',
        'Book Drop': 'Book Drop', // FIXME
        'Check Out': 'Anthologie',
        'Discontinue': 'Druck einstellen',
        'Ecliptic Meteor': 'Ekliptik-Meteor',
        'Folio': 'Foliant',
        'Form Shift': 'Formwechsel',
        'Frightful Roar': 'Furchtbares Brüllen',
        'Hand/Tornado': 'Hand/Tornado',
        'Issue': 'Publizieren',
        'Magnetism': 'Magnetismus',
        'Meteor Impact': 'Meteoreinschlag',
        'Properties Of Darkness': 'Theorie der Dunkelung',
        'Properties Of Imps': 'Über Flusskobolde',
        'Properties Of Quakes': 'Theorie des Seisga',
        'Properties Of Thunder III': 'Theorie des Blitzga',
        'Properties Of Tornados': 'Theorie des Tornado',
        'Quakes/Tornados': 'Seisga/Tornados',
        'Repel': 'Abstoßung',
        'Sea Of Flames': 'Flammenmeer',
        'Seal Of Night And Day': 'Siegel',
        'Searing Wind': 'Versengen',
        'Slosh': 'Durchbläuen',
        'Triclip': 'Dreischnitt',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Behemoth Ward': 'béhémoth conjuré',
        'Demon of the Tome': 'Démon du Tome',
        'Liquid Flame': 'flamme liquide',
        'Meteor': 'Météore',
        'Middle Shelf Tome': 'livre broché',
        'Strix': 'Strix',
        'The Astrology and Astromancy Camera': 'Dôme d\'astrologie et d\'astromancie',
        'The Hall of Magicks': 'Puits des magies',
        'The Rare Tomes Room': 'Dôme des manuscrits rares',
        'Top Shelf Tome': 'livre relié',
      },
      'replaceText': {
        'Bibliocide': 'Bibliocide',
        'Book Drop': 'Laché de livre',
        'Check Out': 'Anthologie',
        'Discontinue': 'Arrêt de publication',
        'Ecliptic Meteor': 'Météore écliptique',
        'Folio': 'Réimpression',
        'Form Shift': 'Glissement de posture',
        'Frightful Roar': 'Rugissement effroyable',
        'Hand/Tornado': 'Main/Tornade',
        'Issue': 'Publication',
        'Magnetism': 'Magnétisme',
        'Meteor Impact': 'Impact de météore',
        'Properties Of Darkness': 'Des propriétés d\'Obscurité',
        'Properties Of Imps': 'Des propriétés de Coup du kappa',
        'Properties Of Quakes': 'Des propriétés de Méga Séisme',
        'Properties Of Thunder III': 'Des propriétés de Méga Foudre',
        'Properties Of Tornados': 'Des propriétés de Tornade',
        'Quakes/Tornados': 'Séismes/Tornades',
        'Repel': 'Répulsion',
        'Sea Of Flames': 'Mer de flammes',
        'Seal Of Night And Day': 'Gravure',
        'Searing Wind': 'Carbonisation',
        'Slosh': 'Ruée',
        'Triclip': 'Triclip',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Behemoth Ward': 'ベヒーモス・ワード',
        'Demon of the Tome': 'デモン・オブ・トーム',
        'Liquid Flame': 'リクイドフレイム',
        'Meteor': 'メテオ',
        'Middle Shelf Tome': '並製本',
        'Strix': 'ストリックス',
        'The Astrology and Astromancy Camera': '占星学研究室',
        'The Hall of Magicks': '魔書の翼廊',
        'The Rare Tomes Room': '思想稀覯書庫',
        'Top Shelf Tome': '上製本',
      },
      'replaceText': {
        'Bibliocide': '火炎',
        'Book Drop': 'Book Drop', // FIXME
        'Check Out': '選書',
        'Discontinue': '廃刊',
        'Ecliptic Meteor': 'エクリプスメテオ',
        'Folio': '重版',
        'Form Shift': '演武',
        'Frightful Roar': 'フライトフルロア',
        'Hand/Tornado': 'Hand/Tornado', // FIXME
        'Issue': '刊行',
        'Magnetism': '磁力',
        'Meteor Impact': 'メテオインパクト',
        'Properties Of Darkness': 'ダークの章',
        'Properties Of Imps': 'カッパの章',
        'Properties Of Quakes': 'クエイガの章',
        'Properties Of Thunder III': 'サンダガの章',
        'Properties Of Tornados': 'トルネドの章',
        'Quakes/Tornados': 'Quakes/Tornados', // FIXME
        'Repel': '反発',
        'Sea Of Flames': 'シー・オブ・フレイム',
        'Seal Of Night And Day': '刻印',
        'Searing Wind': '熱風',
        'Slosh': '突進',
        'Triclip': 'トライクリップ',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Behemoth Ward': '贝希摩斯护卫',
        'Demon of the Tome': '书中恶魔',
        'Liquid Flame': '液态火焰',
        'Meteor': '陨石',
        'Middle Shelf Tome': '平装本',
        'Strix': '博学林鸮',
        'The Astrology and Astromancy Camera': '占星学研究室',
        'The Hall of Magicks': '魔书翼廊',
        'The Rare Tomes Room': '思想珍秘书库',
        'Top Shelf Tome': '精装本',
      },
      'replaceText': {
        'Bibliocide': '焚书',
        'Book Drop': 'Book Drop', // FIXME
        'Check Out': '选集',
        'Discontinue': '停刊',
        'Ecliptic Meteor': '黄道陨石',
        'Folio': '再版',
        'Form Shift': '演武',
        'Frightful Roar': '骇人嚎叫',
        'Hand/Tornado': 'Hand/Tornado', // FIXME
        'Issue': '发行',
        'Magnetism': '磁力',
        'Meteor Impact': '陨石冲击',
        'Properties Of Darkness': '黑暗之章',
        'Properties Of Imps': '河童之章',
        'Properties Of Quakes': '爆震之章',
        'Properties Of Thunder III': '暴雷之章',
        'Properties Of Tornados': '龙卷之章',
        'Quakes/Tornados': 'Quakes/Tornados', // FIXME
        'Repel': '相斥',
        'Sea Of Flames': '', // FIXME
        'Seal Of Night And Day': '刻印',
        'Searing Wind': '热风',
        'Slosh': '突进',
        'Triclip': '三连爪',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Behemoth Ward': '고서의 베히모스',
        'Demon of the Tome': '고서의 악마',
        'Liquid Flame': '액체 불꽃',
        'Meteor': '메테오',
        'Middle Shelf Tome': '문고본',
        'Strix': '스트릭스',
        'The Astrology and Astromancy Camera': '점성학 연구실',
        'The Hall of Magicks': '악마서 복도',
        'The Rare Tomes Room': '사상희귀서고',
        'Top Shelf Tome': '양장본',
      },
      'replaceText': {
        'Bibliocide': '화염',
        'Book Drop': 'Book Drop', // FIXME
        'Check Out': '도서 선정',
        'Discontinue': '폐간',
        'Ecliptic Meteor': '황도 메테오',
        'Folio': '증쇄',
        'Form Shift': '연무',
        'Frightful Roar': '끔찍한 포효',
        'Hand/Tornado': 'Hand/Tornado', // FIXME
        'Issue': '간행',
        'Magnetism': '자력',
        'Meteor Impact': '운석 낙하',
        'Properties Of Darkness': '다크의 장',
        'Properties Of Imps': '물요정의 장',
        'Properties Of Quakes': '퀘이가의 장',
        'Properties Of Thunder III': '선더가의 장',
        'Properties Of Tornados': '토네이도의 장',
        'Quakes/Tornados': 'Quakes/Tornados', // FIXME
        'Repel': '반발',
        'Sea Of Flames': '', // FIXME
        'Seal Of Night And Day': '각인',
        'Searing Wind': '열풍',
        'Slosh': '돌진',
        'Triclip': '삼단베기',
      },
    },
  ],
}];
