'use strict';

// O1S - Deltascape 1.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape \(V1\.0\)$/,
    cn: /^欧米茄时空狭缝 \(德尔塔幻境1\)$/,
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
        cn: '站boss附近',
      },
      tts: {
        en: 'breath wing',
        de: 'atemschwinge',
        cn: '站boss附近',
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
      regex: Regexes.startsUsing({ id: '23D7', source: 'Alte Roite' }),
      regexDe: Regexes.startsUsing({ id: '23D7', source: 'Alte Roite' }),
      regexFr: Regexes.startsUsing({ id: '23D7', source: 'Alte Roite' }),
      regexJa: Regexes.startsUsing({ id: '23D7', source: 'アルテ・ロイテ' }),
      regexCn: Regexes.startsUsing({ id: '23D7', source: '老者' }),
      regexKo: Regexes.startsUsing({ id: '23D7', source: '알테 로이테' }),
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
        'Alte Roite': 'Alte Roite',
        'Ball Of Fire': 'Feuerkugel',
      },
      'replaceText': {
        'Blaze': 'Flamme',
        'Breath Wing': 'Atemschwinge',
        'Burn': 'Verbrennung',
        'Charybdis': 'Charybdis',
        'Clamp': 'Klammer',
        'Downburst': 'Fallböe',
        'Flame': 'Flamme',
        'Flash Freeze': 'Blitzeis',
        'Levinbolt': 'Keraunisches Feld',
        'Roar': 'Brüllen',
        'The Classical Elements': 'Klassisches Element',
        'Twin Bolt': 'Zwillingsschlag',
        'Wyrm Tail': 'Antiker Drachenschweif',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Alte Roite': 'Alte Roite',
        'Ball Of Fire': 'boule ardente',
      },
      'replaceText': {
        'Blaze': 'Fournaise',
        'Breath Wing': 'Aile déferlante',
        'Burn': 'Combustion',
        'Charybdis': 'Charybde',
        'Clamp': 'Pinçage',
        'Downburst': 'Rafale descendante',
        'Flame': 'Flamme',
        'Flash Freeze': 'Glaciation instantanée',
        'Levinbolt': 'Fulguration',
        'Roar': 'Rugissement',
        'The Classical Elements': 'Élément neutre',
        'Twin Bolt': 'Éclairs jumeaux',
        'Wyrm Tail': 'Queue du dragon ancestral',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Alte Roite': 'アルテ・ロイテ',
        'Ball Of Fire': '火炎球',
      },
      'replaceText': {
        'Blaze': '火炎',
        'Breath Wing': 'ブレスウィング',
        'Burn': '燃焼',
        'Charybdis': 'ミールストーム',
        'Clamp': 'クランプ',
        'Downburst': 'ダウンバースト',
        'Flame': '炎',
        'Flash Freeze': 'フラッシュフリーズ',
        'Levinbolt': '稲妻',
        'Roar': '咆哮',
        'The Classical Elements': 'クラシカルエレメント',
        'Twin Bolt': 'ツインボルト',
        'Wyrm Tail': '太古の龍尾',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Alte Roite': '老者',
        'Ball Of Fire': '火焰球',
      },
      'replaceText': {
        'Blaze': '炎爆',
        'Breath Wing': '风息之翼',
        'Burn': '燃烧',
        'Charybdis': '大漩涡',
        'Clamp': '压迫',
        'Downburst': '下行突风',
        'Flame': '火焰',
        'Flash Freeze': '闪耀冻结',
        'Levinbolt': '闪电',
        'Roar': '咆啸',
        'The Classical elements': '经典元素',
        'Twin Bolt': '双重落雷',
        'Wyrm Tail': '太古龙尾',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Alte Roite': '알테 로이테',
      },
      'replaceText': {
        'Blaze': '화염',
        'Breath Wing': '날개바람',
        'Burn': '연소',
        'Charybdis': '대소용돌이',
        'Clamp': '압박',
        'Downburst': '하강 기류',
        'Flame': '불꽃',
        'Flash Freeze': '급속 동결',
        'Levinbolt': '우레',
        'Roar': '포효',
        'The Classical Elements': '고대의 원소',
        'Twin Bolt': '이중 낙뢰',
        'Wyrm Tail': '태고의 용 꼬리',
      },
    },
  ],
}];
