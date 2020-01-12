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
          };
        }
        return {
          en: 'Avoid tank cleave',
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
          };
        }
        return {
          en: 'Avoid tank cleave',
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
          };
        }
        return {
          en: 'Avoid ' + data.ShortName(matches.target),
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
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ser Adelphel Brightblade': 'Adelphel',
        'Ser Adelphel': 'Adelphel',
        'Ser Grinnaux the Bull': 'Grinnaux',
        'Ser Grinnaux': 'Grinnaux',
        'Ser Charibert': 'Charibert',

        'The Quire': 'Chorempore',
        'The chapter house': 'Himmelsgewölbe',
        'The Chancel': 'Bekenntnis des Glaubens',
      },
      'replaceText': {
        'Fast Blade': 'Vortexschnitt',
        'Bloodstain': 'Befleckung',
        'Advent': 'Wiederkunft',
        'Holiest Of Holy': 'Quell der Heiligkeit',
        'Heavenly Slash': 'Himmelsschlag',
        'Holy Shield Bash': 'Heiliger Schildschlag',
        'Solid Ascension': 'Gipfelstürmer',
        'Shining Blade': 'Glänzende Klinge',
        'Execution': 'Exekution',
        'Retreat': 'Rückzug',

        'Overpower': 'Kahlrodung',
        'Rive': 'Spalten',
        'Dimensional Collapse': 'Dimensionskollaps',
        'Heavy Swing': 'Schwerer Schwinger',
        'Hyperdimensional Slash': 'Hyperdimensionsschlag',
        'Dimensional Rip': 'Dimensionsriss',
        'Faith Unmoving': 'Fester Glaube',

        'Altar Candle': 'Altarkerze',
        'Heavensflame': 'Himmlische Flamme',
        'Holy Chain': 'Heilige Kette',
        'Knights Appear': 'Knights Appear', // FIXME
        'Altar Pyre': 'Scheiterhaufen',
        'Black Knight\s Tour': 'Schwarzer Rösselsprung',
        'White Knight\'s Tour': 'Weißer Rösselsprung',
        'Pure Of Heart': 'Reines Herz',
        'Sacred Flame': 'Heilige Flamme',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ser Adelphel Brightblade': 'sire Adelphel',
        'Ser Adelphel': 'sire Adelphel',
        'Ser Grinnaux the Bull': 'sire Grinnaux',
        'Ser Grinnaux': 'sire Grinnaux',
        'Ser Charibert': 'sire Charibert',

        'The Quire': 'Chœur',
        'The chapter house': 'Kiosque du patio',
        'The Chancel': 'Salle de prière du sanctuaire de l\'Azur',
      },
      'replaceText': {
        'Fast Blade': 'Lame rapide',
        'Bloodstain': 'Tache de sang',
        'Advent': 'Avènement',
        'Holiest Of Holy': 'Saint des saints',
        'Heavenly Slash': 'Lacération céleste',
        'Holy Shield Bash': 'Coup de bouclier saint',
        'Solid Ascension': 'Ascension solide',
        'Shining Blade': 'Lame brillante',
        'Execution': 'Exécution',
        'Retreat': 'Retraite',

        'Overpower': 'Domination',
        'Rive': 'Coupure',
        'Dimensional Collapse': 'Effondrement dimensionnel',
        'Heavy Swing': 'Swing céleste',
        'Hyperdimensional Slash': 'Lacération hyperdimensionnelle',
        'Dimensional Rip': 'Déchirure dimensionnelle',
        'Faith Unmoving': 'Foi immuable',

        'Altar Candle': 'Cierge funéraire',
        'Heavensflame': 'Flamme céleste',
        'Holy Chain': 'Chaîne sacrée',
        'Knights Appear': 'Knights Appear', // FIXME
        'Altar Pyre': 'Bûcher funéraire',
        'Black Knight\s Tour': 'Tour de cavalier noir',
        'White Knight\'s Tour': 'Tour de cavalier blanc',
        'Pure Of Heart': 'Pureté du cœur',
        'Sacred Flame': 'Flamme sacrée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ser Adelphel Brightblade': '美剣のアデルフェル',
        'Ser Adelphel': '聖騎士アデルフェル',
        'Ser Grinnaux the Bull': '戦狂のグリノー',
        'Ser Grinnaux': '聖騎士グリノー',
        'Ser Charibert': '聖騎士シャリベル',

        'The Quire': '聖歌隊席',
        'The chapter house': '庭園の小ホール',
        'The Chancel': '氷天宮礼拝堂',
      },
      'replaceText': {
        'Fast Blade': 'ファストブレード',
        'Bloodstain': 'ブラッドステイン',
        'Advent': '再臨',
        'Holiest Of Holy': 'ホリエストホーリー',
        'Heavenly Slash': 'ヘヴンリースラッシュ',
        'Holy Shield Bash': 'ホーリーシールドバッシュ',
        'Solid Ascension': 'ソリッドライズ',
        'Shining Blade': 'シャイニングブレード',
        'Execution': 'エクスキューション',
        'Retreat': '撤退',

        'Overpower': 'オーバーパワー',
        'Rive': 'ライブ',
        'Dimensional Collapse': 'ディメンションクラッシュ',
        'Heavy Swing': 'ヘヴンリースイング',
        'Hyperdimensional Slash': 'ハイパーディメンション',
        'Dimensional Rip': 'ディメンションリップ',
        'Faith Unmoving': 'フェイスアンムーブ',

        'Altar Candle': 'アルターキャンドル',
        'Heavensflame': 'へヴンフレイム',
        'Holy Chain': 'ホーリーチェーン',
        'Knights Appear': 'Knights Appear', // FIXME
        'Altar Pyre': 'アルターパイヤ',
        'Black Knight\s Tour': 'ブラックナイトツアー',
        'White Knight\'s Tour': 'ホワイトナイトツアー',
        'Pure Of Heart': 'ピュア・オブ・ハート',
        'Sacred Flame': '聖火燃焼',
      },
    },
  ],
}];
