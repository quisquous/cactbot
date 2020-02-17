'use strict';

[{
  zoneRegex: /^The Second Coil Of Bahamut - Turn \(3\)$/,
  timelineFile: 't8.txt',
  triggers: [
    {
      id: 'T8 Stack',
      regex: Regexes.headMarker({ id: '0011' }),
      infoText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Laser Stack on YOU',
            fr: 'Package laser sur VOUS',
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
          fr: 'Package sur ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'T8 Landmine Start',
      regex: Regexes.message({ line: 'Landmines have been scattered', capture: false }),
      alertText: {
        en: 'Explode Landmines',
        fr: 'Explosion mines',
      },
      run: function(data) {
        data.landmines = {};
      },
    },
    {
      id: 'T8 Landmine Explosion',
      regex: Regexes.ability({ id: '7D1', source: 'Allagan Mine' }),
      regexDe: Regexes.ability({ id: '7D1', source: 'Allagisch(?:e|er|es|en) Mine' }),
      regexFr: Regexes.ability({ id: '7D1', source: 'Mine Allagoise' }),
      regexJa: Regexes.ability({ id: '7D1', source: 'アラガンマイン' }),
      regexCn: Regexes.ability({ id: '7D1', source: '亚拉戈机雷' }),
      regexKo: Regexes.ability({ id: '7D1', source: '알라그 지뢰' }),
      infoText: function(data, matches) {
        if (matches.target in data.landmines)
          return;
        return (Object.keys(data.landmines).length + 1) + ' / 3';
      },
      tts: function(data, matches) {
        if (matches.target in data.landmines)
          return;
        return (Object.keys(data.landmines).length + 1);
      },
      run: function(data, matches) {
        data.landmines[matches.target] = true;
      },
    },
    {
      id: 'T8 Homing Missile Warning',
      regex: Regexes.tether({ id: '0005', target: 'The Avatar' }),
      regexDe: Regexes.tether({ id: '0005', target: 'Avatar' }),
      regexFr: Regexes.tether({ id: '0005', target: 'Bio-Tréant' }),
      regexJa: Regexes.tether({ id: '0005', target: 'アバター' }),
      regexCn: Regexes.tether({ id: '0005', target: '降世化身' }),
      regexKo: Regexes.tether({ id: '0005', target: '아바타' }),
      suppressSeconds: 6,
      infoText: function(data, matches) {
        return {
          en: 'Missile Tether (on ' + data.ShortName(matches.source) + ')',
          fr: 'Lien missile sur ' + data.ShortName(matches.source),
        };
      },
    },
    {
      id: 'T8 Brainjack',
      regex: Regexes.startsUsing({ id: '7C3', source: 'The Avatar' }),
      regexDe: Regexes.startsUsing({ id: '7C3', source: 'Avatar' }),
      regexFr: Regexes.startsUsing({ id: '7C3', source: 'Bio-Tréant' }),
      regexJa: Regexes.startsUsing({ id: '7C3', source: 'アバター' }),
      regexCn: Regexes.startsUsing({ id: '7C3', source: '降世化身' }),
      regexKo: Regexes.startsUsing({ id: '7C3', source: '아바타' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Brainjack on YOU',
            fr: 'Détournement cérébral sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Brainjack on ' + data.ShortName(matches.target),
            fr: 'Détournement cérébral sur ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T8 Allagan Field',
      regex: Regexes.startsUsing({ id: '7C4', source: 'The Avatar' }),
      regexDe: Regexes.startsUsing({ id: '7C4', source: 'Avatar' }),
      regexFr: Regexes.startsUsing({ id: '7C4', source: 'Bio-Tréant' }),
      regexJa: Regexes.startsUsing({ id: '7C4', source: 'アバター' }),
      regexCn: Regexes.startsUsing({ id: '7C4', source: '降世化身' }),
      regexKo: Regexes.startsUsing({ id: '7C4', source: '아바타' }),
      alertText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Allagan Field on YOU',
            fr: 'Champ allagois sur VOUS',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Allagan Field on ' + data.ShortName(matches.target),
            fr: 'Champ allagois sur ' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      id: 'T8 Dreadnaught',
      regex: Regexes.addedCombatant({ name: 'Clockwork Dreadnaught', capture: false }),
      regexDe: Regexes.addedCombatant({ name: 'Brummonaut', capture: false }),
      regexFr: Regexes.addedCombatant({ name: 'Cuirassé Dreadnaught', capture: false }),
      regexJa: Regexes.addedCombatant({ name: 'ドレッドノート', capture: false }),
      regexCn: Regexes.addedCombatant({ name: '恐慌装甲', capture: false }),
      regexKo: Regexes.addedCombatant({ name: '드레드노트', capture: false }),
      infoText: {
        en: 'Dreadnaught Add',
        fr: 'Add cuirassé',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Allagan Field': 'Allagisches Feld',
        'The Avatar': 'Avatar',
        'The central bow': 'Rumpf-Zentralsektor',
      },
      'replaceText': {
        'Allagan Field': 'Allagisches Feld',
        'Atomic Ray': 'Atomstrahlung',
        'Ballistic Missile': 'Ballistische Rakete',
        'Brainjack': 'Gehirnwäsche',
        'Critical Surge': 'Kritischer Schub',
        'Diffusion Ray': 'Diffusionsstrahl',
        'Gaseous Bomb': 'Explosives Gasgemisch',
        'Homing Missile': 'Lenkgeschoss',
        'Inertia Stream': 'Trägheitsstrom',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Allagan Field': 'Champ allagois',
        'The Avatar': 'Bio-tréant',
        'The central bow': 'l\'axe central',
      },
      'replaceText': {
        'Allagan Field': 'Champ allagois',
        'Atomic Ray': 'Rayon atomique',
        'Ballistic Missile': 'Missiles balistiques',
        'Brainjack': 'Détournement cérébral',
        'Critical Surge': 'Trouée critique',
        'Diffusion Ray': 'Rayon diffuseur',
        'Gaseous Bomb': 'Bombe gazeuse',
        'Homing Missile': 'Tête chercheuse',
        'Inertia Stream': 'Courant apathique',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Allagan Field': 'アラガンフィールド',
        'The Avatar': 'アバター',
      },
      'replaceText': {
        'Allagan Field': 'アラガンフィールド',
        'Atomic Ray': 'アトミックレイ',
        'Ballistic Missile': 'ミサイル発射',
        'Brainjack': 'ブレインジャック',
        'Critical Surge': '臨界突破',
        'Diffusion Ray': 'ディフュージョンレイ',
        'Gaseous Bomb': '気化爆弾',
        'Homing Missile': 'ホーミングミサイル',
        'Inertia Stream': 'イナーシャストリーム',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Allagan Field': '亚拉戈领域',
        'The Avatar': '降世化身',
      },
      'replaceText': {
        'Allagan Field': '亚拉戈领域',
        'Atomic Ray': '原子射线',
        'Ballistic Missile': '导弹发射',
        'Brainjack': '洗脑',
        'Critical Surge': '临界突破',
        'Diffusion Ray': '扩散射线',
        'Gaseous Bomb': '气化炸弹',
        'Homing Missile': '自控导弹',
        'Inertia Stream': '惰性流',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Allagan Field': '알라그 필드',
        'The Avatar': '아바타',
      },
      'replaceText': {
        'Allagan Field': '알라그 필드',
        'Atomic Ray': '원자 파동',
        'Ballistic Missile': '미사일 발사',
        'Brainjack': '두뇌 장악',
        'Critical Surge': '임계 돌파',
        'Diffusion Ray': '확산 광선',
        'Gaseous Bomb': '기화 폭탄',
        'Homing Missile': '유도 미사일',
        'Inertia Stream': '관성 기류',
      },
    },
  ],
}];
