'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Furor \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(2\)$/,
  },
  timelineFile: 'e6s.txt',
  triggers: [
    {
      id: 'E6S Superstorm',
      regex: Regexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
      run: function(data) {
        data.phase = 'garuda';
      },
    },
    {
      id: 'E6S Air Bump',
      regex: Regexes.headMarker({ id: '00D3' }),
      suppressSeconds: 1,
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Enumeration on YOU',
            fr: 'Enumération sur VOUS',
          };
        }
        return {
          en: 'Enumeration',
          fr: 'Enumération',
        };
      },
    },
    {
      id: 'E6S Touchdown',
      regex: Regexes.startsUsing({ source: 'Ifrit', id: '4C09', capture: false }),
      run: function(data) {
        data.phase = 'ifrit';
      },
    },
    {
      id: 'E6S Inferno Howl',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Save ability state since the generic tether used has multiple uses in this fight
      id: 'E6S Hands of Flame Start',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      preRun: function(data) {
        data.handsOfFlame = true;
      },
    },
    {
      // Tank swap if you're not the target
      // Break tether if you're the target during Ifrit+Garuda phase
      id: 'E6S Hands of Flame Tether',
      regex: Regexes.tether({ id: '0068' }),
      condition: function(data) {
        return data.handsOfFlame;
      },
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Charge on YOU',
            fr: 'Charge sur VOUS',
          };
        }
        if (data.role != 'tank' || data.phase == 'both')
          return;
        return {
          en: 'Tank Swap',
          fr: 'Tank Swap',
        };
      },
    },
    {
      id: 'E6S Hands of Flame Cast',
      regex: Regexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      suppressSeconds: 1,
      preRun: function(data) {
        data.handsOfFlame = false;
      },
    },
    {
      id: 'E6S Instant Incineration',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E6S Meteor Strike',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'E6S Hands of Hell',
      regex: Regexes.headMarker({ id: '0016' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Tether Marker on YOU',
        fr: 'Marque de lien sur VOUS',
      },
    },
    {
      id: 'E6S Hated of the Vortex',
      regex: Regexes.startsUsing({ source: 'Garuda', id: '4F9F', capture: false }),
      run: function(data) {
        data.phase = 'both';
      },
    },
    {
      id: 'E6S Hated of the Vortex Effect',
      regex: Regexes.gainsEffect({ effect: 'Hated of the Vortex' }),
      regexFr: Regexes.gainsEffect({ effect: 'Malédiction de la Souffleuse de rafales' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Attack Garuda',
        fr: 'Attaquez Garuda',
      },
    },
    {
      id: 'E6S Hated of the Embers Effect',
      regex: Regexes.gainsEffect({ effect: 'Hated of the Embers' }),
      regexFr: Regexes.gainsEffect({ effect: 'Malédiction du Seigneur des flammes' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Attack Ifrit',
        fr: 'Attaquez Ifrit',
      },
    },
    {
      id: 'E6S Raktapaksa Spawn',
      regex: Regexes.ability({ source: 'Raktapaksa', id: '4D55', capture: false }),
      run: function(data) {
        data.phase = 'raktapaksa';
      },
    },
    {
      id: 'E6S Conflag Strike Knockback',
      regex: Regexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E6S Irons Of Purgatory',
      regex: Regexes.tether({ id: '006C' }),
      condition: function(data, matches) {
        return data.me == matches.target || data.me == matches.source;
      },
      alertText: function(data, matches) {
        if (data.me == matches.source) {
          return {
            en: 'Tethered to ' + matches.target,
            fr: 'Lié à ' + matches.target,
          };
        }
        return {
          en: 'Tethered to ' + matches.source,
          fr: 'Lié à ' + matches.source,
        };
      },
    },
    {
      id: 'E6S Conflag Strike Behind',
      regex: Regexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      delaySeconds: 31,
      response: Responses.getBehind(),
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
        'Hated of the Vortex': 'Fluch des Windes',
        'Hated of Embers': 'Fluch der Flammen',
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
        'Hated of the Vortex': 'Fluch des Windes',
        'Hated of Embers': 'Fluch der Flammen',
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
        'Hated of the Vortex': 'Malédiction de la Souffleuse de rafales',
        'Hated of Embers': 'Malédiction du Seigneur des flammes',
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
        'Hated of the Vortex': 'Malédiction de la Souffleuse de rafales',
        'Hated of Embers': 'Malédiction du Seigneur des flammes',
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
        'Hated of the Vortex': '嵐神の呪い',
        'Hated of Embers': '焔神の呪い',
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
        'Hated of the Vortex': '嵐神の呪い',
        'Hated of Embers': '焔神の呪い',
      },
    },
  ],
}];
