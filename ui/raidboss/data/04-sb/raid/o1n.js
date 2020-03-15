'use strict';

// O1S - Deltascape 1.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape \(V1\.0\)$/,
  },
  timelineFile: 'o1n.txt',
  timelineTriggers: [
    {
      id: 'O1N Wyrm Tail',
      regex: /Wyrm Tail/,
      beforeSeconds: 4,
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.miniBuster(),
    },
  ],
  triggers: [
    {
      id: 'O1N Blaze',
      regex: Regexes.startsUsing({ id: '23E1', source: 'Alte Roite' }),
      regexDe: Regexes.startsUsing({ id: '23E1', source: 'Alte Roite' }),
      regexFr: Regexes.startsUsing({ id: '23E1', source: 'Alte Roite' }),
      regexJa: Regexes.startsUsing({ id: '23E1', source: 'アルテ・ロイテ' }),
      regexCn: Regexes.startsUsing({ id: '23E1', source: '老者' }),
      regexKo: Regexes.startsUsing({ id: '23E1', source: '알테 로이테' }),
      response: Responses.stackOn(),
    },
    {
      id: 'O1N Breath Wing',
      regex: Regexes.startsUsing({ id: '23DE', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23DE', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23DE', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23DE', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23DE', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23DE', source: '알테 로이테', capture: false }),
      infoText: {
        en: 'Breath Wing: Be beside boss',
        de: 'Atemschwinge: Neben Boss gehen',
      },
      tts: {
        en: 'breath wing',
        de: 'atemschwinge',
      },
    },
    {
      id: 'O1N Clamp',
      regex: Regexes.startsUsing({ id: '23E2', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23E2', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23E2', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23E2', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23E2', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23E2', source: '알테 로이테', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Knockback immunities don't work.
      id: 'O1N Downburst',
      regex: Regexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '1ED8', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '1ED8', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '1ED8', source: '알테 로이테', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'O1N Roar',
      regex: Regexes.startsUsing({ id: '23DC', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23DC', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23DC', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23DC', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23DC', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23DC', source: '알테 로이테', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'O1N Charybdis',
      regex: Regexes.startsUsing({ id: '23DB', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23DB', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23DB', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23DB', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23DB', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23DB', source: '알테 로이테', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      // Alert rather than info, as any further raid damage is lethal if unhealed.
      response: Responses.aoe('alert'),
    },
    {
      id: 'O1N Twin Bolt',
      regex: Regexes.startsUsing({ id: '23D7', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23D7', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23D7', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23D7', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23D7', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23D7', source: '알테 로이테', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.role == 'healer';
      },
      response: Responses.tankBuster(),
    },
    {
      // This ID is NOT the same as the one that actually hits players. Levinbolt is first
      // cast by Alte Roite on Alte Roite, and when that resolves the markers on players resolve
      // with 23DA.
      id: 'O1N Levinbolt',
      regex: Regexes.startsUsing({ id: '23D9', source: 'Alte Roite', capture: false }),
      regexDe: Regexes.startsUsing({ id: '23D9', source: 'Alte Roite', capture: false }),
      regexFr: Regexes.startsUsing({ id: '23D9', source: 'Alte Roite', capture: false }),
      regexJa: Regexes.startsUsing({ id: '23D9', source: 'アルテ・ロイテ', capture: false }),
      regexCn: Regexes.startsUsing({ id: '23D9', source: '老者', capture: false }),
      regexKo: Regexes.startsUsing({ id: '23D9', source: '알테 로이테', capture: false }),
      response: Responses.spread(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Ball Of Fire': 'Feuerkugel',
        'Alte Roite': 'Alte Roite',
      },
      'replaceText': {
        'Blaze': 'Flamme',
        'Breath Wing': 'Atemschwinge',
        'Charybdis': 'Charybdis',
        'Clamp': 'Klammer',
        'Downburst': 'Fallböe',
        'Levinbolt': 'Keraunisches Feld',
        'Roar': 'Brüllen',
        'Twin Bolt': 'Zwillingsschlag',
        'Wyrm Tail': 'Antiker Drachenschweif',
      },
      '~effectNames': {
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ball Of Fire': 'boule ardente',
        'Alte Roite': 'Alte Roite',
      },
      'replaceText': {
        'Blaze': 'Fournaise',
        'Breath Wing': 'Aile déferlante',
        'Charybdis': 'Charybde',
        'Clamp': 'Pinçage',
        'Downburst': 'Rafale descendante',
        'Levinbolt': 'Fulguration',
        'Roar': 'Rugissement',
        'Twin Bolt': 'Éclairs jumeaux',
        'Wyrm Tail': 'Queue du dragon ancestral',
      },
      '~effectNames': {
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Ball Of Fire': '火炎球',
        'Alte Roite': 'アルテ・ロイテ',
      },
      'replaceText': {
        'Wyrm Tail': '太古の龍尾',
        'Twin Bolt': 'ツインボルト',
        'Roar': '咆哮',
        'Levinbolt': '稲妻',
        'Clamp': 'クランプ',
        'Downburst': 'ダウンバースト',

        'Charybdis': 'ミールストーム',
        'Breath Wing': 'ブレスウィング',
        'Blaze': '火炎',
      },
      '~effectNames': {
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Ball Of Fire': '火焰球',
        'Alte Roite': '老者',
      },
      'replaceText': {
        'Wyrm Tail': '太古龙尾',
        'Twin Bolt': '双重落雷',
        'Roar': '咆啸',
        'Levinbolt': '闪电',
        'Downburst': '下行突风',
        'Clamp': '压迫',
        'Charybdis': '大漩涡',
        'Breath Wing': '风息之翼',
        'Blaze': '炎爆',
      },
      '~effectNames': {
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Ball Of Fire': 'Ball Of Fire', // FIXME
        'Alte Roite': '알테 로이테',
      },
      'replaceText': {
        'Wyrm Tail': '태고의 용 꼬리',
        'Twin Bolt': '이중 낙뢰',
        'Roar': '포효',
        'Levinbolt': '우레',
        'Downburst': '하강 기류',
        'Clamp': '압박',
        'Charybdis': '대소용돌이',
        'Breath Wing': '날개바람',
        'Blaze': '화염',
      },
      '~effectNames': {
      },
    },
  ],
}];
