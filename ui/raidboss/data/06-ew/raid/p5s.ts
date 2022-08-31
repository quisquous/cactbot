import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  target?: string;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheFifthCircleSavage,
  timelineFile: 'p5s.txt',
  triggers: [
    {
      // The tank busters are not cast on a target,
      // keep track of who the boss is auto attacking.
      id: 'P5S Attack',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7A0E', source: 'Proto-Carbuncle' }),
      run: (data, matches) => data.target = matches.target,
    },
    {
      // Update target whenever Provoke is used.
      id: 'P5S Provoke',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '1D6D' }),
      run: (data, matches) => data.target = matches.source,
    },
    {
      id: 'P5S Sonic Howl',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7720', source: 'Proto-Carbuncle', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'P5S Venomous Mass',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '771D', source: 'Proto-Carbuncle', capture: false }),
      alarmText: (data, _matches, output) => {
        if (data.role === 'tank' && data.target !== data.me)
          return output.tankSwap!();
      },
      alertText: (data, _matches, output) => {
        if (data.role === 'tank' && data.target !== data.me)
          return;

        if (data.target === data.me)
          return output.busterOnYou!();
        return output.busterOnTarget!({ player: data.ShortName(data.target) });
      },
      outputStrings: {
        busterOnYou: Outputs.tankBusterOnYou,
        busterOnTarget: Outputs.tankBusterOnPlayer,
        tankSwap: Outputs.tankSwap,
      },
    },
    {
      id: 'P5S Toxic Crunch',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '784A', source: 'Proto-Carbuncle', capture: false }),
      infoText: (data, _matches, output) => {
        if (data.role === 'tank' && data.target !== data.me)
          return;

        if (data.target === data.me)
          return output.busterOnYou!();
        return output.tankBuster!();
      },
      outputStrings: {
        busterOnYou: Outputs.tankBusterOnYou,
        tankBuster: Outputs.tankBuster,
      },
    },
    {
      id: 'P5S Double Rush',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '771B', source: 'Proto-Carbuncle', capture: false }),
      delaySeconds: 3,
      response: Responses.knockback(),
    },
    {
      id: 'P5S Venom Squall/Surge',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '771[67]', source: 'Proto-Carbuncle' }),
      durationSeconds: 5,
      alertText: (_data, matches, output) => {
        const spread = output.spread!();
        const healerGroups = output.healerGroups!();
        // Venom Squall
        if (matches.id === '7716')
          return output.text!({ dir1: spread, dir2: healerGroups });
        return output.text!({ dir1: healerGroups, dir2: spread });
      },
      outputStrings: {
        healerGroups: Outputs.healerGroups,
        spread: Outputs.spread,
        text: {
          en: '${dir1} -> Bait -> ${dir2}',
          de: '${dir1} -> Ködern -> ${dir2}',
        },
      },
    },
    {
      id: 'P5S Tail to Claw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '7712', source: 'Proto-Carbuncle', capture: false }),
      durationSeconds: 5,
      response: Responses.getFrontThenBack(),
    },
    {
      id: 'P5S Claw to Tail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '770E', source: 'Proto-Carbuncle', capture: false }),
      durationSeconds: 5,
      response: Responses.getBackThenFront(),
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Lively Bait': 'zappelnd(?:e|er|es|en) Köder',
        'Proto-Carbuncle': 'Proto-Karfunkel',
      },
      'replaceText': {
        '--towers--': '--Türme--',
        'Acidic Slaver': 'Säurespeichel',
        'Claw to Tail': 'Kralle und Schwanz',
        'Devour': 'Verschlingen',
        'Double Rush': 'Doppelsturm',
        'Impact': 'Impakt',
        'Raging Claw': 'Wütende Kralle',
        'Raging Tail': 'Wütender Schwanz',
        'Ruby Glow': 'Rubinlicht',
        'Ruby Reflection': 'Rubinspiegelung',
        'Scatterbait': 'Streuköder',
        'Sonic Howl': 'Schallheuler',
        'Sonic Shatter': 'Schallbrecher',
        'Spit': 'Hypersekretion',
        'Starving Stampede': 'Hungerstampede',
        'Tail to Claw': 'Schwanz und Kralle',
        'Topaz Cluster': 'Topasbündel',
        'Topaz Ray': 'Topasstrahl',
        'Topaz Stones': 'Topasstein',
        'Toxic Crunch': 'Giftquetscher',
        'Venom(?!( |ous))': 'Toxinspray',
        'Venom Drops': 'Gifttropfen',
        'Venom Pool': 'Giftschwall',
        'Venom Rain': 'Giftregen',
        'Venom Squall': 'Giftwelle',
        'Venom Surge': 'Giftwallung',
        'Venomous Mass': 'Giftmasse',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Lively Bait': 'amuse-gueule',
        'Proto-Carbuncle': 'Proto-Carbuncle',
      },
      'replaceText': {
        'Acidic Slaver': 'Salive acide',
        'Devour': 'Dévoration',
        'Impact': 'Impact',
        'Raging Claw': 'Griffes enragées',
        'Raging Tail': 'Queue enragée',
        'Ruby Glow': 'Lumière rubis',
        'Ruby Reflection': 'Réflexion rubis',
        'Scatterbait': 'Éclate-appât',
        'Sonic Howl': 'Hurlement sonique',
        'Sonic Shatter': 'Pulvérisation sonique',
        'Spit': 'Crachat',
        'Starving Stampede': 'Charge affamée',
        'Topaz Cluster': 'Chaîne de topazes',
        'Topaz Ray': 'Rayon topaze',
        'Topaz Stones': 'Topazes',
        'Toxic Crunch': 'Croqueur venimeux',
        'Venom(?!( |ous))': 'Venin',
        'Venom Drops': 'Crachin de venin',
        'Venom Pool': 'Giclée de venin',
        'Venom Rain': 'Pluie de venin',
        'Venom Squall': 'Crachat de venin',
        'Venom Surge': 'Déferlante de venin',
        'Venomous Mass': 'Masse venimeuse',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Lively Bait': 'ライブリー・ベイト',
        'Proto-Carbuncle': 'プロトカーバンクル',
      },
      'replaceText': {
        'Acidic Slaver': 'アシッドスレイバー',
        'Devour': '捕食',
        'Impact': '衝撃',
        'Raging Claw': 'レイジングクロウ',
        'Raging Tail': 'レイジングテイル',
        'Ruby Glow': 'ルビーの光',
        'Ruby Reflection': 'ルビーリフレクション',
        'Scatterbait': 'スキャッターベイト',
        'Sonic Howl': 'ソニックハウル',
        'Sonic Shatter': 'ソニックシャッター',
        'Spit': '放出',
        'Starving Stampede': 'スターヴィング・スタンピード',
        'Topaz Cluster': 'トパーズクラスター',
        'Topaz Ray': 'トパーズレイ',
        'Topaz Stones': 'トパーズストーン',
        'Toxic Crunch': 'ベノムクランチ',
        'Venom(?!( |ous))': '毒液',
        'Venom Drops': 'ベノムドロップ',
        'Venom Pool': 'ベノムスプラッシュ',
        'Venom Rain': 'ベノムレイン',
        'Venom Squall': 'ベノムスコール',
        'Venom Surge': 'ベノムサージ',
        'Venomous Mass': 'ベノムマス',
      },
    },
  ],
};

export default triggerSet;
