'use strict';

// The Vault
[{
  zoneRegex: /^The Vault$/,
  timelineFile: 'the_vault.txt',
  timelineTriggers: [
    {
      id: 'The Vault Heavenly Slash',
      regex: /Heavenly Slash/,
      beforeSeconds: 3.5,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank cleave',
            fr: 'Tank cleave',
          };
        }
        return {
          en: 'Avoid tank cleave',
          fr: 'Evitez le cleave sur le tank',
        };
      },
    },
    {
      id: 'The Vault Shining Blade',
      regex: /Shining Blade/,
      beforeSeconds: 3,
      suppressSeconds: 10,
      infoText: {
        en: 'Avoid dashes',
        fr: 'Evitez les dash',
      },
    },
    {
      id: 'The Vault Heavy Swing',
      regex: /Heavy Swing/,
      beforeSeconds: 4,
      infoText: function(data) {
        if (data.role == 'tank') {
          return {
            en: 'Tank cleave',
            fr: 'Tank cleave',
          };
        }
        return {
          en: 'Avoid tank cleave',
          fr: 'Evitez le cleave sur le tank',
        };
      },
    },
    {
      id: 'The Vault Altar Candle',
      regex: /Altar Candle/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role != 'dps';
      },
      alertText: {
        en: 'Tank buster',
        fr: 'Tankbuster',
      },
    },
  ],
  triggers: [
    {
      id: 'The Vault Holiest of Holy',
      regex: Regexes.startsUsing({ id: '101E', source: 'Ser Adelphel', capture: false }),
      regexDe: Regexes.startsUsing({ id: '101E', source: 'Adelphel', capture: false }),
      regexFr: Regexes.startsUsing({ id: '101E', source: 'Sire Adelphel', capture: false }),
      regexJa: Regexes.startsUsing({ id: '101E', source: '聖騎士アデルフェル', capture: false }),
      regexCn: Regexes.startsUsing({ id: '101E', source: '圣骑士阿代尔斐尔', capture: false }),
      regexKo: Regexes.startsUsing({ id: '101E', source: '성기사 아델펠', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'The Vault Holy Shield Bash',
      regex: Regexes.startsUsing({ id: '101F', source: 'Ser Adelphel' }),
      regexDe: Regexes.startsUsing({ id: '101F', source: 'Adelphel' }),
      regexFr: Regexes.startsUsing({ id: '101F', source: 'Sire Adelphel' }),
      regexJa: Regexes.startsUsing({ id: '101F', source: '聖騎士アデルフェル' }),
      regexCn: Regexes.startsUsing({ id: '101F', source: '圣骑士阿代尔斐尔' }),
      regexKo: Regexes.startsUsing({ id: '101F', source: '성기사 아델펠' }),
      alertText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Heal + shield ' + data.ShortName(matches.target),
            fr: 'Heal + boucliers ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'The Vault Execution',
      regex: Regexes.headMarker({ id: '0020' }),
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Spread marker on YOU',
            fr: 'Marqueur de séparation sur VOUS',
          };
        }
        return {
          en: 'Avoid ' + data.ShortName(matches.target),
          fr: 'Evitez ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'The Vault Black Nebula',
      regex: Regexes.startsUsing({ id: '1042', source: 'Face Of The Hero', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1042', source: 'Gesicht Des Helden', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1042', source: 'Visage Du Héros', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1042', source: 'フェイス・オブ・ヒーロー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1042', source: '英雄之相', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1042', source: '영웅의 형상', capture: false }),
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Interrupt the Knight',
        fr: 'Interrompez le chevalier',
      },
    },
    {
      id: 'The Vault Faith Unmoving',
      regex: Regexes.startsUsing({ id: '1027', source: 'Ser Grinnaux', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1027', source: 'Grinnaux', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1027', source: 'Sire Grinnaux', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1027', source: '聖騎士グリノー', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1027', source: '圣骑士格里诺', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1027', source: '성기사 그리노', capture: false }),
      infoText: {
        en: 'Knockback',
        fr: 'Poussée',
      },
    },
    {
      id: 'The Vault Dimensional Torsion',
      regex: Regexes.tether({ id: '0001', source: 'Aetherial Tear' }),
      regexDe: Regexes.tether({ id: '0001', source: 'Ätherspalt' }),
      regexFr: Regexes.tether({ id: '0001', source: 'Déchirure Dimensionnelle' }),
      regexJa: Regexes.tether({ id: '0001', source: '次元の裂け目' }),
      regexCn: Regexes.tether({ id: '0001', source: '次元裂缝' }),
      regexKo: Regexes.tether({ id: '0001', source: '차원의 틈새' }),
      suppressSeconds: 5,
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alarmText: {
        en: 'Away from rifts',
        fr: 'Eloignez-vous des déchirures',
      },
    },
    {
      id: 'The Vault Altar Pyre',
      regex: Regexes.startsUsing({ id: '1035', source: 'Ser Charibert', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1035', source: 'Charibert', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1035', source: 'Sire Charibert', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1035', source: '聖騎士シャリベル', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1035', source: '圣骑士沙里贝尔', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1035', source: '성기사 샤리베르', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'AoE',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'The Vault Holy Chains',
      regex: Regexes.headMarker({ id: '0061' }),
      condition: function(data, matches) {
        return data.me == matches.target;
      },
      alertText: {
        en: 'Break chains',
        fr: 'Cassez les chaines',
      },
    },
    {
      id: 'The Vault Knights March',
      regex: Regexes.addedCombatant({ name: ['Dawn Knight', 'Dusk Knight'], capture: false }),
      regexDe: Regexes.addedCombatant({ name: ['Dämmerross', 'Morgenross'], capture: false }),
      regexFr: Regexes.addedCombatant({ name: ['Cavalier De L\'Aube', 'Cavalier Du Crépuscule'], capture: false }),
      regexJa: Regexes.addedCombatant({ name: ['ドーン・オートナイト', 'ダスク・オートナイト'], capture: false }),
      regexCn: Regexes.addedCombatant({ name: ['拂晓骑士', '黄昏骑士'], capture: false }),
      regexKo: Regexes.addedCombatant({ name: ['여명의 자동기사', '황혼의 자동기사'], capture: false }),
      suppressSeconds: 4,
      infoText: {
        en: 'Evade marching knights',
        fr: 'Esquivez les chevaliers',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Dawn Knight': 'Dämmerross',
        'Dusk Knight': 'Morgenross',
        'Ser Adelphel(?! )': 'Adelphel',
        'Ser Adelphel Brightblade': 'Adelphel',
        'Ser Charibert': 'Charibert',
        'Ser Grinnaux(?! )': 'Grinnaux',
        'Ser Grinnaux the Bull': 'Grinnaux',
        'The Chancel': 'Bekenntnis des Glaubens',
        'The Quire': 'Chorempore',
        'The chapter house': 'Himmelsgewölbe',
        'is no longer sealed': 'is no longer sealed', // FIXME
      },
      'replaceText': {
        '--Untargetable--': '--Untargetable--', // FIXME
        '--reset--': '--reset--', // FIXME
        'Advent': 'Wiederkunft',
        'Altar Candle': 'Altarkerze',
        'Altar Pyre': 'Scheiterhaufen',
        'Black Knight\'s Tour': 'Schwarzer Rösselsprung',
        'Bloodstain': 'Befleckung',
        'Dimensional Collapse': 'Dimensionskollaps',
        'Dimensional Rip': 'Dimensionsriss',
        'Execution': 'Exekution',
        'Faith Unmoving': 'Fester Glaube',
        'Fast Blade': 'Vortexschnitt',
        'Heavenly Slash': 'Himmelsschlag',
        'Heavensflame': 'Himmlische Flamme',
        'Heavy Swing': 'Gewaltiger Hieb',
        'Holiest Of Holy': 'Quell der Heiligkeit',
        'Holy Chain': 'Heilige Kette',
        'Holy Shield Bash': 'Heiliger Schildschlag',
        'Hyperdimensional Slash': 'Hyperdimensionsschlag',
        'Knights Appear': 'Knights Appear', // FIXME
        'Overpower': 'Kahlrodung',
        'Pure Of Heart': 'Reines Herz',
        'Retreat': 'Rückzug',
        'Rive': 'Spalten',
        'Sacred Flame': 'Heilige Flamme',
        'Shining Blade': 'Leuchtende Klinge',
        'Solid Ascension': 'Gipfelstürmer',
        'White Knight\'s Tour': 'Weißer Rösselsprung',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Dawn Knight': 'cavalier de l\'aube',
        'Dusk Knight': 'cavalier du crépuscule',
        'Ser Adelphel(?! )': 'sire Adelphel',
        'Ser Adelphel Brightblade': 'sire Adelphel',
        'Ser Charibert': 'sire Charibert',
        'Ser Grinnaux(?! )': 'sire Grinnaux',
        'Ser Grinnaux the Bull': 'sire Grinnaux',
        'The Chancel': 'Salle de prière du sanctuaire de l\'Azur',
        'The Quire': 'Chœur',
        'The chapter house': 'Kiosque du patio',
        'is no longer sealed': 'Ouverture',
      },
      'replaceText': {
        '--Untargetable--': '-- Impossible à cibler --',
        '--reset--': '-- Reset --',
        'Advent': 'Avènement',
        'Altar Candle': 'Cierge funéraire',
        'Altar Pyre': 'Bûcher funéraire',
        'Black Knight\'s Tour': 'Tour de cavalier noir',
        'Bloodstain': 'Tache de sang',
        'Dimensional Collapse': 'Effondrement dimensionnel',
        'Dimensional Rip': 'Déchirure dimensionnelle',
        'Execution': 'Exécution',
        'Faith Unmoving': 'Foi immuable',
        'Fast Blade': 'Lame rapide',
        'Heavenly Slash': 'Lacération céleste',
        'Heavensflame': 'Flamme céleste',
        'Heavy Swing': 'Coup puissant',
        'Holiest Of Holy': 'Saint des saints',
        'Holy Chain': 'Chaîne sacrée',
        'Holy Shield Bash': 'Coup de bouclier saint',
        'Hyperdimensional Slash': 'Lacération hyperdimensionnelle',
        'Knights Appear': 'Apparition des chevaliers',
        'Overpower': 'Domination',
        'Pure Of Heart': 'Pureté du cœur',
        'Retreat': 'Retraite',
        'Rive': 'Coupure',
        'Sacred Flame': 'Flamme sacrée',
        'Shining Blade': 'Lame étincelante',
        'Solid Ascension': 'Ascension solide',
        'White Knight\'s Tour': 'Tour de cavalier blanc',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Dawn Knight': 'ドーン・オートナイト',
        'Dusk Knight': 'ダスク・オートナイト',
        'Ser Adelphel(?! )': '聖騎士アデルフェル',
        'Ser Adelphel Brightblade': '美剣のアデルフェル',
        'Ser Charibert': '聖騎士シャリベル',
        'Ser Grinnaux(?! )': '聖騎士グリノー',
        'Ser Grinnaux the Bull': '戦狂のグリノー',
        'The Chancel': '氷天宮礼拝堂',
        'The Quire': '聖歌隊席',
        'The chapter house': '庭園の小ホール',
        'is no longer sealed': 'is no longer sealed', // FIXME
      },
      'replaceText': {
        '--Untargetable--': '--Untargetable--', // FIXME
        '--reset--': '--reset--', // FIXME
        'Advent': '降臨',
        'Altar Candle': 'アルターキャンドル',
        'Altar Pyre': 'アルターパイヤ',
        'Black Knight\'s Tour': 'ブラックナイトツアー',
        'Bloodstain': 'ブラッドステイン',
        'Dimensional Collapse': 'ディメンションクラッシュ',
        'Dimensional Rip': 'ディメンションリップ',
        'Execution': '処刑',
        'Faith Unmoving': 'フェイスアンムーブ',
        'Fast Blade': 'ファストブレード',
        'Heavenly Slash': 'ヘヴンリースラッシュ',
        'Heavensflame': 'へヴンフレイム',
        'Heavy Swing': 'ヘヴィスウィング',
        'Holiest Of Holy': 'ホリエストホーリー',
        'Holy Chain': 'ホーリーチェーン',
        'Holy Shield Bash': 'ホーリーシールドバッシュ',
        'Hyperdimensional Slash': 'ハイパーディメンション',
        'Knights Appear': 'Knights Appear', // FIXME
        'Overpower': 'オーバーパワー',
        'Pure Of Heart': 'ピュア・オブ・ハート',
        'Retreat': '撤退',
        'Rive': 'ライブ',
        'Sacred Flame': '聖火燃焼',
        'Shining Blade': 'シャインブレード',
        'Solid Ascension': 'ソリッドライズ',
        'White Knight\'s Tour': 'ホワイトナイトツアー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Dawn Knight': '拂晓骑士',
        'Dusk Knight': '黄昏骑士',
        'Ser Adelphel(?! )': '圣骑士阿代尔斐尔',
        'Ser Adelphel Brightblade': '光辉剑 阿代尔斐尔',
        'Ser Charibert': '圣骑士沙里贝尔',
        'Ser Grinnaux(?! )': '圣骑士格里诺',
        'Ser Grinnaux the Bull': '战争狂 格里诺',
        'The Chancel': '冰天宫礼拜堂',
        'The Quire': '圣歌队席',
        'The chapter house': '庭园小厅',
        'is no longer sealed': 'is no longer sealed', // FIXME
      },
      'replaceText': {
        '--Untargetable--': '--Untargetable--', // FIXME
        '--reset--': '--reset--', // FIXME
        'Advent': '降临',
        'Altar Candle': '圣坛蜡烛',
        'Altar Pyre': '圣坛火葬',
        'Black Knight\'s Tour': '黑骑士之旅',
        'Bloodstain': '染血剑',
        'Dimensional Collapse': '空间破碎',
        'Dimensional Rip': '空间裂痕',
        'Execution': '处刑',
        'Faith Unmoving': '坚定信仰',
        'Fast Blade': '先锋剑',
        'Heavenly Slash': '天斩',
        'Heavensflame': '天火',
        'Heavy Swing': '重劈',
        'Holiest Of Holy': '至圣',
        'Holy Chain': '圣锁',
        'Holy Shield Bash': '圣盾猛击',
        'Hyperdimensional Slash': '多维空间斩',
        'Knights Appear': 'Knights Appear', // FIXME
        'Overpower': '超压斧',
        'Pure Of Heart': '纯洁心灵',
        'Retreat': '撤退',
        'Rive': '撕裂斧',
        'Sacred Flame': '圣火燃烧',
        'Shining Blade': '光明之刃',
        'Solid Ascension': '实体升天',
        'White Knight\'s Tour': '', // FIXME
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Dawn Knight': '여명의 자동기사',
        'Dusk Knight': '황혼의 자동기사',
        'Ser Adelphel(?! )': '성기사 아델펠',
        'Ser Adelphel Brightblade': '미검의 아델펠',
        'Ser Charibert': '성기사 샤리베르',
        'Ser Grinnaux(?! )': '성기사 그리노',
        'Ser Grinnaux the Bull': '전쟁광 그리노',
        'The Chancel': '빙천궁 예배당',
        'The Quire': '성가대석',
        'The chapter house': '기사단 강당',
        'is no longer sealed': 'is no longer sealed', // FIXME
      },
      'replaceText': {
        '--Untargetable--': '--Untargetable--', // FIXME
        '--reset--': '--reset--', // FIXME
        'Advent': '강림',
        'Altar Candle': '제단의 초',
        'Altar Pyre': '제단의 장작',
        'Black Knight\'s Tour': '흑기사 행진',
        'Bloodstain': '핏자국',
        'Dimensional Collapse': '차원 파괴',
        'Dimensional Rip': '차원 찢기',
        'Execution': '처형',
        'Faith Unmoving': '굳건한 신앙',
        'Fast Blade': '재빠른 검격',
        'Heavenly Slash': '천상의 참격',
        'Heavensflame': '천상의 불꽃',
        'Heavy Swing': '육중한 일격',
        'Holiest Of Holy': '지고한 신성',
        'Holy Chain': '거룩한 사슬',
        'Holy Shield Bash': '성스러운 방패 강타',
        'Hyperdimensional Slash': '고차원',
        'Knights Appear': 'Knights Appear', // FIXME
        'Overpower': '압도',
        'Pure Of Heart': '정결한 마음',
        'Retreat': '철수',
        'Rive': '두 동강 내기',
        'Sacred Flame': '성화 연소',
        'Shining Blade': '빛나는 칼날',
        'Solid Ascension': '불변의 승천',
        'White Knight\'s Tour': '', // FIXME
      },
    },
  ],
}];
