import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Callout safe quadrant/half for Venom Pool with Crystals

const directions = {
  'NE': true,
  'SE': true,
  'SW': true,
  'NW': true,
};

export interface Data extends RaidbossData {
  target?: string;
  topazClusterCombatantIdToAbilityId: { [id: number]: string };
  topazRays: { [time: number]: (keyof typeof directions)[] };
  clawCount: number;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheFifthCircleSavage,
  timelineFile: 'p5s.txt',
  initData: () => {
    return {
      topazClusterCombatantIdToAbilityId: {},
      topazRays: {},
      clawCount: 0,
    };
  },
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
      id: 'P5S Ruby Glow',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76F3', source: 'Proto-Carbuncle', capture: false }),
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
      // Collect CombatantIds for the Topaz Stone Proto-Carbuncles
      id: 'P5S Topaz Cluster Collect',
      type: 'StartsUsing',
      // 7703: 3.7s, 7704: 6.2s, 7705: 8.7s, 7706: 11.2s
      netRegex: NetRegexes.startsUsing({ id: '770[3456]', source: 'Proto-Carbuncle' }),
      run: (data, matches) => data.topazClusterCombatantIdToAbilityId[parseInt(matches.sourceId, 16)] = matches.id,
    },
    {
      id: 'P5S Topaz Cluster',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7702', source: 'Proto-Carbuncle', capture: false }),
      durationSeconds: 12,
      promise: async (data) => {
        // Log position data can be stale, call OverlayPlugin
        const result = await callOverlayHandler({
          call: 'getCombatants',
          ids: Object.keys(data.topazClusterCombatantIdToAbilityId).map(Number),
        });

        // For each topaz stone combatant, determine the quadrant
        for (const combatant of result.combatants) {
          if (combatant.ID === undefined)
            continue;
          const abilityId = data.topazClusterCombatantIdToAbilityId[combatant.ID];
          if (abilityId === undefined)
            continue;

          // Convert from ability id to [0-3] index
          // 7703 is the Topaz Ray cast with the lowest cast time
          const index = parseInt(abilityId, 16) - parseInt('7703', 16);
          data.topazRays[index] ??= [];

          // Map from coordinate position to intercardinal quadrant
          const convertCoordinatesToDirection = (x: number, y: number): keyof typeof directions => {
            if (x > 100)
              return y < 100 ? 'NE' : 'SE';
            return y < 100 ? 'NW' : 'SW';
          };
          const direction = convertCoordinatesToDirection(combatant.PosX, combatant.PosY);
          data.topazRays[index]?.push(direction);
        }
      },
      infoText: (data, _matches, output) => {
        const remainingDirections: { [index: string]: Set<keyof typeof directions> } = {};
        for (const [index, directions] of Object.entries(data.topazRays)) {
          remainingDirections[index] = new Set(['NE', 'SE', 'SW', 'NW']);
          for (const direction of directions)
            remainingDirections[index]?.delete(direction);
        }

        // 770[34] cast 2 times, 770[56] cast 3 times
        const expectedLengths = [2, 2, 1, 1];
        const safeDirs = [];
        for (let i = 0; i < 4; i++) {
          if (remainingDirections[i]?.size !== expectedLengths[i])
            return;

          const tmpDirs = [...remainingDirections[i] ?? []];
          if (!tmpDirs[0])
            return;

          // If there's one safe location, print that
          let dirStr = tmpDirs[0];
          // If there's multiple, prefer south
          if (tmpDirs.length === 2 && tmpDirs[1])
            dirStr = ['SE', 'SW'].includes(tmpDirs[0]) ? tmpDirs[0] : tmpDirs[1];
          safeDirs.push(output[dirStr]!());
        }

        if (safeDirs.length !== 4)
          return;
        return output.text!({ dir1: safeDirs[0], dir2: safeDirs[1], dir3: safeDirs[2], dir4: safeDirs[3] });
      },
      outputStrings: {
        NE: Outputs.dirNE,
        SE: Outputs.dirSE,
        SW: Outputs.dirSW,
        NW: Outputs.dirNW,
        text: {
          en: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
          de: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
          fr: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
          ko: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
        },
      },
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
          fr: '${dir1} -> Attendez -> ${dir2}',
          ko: '${dir1} -> 장판 유도 -> ${dir2}',
        },
      },
    },
    {
      id: 'P5S Venom Pool with Crystals',
      // TODO: Callout safe quadrant/half
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '79E2', source: 'Proto-Carbuncle', capture: false }),
      infoText: (_data, _matches, output) => {
        return output.groups!();
      },
      outputStrings: {
        groups: {
          en: 'Healer Groups on Topaz Stones',
          de: 'Heilergruppen auf Topassteine',
          fr: 'Groupes heal sur les Topazes',
          ko: '돌 위에서 힐러 그룹 쉐어',
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
      id: 'P5S Raging Tail Move',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7A0C', source: 'Proto-Carbuncle', capture: false }),
      infoText: (_data, _matches, output) => output.moveBehind!(),
      outputStrings: {
        moveBehind: {
          en: 'Move Behind',
          de: 'Nach Hinten bewegen',
          fr: 'Allez derrière',
          ko: '보스 뒤로',
        },
      },
    },
    {
      id: 'P5S Claw to Tail',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '770E', source: 'Proto-Carbuncle', capture: false }),
      durationSeconds: 5,
      response: Responses.getBackThenFront(),
    },
    {
      id: 'P5S Raging Claw Move',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '7710', source: 'Proto-Carbuncle', capture: false }),
      condition: (data) => {
        data.clawCount = data.clawCount + 1;
        return data.clawCount === 6;
      },
      infoText: (_data, _matches, output) => output.moveFront!(),
      run: (data) => {
        data.clawCount = 0;
      },
      outputStrings: {
        moveFront: {
          en: 'Move Front',
          de: 'Nach Vorne bewegen',
          fr: 'Allez devant',
          ko: '보스 앞으로',
        },
      },
    },
    {
      id: 'P5S Searing Ray',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76[DF]7', source: 'Proto-Carbuncle', capture: false }),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: Outputs.goFront,
      },
    },
    {
      id: 'P5S Raging Claw',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '76FA', source: 'Proto-Carbuncle', capture: false }),
      response: Responses.getBehind(),
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
        'Searing Ray': 'Sengender Strahl',
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
        'Claw to Tail': 'Griffes et queue',
        'Devour': 'Dévoration',
        'Double Rush': 'Double ruée',
        'Impact': 'Impact',
        'Raging Claw': 'Griffes enragées',
        'Raging Tail': 'Queue enragée',
        'Ruby Glow': 'Lumière rubis',
        'Ruby Reflection': 'Réflexion rubis',
        'Scatterbait': 'Éclate-appât',
        'Searing Ray': 'Rayon irradiant',
        'Sonic Howl': 'Hurlement sonique',
        'Sonic Shatter': 'Pulvérisation sonique',
        'Spit': 'Crachat',
        'Starving Stampede': 'Charge affamée',
        'Tail to Claw': 'Queue et griffes',
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
        'Claw to Tail': 'クロウ・アンド・テイル',
        'Devour': '捕食',
        'Double Rush': 'ダブルラッシュ',
        'Impact': '衝撃',
        'Raging Claw': 'レイジングクロウ',
        'Raging Tail': 'レイジングテイル',
        'Ruby Glow': 'ルビーの光',
        'Ruby Reflection': 'ルビーリフレクション',
        'Scatterbait': 'スキャッターベイト',
        'Searing Ray': 'シアリングレイ',
        'Sonic Howl': 'ソニックハウル',
        'Sonic Shatter': 'ソニックシャッター',
        'Spit': '放出',
        'Starving Stampede': 'スターヴィング・スタンピード',
        'Tail to Claw': 'テイル・アンド・クロウ',
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
