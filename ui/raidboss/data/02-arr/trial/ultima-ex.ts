import { defineTriggerSet } from '../../../../../resources/api_define_trigger_set';
import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';

export default defineTriggerSet({
  zoneId: ZoneId.TheMinstrelsBalladUltimasBane,
  timelineFile: 'ultima-ex.txt',
  initData: () => {
    return {
      plasmTargets: [] as Array<string> | undefined,
      boomCounter: 1,
    };
  },
  timelineTriggers: [
    {
      id: 'Ultima EX Homing Lasers',
      regex: /Homing Lasers/,
      beforeSeconds: 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Spread--Homing Lasers',
          de: 'Verteilen--Leitlaser',
          fr: 'Écartez-vous - Lasers guidés',
          cn: '分散--追踪激光',
          ko: '산개--유도 레이저',
        },
      },
    },
    {
      id: 'Ultima EX Diffractive Laser',
      regex: /Diffractive Laser/,
      beforeSeconds: 4,
      response: Responses.tankCleave(),
    },
    {
      id: 'Ultima EX Vulcan Burst',
      regex: /Vulcan Burst/,
      beforeSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Melee knockback',
          de: 'Melee Rückstoß',
          fr: 'Poussée',
          cn: '近战击退',
          ko: '근접 넉백',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'Ultima EX Tank Purge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5EA', source: 'The Ultima Weapon', capture: false }),
      response: Responses.bigAoe(),
    },
    {
      // At 5 stacks of Viscous Aetheroplasm, the target begins taking massive damage.
      id: 'Ultima EX Viscous Aetheroplasm',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '171', count: '04', capture: false }),
      condition: (data) => data.role === 'tank',
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: Outputs.tankSwap,
      },
    },
    {
      id: 'Ultima EX Homing Aetheroplasm Collect',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '672' }),
      run: (data, matches) => {
        data.plasmTargets = data.plasmTargets ??= [];
        data.plasmTargets.push(matches.target);
      },
    },
    {
      // This ability is ARR 2.0's version of headmarkers. No associated 27 lines are present.
      // These lines are sent by entities with no name and no 03/04 lines.
      id: 'Ultima EX Homing Aetheroplasm Call',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '672', capture: false }),
      delaySeconds: 0.5,
      suppressSeconds: 5,
      infoText: (data, _matches, output) => {
        if (data.plasmTargets?.includes(data.me))
          return output.target!();
        return output.avoid!();
      },
      outputStrings: {
        target: {
          en: 'Homing Aetheroplasm on YOU',
          de: 'Verfolgendes Ätheroplasma auf DIR',
          fr: 'Laser + Éthéroplasma sur VOUS',
          cn: '追踪激光点名',
          ko: '에테르 폭뢰 대상자',
        },
        avoid: {
          en: 'Avoid Homing Aetheroplasm',
          de: 'Weiche dem verfolgendem Ätheroplasma aus',
          fr: 'Évitez le laser + l\'Éthéroplasma',
          cn: '躲避追踪激光',
          ko: '에테르 폭뢰 피하기',
        },
      },
    },
    {
      id: 'Ultima EX Homing Aetheroplasm Cleanup',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '672', capture: false }),
      delaySeconds: 5,
      suppressSeconds: 5,
      run: (data) => delete data.plasmTargets,
    },
    {
      // We use a StartsUsing line here because we can't use timeline triggers for this,
      // and we want to warn players as early as possible.
      id: 'Ultima EX Aetheric Boom Orbs',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5E7', source: 'The Ultima Weapon', capture: false }),
      alarmText: (data, _matches, output) => output[`boom${data.boomCounter}`]!(),
      run: (data) => data.boomCounter += 1,
      outputStrings: {
        boom1: {
          en: 'Orbs: Cardinals',
          de: 'Orbs: Kardinal',
          fr: 'Orbes : Cardinaux',
          cn: '球: 十字',
          ko: '구슬: 십자',
        },
        boom2: {
          en: 'Orbs: Cardinals (N/S first)',
          de: 'Orbs: Kardinal (N/S zuerst)',
          fr: 'Orbes : Cardinaux (N/S en premier)',
          cn: '球: 十字（先南/北）',
          ko: '구슬: 십자(남/북 먼저)',
        },
        boom3: {
          en: 'Orbs: Intercardinals',
          de: 'Orbs: Interkardinal',
          fr: 'Orbes : Intercardinaux',
          cn: '球: 方形',
          ko: '구슬: 사각형',
        },
      },
    },
    {
      id: 'Ultima EX Aetheric Boom Knockback',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '5E7', source: 'The Ultima Weapon', capture: false }),
      response: Responses.knockback(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'The Ultima Weapon': 'Ultima-Waffe',
        'Ultima Garuda': 'Ultima-Garuda',
        'Ultima Ifrit': 'Ultima-Ifrit',
        'Ultima Titan': 'Ultima-Titan',
      },
      'replaceText': {
        'Aetheric Boom': 'Ätherknall',
        'Ceruleum Vent': 'Erdseim-Entlüfter',
        'Crimson Cyclone': 'Zinnober-Zyklon',
        'Diffractive Laser': 'Diffraktiver Laser',
        'Eruption': 'Eruption',
        'Eye of the Storm': 'Auge des Sturms',
        'Geocrush': 'Geo-Stoß',
        'Homing Lasers': 'Leitlaser',
        'Magitek Ray': 'Magitek-Laser',
        'Mistral Song': 'Mistral-Song',
        'Radiant Plume': 'Scheiterhaufen',
        'Tank Purge': 'Tankreinigung',
        'Ultima': 'Ultima',
        'Viscous Aetheroplasm': 'Viskoses Ätheroplasma',
        'Vulcan Burst': 'Feuerstoß',
        'Weight of the Land': 'Gaias Gewicht',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'The Ultima Weapon': 'Ultima Arma',
        'Ultima Garuda': 'Ultima-Garuda',
        'Ultima Ifrit': 'Ultima-Ifrit',
        'Ultima Titan': 'Ultima-Titan',
      },
      'replaceText': {
        'Aetheric Boom': 'Onde d\'éther',
        'Ceruleum Vent': 'Exutoire à céruleum',
        'Crimson Cyclone': 'Cyclone écarlate',
        'Diffractive Laser': 'Laser diffractif',
        'Eruption': 'Éruption',
        'Eye of the Storm': 'Œil du cyclone',
        'Geocrush': 'Broie-terre',
        'Homing Lasers': 'Lasers autoguidés',
        'Magitek Ray': 'Rayon magitek',
        'Mistral Song': 'Chant du mistral',
        'Radiant Plume': 'Panache radiant',
        'Tank Purge': 'Vidange de réservoir',
        'Ultima': 'Ultima',
        'Viscous Aetheroplasm': 'Éthéroplasma poisseux',
        'Vulcan Burst': 'Explosion volcanique',
        'Weight of the Land': 'Poids de la terre',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'The Ultima Weapon': 'アルテマウェポン',
        'Ultima Garuda': 'アルテマ・ガルーダ',
        'Ultima Ifrit': 'アルテマ・イフリート',
        'Ultima Titan': 'アルテマ・タイタン',
      },
      'replaceText': {
        'Aetheric Boom': 'エーテル波動',
        'Ceruleum Vent': 'セルレアムベント',
        'Crimson Cyclone': 'クリムゾンサイクロン',
        'Diffractive Laser': '拡散レーザー',
        'Eruption': 'エラプション',
        'Eye of the Storm': 'アイ・オブ・ストーム',
        'Geocrush': 'ジオクラッシュ',
        'Homing Lasers': '誘導レーザー',
        'Magitek Ray': '魔導レーザー',
        'Mistral Song': 'ミストラルソング',
        'Radiant Plume': '光輝の炎柱',
        'Tank Purge': '魔導フレア',
        'Ultima': 'アルテマ',
        'Viscous Aetheroplasm': '吸着式エーテル爆雷',
        'Vulcan Burst': 'バルカンバースト',
        'Weight of the Land': '大地の重み',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'The Ultima Weapon': '究极神兵',
        'Ultima Garuda': '究极迦楼罗',
        'Ultima Ifrit': '究极伊弗利特',
        'Ultima Titan': '究极泰坦',
      },
      'replaceText': {
        'Aetheric Boom': '以太波动',
        'Ceruleum Vent': '青磷放射',
        'Crimson Cyclone': '深红旋风',
        'Diffractive Laser': '扩散射线',
        'Eruption': '地火喷发',
        'Eye of the Storm': '台风眼',
        'Geocrush': '大地粉碎',
        'Homing Lasers': '诱导射线',
        'Magitek Ray': '魔导激光',
        'Mistral Song': '寒风之歌',
        'Radiant Plume': '光辉炎柱',
        'Tank Purge': '魔导核爆',
        'Ultima': '究极',
        'Viscous Aetheroplasm': '吸附式以太炸弹',
        'Vulcan Burst': '火神爆裂',
        'Weight of the Land': '大地之重',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'The Ultima Weapon': '알테마 웨폰',
        'Ultima Garuda': '알테마 가루다',
        'Ultima Ifrit': '알테마 이프리트',
        'Ultima Titan': '알테마 타이탄',
      },
      'replaceText': {
        'Aetheric Boom': '에테르 파동',
        'Ceruleum Vent': '청린 방출',
        'Crimson Cyclone': '진홍 회오리',
        'Diffractive Laser': '확산 레이저',
        'Eruption': '용암 분출',
        'Eye of the Storm': '태풍의 눈',
        'Geocrush': '대지 붕괴',
        'Homing Lasers': '유도 레이저',
        'Magitek Ray': '마도 레이저',
        'Mistral Song': '삭풍의 노래',
        'Radiant Plume': '광휘의 불기둥',
        'Tank Purge': '마도 플레어',
        'Ultima': '알테마',
        'Viscous Aetheroplasm': '흡착식 에테르 폭뢰',
        'Vulcan Burst': '폭렬 난사',
        'Weight of the Land': '대지의 무게',
      },
    },
  ],
});
