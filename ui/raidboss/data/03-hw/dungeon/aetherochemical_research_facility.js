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
        fr: 'Tankbuster',
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
        fr: 'Tankbuster',
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
          fr: 'Evitez le cleave sur le tank',
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
          fr: 'Evitez le cleave sur le tank',
        };
      },
    },
  ],
  triggers: [
    {
      id: 'Facility Petrifaction',
      regex: Regexes.startsUsing({ id: '10EB', source: 'Harmachis', capture: false }),
      regexDe: Regexes.startsUsing({ id: '10EB', source: 'Harmachis', capture: false }),
      regexFr: Regexes.startsUsing({ id: '10EB', source: 'Horemakhet', capture: false }),
      regexJa: Regexes.startsUsing({ id: '10EB', source: 'ハルマキス', capture: false }),
      regexCn: Regexes.startsUsing({ id: '10EB', source: '赫鲁玛奇斯', capture: false }),
      regexKo: Regexes.startsUsing({ id: '10EB', source: '하르마키스', capture: false }),
      infoText: {
        en: 'Look away',
        de: 'Wegschauen!',
        fr: 'Regardez ailleurs',
      },
    },
    {
      id: 'Facility Inertia Stream',
      regex: Regexes.ability({ id: '10ED', source: 'Harmachis' }),
      regexDe: Regexes.ability({ id: '10ED', source: 'Harmachis' }),
      regexFr: Regexes.ability({ id: '10ED', source: 'Horemakhet' }),
      regexJa: Regexes.ability({ id: '10ED', source: 'ハルマキス' }),
      regexCn: Regexes.ability({ id: '10ED', source: '赫鲁玛奇斯' }),
      regexKo: Regexes.ability({ id: '10ED', source: '하르마키스' }),
      condition: function(data) {
        // Tanks technically shouldn't assist with this mechanic
        return data.role != 'tank';
      },
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Laser Stack on YOU',
            fr: 'Laser sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.shortName(matches.target),
          de: 'Stack auf ' + data.shortName(matches.target),
          fr: 'Stack sur ' + data.shortName(matches.target),
        };
      },
    },
    {
      id: 'Facility Dark Orb',
      regex: Regexes.startsUsing({ id: '10FC', source: ['Igeyorhm', 'Lahabrea'] }),
      regexDe: Regexes.startsUsing({ id: '10FC', source: ['Igeyorhm', 'Lahabrea'] }),
      regexFr: Regexes.startsUsing({ id: '10FC', source: ['Igeyorhm', 'Lahabrea'] }),
      regexJa: Regexes.startsUsing({ id: '10FC', source: ['アシエン・イゲオルム', 'アシエン・ラハブレア'] }),
      regexCn: Regexes.startsUsing({ id: '10FC', source: ['以格约姆', '拉哈布雷亚'] }),
      regexKo: Regexes.startsUsing({ id: '10FC', source: ['아씨엔 이게요름', '아씨엔 라하브레아'] }),
      infoText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank buster on YOU',
            fr: 'Tankbuster sur VOUS',
          };
        } else if (data.role == 'healer') {
          return {
            en: 'Buster on ' + data.shortName(matches[1]),
            fr: 'Tankbuster sur ' + data.shortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'Facility Shadow Flare',
      regex: Regexes.startsUsing({ id: '1109', source: 'Ascian Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1109', source: 'Prim-Ascian', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1109', source: 'Primo-Ascien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1109', source: 'アシエン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1109', source: '至尊无影', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1109', source: '아씨엔 프라임', capture: false }),
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
      regex: Regexes.startsUsing({ id: '110A', source: 'Ascian Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '110A', source: 'Prim-Ascian', capture: false }),
      regexFr: Regexes.startsUsing({ id: '110A', source: 'Primo-Ascien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '110A', source: 'アシエン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '110A', source: '至尊无影', capture: false }),
      regexKo: Regexes.startsUsing({ id: '110A', source: '아씨엔 프라임', capture: false }),
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
      regex: Regexes.startsUsing({ id: '1105', source: 'Ascian Prime', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1105', source: 'Prim-Ascian', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1105', source: 'Primo-Ascien', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1105', source: 'アシエン・プライム', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1105', source: '至尊无影', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1105', source: '아씨엔 프라임', capture: false }),
      // The cast is ~10s, but it takes about 2s for correct execution to register
      // 6s to execute is *usually* enough time
      delaySeconds: 4,
      alertText: {
        en: 'Stand in dark portal',
        fr: 'Allez dans le portail noir',
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
        fr: 'Evitez votre orbe, détruisez les autres',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Analysis and Proving': 'Prototypentest',
        'Ascian Prime': 'Prim-Ascian',
        'Blizzardsphere': 'Eissphäre',
        'Evaluation and Authentication': 'Evaluation und Zertifikation',
        'Firesphere': 'Feuersphäre',
        'Harmachis': 'Harmachis',
        'Igeyorhm': 'Igeyorhm',
        'Lahabrea': 'Lahabrea',
        'Magitek Turret I': 'Magitek-Geschütz I',
        'Magitek Turret II': 'Magitek-Geschütz II',
        'Neurolink Nacelle': 'Neurolink-Zelle',
        'Regula van Hydrus': 'Regula van Hydrus',
      },
      'replaceText': {
        'Aetherochemical Grenado': 'Magitek-Granate',
        'Ancient Circle': 'Orbis Antiquus',
        'Ancient Eruption': 'Antike Eruption',
        'Annihilation': 'Annihilation',
        'Ballistic Missile': 'Ballistische Rakete',
        'Bastardbluss': 'Bastardschuss',
        'Blizzard Burst': 'Eissplitter',
        'Blizzard Sphere': 'Eissphäre',
        'Chthonic Hush': 'Chthonisches Schweigen',
        'Circle of Flames': 'Feuerkreis',
        'Dark Blizzard II': 'Dunkel-Eisra',
        'Dark Fire II': 'Dunkel-Feura',
        'Dark Orb': 'Dunkler Orbis',
        'End of Days': 'Ende aller Tage',
        'Entropic Flame': 'Entropische Flamme',
        'Fire Burst': 'Feuerknall',
        'Fire Sphere': 'Feuersphäre',
        'Gaseous Bomb': 'Explosives Gasgemisch',
        'Height of Chaos': 'Klimax des Chaos',
        'Hood Swing': 'Kapuzenschwung',
        'Inertia Stream': 'Trägheitsstrom',
        'Judgment': 'Aburteilung',
        'Ka': 'Ka',
        'Magitek Slug': 'Magitek-Projektil',
        'Magitek Spread': 'Magitek-Streuschuss',
        'Magitek Turret': 'Magitek-Gefechtsturm',
        'Permafrost': 'Permafrost',
        'Petrifaction': 'Versteinerung',
        'Quickstep': 'Schneller Schritt',
        'Riddle of the Sphinx': 'Rätsel der Sphinx',
        'Sea of Pitch': 'Pech-See',
        'Self-detonate': 'Zerbersten',
        'Shadow Flare': 'Schattenflamme',
        'Steel Scales': 'Stahlschuppen',
        'Universal Manipulation': 'Umwertung aller Werte',
        'Weighing of the Heart': 'Gewissensprüfung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Analysis and Proving': 'Analyse et Essai',
        'Ascian Prime': 'Primo-Ascien',
        'Blizzardsphere': 'Sphère de glace',
        'Evaluation and Authentication': 'Évaluation et Authentification',
        'Firesphere': 'Sphère de feu',
        'Harmachis': 'Horemakhet',
        'Igeyorhm': 'Igeyorhm',
        'Lahabrea': 'Lahabrea',
        'Magitek Turret I': 'Tourelle magitek TM-I',
        'Magitek Turret II': 'Tourelle magitek TM-II',
        'Neurolink Nacelle': 'Nacelle neurolien',
        'Regula van Hydrus': 'Regula van Hydrus',
      },
      'replaceText': {
        'Aetherochemical Grenado': 'Grenade magitek',
        'Ancient Circle': 'Cercle ancien',
        'Ancient Eruption': 'Éruption ancienne',
        'Annihilation': 'Annihilation',
        'Ballistic Missile': 'Missiles balistiques',
        'Bastardbluss': 'Lacération vicieuse',
        'Blizzard Burst': 'Explosion glaciale',
        'Blizzard Sphere': 'Sphère de glace',
        'Chthonic Hush': 'Silence chthonien',
        'Circle of Flames': 'Cercle de flammes',
        'Dark Blizzard II': 'Extra Glace ténébreuse',
        'Dark Fire II': 'Extra Feu ténébreux',
        'Dark Orb': 'Orbe ténébreux',
        'End of Days': 'Jugement dernier',
        'Entropic Flame': 'Flamme entropique',
        'Fire Burst': 'Explosion ardente',
        'Fire Sphere': 'Sphère de feu',
        'Gaseous Bomb': 'Bombe gazeuse',
        'Height of Chaos': 'Apogée du chaos',
        'Hood Swing': 'Coup de capot',
        'Inertia Stream': 'Courant apathique',
        'Judgment': 'Jugement',
        'Ka': 'Ka',
        'Magitek Slug': 'Projectile magitek',
        'Magitek Spread': 'Ensemencement magitek',
        'Magitek Turret': 'Tourelle magitek',
        'Permafrost': 'Permafrost',
        'Petrifaction': 'Pétrification',
        'Quickstep': 'Pas rapides',
        'Riddle of the Sphinx': 'Énigme du Sphinx',
        'Sea of Pitch': 'Océan de goudron',
        'Self-detonate': 'Auto-atomisation',
        'Shadow Flare': 'Éruption ténébreuse',
        'Steel Scales': 'Écailles d\'acier',
        'Universal Manipulation': 'Manipulation universelle',
        'Weighing of the Heart': 'Pesée du cœur',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Analysis and Proving': '試作機実験庫',
        'Ascian Prime': 'アシエン・プライム',
        'Blizzardsphere': 'ブリザードスフィア',
        'Evaluation and Authentication': '評価試験場',
        'Firesphere': 'ファイアスフィア',
        'Harmachis': 'ハルマキス',
        'Igeyorhm': 'アシエン・イゲオルム',
        'Lahabrea': 'アシエン・ラハブレア',
        'Magitek Turret I': '魔導タレットI',
        'Magitek Turret II': '魔導タレットII',
        'Neurolink Nacelle': 'ニューロリンク・ナセル',
        'Regula van Hydrus': 'レグラ・ヴァン・ヒュドルス',
      },
      'replaceText': {
        'Aetherochemical Grenado': '魔導榴弾',
        'Ancient Circle': 'エンシェントリング',
        'Ancient Eruption': 'エンシェントエラプション',
        'Annihilation': 'アナイアレイション',
        'Ballistic Missile': 'ミサイル発射',
        'Bastardbluss': 'ガンバスタード',
        'Blizzard Burst': 'ブリザードバースト',
        'Blizzard Sphere': 'ブリザードスフィア',
        'Chthonic Hush': 'クトニオスハッシュ',
        'Circle of Flames': 'サークル・オブ・フレイム',
        'Dark Blizzard II': 'ダークブリザラ',
        'Dark Fire II': 'ダークファイラ',
        'Dark Orb': 'ダークオーブ',
        'End of Days': 'メギドフレイム',
        'Entropic Flame': 'エントロピックフレイム',
        'Fire Burst': 'ファイアバースト',
        'Fire Sphere': 'ファイアスフィア',
        'Gaseous Bomb': '気化爆弾',
        'Height of Chaos': 'ハイト・オブ・カオス',
        'Hood Swing': 'フードスイング',
        'Inertia Stream': 'イナーシャストリーム',
        'Judgment': 'ジャッジメント',
        'Ka': 'カー',
        'Magitek Slug': '魔導スラッグショット',
        'Magitek Spread': '魔導バックショット',
        'Magitek Turret': '魔導タレット',
        'Permafrost': 'パーマフロスト',
        'Petrifaction': 'ペトリファクション',
        'Quickstep': 'クイックステップ',
        'Riddle of the Sphinx': '謎かけ',
        'Sea of Pitch': 'シー・オブ・ピッチ',
        'Self-detonate': '爆発霧散',
        'Shadow Flare': 'シャドウフレア',
        'Steel Scales': 'スチールスケール',
        'Universal Manipulation': '法則改変',
        'Weighing of the Heart': '転生の儀',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Analysis and Proving': '试验机评测库',
        'Ascian Prime': '至尊无影',
        'Blizzardsphere': '寒冰晶球',
        'Evaluation and Authentication': '评测场',
        'Firesphere': '烈火晶球',
        'Harmachis': '赫鲁玛奇斯',
        'Igeyorhm': '以格约姆',
        'Lahabrea': '拉哈布雷亚',
        'Magitek Turret I': '魔导炮塔I',
        'Magitek Turret II': '魔导炮塔II',
        'Neurolink Nacelle': '拘束仓',
        'Regula van Hydrus': '雷古拉·范·休著斯',
      },
      'replaceText': {
        'Aetherochemical Grenado': '魔导榴弹',
        'Ancient Circle': '', // FIXME
        'Ancient Eruption': '古火喷发',
        'Annihilation': '', // FIXME
        'Ballistic Missile': '导弹发射',
        'Bastardbluss': '重枪剑',
        'Blizzard Burst': '冰结球炸裂',
        'Blizzard Sphere': '', // FIXME
        'Chthonic Hush': '地府安宁',
        'Circle of Flames': '地层断裂',
        'Dark Blizzard II': '暗冰冻',
        'Dark Fire II': '暗烈炎',
        'Dark Orb': '暗天球',
        'End of Days': '末日之火',
        'Entropic Flame': '熵火',
        'Fire Burst': '火炎球炸裂',
        'Fire Sphere': '', // FIXME
        'Gaseous Bomb': '气化炸弹',
        'Height of Chaos': '', // FIXME
        'Hood Swing': '甩头攻击',
        'Inertia Stream': '惰性流',
        'Judgment': '制裁',
        'Ka': '灵',
        'Magitek Slug': '魔导独头弹',
        'Magitek Spread': '魔导扩散弹',
        'Magitek Turret': '魔导炮塔',
        'Permafrost': '永久冻土',
        'Petrifaction': '石化',
        'Quickstep': '快步',
        'Riddle of the Sphinx': '斯芬克斯之谜',
        'Sea of Pitch': '沥青海',
        'Self-detonate': '雾散爆发',
        'Shadow Flare': '暗影核爆',
        'Steel Scales': '钢鳞',
        'Universal Manipulation': '', // FIXME
        'Weighing of the Heart': '转生之仪',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Analysis and Proving': '견본 기체 실험고',
        'Ascian Prime': '아씨엔 프라임',
        'Blizzardsphere': '눈보라 구체',
        'Evaluation and Authentication': '평가시험장',
        'Firesphere': '불의 구체',
        'Harmachis': '하르마키스',
        'Igeyorhm': '아씨엔 이게요름',
        'Lahabrea': '아씨엔 라하브레아',
        'Magitek Turret I': '마도 포탑 I',
        'Magitek Turret II': '마도 포탑 II',
        'Neurolink Nacelle': '신경연결기관',
        'Regula van Hydrus': '레굴라 반 히드루스',
      },
      'replaceText': {
        'Aetherochemical Grenado': '마도 유탄',
        'Ancient Circle': '', // FIXME
        'Ancient Eruption': '고대의 불기둥',
        'Annihilation': '', // FIXME
        'Ballistic Missile': '미사일 발사',
        'Bastardbluss': '건바스타드',
        'Blizzard Burst': '블리자드 버스트',
        'Blizzard Sphere': '', // FIXME
        'Chthonic Hush': '지하신의 침묵',
        'Circle of Flames': '화염의 원',
        'Dark Blizzard II': '다크 블리자라',
        'Dark Fire II': '다크 파이라',
        'Dark Orb': '암흑 구체',
        'End of Days': '메기도 플레임',
        'Entropic Flame': '불확실한 불꽃',
        'Fire Burst': '파이어 버스트',
        'Fire Sphere': '', // FIXME
        'Gaseous Bomb': '기화 폭탄',
        'Height of Chaos': '', // FIXME
        'Hood Swing': '머리 휘두르기',
        'Inertia Stream': '관성 기류',
        'Judgment': '심판의 날',
        'Ka': '카',
        'Magitek Slug': '마도 슬러그탄',
        'Magitek Spread': '마도 난사',
        'Magitek Turret': '마도 포탑',
        'Permafrost': '영구동토',
        'Petrifaction': '석화',
        'Quickstep': '빠른 발놀림',
        'Riddle of the Sphinx': '수수께끼',
        'Sea of Pitch': '역청의 바다',
        'Self-detonate': '자가폭발',
        'Shadow Flare': '섀도우 플레어',
        'Steel Scales': '강철 비늘',
        'Universal Manipulation': '', // FIXME
        'Weighing of the Heart': '윤회 의식',
      },
    },
  ],
}];
