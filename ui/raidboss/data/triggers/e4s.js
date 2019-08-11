'use strict';

[{
  zoneRegex: /^Eden's Gate: Sepulture \(Savage\)$/,
  timelineFile: 'e4s.txt',
  timelineTriggers: [
    {
      id: 'E4S Earthen Anguish',
      regex: /Earthen Anguish/,
      beforeSeconds: 3,
      condition: function(data) {
        return data.role == 'healer' || data.role == 'tank';
      },
      alertText: {
        en: 'tank busters',
      },
    },
  ],
  triggers: [
    {
      id: 'E4S Stonecrusher',
      regex: / 14:4116:Titan starts using Stonecrusher on (\y{Name})/,
      regexCn: / 14:4116:泰坦 starts using Stonecrusher on (\y{Name})/,
      regexDe: / 14:4116:Titan starts using Felsbrecher on (\y{Name})/,
      regexFr: / 14:4116:Titan starts using Éruption tellurique on (\y{Name})/,
      regexJa: / 14:4116:タイタン starts using ロッククラッシュ on (\y{Name})/,
      alertText: function(data, matches) {
        if (matches[1] == data.me) {
          return {
            en: 'Tank Buster on YOU',
            de: 'Tankbuster auf DIR',
            fr: 'Tankbuster sur VOUS',
          };
        }
      },
      // As this seems to usually seems to be invulned,
      // don't make a big deal out of it.
      infoText: function(data, matches) {
        if (matches[1] == data.me)
          return;
        if (data.role != 'tank' && data.role != 'healer')
          return;

        return {
          en: 'Buster on ' + data.ShortName(matches[1]),
          de: 'Tankbuster auf ' + data.ShortName(matches[1]),
          fr: 'Tankbuster sur ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E4S Pulse of the Land',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00B9:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Spread Marker',
      },
    },
    {
      id: 'E4S Evil Earth',
      regex: / 14:410C:Titan starts using Evil Earth/,
      regexCn: / 14:410C:泰坦 starts using Evil Earth/,
      regexDe: / 14:410C:Titan starts using Grimm der Erde/,
      regexFr: / 14:410C:Titan starts using Terre maléfique/,
      regexJa: / 14:410C:タイタン starts using イビルアース/,
      suppressSeconds: 1,
      infoText: {
        en: 'Look for Evil Earth Marker',
      },
    },
    {
      id: 'E4S Force of the Land',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00BA:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Stack Marker',
      },
    },
    {
      id: 'E4S Voice of the Land',
      regex: / 14:4114:Titan starts using Voice of the Land/,
      regexCn: / 14:4114:泰坦 starts using Voice of the Land/,
      regexDe: / 14:4114:Titan starts using Aufschrei der Erde/,
      regexFr: / 14:4114:Titan starts using Hurlement tellurique/,
      regexJa: / 14:4114:タイタン starts using 大地の叫び/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
        fr: 'Dégâts de zone',
      },
    },
    {
      id: 'E4S Geocrush',
      regex: / 14:4113:Titan starts using Geocrush/,
      regexCn: / 14:4113:泰坦 starts using Geocrush/,
      regexDe: / 14:4113:Titan starts using Kraterschlag/,
      regexFr: / 14:4113:Titan starts using Broie-terre/,
      regexJa: / 14:4113:タイタン starts using ジオクラッシュ/,
      alertText: {
        en: 'Knockback',
        fr: 'Poussée',
      },
    },
    {
      id: 'E4S Massive Landslide - Front',
      regex: / 15:........:Titan:40E6:Earthen Gauntlets/,
      regexCn: / 15:........:泰坦:40E6:Earthen Gauntlets/,
      regexDe: / 15:........:Titan:40E6:Gaia-Armberge/,
      regexFr: / 15:........:Titan:40E6:Poing tellurique/,
      regexJa: / 15:........:タイタン:40E6:大地の手甲/,
      alertText: {
        en: 'Landslide: In Front',
      },
    },
    {
      id: 'E4S Massive Landslide - Sides',
      regex: / 15:........:Titan:4117:Massive Landslide/,
      regexCn: / 15:........:泰坦:4117:Massive Landslide/,
      regexDe: / 15:........:Titan:4117:Gigantischer Bergsturz/,
      regexFr: / 15:........:Titan:4117:Glissement apocalyptique/,
      regexJa: / 15:........:タイタン:4117:メガ・ランドスライド/,
      infoText: {
        en: 'Get to Sides',
      },
    },
    {
      id: 'E4S Landslide',
      regex: / 14:411A:Titan starts using Landslide/,
      regexCn: / 14:411A:泰坦 starts using Landslide/,
      regexDe: / 14:411A:Titan starts using Bergsturz/,
      regexFr: / 14:411A:Titan starts using Glissement de terrain/,
      regexJa: / 14:411A:タイタン starts using ランドスライド/,
      alertText: {
        en: 'Back Corners',
      },
    },
    {
      id: 'E4S Crumbling Down',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:0017:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Bomb on YOU',
      },
    },
    {
      id: 'E4S Seismic Wave',
      regex: / 14:4110:Titan starts using Seismic Wave/,
      regexCn: / 14:4110:泰坦 starts using Seismic Wave/,
      regexDe: / 14:4110:Titan starts using Seismische Welle/,
      regexFr: / 14:4110:Titan starts using Ondes sismiques/,
      regexJa: / 14:4110:タイタン starts using サイズミックウェーブ/,
      alertText: {
        en: 'Hide Behind',
      },
    },
    {
      id: 'E4S Fault Line - Sides',
      regex: / 15:\y{ObjectId}:Titan:40E8:Earthen Wheels/,
      regexCn: / 15:\y{ObjectId}:泰坦:40E8:Earthen Wheels/,
      regexDe: / 15:\y{ObjectId}:Titan:40E8:Gaia-Räder/,
      regexFr: / 15:\y{ObjectId}:Titan:40E8:Pas tellurique/,
      regexJa: / 15:\y{ObjectId}:タイタン:40E8:大地の車輪/,
      alertText: {
        en: 'Wheels: On Sides',
      },
    },
    {
      id: 'E4S Fault Line - Front',
      regex: / 16:\y{ObjectId}:Titan:411F:Fault Line/,
      regexCn: / 16:\y{ObjectId}:泰坦:411F:Fault Line/,
      regexDe: / 16:\y{ObjectId}:Titan:411F:Bruchlinie/,
      regexFr: / 16:\y{ObjectId}:Titan:411F:Faille tectonique/,
      regexJa: / 16:\y{ObjectId}:タイタン:411F:フォールトゾーン/,
      infoText: {
        en: 'Tank Charge',
      },
    },
    {
      id: 'E4S Magnitude 5.0',
      regex: / 14:4121:Titan starts using Magnitude 5.0/,
      regexCn: / 14:4121:泰坦 starts using Magnitude 5.0/,
      regexDe: / 14:4121:Titan starts using Magnitude 5.0/,
      regexFr: / 14:4121:Titan starts using Magnitude 5/,
      regexJa: / 14:4121:タイタン starts using マグニチュード5.0/,
      alertText: {
        en: 'Get Under',
      },
    },
    {
      id: 'E4S Earthen Fury',
      regex: / 14:4124:Titan Maximum starts using Earthen Fury/,
      regexCn: / 14:4124:泰坦 Maximum starts using Earthen Fury/,
      regexDe: / 14:4124:Titan Maximum starts using Gaias Zorn/,
      regexFr: / 14:4124:Titan Maximum starts using Fureur tellurique/,
      regexJa: / 14:4124:タイタン Maximum starts using 大地の怒り/,
      condition: function(data) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'big aoe',
      },
    },
    {
      id: 'E4S Earthen Fist - Left/Right',
      regex: / 14:412F:Titan Maximum starts using Earthen Fist/,
      regexCn: / 14:412F:泰坦 Maximum starts using Earthen Fist/,
      regexDe: / 14:412F:Titan Maximum starts using Gaias Faust/,
      regexFr: / 14:412F:Titan Maximum starts using Poing de la terre/,
      regexJa: / 14:412F:タイタン Maximum starts using 大地の拳/,
      infoText: {
        en: 'Left, Then Right',
      },
    },
    {
      id: 'E4S Earthen Fist - Right/Left',
      regex: / 14:4130:Titan Maximum starts using Earthen Fist/,
      regexCn: / 14:4130:泰坦 Maximum starts using Earthen Fist/,
      regexDe: / 14:4130:Titan Maximum starts using Gaias Faust/,
      regexFr: / 14:4130:Titan Maximum starts using Poing de la terre/,
      regexJa: / 14:4130:タイタン Maximum starts using 大地の拳/,
      infoText: {
        en: 'Right, Then Left',
      },
    },
    {
      id: 'E4S Earthen Fist - 2x Left',
      regex: / 14:4131:Titan Maximum starts using Earthen Fist/,
      regexCn: / 14:4131:泰坦 Maximum starts using Earthen Fist/,
      regexDe: / 14:4131:Titan Maximum starts using Gaias Faust/,
      regexFr: / 14:4131:Titan Maximum starts using Poing de la terre/,
      regexJa: / 14:4131:タイタン Maximum starts using 大地の拳/,
      infoText: {
        en: 'Left, Stay Left',
      },
    },
    {
      id: 'E4S Earthen Fist - 2x Right',
      regex: / 14:4132:Titan Maximum starts using Earthen Fist/,
      regexCn: / 14:4132:泰坦 Maximum starts using Earthen Fist/,
      regexDe: / 14:4132:Titan Maximum starts using Gaias Faust/,
      regexFr: / 14:4132:Titan Maximum starts using Poing de la terre/,
      regexJa: / 14:4132:タイタン Maximum starts using 大地の拳/,
      infoText: {
        en: 'Right, Stay Right',
      },
    },
    {
      id: 'E4S Dual Earthen Fists',
      regex: / 14:4135:Titan Maximum starts using Dual Earthen Fists/,
      regexCn: / 14:4135:泰坦 Maximum starts using Dual Earthen Fists/,
      regexDe: / 14:4135:Titan Maximum starts using Dual Gaias Fausts/,
      regexFr: / 14:4135:Titan Maximum starts using Dual Poing de la terres/,
      regexJa: / 14:4135:タイタン Maximum starts using Dual 大地の拳s/,
      infoText: {
        en: 'Knockback',
        fr: 'Poussée',
      },
    },
    {
      id: 'E4S Weight of the World',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00BB:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Weight, Get Out',
      },
    },
    {
      id: 'E4S Megalith',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:005D:/,
      alertText: function(data, matches) {
        if (data.role != 'tank') {
          return {
            en: 'Away from Tanks',
          };
        }
        if (matches[1] == data.me) {
          return {
            en: 'Stack on YOU',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches[1]),
        };
      },
    },
    {
      id: 'E4S Granite Gaol',
      regex: / 1B:\y{ObjectId}:(\y{Name}):....:....:00BF:/,
      condition: function(data, matches) {
        return data.me == matches[1];
      },
      alertText: {
        en: 'Gaol on YOU',
      },
    },
    {
      // TODO: these could be better called out
      // On the first set, maybe should tell you where to put the jails,
      // if it's a consistent strategy to ranged lb the jails.  After that
      // it could just tell you to "go right" or "go left".
      // On the second set, could just say "go right" / "go front" and
      // keep track of which it has seen.
      id: 'E4S Plate Fracture - Front Right',
      regex: / 14:4125:Titan Maximum starts using Plate Fracture/,
      regexCn: / 14:4125:泰坦 Maximum starts using Plate Fracture/,
      regexDe: / 14:4125:Titan Maximum starts using Felsberster/,
      regexFr: / 14:4125:Titan Maximum starts using Fracture rocheuse/,
      regexJa: / 14:4125:タイタン Maximum starts using ロックフラクチャー/,
      infoText: {
        en: 'GET OFF FRONT RIGHT',
      },
    },
    {
      id: 'E4S Plate Fracture - Back Right',
      regex: / 14:4126:Titan Maximum starts using Plate Fracture/,
      regexCn: / 14:4126:泰坦 Maximum starts using Plate Fracture/,
      regexDe: / 14:4126:Titan Maximum starts using Felsberster/,
      regexFr: / 14:4126:Titan Maximum starts using Fracture rocheuse/,
      regexJa: / 14:4126:タイタン Maximum starts using ロックフラクチャー/,
      infoText: {
        en: 'GET OFF BACK RIGHT',
      },
    },
    {
      id: 'E4S Plate Fracture - Back Left',
      regex: / 14:4127:Titan Maximum starts using Plate Fracture/,
      regexCn: / 14:4127:泰坦 Maximum starts using Plate Fracture/,
      regexDe: / 14:4127:Titan Maximum starts using Felsberster/,
      regexFr: / 14:4127:Titan Maximum starts using Fracture rocheuse/,
      regexJa: / 14:4127:タイタン Maximum starts using ロックフラクチャー/,
      infoText: {
        en: 'GET OFF BACK LEFT',
      },
    },
    {
      id: 'E4S Plate Fracture - Front Left',
      regex: / 14:4128:Titan Maximum starts using Plate Fracture/,
      regexCn: / 14:4128:泰坦 Maximum starts using Plate Fracture/,
      regexDe: / 14:4128:Titan Maximum starts using Felsberster/,
      regexFr: / 14:4128:Titan Maximum starts using Fracture rocheuse/,
      regexJa: / 14:4128:タイタン Maximum starts using ロックフラクチャー/,
      infoText: {
        en: 'GET OFF FRONT LEFT',
      },
    },
    {
      id: 'E4S Tumult',
      regex: / 14:412A:Titan Maximum starts using Tumult/,
      regexCn: / 14:412A:泰坦 Maximum starts using Tumult/,
      regexDe: / 14:412A:Titan Maximum starts using Katastrophales Beben/,
      regexFr: / 14:412A:Titan Maximum starts using Tumulte/,
      regexJa: / 14:412A:タイタン Maximum starts using 激震/,
      condition: function(data, matches) {
        return data.role == 'healer';
      },
      infoText: {
        en: 'aoe',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Titan': 'Titan',
        'Granite Gaol': 'Granitgefängnis',
        'Engage!': 'Start!',
        'Bomb Boulder': 'Bomber-Brocken',
      },
      'replaceText': {
        'attack': 'Attacke',
        'Weight of the World': 'Schwere der Erde',
        'Weight of the Land': 'Gaias Gewicht',
        'Voice of the Land': 'Aufschrei der Erde',
        'Unknown Ability': 'Unknown Ability',
        'Tumult': 'Katastrophales Beben',
        'Tectonic Uplift': 'Tektonische Hebung',
        'Stonecrusher': 'Felsbrecher',
        'Seismic Wave': 'Seismische Welle',
        'Rock Throw': 'Granitgefängnis',
        'Rightward Landslide': 'Rechter Bergsturz',
        'Pulse of the Land': 'Gaias Beben',
        'Plate Fracture': 'Felsberster',
        'Orogenesis': 'Orogenese',
        'Megalith': 'Megalithenbrecher',
        'Massive Landslide': 'Gigantischer Bergsturz',
        'Magnitude 5.0': 'Magnitude 5.0',
        'Landslide': 'Bergsturz',
        'Geocrush': 'Kraterschlag',
        'Force of the Land': 'Gaias Tosen',
        'Fault Line': 'Bruchlinie',
        'Explosion': 'Explosion',
        'Evil Earth': 'Grimm der Erde',
        'Enrage': 'Finalangriff',
        'Earthen Wheels': 'Gaia-Räder',
        'Earthen Gauntlets': 'Gaia-Armberge',
        'Earthen Fury': 'Gaias Zorn',
        'Earthen Fist': 'Gaias Faust',
        'Earthen Armor': 'Basaltpanzer',
        'Earthen Anguish': 'Gaias Pein',
        'Dual Earthen Fists': 'Gaias Hammerfaust',
        'Crumbling Down': 'Felsfall',
        'Bury': 'Begraben',
        'Bomb Boulders': 'Tumulus',
        'Aftershock': 'Nachbeben',
        '--untargetable--': '--nich anvisierbar--',
        '--targetable--': '--anvisierbar--',
      },
      '~effectNames': {
        'Summon Order III': 'Egi-Attacke III',
        'Summon Order': 'Egi-Attacke I',
        'Physical Vulnerability Up': 'Erhöhte Physische Verwundbarkeit',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Healing Magic Down': 'Heilmagie -',
        'Filthy': 'Dreck',
        'Fetters': 'Gefesselt',
        'Devotion': 'Hingabe',
        'Damage Down': 'Schaden -',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Titan': 'Titan',
        'Granite Gaol': 'Geôle De Granite',
        'Engage!': 'À l\'attaque',
        'Bomb Boulder': 'Bombo Rocher',
      },
      'replaceText': {
        'attack': 'Attaque',
        'Weight of the World': 'Poids du monde',
        'Weight of the Land': 'Poids de la terre',
        'Voice of the Land': 'Hurlement tellurique',
        'Unknown Ability': 'Unknown Ability',
        'Tumult': 'Tumulte',
        'Tectonic Uplift': 'Soulèvement tectonique',
        'Stonecrusher': 'Éruption tellurique',
        'Seismic Wave': 'Ondes sismiques',
        'Rock Throw': 'Jeté de rocs',
        'Rightward Landslide': 'Glissement dextre',
        'Pulse of the Land': 'Vibration tellurique',
        'Plate Fracture': 'Fracture rocheuse',
        'Orogenesis': 'Orogenèse',
        'Megalith': 'Écrasement mégalithique',
        'Massive Landslide': 'Glissement apocalyptique',
        'Magnitude 5.0': 'Magnitude 5',
        'Landslide': 'Glissement de terrain',
        'Geocrush': 'Broie-terre',
        'Force of the Land': 'Grondement tellurique',
        'Fault Line': 'Faille tectonique',
        'Explosion': 'Explosion',
        'Evil Earth': 'Terre maléfique',
        'Enrage': 'Enrage',
        'Earthen Wheels': 'Pas tellurique',
        'Earthen Gauntlets': 'Poing tellurique',
        'Earthen Fury': 'Fureur tellurique',
        'Earthen Fist': 'Poing de la terre',
        'Earthen Armor': 'Armure tellurique',
        'Earthen Anguish': 'Peine de la terre',
        'Dual Earthen Fists': 'Frappe de la terre',
        'Crumbling Down': 'Chute de monolithes',
        'Bury': 'Ensevelissement',
        'Bomb Boulders': 'Bombo rocher',
        'Aftershock': 'Répercussion',
        '--untargetable--': '--Impossible à cibler--',
        '--targetable--': '--Ciblable--',
        '--sync--': '--Synchronisation--',
        '--Reset--': '--Réinitialisation--',
      },
      '~effectNames': {
        'Summon Order III': 'Actions en attente: 3',
        'Summon Order': 'Action en attente: 1',
        'Physical Vulnerability Up': 'Vulnérabilité Physique Augmentée',
        'Magic Vulnerability Up': 'Vulnérabilité Magique Augmentée',
        'Healing Magic Down': 'Malus De Soin',
        'Filthy': 'Embourbement',
        'Fetters': 'Attache',
        'Devotion': 'Dévouement',
        'Damage Down': 'Malus De Dégâts',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'ジャイアントボルダー': 'ジャイアントボルダー',
        'Titan': 'タイタン',
        'Granite Gaol': 'グラナイト・ジェイル',
        'Engage!': '戦闘開始！',
        'Bomb Boulder': 'ボムボルダー',
      },
      'replaceText': {
        'attack': '攻撃',
        'Weight of the World': '大陸の重み',
        'Weight of the Land': '大地の重み',
        'Voice of the Land': '大地の叫び',
        'Unknown Ability': 'Unknown Ability',
        'Tumult': '激震',
        'Tectonic Uplift': 'クラスタルアップリフト',
        'Stonecrusher': 'ロッククラッシュ',
        'Seismic Wave': 'サイズミックウェーブ',
        'Rock Throw': 'グラナイト・ジェイル',
        'Rightward Landslide': 'ライト・ランドスライド',
        'Pulse of the Land': '大地の響き',
        'Plate Fracture': 'ロックフラクチャー',
        'Orogenesis': 'オーロジェニー',
        'Megalith': 'メガリスクラッシュ',
        'Massive Landslide': 'メガ・ランドスライド',
        'Magnitude 5.0': 'マグニチュード5.0',
        'Landslide': 'ランドスライド',
        'Geocrush': 'ジオクラッシュ',
        'Force of the Land': '大地の轟き',
        'Fault Line': 'フォールトゾーン',
        'Explosion': '爆散',
        'Evil Earth': 'イビルアース',
        'Earthen Wheels': '大地の車輪',
        'Earthen Gauntlets': '大地の手甲',
        'Earthen Fury': '大地の怒り',
        'Earthen Fist': '大地の拳',
        'Earthen Armor': '大地の鎧',
        'Earthen Anguish': '大地の痛み',
        'Dual Earthen Fists': '大地の両拳',
        'Crumbling Down': '岩盤崩落',
        'Bury': '衝撃',
        'Bomb Boulders': 'ボムボルダー',
        'Aftershock': '余波',
      },
      '~effectNames': {
        'Summon Order III': 'アクション実行待機III',
        'Summon Order': 'アクション実行待機I',
        'Physical Vulnerability Up': '被物理ダメージ増加',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Healing Magic Down': '回復魔法効果低下',
        'Filthy': '汚泥',
        'Fetters': '拘束',
        'Devotion': 'エギの加護',
        'Damage Down': 'ダメージ低下',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Titan': '泰坦',
        'Granite Gaol': '花岗石牢',
        'Engage!': '战斗开始！',
        'Bomb Boulder': '爆破岩石',
      },
      'replaceText': {
        'Unknown Ability': 'Unknown Ability',
      },
      '~effectNames': {
        'Physical Vulnerability Up': '物理受伤加重',
        'Magic Vulnerability Up': '魔法受伤加重',
        'Healing Magic Down': '治疗魔法效果降低',
        'Filthy': '污泥',
        'Devotion': '灵护',
        'Damage Down': '伤害降低',
      },
    },
  ],
}];
