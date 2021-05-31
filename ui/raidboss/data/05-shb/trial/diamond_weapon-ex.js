import ZoneId from '../../../../../resources/zone_id';
import NetRegexes from '../../../../../resources/netregexes';
import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import Outputs from '../../../../../resources/outputs';

// Due to changes introduced in patch 5.2, overhead markers now have a random offset
// added to their ID. This offset currently appears to be set per instance, so
// we can determine what it is from the first overhead marker we see.
// The first 1B markers in the encounter are flares, ID 0057.
// The lowest 1B marker in the encounter is LC #1, ID 004F.
// P2 buster is 00F3
// P3 Shrapnal tracking AoE is 00C5
const firstHeadmarker = parseInt('0057', 16);
const getHeadmarkerId = (data, matches) => {
  // If we naively just check !data.decOffset and leave it, it breaks if the first marker is 0057.
  // (This makes the offset 0, and !0 is true.)
  if (typeof data.decOffset === 'undefined')
    data.decOffset = parseInt(matches.id, 16) - firstHeadmarker;
  // The leading zeroes are stripped when converting back to string, so we re-add them here.
  // Fortunately, we don't have to worry about whether or not this is robust,
  // since we know all the IDs that will be present in the encounter.
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

export default {
  zoneId: ZoneId.TheCloudDeckExtreme,
  timelineFile: 'diamond_weapon-ex.txt',
  triggers: [
    // Phase 1&3
    {
      id: 'DiamondEx Diamond Rain',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA7', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
      run: (data) => data.phase = data.phase || 1,
    },
    // @TODO: There's probably a better callout for these mechanics, e.g.
    // `jump -> stay -> aoe`
    // `stay -> jump -> aoe`
    // `jump -> stack -> stay`
    // `stay -> stack -> jump`
    // `jump -> spread -> stay`
    // `stay -> spread -> jump`
    // but need to figure out what side player is on
    {
      id: 'DiamondEx Adamant Purge West Diamond Rain',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5F9B', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5F9B', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5F9B', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5F9B', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go east -> aoe',
          de: 'Geh nach Osten -> AoE',
          fr: 'Allez à l\'est -> AoE',
          ja: '東へ -> AoE',
          cn: '去右边(东边) -> AoE',
          ko: '동쪽 -> 광역기',
        },
      },
    },
    {
      id: 'DiamondEx Adamant Purge East Diamond Rain',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5F9A', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5F9A', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5F9A', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5F9A', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go west -> aoe',
          de: 'Geh nach Westen -> AoE',
          fr: 'Allez à l\'ouest -> AoE',
          ja: '西へ -> AoE',
          cn: '去左边(西边) -> AoE',
          ko: '서쪽 -> 광역기',
        },
      },
    },
    {
      id: 'DiamondEx Adamant Purge West Diamond Flash',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA5', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go east -> stack',
          de: 'Geh nach Osten -> Sammeln',
          fr: 'Allez à l\'est -> Packez-vous',
          ja: '東へ -> 頭割り',
          cn: '去右边(东边) -> 集合',
          ko: '동쪽 -> 쉐어',
        },
      },
    },
    {
      id: 'DiamondEx Adamant Purge East Diamond Flash',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA4', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA4', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA4', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA4', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go west -> stack',
          de: 'Geh nach Westen -> Sammeln',
          fr: 'Allez à l\'ouest -> Packez-vous',
          ja: '西へ -> 頭割り',
          cn: '去左边(西边) -> 集合',
          ko: '서쪽  -> 쉐어',
        },
      },
    },
    {
      id: 'DiamondEx Adamant Purge West Homing Laser',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA3', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA3', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA3', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA3', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go east -> spread',
          de: 'Geh nach Osten -> Verteilen',
          fr: 'Allez à l\'est -> Dispersez-vous',
          ja: '東へ -> 散開',
          cn: '去右边(东边) -> 分散',
          ko: '동쪽 -> 산개',
        },
      },
    },
    {
      id: 'DiamondEx Adamant Purge East Homing Laser',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA2', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'go west -> spread',
          de: 'Geh nach Westen -> Verteilen',
          fr: 'Allez à l\'ouest -> Dispersez-vous',
          ja: '西へ -> 散開',
          cn: '去左边(西边) -> 分散',
          ko: '서쪽 -> 산개',
        },
      },
    },
    // @TODO: Make this a collector with with flare/away from flare
    {
      id: 'DiamondEx Photon Burst',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA8', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA8', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA8', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA8', capture: false }),
      condition: Conditions.caresAboutMagical(),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Flare',
          de: 'Flare',
          fr: 'Brasier',
          ja: 'フレア',
          cn: '核爆',
          ko: '플레어',
        },
      },
    },
    // @TODO: Phase transition tethers and KB
    {
      id: 'DiamondEx Code Chi-Xi-Stigma',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FAD', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FAD', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FAD', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FAD', capture: false }),
      run: (data) => data.phase = 2,
    },
    // Phase 2
    {
      id: 'DiamondEx Outrage',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FBC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FBC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FBC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FBC', capture: false }),
      condition: Conditions.caresAboutMagical(),
      response: Responses.aoe(),
    },
    {
      id: 'DiamondEx Auri Doomstead',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FBD' }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FBD' }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FBD' }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FBD' }),
      condition: Conditions.caresAboutPhysical(),
      response: Responses.tankBusterSwap(),
    },
    // @TODO: Get boss facing and bits position, call out adjust?
    {
      id: 'DiamondEx P2 Zig-Zag',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FAF', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FAF', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FAF', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FAF', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Zig-Zag',
          de: 'Zig-Zag ausweichen',
          fr: 'Esquivez le Zig-Zag',
          ja: 'ジグザグに避ける',
          cn: '躲避Z字型突进',
          ko: '지그재그 피하기',
        },
      },
    },
    // @TODO: Get boss facing and orb position, call out safe side?
    {
      id: 'DiamondEx P2 Zig-Zag Jump',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FB2', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FB2', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FB2', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FB2', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge East/West',
          de: 'Orb vom Osten/Westen ausweichen',
          fr: 'Esquivez Est/Ouest',
          ja: '東/西へ',
          cn: '左右(东西)躲避',
          ko: '동/서쪽 피하기',
        },
      },
    },
    // @TODO: Get boss facing and orb count, call out towards/away?
    {
      id: 'DiamondEx P2 North/South Jump',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FB5', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FB5', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FB5', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FB5', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Towards/Away',
          de: 'Hin oder weg ausweichen',
          fr: 'Rapprochez-vous/Éloignez-vous',
          ja: '前/後ろへ',
          cn: '前后躲避',
          ko: '가까이/멀리 이동하기',
        },
      },
    },
    // @TODO: Get bit locations, call out north/south diagonal KB?
    {
      id: 'DiamondEx P2 Vertical Cleave',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FB7', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FB7', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FB7', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FB7', capture: false }),
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Diagonal Knockback',
          de: 'Diagonaler Rückstoß',
          fr: 'Poussée diagonale',
          ja: '斜めにノックバック',
          cn: '对角击退',
          ko: '대각으로 넉백',
        },
      },
    },
    {
      id: 'DiamondEx P2 Articulated Bits',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FC1', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FC1', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FC1', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FC1', capture: false }),
      durationSeconds: 15,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Bits',
          de: 'Satelliten ausweichen',
          fr: 'Esquivez les bras',
          ja: 'ビームを避ける',
          cn: '躲避浮游炮激光',
          ko: '비트 피하기',
        },
      },
    },
    {
      id: 'DiamondEx Headmarker',
      netRegex: NetRegexes.headMarker({}),
      durationSeconds: 25,
      infoText: (data, matches, output) => {
        // Always get the headmarker ID, so that decOffset can be defined properly
        const idHex = getHeadmarkerId(data, matches);
        if (matches.target !== data.me)
          return;

        const id = parseInt(idHex, 16);
        const firstLCMarker = parseInt('004F', 16);
        const lastLCMarker = parseInt('0056', 16);

        if (id >= firstLCMarker && id <= lastLCMarker) {
          const decOffset = id - firstLCMarker;
          return output[decOffset + 1]();
        }
      },
      outputStrings: {
        1: Outputs.num1,
        2: Outputs.num2,
        3: Outputs.num3,
        4: Outputs.num4,
        5: Outputs.num5,
        6: Outputs.num6,
        7: Outputs.num7,
        8: Outputs.num8,
      },
    },
    // Phase 3
    {
      id: 'DiamondEx P3 Articulated Bits',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FA9', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FA9', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FA9', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FA9', capture: false }),
      durationSeconds: 20,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Dodge Bits',
          de: 'Satelliten ausweichen',
          fr: 'Esquivez les bras',
          ja: 'ビームを避ける',
          cn: '躲避浮游炮激光',
          ko: '비트 피하기',
        },
      },
    },
    {
      id: 'DiamondEx Diamond Shrapnel',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FAC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FAC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FAC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FAC', capture: false }),
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Bait Puddles',
          de: 'Flächen ködern',
          fr: 'Placez les zones au sol',
          ja: 'AoEを誘導',
          cn: '诱导AoE',
          ko: '장판 피하기',
        },
      },
    },
    {
      id: 'DiamondEx Burst',
      netRegex: NetRegexes.startsUsing({ source: 'The Diamond Weapon', id: '5FAC', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ source: 'Diamant-Waffe', id: '5FAC', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ source: 'Arme Diamant', id: '5FAC', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ source: 'ダイヤウェポン', id: '5FAC', capture: false }),
      delaySeconds: 15,
      alertText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Towers',
          de: 'Türme',
          fr: 'Tours',
          ja: '塔を踏む',
          cn: '踩塔',
          ko: '장판 들어가기',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Articulated Bit': 'Satellitenarm',
        'The Diamond Weapon': 'Diamant-Waffe',
      },
      'replaceText': {
        '\\(Jump\\)': '(Sprung)',
        'Adamant Purge': 'Diamantpanzer',
        'Aetherial Bullet': 'Ätherreigen',
        'Articulated Bits': 'Satellitenarme',
        'Auri Arts': 'Aurische Kunst',
        'Auri Cyclone': 'Aurischer Zyklon',
        'Auri Doomstead': 'Aurisches Verderben',
        '(?<!Photon )Burst': 'Einschlag',
        'Claw Swipe': 'Klauensturm',
        'Code Chi-Xi-Stigma': 'Code 666',
        'Diamond Flash': 'Diamantblitz',
        'Diamond Rain': 'Dominanz der Diamanten',
        'Diamond Shot': 'Diamantschuss',
        'Diamond Shrapnel': 'Diamantschub',
        'Flood Ray': 'Flutstrahl',
        'Homing Laser': 'Leitlaser',
        'Outrage': 'Diamantwut',
        'Photon Burst': 'Photonenknall',
        'Vertical Cleave': 'Vertikalspalter',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Articulated Bit': 'bras autonome',
        'The Diamond Weapon': 'Arme Diamant',
      },
      'replaceText': {
        '\\?': ' ?',
        '\\(Jump\\)': '(Saut)',
        'Adamant Purge': 'Armure adaptative',
        'Aetherial Bullet': 'Rayon éthéré',
        'Articulated Bits': 'Bras autonome',
        'Auri Arts': 'Art martial aoran',
        'Auri Cyclone': 'Tornade aoranne',
        'Auri Doomstead': 'Calamité aoranne',
        '(?<!Photon )Burst': 'Explosion',
        'Claw Swipe': 'Ruée de griffes',
        'Code Chi-Xi-Stigma': 'Code Chi-Xi-Stigma',
        'Diamond Flash': 'Éclair de diamant',
        'Diamond Rain': 'Bombardement adamantin',
        'Diamond Shot': 'Tir diamantaire',
        'Diamond Shrapnel': 'Salve adamantine',
        'Flood Ray': 'Déluge de rayons',
        'Homing Laser': 'Laser auto-guidé',
        'Outrage': 'Indignation',
        'Photon Burst': 'Salve photonique',
        'Vertical Cleave': 'Fente verticale',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Articulated Bit': 'アームビット',
        'The Diamond Weapon': 'ダイヤウェポン',
      },
      'replaceText': {
        'Adamant Purge': '装甲展開',
        'Aetherial Bullet': 'エーテルバレット',
        'Articulated Bits': 'アームビット',
        'Auri Arts': 'アウリアーツ',
        'Auri Cyclone': 'アウリサイクロン',
        'Auri Doomstead': 'アウリドゥーム',
        '(?<!Photon )Burst': '大爆発',
        'Claw Swipe': 'クロースラッシュ',
        'Code Chi-Xi-Stigma': 'コード666',
        'Diamond Flash': 'ダイヤフラッシュ',
        'Diamond Rain': 'ダイヤレイン',
        'Diamond Shot': 'ダイヤショット',
        'Diamond Shrapnel': 'ダイヤバースト',
        'Flood Ray': 'フラッドレイ',
        'Homing Laser': 'ホーミングレーザー',
        'Outrage': 'アウトレイジ',
        'Photon Burst': 'フォトンバースト',
        'Vertical Cleave': 'バーチカルクリーヴ',
      },
    },
  ],
};
