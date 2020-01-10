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
      regex: / 14:101E:Ser Adelphel starts using Holiest Of Holy/,
      regexDe: / 14:101E:Adelphel starts using Quell Der Heiligkeit/,
      regexFr: / 14:101E:Sire Adelphel starts using Saint Des Saints/,
      regexJa: / 14:101E:聖騎士アデルフェル starts using ホリエストホーリー/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'AoE',
      },
    },
    {
      id: 'The Vault Holy Shield Bash',
      regex: / 14:101F:Ser Adelphel starts using Holy Shield Bash on (\y{Name})/,
      regexDe: / 14:101F:Adelphel starts using Heiliger Schildschlag on (\y{Name})/,
      regexFr: / 14:101F:Sire Adelphel starts using Coup De Bouclier Saint on (\y{Name})/,
      regexJa: / 14:101F:聖騎士アデルフェル starts using ホーリーシールドバッシュ on (\y{Name})/,
      alertText: function(data, matches) {
        if (data.role == 'healer') {
          return {
            en: 'Heal + shield ' + data.ShortName(matches[1]),
          };
        }
      },
    },
    {
      id: 'The Vault Execution',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0020/,
      infoText: function(data, matches) {
        if (data.me == matches[1]) {
          return {
            en: 'Spread marker on YOU',
          };
        }
        return {
          en: 'Avoid ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'The Vault Black Nebula',
      regex: / 14:1042:Face Of The Hero starts using Black Nebula/,
      regexDe: / 14:1042:Gesicht Des Helden starts using Schwarze Nebula/,
      regexFr: / 14:1042:Visage Du Héros starts using Nébuleuse Noire/,
      regexJa: / 14:1042:フェイス・オブ・ヒーロー starts using ブラックネビュラ/,
      condition: function(data) {
        return data.CanStun();
      },
      infoText: {
        en: 'Interrupt the Knight',
      },
    },
    {
      id: 'The Vault Faith Unmoving',
      regex: / 14:1027:Ser Grinnaux starts using Faith Unmoving/,
      regexDe: / 14:1027:Grinnaux starts using Fester Glaube/,
      regexFr: / 14:1027:Sire Grinnaux starts using Foi Immuable/,
      regexJa: / 14:1027:聖騎士グリノー starts using フェイスアンムーブ/,
      infoText: {
        en: 'Knockback',
      },
    },
    {
      id: 'The Vault Dimensional Torsion',
      regex: / 23:\y{ObjectId}:Aetherial Tear:\y{ObjectId}:(\y{Name}):....:....:0001:/,
      regexDe: / 23:\y{ObjectId}:Ätherspalt:\y{ObjectId}:(\y{Name}):....:....:0001:/,
      regexFr: / 23:\y{ObjectId}:Déchirure Dimensionnelle:\y{ObjectId}:(\y{Name}):....:....:0001:/,
      regexJa: / 23:\y{ObjectId}:次元の裂け目:\y{ObjectId}:(\y{Name}):....:....:0001:/,
      suppressSeconds: 5,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alarmText: {
        en: 'Away from rifts',
      },
    },
    {
      id: 'The Vault Altar Pyre',
      regex: / 14:1035:Ser Charibert starts using Altar Pyre/,
      regexDe: / 14:1035:Charibert starts using Scheiterhaufen/,
      regexFr: / 14:1035:Sire Charibert starts using Bûcher Funéraire/,
      regexJa: / 14:1035:聖騎士シャリベル starts using アルターパイヤ/,
      condition: function(data) {
        return data.role == 'healer';
      },
      alertText: {
        en: 'AoE',
      },
    },
    {
      id: 'The Vault Holy Chains',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0061/,
      condition: function(data, matches) {
        return data.me == matches[1];
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
