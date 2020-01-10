'use strict';

// Aetherochemical Research Facility
[{
  zoneRegex: /Aetherochemical Research Facility/,
  timelineFile: 'aetherochemical_research_facility.txt',
  timelineTriggers: [
    {
      id: 'Facility Bastardbluss',
      regex: /Bastardbluss/,
      beforeSeconds: 4,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      infoText: {
        en: 'Tank buster',
      },
    },
    {
      id: 'Facility Hood Swing',
      regex: /Hood Swing/,
      beforeSeconds: 4,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      infoText: {
        en: 'Tank buster',
      },
    },
    {
      id: 'Facility Chthonic Hush',
      regex: /Chthonic Hush/,
      beforeSeconds: 4,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank cleave on YOU',
            de: 'Tank Cleave auf DIR',
            fr: 'Tank cleave sur vous',
          };
        }
        return {
          en: 'Avoid tank cleave',
        };
      },
    },
    {
      id: 'Facility Height Of Chaos',
      regex: /Height Of Chaos/,
      beforeSeconds: 4,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank cleave on YOU',
            de: 'Tank Cleave auf DIR',
            fr: 'Tank cleave sur vous',
          };
        }
        return {
          en: 'Avoid tank cleave',
        };
      },
    },
  ],
  triggers: [
    {
      id: 'Facility Petrifaction',
      regex: / 14:10EB:Harmachis starts using Petrifaction/,
      regexDe: / 14:10EB:Harmachis starts using Versteinerung/,
      regexFr: / 14:10EB:Horamakhet starts using Pétrification/,
      regexJa: / 14:10EB:ハルマキス starts using ペトリファクション/,
      infoText: {
        en: 'Look away',
        de: 'Wegschauen!',
        fr: 'Ne regardez pas',
      },
    },
    {
      id: 'Facility Inertia Stream',
      regex: / 15:\y{ObjectId}:Harmachis:10ED:Inertia Stream:\y{ObjectId}:(\y{Name}):/,
      regexDe: / 15:\y{ObjectId}:Harmachis:10ED:Trägheitsstrom:\y{ObjectId}:(\y{Name}):/,
      regexFr: / 15:\y{ObjectId}:Horamakhet:10ED:Courant indolent:\y{ObjectId}:(\y{Name}):/,
      regexJa: / 15:\y{ObjectId}:ハルマキス:10ED:イナーシャストリーム:\y{ObjectId}:(\y{Name}):/,
      condition: function(data) {
        // Tanks technically shouldn't assist with this mechanic
        return data.role != 'tank';
      },
      alertText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Laser Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.shortName(matches[1]),
          de: 'Stack auf ' + data.shortName(matches[1]),
          fr: 'Stack sur ' + data.shortName(matches[1]),
        };
      },
    },
    {
      id: 'Facility Dark Orb',
      regex: /14:10FC:(?:Igeyorhm|Lahabrea) starts using Dark Orb on (\y{Name})/,
      regexDe: /14:10FC:(?:Igeyorhm|Lahabrea) starts using Dunkler Orbis on (\y{Name})/,
      regexFr: /14:10FC:(?:Igeyorhm|Lahabrea) starts using Orbe ténébreux on (\y{Name})/,
      regexJa: /14:10FC:(?:アシエン・イゲオルム|アシエン・ラハブレア) starts using ダークオーブ on (\y{Name})/,
      infoText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank buster on YOU',
          };
        } else if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.shortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Facility Shadow Flare',
      regex: / 14:1109:Ascian Prime starts using Shadow Flare/,
      regexDe: / 14:1109:Prim-Ascian starts using Schattenflamme/,
      regexFr: / 14:1109:Primo-Ascien starts using Éruption ténébreuse/,
      regexJa: / 14:1109:アシエン・プライム starts using シャドウフレア/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Facility Annihilation',
      regex: / 14:110A:Ascian Prime starts using Annihilation/,
      regexDe: / 14:110A:Prim-Ascian starts using Annihilation/,
      regexFr: / 14:110A:Primo-Ascien starts using Annihilation/,
      regexJa: / 14:110A:アシエン・プライム starts using アナイアレイション/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'Facility Universal Manipulation',
      regex: / 14:1105:Ascian Prime starts using Universal Manipulation/,
      regexDe: / 14:1105:Prim-Ascian starts using Umwertung aller Werte/,
      regexFr: / 14:1105:Primo-Ascien starts using Manipulation universelle/,
      regexJa: / 14:1105:アシエン・プライム starts using 法則改変/,
      // The cast is ~10s, but it takes about 2s for correct execution to register
      // 6s to execute is *usually* enough time
      delaySeconds: 4,
      alertText: {
        en: 'Stand in dark portal',
      },
    },
    {
      id: 'Facility Chaosphere',
      regex: Regexes.addedCombatant({ name: 'Chaosphere', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Chaossphäre', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Sphère De Chaos', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'カオススフィア', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '混沌晶球', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '혼돈의 구체', capture: false }),
      suppressSeconds: 5,
      infoText: {
        en: 'Avoid your orb--pop others\'',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Regula van Hydrus': 'Regula van Hydrus',
        'Harmachis': 'Harmachis',
        'Igeyorhm': 'Igeyorhm',
        'Lahabrea': 'Lahabrea',
        'Ascian Prime': 'Prim-Ascian',

        'Analysis and Proving': 'Prototypentest',
        'Evaluation and Authentication': 'Evaluation und Zertifikation',
        'Neurolink Nacelle': 'Neurolink-Zelle',
      },
      'replaceText': {
        'Bastardbluss': 'Lacération vicieuse',
        'Judgment': 'Jugement',
        'Magitek Turret': 'Magitek-Gefechtsturm',
        'Magitek Slug': 'Magitek-Projektil',
        'Self-detonate': 'Zerbersten',
        'Quickstep': 'Schneller Schritt',
        'Aetherochemical Grenado': 'Magitek-Granate',
        'Magitek Spread': 'Magitek-Streuschuss',

        'Weighing of the Heart': 'Gewissensprüfung',
        'Steel Scales': 'Stahlschuppen',
        'Hood Swing': 'Kapuzenschwung',
        'Chthonic Hush': 'Chthonisches Schweigen',
        'Riddle of the Sphinx': 'Rätsel der Sphinx',
        'Petrifaction': 'Versteinerung',
        'Circle of Flames': 'Feuerkreis',
        'Ka': 'Ka',
        'Inertia Stream': 'Trägheitsstrom',
        'Ballistic Missile': 'Ballistische Rakete',
        'Gaseous Bomb': 'Ballistische Rakete',

        'Dark Orb': 'Dunkler Orbis',
        'End of Days': 'Megiddoflamme',
        'Sea of Pitch': 'Pech-See',
        'Blizzard Sphere': 'Eissphäre',
        'Fire Sphere': 'Feuersphäre',
        'Blizzard Burst': 'Eissplitter',
        'Fire Burst': 'Feuerknall',
        'Dark Blizzard II': 'Dunkel-Eisra',
        'Shadow Flare': 'Schattenflamme',
        'Dark Fire II': 'Dunkel-Feura',
        'Permafrost': 'Pergelisol',

        'Height of Chaos': 'Klimax des Chaos',
        'Ancient Eruption': 'Antike Eruption',
        'Ancient Circle': 'Orbis Antiquus',
        'Annihilation': 'Annihilation',
        'Universal Manipulation': 'Umwertung aller Werte',
        'Entropic Flame': 'Entropische Flamme',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Regula van Hydrus': 'Regula van Hydrus',
        'Harmachis': 'Horamakhet',
        'Igeyorhm': 'Igeyorhm',
        'Lahabrea': 'Lahabrea',
        'Ascian Prime': 'Primo-Ascien',

        'Analysis and Proving': 'Analyse et Essai',
        'Evaluation and Authentication': 'Évaluation et Authentification',
        'Neurolink Nacelle': 'Nacelle neurolien',
      },
      'replaceText': {
        'Bastardbluss': 'Lacération vicieuse',
        'Judgment': 'Jugement',
        'Magitek Turret': 'Tourelle magitek',
        'Magitek Slug': 'Projectile magitek',
        'Self-detonate': 'Auto-atomisation',
        'Quickstep': 'Pas rapides',
        'Aetherochemical Grenado': 'Grenade magitek',
        'Magitek Spread': 'Ensemencement magitek',

        'Weighing of the Heart': 'Pesée du cœur',
        'Steel Scales': 'Écailles d\'acier',
        'Hood Swing': 'Coup de capot',
        'Chthonic Hush': 'Silence chthonien',
        'Riddle of the Sphinx': 'Énigme du Sphinx',
        'Petrifaction': 'Pétrification',
        'Circle of Flames': 'Cercle de flammes',
        'Ka': 'Ka',
        'Inertia Stream': 'Courant indolent',
        'Ballistic Missile': 'Missile balistique',
        'Gaseous Bomb': 'Bombe gazeuse',

        'Dark Orb': 'Orbe ténébreux',
        'End of Days': 'Jugement dernier',
        'Sea of Pitch': 'Océan de goudron',
        'Blizzard Sphere': 'Sphère de glace',
        'Fire Sphere': 'Sphère de feu',
        'Blizzard Burst': 'Explosion glaciale',
        'Fire Burst': 'Explosion ardente',
        'Dark Blizzard II': 'Extra Glace ténébreuse',
        'Shadow Flare': 'Éruption ténébreuse',
        'Dark Fire II': 'Extra Feu ténébreux',
        'Permafrost': 'Pergélisol',

        'Height of Chaos': 'Apogée du chaos',
        'Ancient Eruption': 'Éruption ancienne',
        'Ancient Circle': 'Cercle ancien',
        'Annihilation': 'Annihilation',
        'Universal Manipulation': 'Manipulation universelle',
        'Entropic Flame': 'Flamme entropique',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Regula van Hydrus': 'レグラ・ヴァン・ヒュドルス',
        'Harmachis': 'ハルマキス',
        'Igeyorhm': 'アシエン・イゲオルム',
        'Lahabrea': 'アシエン・ラハブレア',
        'Ascian Prime': 'アシエン・プライム',

        'Analysis and Proving': '試作機実験庫',
        'Evaluation and Authentication': '評価試験場',
        'Neurolink Nacelle': 'ニューロリンク・ナセル',
      },
      'replaceText': {
        'Bastardbluss': 'ガンバスタード',
        'Judgment': 'ジャッジメント',
        'Magitek Turret': '魔導タレット',
        'Magitek Spread': '魔導バックショット',
        'Magitek Slug': '魔導スラッグショット',
        'Self-detonate': '爆発霧散',
        'Aetherochemical Grenado': '魔導榴弾',
        'Quickstep': 'クイックステップ',

        'Weighing of the Heart': '転生の儀',
        'Steel Scales': 'スチールスケール',
        'Hood Swing': 'フードスイング',
        'Chthonic Hush': 'クトニオスハッシュ',
        'Riddle of the Sphinx': '謎かけ',
        'Petrifaction': 'ペトリファクション',
        'Circle of Flames': 'サークル・オブ・フレイム',
        'Ka': 'カー',
        'Inertia Stream': 'イナーシャストリーム',
        'Ballistic Missile': 'バリスティックミサイル',
        'Gaseous Bomb': '気化爆弾',

        'Dark Orb': 'ダークオーブ',
        'End of Days': 'メギドフレイム',
        'Sea of Pitch': 'シー・オブ・ピッチ',
        'Blizzard Sphere': 'ブリザードスフィア',
        'Fire Sphere': 'ファイアスフィア',
        'Blizzard Burst': 'ブリザードバースト',
        'Fire Burst': 'ファイアバースト',
        'Dark Blizzard II': 'ダークブリザラ',
        'Shadow Flare': 'シャドウフレア',
        'Dark Fire II': 'ダークファイラ',
        'Permafrost': '永久凍土',

        'Height of Chaos': 'ハイト・オブ・カオス',
        'Ancient Eruption': 'エンシェントエラプション',
        'Ancient Circle': 'エンシェントリング',
        'Annihilation': 'アナイアレイション',
        'Universal Manipulation': '法則改変',
        'Entropic Flame': 'エントロピックフレイム',
      },
    },
  ],
}];
