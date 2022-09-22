import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import NetRegexes from '../../../../../resources/netregexes';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

// O1S - Deltascape 1.0 Normal
export default defineTriggerSet({
  zoneId: ZoneId.DeltascapeV10,
  timelineFile: 'o1n.txt',
  timelineTriggers: [
    {
      id: 'O1N Wyrm Tail',
      regex: /Wyrm Tail/,
      beforeSeconds: 4,
      response: Responses.miniBuster(),
    },
  ],
  triggers: [
    {
      id: 'O1N Blaze',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23E1', source: 'Alte Roite' }),
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'O1N Breath Wing',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23DE', source: 'Alte Roite', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Breath Wing: Be beside boss',
          de: 'Atemschwinge: Neben Boss gehen',
          fr: 'Aile déferlante : Placez-vous à côté du boss',
          ja: 'ブレスウィング: ボスに近づく',
          cn: '站boss附近',
          ko: '날개바람: 보스 옆으로',
        },
      },
    },
    {
      id: 'O1N Clamp',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23E2', source: 'Alte Roite', capture: false }),
      response: Responses.awayFromFront(),
    },
    {
      // Knockback immunities don't work.
      id: 'O1N Downburst',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '1ED8', source: 'Alte Roite', capture: false }),
      response: Responses.knockback(),
    },
    {
      id: 'O1N Roar',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23DC', source: 'Alte Roite', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'O1N Charybdis',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23DB', source: 'Alte Roite', capture: false }),
      condition: (data) => data.role === 'healer',
      // Alert rather than info, as any further raid damage is lethal if unhealed.
      response: Responses.aoe('alert'),
    },
    {
      id: 'O1N Twin Bolt',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23D7', source: 'Alte Roite' }),
      response: Responses.tankBuster(),
    },
    {
      // This ID is NOT the same as the one that actually hits players. Levinbolt is first
      // cast by Alte Roite on Alte Roite, and when that resolves the markers on players resolve
      // with 23DA.
      id: 'O1N Levinbolt',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '23D9', source: 'Alte Roite', capture: false }),
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
        'Levinbolt': 'Blitzschlag',
        'Flash Freeze': 'Blitzeis',
        'Flame': 'Flamme',
        'Downburst': 'Fallböe',
        'Clamp': 'Klammer',
        'Charybdis': 'Charybdis',
        'Burn': 'Verbrennung',
        'Breath Wing': 'Atemschwinge',
        'Blaze': 'Frost',
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
        'Blaze': 'Givre',
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
        'Blaze': 'ブレイズ',
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
        'Roar': '咆哮',
        'Levinbolt': '闪电',
        'Flash Freeze': '闪耀冻结',
        'Flame': '火焰',
        'Downburst': '下行突风',
        'Clamp': '压迫',
        'Charybdis': '大漩涡',
        'Burn': '燃烧',
        'Breath Wing': '风息之翼',
        'Blaze': '冰焰',
      },
    },
    {
      'locale': 'ko',
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
});
