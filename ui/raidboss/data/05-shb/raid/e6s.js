'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Furor \(Savage\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(2\)$/,
  },
  timelineFile: 'e6s.txt',
  triggers: [
    {
      id: 'E6S Strike Spark',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BD3', capture: false }),
      regexDe: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BD3', capture: false }),
      regexFr: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BD3', capture: false }),
      regexJa: Regexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4BD3', capture: false }),
      delaySeconds: 11,
      promise: async (data) => {
        const ifritLocaleNames = {
          en: 'Ifrit',
          de: 'Ifrit',
          fr: 'Ifrit',
          ja: 'イフリート',
        };

        const raktapaksaLocaleNames = {
          en: 'Raktapaksa',
          de: 'Raktapaksa',
          fr: 'Raktapaksa',
          ja: 'ラクタパクシャ',
        };

        // select the 4 most recent Ifrit or Raktapaksa's depending on phase
        let combatantName = null;
        if (data.phase === 'ifrit')
          combatantName = ifritLocaleNames[data.lang];
        else
          combatantName = raktapaksaLocaleNames[data.lang];

        let combatantData = null;
        if (combatantName) {
          combatantData = await window.callOverlayHandler({
            call: 'getCombatants',
            names: [combatantName],
          });
        }

        // if we could not retrieve combatant data, the
        // trigger will not work, so just resume promise here.
        if (!(combatantData !== null &&
          combatantData.combatants &&
          combatantData.combatants.length)) {
          data.safeZone = null;
          return;
        }

        // we need to filter for the Ifrit with the highest ID
        // since that one is always the safe spot.
        let currentHighestCombatant =
          combatantData.combatants.sort((a, b) => a.ID - b.ID).pop();

        // all variation ranges for all the 9 ball positions for the kicking actors
        // north      x: 96-104   y: 85-93
        // northeast  x: 107-115  y: 85-93
        // northwest  x: 85-93    y: 85-93
        // east       x: 107-115  y: 96-104
        // west       x: 85-93    y: 96-104
        // south      x: 96-104   y: 107-115
        // southeast  x: 107-115  y: 107-115
        // southwest  x: 85-93    y: 107-115
        let safeZoneObj1 = { en: '', de: '' };
        let safeZoneObj2 = { en: '', de: '' };

        // don't need to go through all the posibilities,
        // only those 4 ifs do reflect the above positions
        if (currentHighestCombatant.PosY > 84 && currentHighestCombatant.PosY < 94) {
          safeZoneObj1 = {
            en: 'north',
            de: 'nord',
            fr: 'nord',
            ko: '북',
          };
        } else if (currentHighestCombatant.PosY > 106 && currentHighestCombatant.PosY < 116) {
          safeZoneObj1 = {
            en: 'south',
            de: 'süd',
            fr: 'sud',
            ko: '남',
          };
        }

        if (currentHighestCombatant.PosX > 84 && currentHighestCombatant.PosX < 94) {
          safeZoneObj2 = {
            en: 'west',
            de: 'west',
            fr: 'ouest',
            ko: '서',
          };
        } else if (currentHighestCombatant.PosX > 106 && currentHighestCombatant.PosX < 116) {
          safeZoneObj2 = {
            en: 'east',
            de: 'ost',
            fr: 'est',
            ko: '동',
          };
        }

        data.safeZone = {
          en: safeZoneObj1.en + safeZoneObj2.en,
          de: safeZoneObj1.de + safeZoneObj2.de,
          fr: safeZoneObj1.fr + safeZoneObj2.fr,
          ko: safeZoneObj1.ko + safeZoneObj2.ko + '쪽으로',
        };
      },
      infoText: function(data) {
        return data.safeZone === null ? '???' : data.safeZone;
      },
    },
    {
      id: 'E6S Superstorm',
      regex: Regexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ガルーダ', id: '4BF7', capture: false }),
      regexCn: Regexes.startsUsing({ source: '迦楼罗', id: '4BF7', capture: false }),
      regexKo: Regexes.startsUsing({ source: '가루다', id: '4BF7', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
      run: function(data) {
        data.phase = 'garuda';
      },
    },
    {
      id: 'E6S Ferostorm',
      regex: Regexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      regexDe: Regexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      regexFr: Regexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      regexJa: Regexes.startsUsing({ source: ['ガルーダ', 'ラクタパクシャ'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      infoText: {
        en: 'Avoid green nails',
        de: 'Weiche den grünen Nägeln aus',
        fr: 'Evitez les griffes',
        ko: '초록 발톱 피하기',
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
            de: 'Enumeration aud DIR',
            fr: 'Enumération sur VOUS',
            ko: '2인 장판 대상자',
            cn: '蓝圈分摊点名',
          };
        }
        return {
          en: 'Enumeration',
          de: 'Enumeration',
          fr: 'Enumération',
          ko: '2인 장판',
          cn: '蓝圈分摊',
        };
      },
    },
    {
      id: 'E6S Touchdown',
      regex: Regexes.startsUsing({ source: 'Ifrit', id: '4C09', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Ifrit', id: '4C09', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Ifrit', id: '4C09', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'イフリート', id: '4C09', capture: false }),
      regexCn: Regexes.startsUsing({ source: '伊弗利特', id: '4C09', capture: false }),
      regexKo: Regexes.startsUsing({ source: '이프리트', id: '4C09', capture: false }),
      run: function(data) {
        data.phase = 'ifrit';
      },
    },
    {
      id: 'E6S Inferno Howl',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      regexDe: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      regexFr: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      regexJa: Regexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4C14', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Save ability state since the generic tether used has multiple uses in this fight
      id: 'E6S Hands of Flame Start',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      regexDe: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      regexFr: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      regexJa: Regexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4D00', capture: false }),
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
            de: 'Ansturm auf DIR',
            fr: 'Charge sur VOUS',
            ko: '나에게 보스 돌진',
            cn: '冲锋点名',
          };
        }
        if (data.role != 'tank' || data.phase == 'both')
          return;
        return {
          en: 'Tank Swap',
          de: 'Tank Swap',
          fr: 'Tank Swap',
          ko: '탱 교대',
          cn: '换坦',
        };
      },
    },
    {
      id: 'E6S Hands of Flame Cast',
      regex: Regexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      regexDe: Regexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      regexFr: Regexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      regexJa: Regexes.ability({ source: ['イフリート', 'ラクタパクシャ'], id: '4D00', capture: false }),
      preRun: function(data) {
        data.handsOfFlame = false;
      },
      suppressSeconds: 1,
    },
    {
      id: 'E6S Instant Incineration',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      regexDe: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      regexFr: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      regexJa: Regexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4C0E' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E6S Meteor Strike',
      regex: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      regexDe: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      regexFr: Regexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      regexJa: Regexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4C0F', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'E6S Hands of Hell',
      regex: Regexes.headMarker({ id: '0016' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Tether Marker on YOU',
        de: 'Verbindung auf DIR',
        fr: 'Marque de lien sur VOUS',
        ko: '선 징 대상자',
        cn: '连线点名',
      },
    },
    {
      id: 'E6S Hated of the Vortex',
      regex: Regexes.startsUsing({ source: 'Garuda', id: '4F9F', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Garuda', id: '4F9F', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Garuda', id: '4F9F', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ガルーダ', id: '4F9F', capture: false }),
      regexCn: Regexes.startsUsing({ source: '迦楼罗', id: '4F9F', capture: false }),
      regexKo: Regexes.startsUsing({ source: '가루다', id: '4F9F', capture: false }),
      run: function(data) {
        data.phase = 'both';
      },
    },
    {
      id: 'E6S Hated of the Vortex Effect',
      regex: Regexes.gainsEffect({ effect: 'Hated of the Vortex' }),
      regexDe: Regexes.gainsEffect({ effect: 'Fluch Des Windes' }),
      regexFr: Regexes.gainsEffect({ effect: 'Malédiction de la Souffleuse de rafales' }),
      regexJa: Regexes.gainsEffect({ effect: '嵐神の呪い' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Attack Garuda',
        de: 'Greife Garuda an',
        fr: 'Attaquez Garuda',
        ko: '가루다 공격하기',
        cn: '打风神',
      },
    },
    {
      id: 'E6S Hated of the Embers Effect',
      regex: Regexes.gainsEffect({ effect: 'Hated of Embers' }),
      regexDe: Regexes.gainsEffect({ effect: 'Fluch der Flammen' }),
      regexFr: Regexes.gainsEffect({ effect: 'Malédiction du Seigneur des flammes' }),
      regexJa: Regexes.gainsEffect({ effect: '焔神の呪い' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Attack Ifrit',
        de: 'Greife Ifrit an',
        fr: 'Attaquez Ifrit',
        ko: '이프리트 공격하기',
        cn: '打火神',
      },
    },
    {
      id: 'E6S Raktapaksa Spawn',
      regex: Regexes.ability({ source: 'Raktapaksa', id: '4D55', capture: false }),
      regexDe: Regexes.ability({ source: 'Raktapaksa', id: '4D55', capture: false }),
      regexFr: Regexes.ability({ source: 'Raktapaksa', id: '4D55', capture: false }),
      regexJa: Regexes.ability({ source: 'ラクタパクシャ', id: '4D55', capture: false }),
      run: function(data) {
        data.phase = 'raktapaksa';
      },
    },
    {
      id: 'E6S Downburst Knockback 1',
      regex: Regexes.startsUsing({ source: 'Garuda', id: '4BFB', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Garuda', id: '4BFB', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Garuda', id: '4BFB', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ガルーダ', id: '4BFB', capture: false }),
      regexCn: Regexes.startsUsing({ source: '迦楼罗', id: '4BFB', capture: false }),
      regexKo: Regexes.startsUsing({ source: '가루다', id: '4BFB', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E6S Downburst Knockback 2',
      regex: Regexes.startsUsing({ source: 'Raktapaksa', id: '4BFC', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Raktapaksa', id: '4BFC', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Raktapaksa', id: '4BFC', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ラクタパクシャ', id: '4BFC', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E6S Conflag Strike',
      regex: Regexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ラクタパクシャ', id: '4C10', capture: false }),
      infoText: {
        en: 'go to spots for chains',
        de: 'Gehe zu den Stellen für die Kette',
        fr: 'Positions pour les chaines',
        ko: '콘플레그 준비',
        cn: '连线站位',
      },
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
            en: 'Tethered to ' + data.ShortName(matches.target),
            de: 'Verbunden mit ' + data.ShortName(matches.target),
            fr: 'Lié à ' + data.ShortName(matches.target),
            ko: '선 연결 짝: ' + data.ShortName(matches.target),
            cn: '和' + data.ShortName(matches.target) + '连线',
          };
        }
        return {
          en: 'Tethered to ' + data.ShortName(matches.source),
          de: 'Verbunden mit ' + data.ShortName(matches.source),
          fr: 'Lié à ' + data.ShortName(matches.source),
          ko: '선 연결 짝: ' + data.ShortName(matches.source),
          cn: '和' + data.ShortName(matches.source) + '连线',
        };
      },
    },
    {
      id: 'E6S Conflag Strike Behind',
      regex: Regexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'ラクタパクシャ', id: '4C10', capture: false }),
      delaySeconds: 31,
      response: Responses.getBehind(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Garuda': 'Garuda',
        'Ifrit': 'Ifrit',
        'Raktapaksa': 'Raktapaksa',
        'Tumultuous Nexus': 'Orkankugel',
        'Twisting Blaze': 'Feuersturm',
        'great ball of fire': 'Flammenkugel',
      },
      'replaceText': {
        'Air Bump': 'Aufsteigende Böe',
        'Blaze': 'Flamme',
        'Call Of The Inferno': 'Flimmernde Hitze',
        'Conflag Strike': 'Feuersbrunst',
        'Downburst': 'Fallböe',
        'Eruption': 'Eruption',
        'Explosion': 'Explosion',
        'Ferostorm': 'Angststurm',
        'Firestorm': 'Feuersturm',
        'Hands Of Flame': 'Flammenfaust',
        'Hands Of Hell': 'Faust des Schicksals',
        'Hated Of Embers': 'Fluch der Flammen',
        'Hated Of the Vortex': 'Fluch des Windes',
        'Heat Burst': 'Hitzewelle',
        'Hot Foot': 'Fliegendes Feuer',
        'Inferno Howl': 'Glühendes Gebrüll',
        'Instant Incineration': 'Explosive Flamme',
        'Irresistible Pull': 'Saugkraft',
        'Meteor Strike': 'Meteorit',
        'Occluded Front': 'Okklusion',
        'Radiant Plume': 'Scheiterhaufen',
        'Spike Of Flame': 'Flammenstachel',
        'Spread Of Fire': 'Ausbreitung des Feuers',
        'Storm Of Fury': 'Wütender Sturm',
        'Strike Spark': 'Feuerfunken',
        'Superstorm': 'Sturm der Zerstörung',
        'Thorns': 'Dornen',
        'Touchdown': 'Himmelssturz',
        'Vacuum Slice': 'Vakuumschnitt',
        'Wind Cutter': 'Schneidender Wind',
      },
      '~effectNames': {
        'Hated of Embers': 'Fluch der Flammen',
        'Hated of the Vortex': 'Fluch des Windes',
        'Irons of Purgatory': 'Höllenfessel',
        'Lightheaded': 'Auf wackeligen Beinen',
        'Magic Vulnerability Up': 'Erhöhte Magie-Verwundbarkeit',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Garuda': 'Garuda',
        'Ifrit': 'Ifrit',
        'Raktapaksa': 'Raktapaksa',
        'great ball of fire': 'Ignescence',
        'tumultuous nexus': 'Rafale',
        'twisting blaze': 'Vortex enflammé',
      },
      'replaceText': {
        'Air Bump': 'Rafale ascendante',
        'Blaze': 'Fournaise',
        'Call of the Inferno': 'Mirage de chaleur',
        'Conflag Strike': 'Ekpurosis',
        'Downburst': 'Rafale descendante',
        'Eruption': 'Éruption',
        'Explosion': 'Explosion de vent',
        'Ferostorm': 'Tempête déchaînée',
        'Firestorm': 'Tempête de feu',
        'Hands of Flame': 'Frappe enflammée',
        'Hands of Hell': 'Frappe purgatrice',
        'Hated of Embers': 'Malédiction du Seigneur des flammes',
        'Hated of the Vortex': 'Malédiction de la Souffleuse de rafales',
        'Heat Burst': 'Vague de chaleur',
        'Hot Foot': 'Jet d\'ignescence',
        'Inferno Howl': 'Rugissement ardent',
        'Instant Incineration': 'Uppercut enflammé',
        'Irresistible Pull': 'Force d\'aspiration',
        'Meteor Strike': 'Frappe de météore',
        'Occluded Front': 'Front occlus',
        'Radiant Plume': 'Panache radiant',
        'Spike of Flame': 'Explosion de feu',
        'Spread of Fire': 'Océan de feu',
        'Storm of Fury': 'Tempête déchaînée',
        'Strike Spark': 'Ignescences',
        'Superstorm': 'Tempête dévastatrice',
        'Thorns': 'Lardoir',
        'Touchdown': 'Atterrissage',
        'Vacuum Slice': 'Lacération du vide',
        'Wind Cutter': 'Trancheur de vent',
      },
      '~effectNames': {
        'Hated of Embers': 'Malédiction du Seigneur des flammes',
        'Hated of the Vortex': 'Malédiction de la Souffleuse de rafales',
        'Irons of Purgatory': 'Chaîne du purgatoire',
        'Lightheaded': 'Titubation',
        'Magic Vulnerability Up': 'Vulnérabilité magique augmentée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Garuda': 'ガルーダ',
        'Ifrit': 'イフリート',
        'Raktapaksa': 'ラクタパクシャ',
        'great ball of fire': '火焔球',
        'tumultuous nexus': '暴風球',
        'twisting blaze': '火炎旋風',
      },
      'replaceText': {
        'Air Bump': 'エアーバンプ',
        'Blaze': '火炎',
        'Call of the Inferno': '陽炎召喚',
        'Conflag Strike': 'コンフラグレーションストライク',
        'Downburst': 'ダウンバースト',
        'Eruption': 'エラプション',
        'Explosion': '爆散',
        'Ferostorm': 'フィアスストーム',
        'Firestorm': 'ファイアストーム',
        'Hands of Flame': '火炎拳',
        'Hands of Hell': '業炎拳',
        'Hated of Embers': '焔神の呪い',
        'Hated of the Vortex': '嵐神の呪い',
        'Heat Burst': '熱波',
        'Hot Foot': '飛び火',
        'Inferno Howl': '灼熱の咆哮',
        'Instant Incineration': '爆裂炎',
        'Irresistible Pull': '吸引力',
        'Meteor Strike': 'メテオストライク',
        'Occluded Front': 'オクルーデッドフロント',
        'Radiant Plume': '光輝の炎柱',
        'Spike of Flame': '爆炎',
        'Spread of Fire': 'スプレッド・オブ・ファイア',
        'Storm of Fury': 'フューリアスストーム',
        'Strike Spark': 'ファイアスパーク',
        'Superstorm': 'スーパーストーム',
        'Thorns': '早贄',
        'Touchdown': 'タッチダウン',
        'Vacuum Slice': 'バキュームスラッシュ',
        'Wind Cutter': 'ウィンドカッター',
      },
      '~effectNames': {
        'Hated of Embers': '焔神の呪い',
        'Hated of the Vortex': '嵐神の呪い',
        'Irons of Purgatory': '煉獄の鎖',
        'Lightheaded': 'ふらつき',
        'Magic Vulnerability Up': '被魔法ダメージ増加',
      },
    },
  ],
}];
