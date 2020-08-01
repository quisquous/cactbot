'use strict';

[{
  zoneRegex: {
    en: /^Eden's Verse: Furor \(Savage\)$/,
    cn: /^伊甸零式希望乐园 \(共鸣之章2\)$/,
    ko: /^희망의 낙원 에덴: 공명편\(영웅\) \(2\)$/,
  },
  zoneId: ZoneId.EdensVerseFurorSavage,
  timelineFile: 'e6s.txt',
  triggers: [
    {
      id: 'E6S Strike Spark',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BD3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BD3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4BD3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4BD3', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4BD3', capture: false }),
      delaySeconds: 11,
      promise: async (data) => {
        const ifritLocaleNames = {
          en: 'Ifrit',
          de: 'Ifrit',
          fr: 'Ifrit',
          ja: 'イフリート',
          cn: '伊弗利特',
        };

        const raktapaksaLocaleNames = {
          en: 'Raktapaksa',
          de: 'Raktapaksa',
          fr: 'Raktapaksa',
          ja: 'ラクタパクシャ',
          cn: '赤翼罗羯坨博叉',
        };

        // select the 4 most recent Ifrit or Raktapaksa's depending on phase
        let combatantName = null;
        if (data.phase === 'ifrit')
          combatantName = ifritLocaleNames[data.parserLang];
        else
          combatantName = raktapaksaLocaleNames[data.parserLang];

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
        let safeZoneObj1 = null;
        let safeZoneObj2 = null;

        // don't need to go through all the posibilities,
        // only those 4 ifs do reflect the above positions
        if (currentHighestCombatant.PosY > 84 && currentHighestCombatant.PosY < 94) {
          safeZoneObj1 = {
            en: 'north',
            de: 'nord',
            fr: 'nord',
            ko: '북',
            cn: '前',
          };
        } else if (currentHighestCombatant.PosY > 106 && currentHighestCombatant.PosY < 116) {
          safeZoneObj1 = {
            en: 'south',
            de: 'süd',
            fr: 'sud',
            ko: '남',
            cn: '后',
          };
        }

        if (currentHighestCombatant.PosX > 84 && currentHighestCombatant.PosX < 94) {
          safeZoneObj2 = {
            en: 'west',
            de: 'west',
            fr: 'ouest',
            ko: '서',
            cn: '左',
          };
        } else if (currentHighestCombatant.PosX > 106 && currentHighestCombatant.PosX < 116) {
          safeZoneObj2 = {
            en: 'east',
            de: 'ost',
            fr: 'est',
            ko: '동',
            cn: '右',
          };
        }

        let concatSafeZones = (lang) => {
          let str1 = safeZoneObj1 ? safeZoneObj1[lang] : '';
          let str2 = safeZoneObj2 ? safeZoneObj2[lang] : '';

          if (lang === 'fr' && str1 && str2)
            return str1 + ' ' + str2;
          return str1 + str2;
        };

        data.safeZone = {
          en: concatSafeZones('en'),
          de: concatSafeZones('de'),
          fr: concatSafeZones('fr'),
          cn: concatSafeZones('cn'),
          ko: concatSafeZones('ko') + '쪽으로',
        };
      },
      infoText: function(data) {
        return data.safeZone === null ? '???' : data.safeZone;
      },
    },
    {
      id: 'E6S Superstorm',
      netRegex: NetRegexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garuda', id: '4BF7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガルーダ', id: '4BF7', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '迦楼罗', id: '4BF7', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '가루다', id: '4BF7', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
      run: function(data) {
        data.phase = 'garuda';
      },
    },
    {
      id: 'E6S Ferostorm',
      netRegex: NetRegexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Garuda', 'Raktapaksa'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['ガルーダ', 'ラクタパクシャ'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['迦楼罗', '赤翼罗羯坨博叉'], id: ['4BF[EF]', '4C0[45]'], capture: false }),
      infoText: {
        en: 'Avoid green nails',
        de: 'Weiche den grünen Nägeln aus',
        fr: 'Évitez les griffes',
        cn: '躲避风刃',
        ko: '초록 발톱 피하기',
      },
    },
    {
      id: 'E6S Air Bump',
      netRegex: NetRegexes.headMarker({ id: '00D3' }),
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
      id: 'E6S Touchdown',
      netRegex: NetRegexes.startsUsing({ source: 'Ifrit', id: '4C09', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Ifrit', id: '4C09', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Ifrit', id: '4C09', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'イフリート', id: '4C09', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '伊弗利特', id: '4C09', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '이프리트', id: '4C09', capture: false }),
      run: function(data) {
        data.phase = 'ifrit';
      },
    },
    {
      id: 'E6S Inferno Howl',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C14', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4C14', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4C14', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      // Save ability state since the generic tether used has multiple uses in this fight
      id: 'E6S Hands of Flame Start',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4D00', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4D00', capture: false }),
      preRun: function(data) {
        data.handsOfFlame = true;
      },
    },
    {
      // Tank swap if you're not the target
      // Break tether if you're the target during Ifrit+Garuda phase
      id: 'E6S Hands of Flame Tether',
      netRegex: NetRegexes.tether({ id: '0068' }),
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
            ko: '나에게 보스 돌진',
          };
        }
        if (data.role != 'tank' || data.phase == 'both')
          return;
        return {
          en: 'Tank Swap',
          de: 'Tank Swap',
          fr: 'Tank Swap',
          cn: '换T',
          ko: '탱 교대',
        };
      },
    },
    {
      id: 'E6S Hands of Flame Cast',
      netRegex: NetRegexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexDe: NetRegexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexFr: NetRegexes.ability({ source: ['Ifrit', 'Raktapaksa'], id: '4D00', capture: false }),
      netRegexJa: NetRegexes.ability({ source: ['イフリート', 'ラクタパクシャ'], id: '4D00', capture: false }),
      netRegexCn: NetRegexes.ability({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4D00', capture: false }),
      preRun: function(data) {
        data.handsOfFlame = false;
      },
      suppressSeconds: 1,
    },
    {
      id: 'E6S Instant Incineration',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0E' }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4C0E' }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4C0E' }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.tankBuster(),
    },
    {
      id: 'E6S Meteor Strike',
      netRegex: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: ['Ifrit', 'Raktapaksa'], id: '4C0F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: ['イフリート', 'ラクタパクシャ'], id: '4C0F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: ['伊弗利特', '赤翼罗羯坨博叉'], id: '4C0F', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      id: 'E6S Hands of Hell',
      netRegex: NetRegexes.headMarker({ id: '0016' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Tether Marker on YOU',
        de: 'Verbindung auf DIR',
        fr: 'Marque de lien sur VOUS',
        cn: '连线点名',
        ko: '선 징 대상자',
      },
    },
    {
      id: 'E6S Hated of the Vortex',
      netRegex: NetRegexes.startsUsing({ source: 'Garuda', id: '4F9F', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Garuda', id: '4F9F', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garuda', id: '4F9F', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガルーダ', id: '4F9F', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '迦楼罗', id: '4F9F', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '가루다', id: '4F9F', capture: false }),
      run: function(data) {
        data.phase = 'both';
      },
    },
    {
      id: 'E6S Hated of the Vortex Effect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BB' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Attack Garuda',
        de: 'Greife Garuda an',
        fr: 'Attaquez Garuda',
        cn: '打风神',
        ko: '가루다 공격하기',
      },
    },
    {
      id: 'E6S Hated of the Embers Effect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8BC' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Attack Ifrit',
        de: 'Greife Ifrit an',
        fr: 'Attaquez Ifrit',
        cn: '打火神',
        ko: '이프리트 공격하기',
      },
    },
    {
      id: 'E6S Raktapaksa Spawn',
      netRegex: NetRegexes.ability({ source: 'Raktapaksa', id: '4D55', capture: false }),
      netRegexDe: NetRegexes.ability({ source: 'Raktapaksa', id: '4D55', capture: false }),
      netRegexFr: NetRegexes.ability({ source: 'Raktapaksa', id: '4D55', capture: false }),
      netRegexJa: NetRegexes.ability({ source: 'ラクタパクシャ', id: '4D55', capture: false }),
      netRegexCn: NetRegexes.ability({ source: '赤翼罗羯坨博叉', id: '4D55', capture: false }),
      run: function(data) {
        data.phase = 'raktapaksa';
      },
    },
    {
      id: 'E6S Downburst Knockback 1',
      netRegex: NetRegexes.startsUsing({ source: 'Garuda', id: '4BFB', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Garuda', id: '4BFB', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Garuda', id: '4BFB', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ガルーダ', id: '4BFB', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '迦楼罗', id: '4BFB', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ source: '가루다', id: '4BFB', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E6S Downburst Knockback 2',
      netRegex: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4BFC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4BFC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4BFC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ラクタパクシャ', id: '4BFC', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '赤翼罗羯坨博叉', id: '4BFC', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'E6S Conflag Strike',
      netRegex: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ラクタパクシャ', id: '4C10', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '赤翼罗羯坨博叉', id: '4C10', capture: false }),
      infoText: {
        en: 'go to spots for chains',
        de: 'Gehe zu den Stellen für die Kette',
        fr: 'Positions pour les chaines',
        cn: '连线站位',
        ko: '콘플레그 준비',
      },
    },
    {
      id: 'E6S Irons Of Purgatory',
      netRegex: NetRegexes.tether({ id: '006C' }),
      condition: function(data, matches) {
        return data.me == matches.target || data.me == matches.source;
      },
      alertText: function(data, matches) {
        if (data.me == matches.source) {
          return {
            en: 'Tethered to ' + data.ShortName(matches.target),
            de: 'Verbunden mit ' + data.ShortName(matches.target),
            fr: 'Lié à ' + data.ShortName(matches.target),
            cn: '和' + data.ShortName(matches.target) + '连线',
            ko: '선 연결 짝: ' + data.ShortName(matches.target),
          };
        }
        return {
          en: 'Tethered to ' + data.ShortName(matches.source),
          de: 'Verbunden mit ' + data.ShortName(matches.source),
          fr: 'Lié à ' + data.ShortName(matches.source),
          cn: '和' + data.ShortName(matches.source) + '连线',
          ko: '선 연결 짝: ' + data.ShortName(matches.source),
        };
      },
    },
    {
      id: 'E6S Conflag Strike Behind',
      netRegex: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Raktapaksa', id: '4C10', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ラクタパクシャ', id: '4C10', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ source: '赤翼罗羯坨博叉', id: '4C10', capture: false }),
      delaySeconds: 31,
      response: Responses.getBehind(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Twisting Blaze': 'Feuersturm',
        'Tumultuous Nexus': 'Orkankugel',
        'Raktapaksa': 'Raktapaksa',
        'Ifrit': 'Ifrit',
        'Garuda': 'Garuda',
      },
      'replaceText': {
        'Wind Cutter': 'Schneidender Wind',
        'Vacuum Slice': 'Vakuumschnitt',
        'Touchdown': 'Himmelssturz',
        'Superstorm': 'Sturm der Zerstörung',
        'Strike Spark': 'Feuerfunken',
        'Storm Of Fury': 'Wütender Sturm',
        'Spread Of Fire': 'Ausbreitung des Feuers',
        'Radiant Plume': 'Scheiterhaufen',
        'Occluded Front': 'Okklusion',
        'Meteor Strike': 'Meteorit',
        'Irresistible Pull': 'Saugkraft',
        'Instant Incineration': 'Explosive Flamme',
        'Inferno Howl': 'Glühendes Gebrüll',
        'Hot Foot': 'Fliegendes Feuer',
        'Heat Burst': 'Hitzewelle',
        'Hated Of Embers': 'Fluch der Flammen',
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
        'Raktapaksa': 'Raktapaksa',
        'Ifrit': 'Ifrit',
        'Garuda': 'Garuda',
      },
      'replaceText': {
        'Wind Cutter': 'Trancheur de vent',
        'Vacuum Slice': 'Lacération du vide',
        'Touchdown': 'Atterrissage',
        'Superstorm': 'Tempête dévastatrice',
        'Strike Spark': 'Ignescences',
        'Storm Of Fury': 'Tempête déchaînée',
        'Spread Of Fire': 'Océan de feu',
        'Radiant Plume': 'Panache radiant',
        'Occluded Front': 'Front occlus',
        'Meteor Strike': 'Frappe de météore',
        'Irresistible Pull': 'Force d\'aspiration',
        'Instant Incineration': 'Uppercut enflammé',
        'Inferno Howl': 'Rugissement ardent',
        'Hot Foot': 'Jet d\'ignescence',
        'Heat Burst': 'Vague de chaleur',
        'Hated Of Embers/Vortex': 'Malédiction des flammes/de rafales',
        'Hands Of Hell': 'Frappe purgatrice',
        'Hands Of Flame': 'Frappe enflammée',
        'Firestorm': 'Tempête de feu',
        'Ferostorm': 'Tempête déchaînée',
        'Explosion': 'Explosion',
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
        'Raktapaksa': 'ラクタパクシャ',
        'Ifrit': 'イフリート',
        'Garuda': 'ガルーダ',
      },
      'replaceText': {
        'Wind Cutter': 'ウィンドカッター',
        'Vacuum Slice': 'バキュームスラッシュ',
        'Touchdown': 'タッチダウン',
        'Superstorm': 'スーパーストーム',
        'Strike Spark': 'ファイアスパーク',
        'Storm Of Fury': 'フューリアスストーム',
        'Spread Of Fire': 'スプレッド・オブ・ファイア',
        'Radiant Plume': '光輝の炎柱',
        'Occluded Front': 'オクルーデッドフロント',
        'Meteor Strike': 'メテオストライク',
        'Irresistible Pull': '吸引力',
        'Instant Incineration': '爆裂炎',
        'Inferno Howl': '灼熱の咆哮',
        'Hot Foot': '飛び火',
        'Heat Burst': '熱波',
        'Hated Of Embers': '焔神の呪い',
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
    {
      'locale': 'cn',
      'replaceSync': {
        'Garuda': '迦楼罗',
        'Tumultuous Nexus': '暴风球',
        'Ifrit': '伊弗利特',
        'Raktapaksa': '赤翼罗羯坨博叉',
        'Twisting Blaze': '火焰旋风',
      },
      'replaceText': {
        'Superstorm': '超级风暴',
        'Occluded Front': '锢囚锋',
        'Wind Cutter': '风刃',
        'Storm Of Fury': '暴怒风暴',
        'Air Bump': '空气弹垫',
        'Ferostorm': '凶猛风暴',
        'Downburst': '下行突风',
        'Vacuum Slice': '真空斩',
        'Irresistible Pull': '吸引力',
        'Explosions?': '爆炸',
        'Touchdown': '空降',
        'Hands Of Flame': '火焰拳',
        'Eruption': '地火喷发',
        'Instant Incineration': '爆裂炎',
        'Meteor Strike': '流星强击',
        'Inferno Howl': '灼热的咆哮',
        'Hands Of Hell': '业火拳',
        'Strike Spark': '火花爆',
        'Call Of The Inferno': '幻影召唤',
        'Hot Foot': '飞火',
        'Hated Of Embers/Vortex': '火/风神的诅咒',
        'Firestorm': '火焰流',
        'Heat Burst': '热波',
        'Radiant Plume': '光辉炎柱',
        'Spread Of Fire': '火势蔓延',
        'Conflag Strike': '瞬燃强袭',
        'Blaze': '炎爆',
      },
    },
  ],
}];
