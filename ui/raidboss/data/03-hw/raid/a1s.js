'use strict';

[{
  zoneRegex: {
    en: /^Alexander - The Fist Of The Father \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(启动之章1\)$/,
  },
  timelineFile: 'a1s.txt',
  timelineTriggers: [
    {
      id: 'A1S Emergency Liftoff',
      regex: /Emergency Liftoff/,
      beforeSeconds: 5,
      infoText: {
        en: 'Liftoff Soon',
        de: 'Bald abheben',
        fr: 'Décollage bientôt',
        cn: '上升',
      },
    },
  ],
  triggers: [
    {
      id: 'A1S Gunnery Pod',
      regex: Regexes.startsUsing({ id: 'E41', source: 'Oppressor', capture: false }),
      regexDe: Regexes.startsUsing({ id: 'E41', source: 'Unterdrücker', capture: false }),
      regexFr: Regexes.startsUsing({ id: 'E41', source: 'Oppresseur', capture: false }),
      regexJa: Regexes.startsUsing({ id: 'E41', source: 'オプレッサー', capture: false }),
      regexCn: Regexes.startsUsing({ id: 'E41', source: '压迫者', capture: false }),
      regexKo: Regexes.startsUsing({ id: 'E41', source: '억압자', capture: false }),
      condition: Conditions.caresAboutAOE(),
      suppressSeconds: 3,
      response: Responses.aoe(),
    },
    {
      id: 'A1S Hydrothermal Collect',
      regex: Regexes.headMarker({ id: '001E' }),
      run: function(data, matches) {
        data.hydro = data.hydro || [];
        data.hydro.push(matches.target);
      },
    },
    {
      id: 'A1S Hydrothermal You',
      regex: Regexes.headMarker({ id: '001E' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Hydrothermal on You',
        de: 'Hydrothermales auf DIR',
        fr: 'Missile hydrothermique sur Vous',
        cn: '导弹点名',
      },
    },
    {
      id: 'A1S Hydrothermal Healer',
      regex: Regexes.headMarker({ id: '001E' }),
      condition: Conditions.caresAboutMagical(),
      infoText: function(data, matches) {
        data.hydro = data.hydro || [];
        if (data.hydro.length == 0)
          return;
        return {
          en: 'Hydrothermal on ' + data.hydro.map((x) => data.ShortName(x)).join(', '),
          de: 'Hydrothermales auf ' + data.hydro.map((x) => data.ShortName(x)).join(', '),
          fr: 'Missile hydrothermique sur ' + data.hydro.map((x) => data.ShortName(x)).join(', '),
          cn: '导弹点' + data.hydro.map((x) => data.ShortName(x)).join(', '),
        };
      },
    },
    {
      id: 'A1S Hydrothermal Cleanup',
      regex: Regexes.headMarker({ id: '001E' }),
      delaySeconds: 10,
      run: function(data, matches) {
        delete data.hydro;
      },
    },
    {
      id: 'A1S Resin Bomb',
      regex: Regexes.startsUsing({ id: 'E47', source: 'Oppressor' }),
      regexDe: Regexes.startsUsing({ id: 'E47', source: 'Unterdrücker' }),
      regexFr: Regexes.startsUsing({ id: 'E47', source: 'Oppresseur' }),
      regexJa: Regexes.startsUsing({ id: 'E47', source: 'オプレッサー' }),
      regexCn: Regexes.startsUsing({ id: 'E47', source: '压迫者' }),
      regexKo: Regexes.startsUsing({ id: 'E47', source: '억압자' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Bait Resin Bomb',
        de: 'Köder Pechbombe',
        fr: 'Placez-vous pour Bombe de résine',
        cn: '粘着弹',
      },
    },
    {
      id: 'A1S Hypercompressed Collect',
      regex: Regexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\.5'] }),
      regexDe: Regexes.startsUsing({ id: 'E4A', source: ['Unterdrücker', 'Unterdrücker 0,5'] }),
      regexFr: Regexes.startsUsing({ id: 'E4A', source: ['Oppresseur', 'Oppresseur 0\\.5'] }),
      regexJa: Regexes.startsUsing({ id: 'E4A', source: ['オプレッサー', 'オプレッサー・ゼロ'] }),
      regexCn: Regexes.startsUsing({ id: 'E4A', source: ['压迫者', '压迫者零号'] }),
      regexKo: Regexes.startsUsing({ id: 'E4A', source: ['억압자', '미완성 억압자'] }),
      run: function(data, matches) {
        data.hyper = data.hyper || [];
        data.hyper.push(matches.target);
      },
    },
    {
      id: 'A1S Hypercompressed You',
      regex: Regexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\.5'] }),
      regexDe: Regexes.startsUsing({ id: 'E4A', source: ['Unterdrücker', 'Unterdrücker 0,5'] }),
      regexFr: Regexes.startsUsing({ id: 'E4A', source: ['Oppresseur', 'Oppresseur 0\\.5'] }),
      regexJa: Regexes.startsUsing({ id: 'E4A', source: ['オプレッサー', 'オプレッサー・ゼロ'] }),
      regexCn: Regexes.startsUsing({ id: 'E4A', source: ['压迫者', '压迫者零号'] }),
      regexKo: Regexes.startsUsing({ id: 'E4A', source: ['억압자', '미완성 억압자'] }),
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster('alarm'),
    },
    {
      id: 'A1S Hypercompressed Other',
      regex: Regexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\.5'], capture: false }),
      regexDe: Regexes.startsUsing({ id: 'E4A', source: ['Unterdrücker', 'Unterdrücker 0,5'], capture: false }),
      regexFr: Regexes.startsUsing({ id: 'E4A', source: ['Oppresseur', 'Oppresseur 0\\.5'], capture: false }),
      regexJa: Regexes.startsUsing({ id: 'E4A', source: ['オプレッサー', 'オプレッサー・ゼロ'], capture: false }),
      regexCn: Regexes.startsUsing({ id: 'E4A', source: ['压迫者', '压迫者零号'], capture: false }),
      regexKo: Regexes.startsUsing({ id: 'E4A', source: ['억압자', '미완성 억압자'], capture: false }),
      delaySeconds: 0.3,
      alertText: function(data) {
        data.hyper = data.hyper || [];
        if (data.hyper.includes(data.me))
          return;
        // TODO: maybe need some way to make calling Conditions look less
        // awkward inside of functions.
        if (!Conditions.caresAboutMagical()(data))
          return;
        return {
          en: 'Tank Busters',
          de: 'Tank buster',
          fr: 'Tank busters',
          ja: 'タンクバスター',
          cn: '坦克死刑',
          ko: '탱버',
        };
      },
    },
    {
      id: 'A1S Hypercompressed Delete',
      regex: Regexes.startsUsing({ id: 'E4A', source: ['Oppressor', 'Oppressor 0\.5'] }),
      regexDe: Regexes.startsUsing({ id: 'E4A', source: ['Unterdrücker', 'Unterdrücker 0,5'] }),
      regexFr: Regexes.startsUsing({ id: 'E4A', source: ['Oppresseur', 'Oppresseur 0\\.5'] }),
      regexJa: Regexes.startsUsing({ id: 'E4A', source: ['オプレッサー', 'オプレッサー・ゼロ'] }),
      regexCn: Regexes.startsUsing({ id: 'E4A', source: ['压迫者', '压迫者零号'] }),
      regexKo: Regexes.startsUsing({ id: 'E4A', source: ['억압자', '미완성 억압자'] }),
      delaySeconds: 10,
      run: function(data, matches) {
        delete data.hyper;
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '3000-Tonze Missile': '3000-Tonzen-Geschoss',
        'Faust': 'Faust',
        'Hangar 8': 'Lagerhalle 8',
        'Machinery Bay 44': 'Kampfmaschinen-Baracke 44',
        'Oppressor': 'Unterdrücker',
        'Oppressor 0.5': 'Unterdrücker 0,5',
      },
      'replaceText': {
        '3000-Tonze Missile': '3000-Tonzen-Geschoss',
        'Distress Beacon': 'Notsignal',
        'Emergency Deployment': 'Noteinsatz',
        'Emergency Liftoff': 'Notstart',
        'Gunnery Pod': 'Waffenbehälter',
        'Hydrothermal Missile': 'Hydrothermales Geschoss',
        'Hypercompressed Plasma': 'Hyperkomprimiertes Plasma',
        'Kaltstrahl': 'Kaltstrahl',
        'Missile Impact': 'Raketenangriff',
        'Photon Spaser': 'Plasmonen-Spaser',
        'Pressure Increase': 'Druckanstieg',
        'Quick Landing': 'Schnelle Landung',
        'Resin Bomb': 'Pechbombe',
        'Royal Fount': 'Königsquelle',
        'Self-Destruct': 'Selbstzerstörung',
        'Sturm Doll': 'Sturmpuppe',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '3000-Tonze Missile': 'Missile de 3000 tonz',
        'Faust': 'faust',
        'Hangar 8': 'Grand hangar GH-8',
        'Machinery Bay 44': 'Hangar d\'armement HA-44',
        'Oppressor': 'Oppresseur',
        'Oppressor 0.5': 'Oppresseur 0.5',
      },
      'replaceText': {
        '3000-Tonze Missile': 'Missile de 3000 tonz',
        'Distress Beacon': 'Fanal de détresse',
        'Emergency Deployment': 'Déploiement d\'urgence',
        'Emergency Liftoff': 'Décollage d\'urgence',
        'Gunnery Pod': 'Feu d\'artillerie',
        'Hydrothermal Missile': 'Missile hydrothermique',
        'Hypercompressed Plasma': 'Plasma hypercomprimé',
        'Kaltstrahl': 'Kaltstrahl',
        'Missile Impact': 'Frappe de missile',
        'Photon Spaser': 'Spaser à photons',
        'Pressure Increase': 'Hausse de pression',
        'Quick Landing': 'Atterrissage rapide',
        'Resin Bomb': 'Bombe de résine',
        'Royal Fount': 'Source royale',
        'Self-Destruct': 'Auto-destruction',
        'Sturm Doll Add': 'Add poupée sturm',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '3000-Tonze Missile': '超大型ミサイル',
        'Faust': 'ファウスト',
        'Hangar 8': '第8大型格納庫',
        'Machinery Bay 44': '第44機工兵格納庫',
        'Oppressor': 'オプレッサー',
        'Oppressor 0.5': 'オプレッサー・ゼロ',
      },
      'replaceText': {
        '3000-Tonze Missile': '超大型ミサイル',
        'Distress Beacon': '救援要請',
        'Emergency Deployment': '緊急出撃',
        'Emergency Liftoff': '緊急上昇',
        'Gunnery Pod': 'ガンポッドファイア',
        'Hydrothermal Missile': '蒸気ミサイル',
        'Hypercompressed Plasma': 'ハイパープラズマ',
        'Kaltstrahl': 'カルトシュトラール',
        'Missile Impact': 'ミサイル攻撃',
        'Photon Spaser': 'フォトンスペーサー',
        'Pressure Increase': '蒸気圧上昇',
        'Quick Landing': '落着',
        'Resin Bomb': '粘着弾',
        'Royal Fount': 'ロイヤルファウント',
        'Self-Destruct': '自爆',
        'Sturm Doll': 'シュツルムドール',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        '3000-Tonze Missile': '超大型导弹',
        'Faust': '浮士德',
        'Hangar 8': '第8大型机库',
        'Machinery Bay 44': '第44机工兵仓库',
        'Oppressor': '压迫者',
        'Oppressor 0.5': '压迫者零号',
      },
      'replaceText': {
        '3000-Tonze Missile': '超大型导弹',
        'Distress Beacon': '请求救援',
        'Emergency Deployment': '紧急出击',
        'Emergency Liftoff': '紧急上升',
        'Gunnery Pod': '炮台散射',
        'Hydrothermal Missile': '蒸汽导弹',
        'Hypercompressed Plasma': '超压缩等离子',
        'Kaltstrahl': '寒光',
        'Missile Impact': '导弹攻击',
        'Photon Spaser': '光子照射',
        'Pressure Increase': '蒸汽压上升',
        'Quick Landing': '落地',
        'Resin Bomb': '粘着弹',
        'Royal Fount': '皇泉射线',
        'Self-Destruct': '自爆',
        'Sturm Doll': '风暴人偶',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        '3000-Tonze Missile': '초대형 미사일',
        'Faust': '파우스트',
        'Hangar 8': '제8 대형 격납고',
        'Machinery Bay 44': '제44 기공병 격납고',
        'Oppressor': '억압자',
        'Oppressor 0.5': '미완성 억압자',
      },
      'replaceText': {
        '3000-Tonze Missile': '초대형 미사일',
        'Distress Beacon': '구원 요청',
        'Emergency Deployment': '긴급 출격',
        'Emergency Liftoff': '긴급 상승',
        'Gunnery Pod': '기관총 발사',
        'Hydrothermal Missile': '증기 미사일',
        'Hypercompressed Plasma': '초플라스마',
        'Kaltstrahl': '냉병기 공격',
        'Missile Impact': '미사일 공격',
        'Photon Spaser': '광자포',
        'Pressure Increase': '증기압 상승',
        'Quick Landing': '경착륙',
        'Resin Bomb': '점착탄',
        'Royal Fount': '과열 분사',
        'Self-Destruct': '자폭',
        'Sturm Doll': '인형 폭기병',
      },
    },
  ],
}];
