'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Furor$/,
    ko: /^희망의 낙원 에덴: 공명편 \(2\)$/,
  },
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
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'E6N Ferostorm',
      regex: Regexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BD[DEF]', '4BE[345]'], capture: false }),
      infoText: {
        en: 'Avoid green nails',
        fr: 'Evitez les clous',
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
            fr: 'Enumération sur VOUS',
            ko: '2인 장판 대상자',
          };
        }
        return {
          en: 'Enumeration',
          de: 'Enumeration',
          fr: 'Enumération',
          ko: '2인 장판',
        };
      },
    },
    {
      id: 'E6N Inferno Howl',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BF1', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Save ability state since the generic tether used has multiple uses in this fight
      id: 'E6N Hands of Flame Start',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4CFE', capture: false }),
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
            ko: '돌진 대상자',
          };
        }
        if (data.role != 'tank' || data.phase == 'both')
          return;
        return {
          en: 'Tank Swap',
          de: 'Tank Swap',
          fr: 'Tank Swap',
          ko: '탱 교대',
        };
      },
    },
    {
      id: 'E6N Hands of Flame Cast',
      regex: Regexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4BE9', capture: false }),
      preRun: function(data) {
        data.handsOfFlame = false;
      },
      suppressSeconds: 1,
    },
    {
      id: 'E6N Instant Incineration',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BED' }),
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
        ko: '징 대상자',
      },
    },
    {
      id: 'E6N Strike Spark',
      regex: Regexes.ability({ source: 'Ifrit', id: '4F98', capture: false }),
      // Run only once, because Ifrit's other jumps are not important.
      condition: function(data) {
        return !data.seenSpark;
      },
      alertText: {
        en: 'Move to Ifrit',
        fr: 'Allez sur Ifrit',
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
        'Storm of Fury': 'Wütender Sturm',
        'Spread of Fire': 'Ausbreitung des Feuers',
        'Spike of Flame': 'Flammenstachel',
        'Radiant Plume': 'Scheiterhaufen',
        'Occluded Front': 'Okklusion',
        'Meteor Strike': 'Meteorit',
        'Irresistible Pull': 'Saugkraft',
        'Instant Incineration': 'Explosive Flamme',
        'Inferno Howl': 'Glühendes Gebrüll',
        'Hot Foot': 'Fliegendes Feuer',
        'Heat Burst': 'Hitzewelle',
        'Hands of Hell': 'Faust des Schicksals',
        'Hands of Flame': 'Flammenfaust',
        'Firestorm': 'Feuersturm',
        'Ferostorm': 'Angststurm',
        'Explosion': 'Explosion',
        'Eruption': 'Eruption',
        'Downburst': 'Fallböe',
        'Conflag Strike': 'Feuersbrunst',
        'Call of the Inferno': 'Flimmernde Hitze',
        'Blaze': 'Flamme',
        'Air Bump': 'Aufsteigende Böe',
      },
      '~effectNames': {
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
        'Lightheaded': 'Auf wackeligen Beinen',
        'Irons of Purgatory': 'Höllenfessel',
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
        'Storm of Fury': 'Tempête déchaînée',
        'Spread of Fire': 'Océan de feu',
        'Spike of Flame': 'Explosion de feu',
        'Radiant Plume': 'Panache radiant',
        'Occluded Front': 'Front occlus',
        'Meteor Strike': 'Frappe de météore',
        'Irresistible Pull': 'Force d\'aspiration',
        'Instant Incineration': 'Uppercut enflammé',
        'Inferno Howl': 'Rugissement ardent',
        'Hot Foot': 'Jet d\'ignescence',
        'Heat Burst': 'Vague de chaleur',
        'Hands of Hell': 'Frappe purgatrice',
        'Hands of Flame': 'Frappe enflammée',
        'Firestorm': 'Tempête de feu',
        'Ferostorm': 'Tempête déchaînée',
        'Explosion': 'Explosion de vent',
        'Eruption': 'Éruption',
        'Downburst': 'Rafale descendante',
        'Conflag Strike': 'Ekpurosis',
        'Call of the Inferno': 'Mirage de chaleur',
        'Blaze': 'Fournaise',
        'Air Bump': 'Rafale ascendante',
      },
      '~effectNames': {
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
        'Lightheaded': 'Titubation',
        'Irons of Purgatory': 'Chaîne du purgatoire',
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
        'Storm of Fury': 'フューリアスストーム',
        'Spread of Fire': 'スプレッド・オブ・ファイア',
        'Spike of Flame': '爆炎',
        'Radiant Plume': '光輝の炎柱',
        'Occluded Front': 'オクルーデッドフロント',
        'Meteor Strike': 'メテオストライク',
        'Irresistible Pull': '吸引力',
        'Instant Incineration': '爆裂炎',
        'Inferno Howl': '灼熱の咆哮',
        'Hot Foot': '飛び火',
        'Heat Burst': '熱波',
        'Hands of Hell': '業炎拳',
        'Hands of Flame': '火炎拳',
        'Firestorm': 'ファイアストーム',
        'Ferostorm': 'フィアスストーム',
        'Explosion': '爆散',
        'Eruption': 'エラプション',
        'Downburst': 'ダウンバースト',
        'Conflag Strike': 'コンフラグレーションストライク',
        'Call of the Inferno': '陽炎召喚',
        'Blaze': '火炎',
        'Air Bump': 'エアーバンプ',
      },
      '~effectNames': {
        'Magic Vulnerability Up': '被魔法ダメージ増加',
        'Lightheaded': 'ふらつき',
        'Irons of Purgatory': '煉獄の鎖',
      },
    },
  ],
}];
