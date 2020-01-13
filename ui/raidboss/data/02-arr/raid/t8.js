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
          };
        }
        return {
          en: 'Stack on ' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'T8 Landmine Start',
      regex: / 00:0839:Landmines have been scattered/,
      alertText: {
        en: 'Explode Landmines',
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
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Brainjack on ' + data.ShortName(matches.target),
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
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Allagan Field on ' + data.ShortName(matches.target),
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
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Allagan Field': 'Allagisches Feld',
        'Engage!': 'Start!',
        'The Avatar': 'Avatar',
        'The central bow is no longer sealed': 'Der Zugang zum Rumpf-Zentralsektor öffnet sich wieder',
        'The central bow will be sealed off': 'bis sich der Zugang zum Rumpf-Zentralsektor schließt',
        'XYZ': '',
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
        'Engage!': 'À l\'attaque !',
        'The Avatar': 'Bio-tréant',
        'The central bow is no longer sealed': 'Ouverture de l\'axe central', // FIXME
        'The central bow will be sealed off': 'Fermeture de l\'axe central', // FIXME
        'XYZ': '',
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
      'replaceSync': {
        'Allagan Field': 'アラガンフィールド',
        'Engage!': '戦闘開始！',
        'The Avatar': 'アバター',
        'The central bow is no longer sealed': 'The central bow is no longer sealed', // FIXME
        'The central bow will be sealed off': 'The central bow will be sealed off', // FIXME
        'XYZ': '',
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
  ],
}];
