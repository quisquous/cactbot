'use strict';

// O1S - Deltascape 1.0 Normal
[{
  zoneRegex: {
    en: /^Deltascape \(V1\.0\)$/,
    cn: /^欧米茄时空狭缝 \(德尔塔幻境1\)$/,
  },
  zoneId: ZoneId.DeltascapeV10,
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
      netRegex: NetRegexes.startsUsing({ id: '23E1', source: 'Alte Roite' }),
      netRegexDe: NetRegexes.startsUsing({ id: '23E1', source: 'Alte Roite' }),
      netRegexFr: NetRegexes.startsUsing({ id: '23E1', source: 'Alte Roite' }),
      netRegexJa: NetRegexes.startsUsing({ id: '23E1', source: 'アルテ・ロイテ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '23E1', source: '老者' }),
      netRegexKo: NetRegexes.startsUsing({ id: '23E1', source: '알테 로이테' }),
      response: Responses.stackOn(),
    },
    {
      id: 'O1N Breath Wing',
      netRegex: NetRegexes.startsUsing({ id: '23DE', source: 'Alte Roite', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23DE', source: 'Alte Roite', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23DE', source: 'Alte Roite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23DE', source: 'アルテ・ロイテ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23DE', source: '老者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23DE', source: '알테 로이테', capture: false }),
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
      netRegex: NetRegexes.startsUsing({ id: '23E2', source: 'Alte Roite', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23E2', source: 'Alte Roite', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23E2', source: 'Alte Roite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23E2', source: 'アルテ・ロイテ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23E2', source: '老者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23E2', source: '알테 로이테', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Knockback immunities don't work.
      id: 'O1N Downburst',
      netRegex: NetRegexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '1ED8', source: 'アルテ・ロイテ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '1ED8', source: '老者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '1ED8', source: '알테 로이테', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'O1N Roar',
      netRegex: NetRegexes.startsUsing({ id: '23DC', source: 'Alte Roite', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23DC', source: 'Alte Roite', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23DC', source: 'Alte Roite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23DC', source: 'アルテ・ロイテ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23DC', source: '老者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23DC', source: '알테 로이테', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      response: Responses.aoe(),
    },
    {
      id: 'O1N Charybdis',
      netRegex: NetRegexes.startsUsing({ id: '23DB', source: 'Alte Roite', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23DB', source: 'Alte Roite', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23DB', source: 'Alte Roite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23DB', source: 'アルテ・ロイテ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23DB', source: '老者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23DB', source: '알테 로이테', capture: false }),
      condition: function(data) {
        return data.role == 'healer';
      },
      // Alert rather than info, as any further raid damage is lethal if unhealed.
      response: Responses.aoe('alert'),
    },
    {
      id: 'O1N Twin Bolt',
      netRegex: NetRegexes.startsUsing({ id: '23D7', source: 'Alte Roite' }),
      netRegexDe: NetRegexes.startsUsing({ id: '23D7', source: 'Alte Roite' }),
      netRegexFr: NetRegexes.startsUsing({ id: '23D7', source: 'Alte Roite' }),
      netRegexJa: NetRegexes.startsUsing({ id: '23D7', source: 'アルテ・ロイテ' }),
      netRegexCn: NetRegexes.startsUsing({ id: '23D7', source: '老者' }),
      netRegexKo: NetRegexes.startsUsing({ id: '23D7', source: '알테 로이테' }),
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
      netRegex: NetRegexes.startsUsing({ id: '23D9', source: 'Alte Roite', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '23D9', source: 'Alte Roite', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '23D9', source: 'Alte Roite', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '23D9', source: 'アルテ・ロイテ', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '23D9', source: '老者', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '23D9', source: '알테 로이테', capture: false }),
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
        'Wyrm Tail': 'Antiker Drachenschweif',
        'Twin Bolt': 'Zwillingsschlag',
        'The Classical Elements': 'Klassisches Element',
        'Roar': 'Brüllen',
        'Levinbolt': 'Keraunisches Feld',
        'Flash Freeze': 'Blitzeis',
        'Flame': 'Flamme',
        'Downburst': 'Fallböe',
        'Clamp': 'Klammer',
        'Charybdis': 'Charybdis',
        'Burn': 'Verbrennung',
        'Breath Wing': 'Atemschwinge',
        'Blaze': 'Flamme',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Ball Of Fire': 'boule ardente',
        'Alte Roite': 'Alte Roite',
      },
      'replaceText': {
        'Wyrm Tail': 'Queue du dragon ancestral',
        'Twin Bolt': 'Éclairs jumeaux',
        'The Classical Elements': 'Élément neutre',
        'Roar': 'Rugissement',
        'Levinbolt': 'Fulguration',
        'Flash Freeze': 'Glaciation instantanée',
        'Flame': 'Flamme',
        'Downburst': 'Rafale descendante',
        'Clamp': 'Pinçage',
        'Charybdis': 'Charybde',
        'Burn': 'Combustion',
        'Breath Wing': 'Aile déferlante',
        'Blaze': 'Fournaise',
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
        'The Classical Elements': 'クラシカルエレメント',
        'Roar': '咆哮',
        'Levinbolt': '稲妻',
        'Flash Freeze': 'フラッシュフリーズ',
        'Flame': '炎',
        'Downburst': 'ダウンバースト',
        'Clamp': 'クランプ',
        'Charybdis': 'ミールストーム',
        'Burn': '燃焼',
        'Breath Wing': 'ブレスウィング',
        'Blaze': '火炎',
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
        'The Classical elements': '经典元素',
        'Roar': '咆啸',
        'Levinbolt': '闪电',
        'Flash Freeze': '闪耀冻结',
        'Flame': '火焰',
        'Downburst': '下行突风',
        'Clamp': '压迫',
        'Charybdis': '大漩涡',
        'Burn': '燃烧',
        'Breath Wing': '风息之翼',
        'Blaze': '炎爆',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Alte Roite': '알테 로이테',
        'Ball Of Fire': '화염 구체',
      },
      'replaceText': {
        'Wyrm Tail': '태고의 용 꼬리',
        'Twin Bolt': '이중 낙뢰',
        'The Classical Elements': '고대의 원소',
        'Roar': '포효',
        'Levinbolt': '우레',
        'Flash Freeze': '급속 동결',
        'Flame': '불꽃',
        'Downburst': '하강 기류',
        'Clamp': '압박',
        'Charybdis': '대소용돌이',
        'Burn': '연소',
        'Breath Wing': '날개바람',
        'Blaze': '화염',
      },
    },
  ],
}];
