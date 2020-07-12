'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Furor$/,
    ko: /^희망의 낙원 에덴: 공명편 \(2\)$/,
  },
  zoneId: ZoneId.EdensVerseFuror,
  timelineFile: 'e6n.txt',
  timelineTriggers: [
    {
      // We warn the user here because the startsUsing warning gives only 3.5s or so.
      id: 'E6N Downburst',
      regex: /Downburst/,
      beforeSeconds: 5,
      response: Responses.knockback('info'),
    },

  ],
  triggers: [
    {
      id: 'E6N Superstorm',
      regex: Regexes.startsUsing({ source: 'Garuda', id: '4BD7', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Garuda', id: '4BD7', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Garuda', id: '4BD7', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ガルーダ', id: '4BD7', capture: false }),
      regexCn: Regexes.startsUsing({ source: '迦楼罗', id: '4BD7', capture: false }),
      regexKo: Regexes.startsUsing({ source: '가루다', id: '4BD7', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E6N Ferostorm',
      regex: Regexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      regexDe: Regexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      regexFr: Regexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      regexJa: Regexes.startsUsing({ source: ['ガルーダ', 'ラクタパクシャ'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      infoText: {
        en: 'Avoid green nails',
        de: 'Weiche den grünen Nägeln aus',
        fr: 'Évitez les griffes',
        cn: '躲避风牙',
        ko: '초록 발톱 피하기',
      },
    },
    {
      id: 'E6N Air Bump',
      regex: Regexes.headMarker({ id: '00D3' }),
      suppressSeconds: 1,
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Enumeration on YOU',
            de: 'Enumeration aud DIR',
            fr: 'Énumération sur VOUS',
            cn: '蓝圈分摊点名',
            ko: '2인 장판 대상자',
          };
        }
        return {
          en: 'Enumeration',
          de: 'Enumeration',
          fr: 'Énumération',
          cn: '蓝圈分摊',
          ko: '2인 장판',
        };
      },
    },
    {
      id: 'E6N Inferno Howl',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BF1', capture: false }),
      regexDe: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BF1', capture: false }),
      regexFr: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BF1', capture: false }),
      regexJa: Regexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4BF1', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Save ability state since the generic tether used has multiple uses in this fight
      id: 'E6N Hands of Flame Start',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4CFE', capture: false }),
      regexDe: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4CFE', capture: false }),
      regexFr: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4CFE', capture: false }),
      regexJa: Regexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4CFE', capture: false }),
      preRun: function(data) {
        data.handsOfFlame = true;
      },
    },
    {
      // Tank swap if you're not the target
      // Break tether if you're the target during Ifrit+Garuda phase
      id: 'E6N Hands of Flame Tether',
      regex: Regexes.tether({ id: '0068' }),
      condition: function(data) {
        return data.handsOfFlame;
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Charge on YOU',
            de: 'Ansturm auf DIR',
            fr: 'Charge sur VOUS',
            cn: '冲锋点名',
            ko: '돌진 대상자',
          };
        }
        if (data.role != 'tank' || data.phase == 'both')
          return;
        return {
          en: 'Tank Swap',
          de: 'Tank Swap',
          fr: 'Tank Swap',
          cn: '换坦克',
          ko: '탱 교대',
        };
      },
    },
    {
      id: 'E6N Hands of Flame Cast',
      regex: Regexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4BE9', capture: false }),
      regexDe: Regexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4BE9', capture: false }),
      regexFr: Regexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4BE9', capture: false }),
      regexJa: Regexes.ability({ source: ['イフリート', 'ラクタパクシャ'], id: '4BE9', capture: false }),
      preRun: function(data) {
        data.handsOfFlame = false;
      },
      suppressSeconds: 1,
    },
    {
      id: 'E6N Instant Incineration',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BED' }),
      regexDe: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BED' }),
      regexFr: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BED' }),
      regexJa: Regexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4BED' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E6N Hands of Hell',
      regex: Regexes.headMarker({ id: '0016' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Tether Marker on YOU',
        de: 'Verbindung auf DIR',
        fr: 'Marque de lien sur VOUS',
        cn: '连线点名',
        ko: '징 대상자',
      },
    },
    {
      id: 'E6N Strike Spark',
      regex: Regexes.ability({ source: 'Ifrit', id: '4F98', capture: false }),
      regexDe: Regexes.ability({ source: 'Ifrit', id: '4F98', capture: false }),
      regexFr: Regexes.ability({ source: 'Ifrit', id: '4F98', capture: false }),
      regexJa: Regexes.ability({ source: 'イフリート', id: '4F98', capture: false }),
      regexCn: Regexes.ability({ source: '伊弗利特', id: '4F98', capture: false }),
      regexKo: Regexes.ability({ source: '이프리트', id: '4F98', capture: false }),
      // Run only once, because Ifrit's other jumps are not important.
      condition: function(data) {
        return !data.seenSpark;
      },
      alertText: {
        en: 'Move to Ifrit',
        de: 'Zu Ifrit bewegen',
        fr: 'Allez sur Ifrit',
        cn: '踢球 集合待机',
        ko: '이프리트로 이동',
      },
      run: function(data) {
        data.seenSpark = true;
      },
    },
    {
      id: 'E6N Storm Of Fury',
      // Garuda uses this ability without eruptions alongside, so she needs no warnings.
      regex: Regexes.startsUsing({ source: 'Raktapaksa', id: '4BE6', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Raktapaksa', id: '4BE6', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Raktapaksa', id: '4BE6', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ラクタパクシャ', id: '4BE6', capture: false }),
      response: Responses.stackThenSpread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'twisting blaze': 'Feuersturm',
        'tumultuous nexus': 'Orkankugel',
        'great ball of fire': 'Flammenkugel',
        'Raktapaksa': 'Raktapaksa',
        'Ifrit': 'Ifrit',
        'Garuda': 'Garuda',
      },
      'replaceText': {
        'Wind Cutter': 'Schneidender Wind',
        'Vacuum Slice': 'Vakuumschnitt',
        'Touchdown': 'Himmelssturz',
        'Thorns': 'Dornen',
        'Superstorm': 'Sturm der Zerstörung',
        'Strike Spark': 'Feuerfunken',
        'Storm Of Fury': 'Wütender Sturm',
        'Spread Of Fire': 'Ausbreitung des Feuers',
        'Spike Of Flame': 'Flammenstachel',
        'Radiant Plume': 'Scheiterhaufen',
        'Occluded Front': 'Okklusion',
        'Meteor Strike': 'Meteorit',
        'Irresistible Pull': 'Saugkraft',
        'Instant Incineration': 'Explosive Flamme',
        'Inferno Howl': 'Glühendes Gebrüll',
        'Hot Foot': 'Fliegendes Feuer',
        'Heat Burst': 'Hitzewelle',
        'Hands Of Hell': 'Faust des Schicksals',
        'Hands Of Flame': 'Flammenfaust',
        'Firestorm': 'Feuersturm',
        'Ferostorm': 'Angststurm',
        'Explosion': 'Explosion',
        'Eruption': 'Eruption',
        'Downburst': 'Fallböe',
        'Conflag Strike': 'Feuersbrunst',
        'Call Of The Inferno': 'Flimmernde Hitze',
        'Blaze': 'Flamme',
        'Air Bump': 'Aufsteigende Böe',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'twisting blaze': 'Vortex enflammé',
        'tumultuous nexus': 'Rafale',
        'great ball of fire': 'Ignescence',
        'Raktapaksa': 'Raktapaksa',
        'Ifrit': 'Ifrit',
        'Garuda': 'Garuda',
      },
      'replaceText': {
        'Wind Cutter': 'Trancheur de vent',
        'Vacuum Slice': 'Lacération du vide',
        'Touchdown': 'Atterrissage',
        'Thorns': 'Lardoir',
        'Superstorm': 'Tempête dévastatrice',
        'Strike Spark': 'Ignescences',
        'Storm Of Fury': 'Tempête déchaînée',
        'Spread Of Fire': 'Océan de feu',
        'Spike Of Flame': 'Explosion de feu',
        'Radiant Plume': 'Panache radiant',
        'Occluded Front': 'Front occlus',
        'Meteor Strike': 'Frappe de météore',
        'Irresistible Pull': 'Force d\'aspiration',
        'Instant Incineration': 'Uppercut enflammé',
        'Inferno Howl': 'Rugissement ardent',
        'Hot Foot': 'Jet d\'ignescence',
        'Heat Burst': 'Vague de chaleur',
        'Hands Of Hell': 'Frappe purgatrice',
        'Hands Of Flame': 'Frappe enflammée',
        'Firestorm': 'Tempête de feu',
        'Ferostorm': 'Tempête déchaînée',
        'Explosion': 'Explosion de vent',
        'Eruption': 'Éruption',
        'Downburst': 'Rafale descendante',
        'Conflag Strike': 'Ekpurosis',
        'Call Of The Inferno': 'Mirage de chaleur',
        'Blaze': 'Fournaise',
        'Air Bump': 'Rafale ascendante',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'twisting blaze': '火炎旋風',
        'tumultuous nexus': '暴風球',
        'great ball of fire': '火焔球',
        'Raktapaksa': 'ラクタパクシャ',
        'Ifrit': 'イフリート',
        'Garuda': 'ガルーダ',
      },
      'replaceText': {
        'Wind Cutter': 'ウィンドカッター',
        'Vacuum Slice': 'バキュームスラッシュ',
        'Touchdown': 'タッチダウン',
        'Thorns': '早贄',
        'Superstorm': 'スーパーストーム',
        'Strike Spark': 'ファイアスパーク',
        'Storm Of Fury': 'フューリアスストーム',
        'Spread Of Fire': 'スプレッド・オブ・ファイア',
        'Spike Of Flame': '爆炎',
        'Radiant Plume': '光輝の炎柱',
        'Occluded Front': 'オクルーデッドフロント',
        'Meteor Strike': 'メテオストライク',
        'Irresistible Pull': '吸引力',
        'Instant Incineration': '爆裂炎',
        'Inferno Howl': '灼熱の咆哮',
        'Hot Foot': '飛び火',
        'Heat Burst': '熱波',
        'Hands Of Hell': '業炎拳',
        'Hands Of Flame': '火炎拳',
        'Firestorm': 'ファイアストーム',
        'Ferostorm': 'フィアスストーム',
        'Explosion': '爆散',
        'Eruption': 'エラプション',
        'Downburst': 'ダウンバースト',
        'Conflag Strike': 'コンフラグレーションストライク',
        'Call Of The Inferno': '陽炎召喚',
        'Blaze': '火炎',
        'Air Bump': 'エアーバンプ',
      },
    },
  ],
}];
