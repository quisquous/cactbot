import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: Callout safe quadrant/half for Venom Pool with Crystals

export const directions = ['NW', 'NE', 'SE', 'SW'] as const;
export type IntercardDir = typeof directions[number];

export interface Data extends RaidbossData {
  target?: string;
  topazClusterCombatantIdToAbilityId: { [id: number]: string };
  topazRays: { [time: number]: IntercardDir[] };
  clawCount: number;
  ruby1TopazStones: NetMatches['Ability'][];
  isRuby1Done: boolean;
}

export const convertCoordinatesToDirection = (x: number, y: number): IntercardDir => {
  if (x > 100)
    return y < 100 ? 'NE' : 'SE';
  return y < 100 ? 'NW' : 'SW';
};

const triggerSet: TriggerSet<Data> = {
  id: 'AbyssosTheFifthCircleSavage',
  zoneId: ZoneId.AbyssosTheFifthCircleSavage,
  timelineFile: 'p5s.txt',
  initData: () => {
    return {
      topazClusterCombatantIdToAbilityId: {},
      topazRays: {},
      clawCount: 0,
      ruby1TopazStones: [],
      isRuby1Done: false,
    };
  },
  triggers: [
    {
      // The tank busters are not cast on a target,
      // keep track of who the boss is auto attacking.
      id: 'P5S Attack',
      type: 'Ability',
      netRegex: { id: '7A0E', source: 'Proto-Carbuncle' },
      run: (data, matches) => data.target = matches.target,
    },
    {
      // Update target whenever Provoke is used.
      id: 'P5S Provoke',
      type: 'Ability',
      netRegex: { id: '1D6D' },
      run: (data, matches) => data.target = matches.source,
    },
    {
      id: 'P5S Sonic Howl',
      type: 'StartsUsing',
      netRegex: { id: '7720', source: 'Proto-Carbuncle', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P5S Ruby Glow',
      type: 'StartsUsing',
      netRegex: { id: '76F3', source: 'Proto-Carbuncle', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'P5S Ruby 1 Topaz Stone Collect',
      type: 'Ability',
      netRegex: { id: '76FE', source: 'Proto-Carbuncle' },
      condition: (data) => !data.isRuby1Done,
      run: (data, matches) => {
        data.ruby1TopazStones.push(matches);
      },
    },
    {
      id: 'P5S Ruby 1 Topaz Stones',
      type: 'Ability',
      netRegex: { id: '76FE', source: 'Proto-Carbuncle', capture: false },
      condition: (data) => !data.isRuby1Done,
      delaySeconds: 0.3, // allow collector to finish
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const safeQuadrants = new Set(directions);
        for (const stone of data.ruby1TopazStones)
          safeQuadrants.delete(
            convertCoordinatesToDirection(parseFloat(stone.targetX), parseFloat(stone.targetY)),
          );

        const safe = Array.from(safeQuadrants);
        const [safe0, safe1] = safe;
        data.isRuby1Done = true;

        if (safe1 !== undefined) // too many safe quadrants
          return;
        else if (safe0 !== undefined) // one safe quadrant, we're done
          return output[safe0]!();

        // no safe quadrants - find the one with a stone closest to center (x100,y100)
        // magic stones will always have an x/y center offset of 7.5/1.0 or 1.0/7.5
        // poison stone closest to center will always have an x/y center offset of 4.0/4.0
        for (const stone of data.ruby1TopazStones) {
          const stoneX = parseFloat(stone.targetX);
          const stoneY = parseFloat(stone.targetY);
          if (Math.abs(stoneX - 100) < 5 && Math.abs(stoneY - 100) < 5)
            return output.safeCorner!({
              dir1: output[convertCoordinatesToDirection(stoneX, stoneY)]!(),
            });
        }
        return;
      },
      outputStrings: {
        NE: Outputs.dirNE,
        SE: Outputs.dirSE,
        SW: Outputs.dirSW,
        NW: Outputs.dirNW,
        safeCorner: {
          en: '${dir1} Corner (avoid poison)',
          de: '${dir1} Ecke (vermeide das Gift)',
          fr: 'Coin ${dir1} (évitez le poison)',
          ja: '${dir1}の隅へ (毒回避)',
          cn: '${dir1} 角落 (避开毒)',
          ko: '${dir1} 구석 (독 피하기)',
        },
      },
    },
    {
      id: 'P5S Venomous Mass',
      type: 'StartsUsing',
      netRegex: { id: '771D', source: 'Proto-Carbuncle', capture: false },
      alarmText: (data, _matches, output) => {
        if (data.role === 'tank' && data.target !== data.me)
          return output.tankSwap!();
      },
      alertText: (data, _matches, output) => {
        if (data.role === 'tank' && data.target !== data.me)
          return;

        if (data.target === data.me)
          return output.busterOnYou!();
        return output.busterOnTarget!({ player: data.party.member(data.target) });
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
      netRegex: { id: '784A', source: 'Proto-Carbuncle', capture: false },
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
      netRegex: { id: '771B', source: 'Proto-Carbuncle', capture: false },
      delaySeconds: 3,
      response: Responses.knockback(),
    },
    {
      // Collect CombatantIds for the Topaz Stone Proto-Carbuncles
      id: 'P5S Ruby 3 Topaz Cluster Collect',
      type: 'StartsUsing',
      // 7703: 3.7s, 7704: 6.2s, 7705: 8.7s, 7706: 11.2s
      netRegex: { id: '770[3456]', source: 'Proto-Carbuncle' },
      run: (data, matches) =>
        data.topazClusterCombatantIdToAbilityId[parseInt(matches.sourceId, 16)] = matches.id,
    },
    {
      id: 'P5S Ruby 3 Topaz Cluster',
      type: 'Ability',
      netRegex: { id: '7702', source: 'Proto-Carbuncle', capture: false },
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
          const direction = convertCoordinatesToDirection(combatant.PosX, combatant.PosY);
          data.topazRays[index]?.push(direction);
        }
      },
      infoText: (data, _matches, output) => {
        const remainingDirections: { [index: string]: Set<IntercardDir> } = {};
        for (const [index, dirs] of Object.entries(data.topazRays)) {
          remainingDirections[index] = new Set(directions);
          for (const dir of dirs)
            remainingDirections[index]?.delete(dir);
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
        return output.text!({
          dir1: safeDirs[0],
          dir2: safeDirs[1],
          dir3: safeDirs[2],
          dir4: safeDirs[3],
        });
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
          ja: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
          cn: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
          ko: '${dir1} -> ${dir2} -> ${dir3} -> ${dir4}',
        },
      },
    },
    {
      id: 'P5S Venom Squall/Surge',
      type: 'StartsUsing',
      netRegex: { id: '771[67]', source: 'Proto-Carbuncle' },
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
          ja: '${dir1} -> 真ん中 -> ${dir2}',
          cn: '${dir1} -> 诱导 -> ${dir2}',
          ko: '${dir1} -> 장판 유도 -> ${dir2}',
        },
      },
    },
    {
      id: 'P5S Venom Pool with Crystals',
      // TODO: Callout safe quadrant/half
      type: 'StartsUsing',
      netRegex: { id: '79E2', source: 'Proto-Carbuncle', capture: false },
      infoText: (_data, _matches, output) => {
        return output.groups!();
      },
      outputStrings: {
        groups: {
          en: 'Healer Groups on Topaz Stones',
          de: 'Heilergruppen auf Topassteine',
          fr: 'Groupes heal sur les Topazes',
          ja: 'トパーズの上でヒーラーと頭割り',
          cn: '黄宝石处治疗分组分摊',
          ko: '돌 위에서 힐러 그룹 쉐어',
        },
      },
    },
    {
      id: 'P5S Tail to Claw',
      type: 'StartsUsing',
      netRegex: { id: '7712', source: 'Proto-Carbuncle', capture: false },
      durationSeconds: 5,
      response: Responses.getFrontThenBack(),
    },
    {
      id: 'P5S Raging Tail Move',
      type: 'Ability',
      netRegex: { id: '7A0C', source: 'Proto-Carbuncle', capture: false },
      infoText: (_data, _matches, output) => output.moveBehind!(),
      outputStrings: {
        moveBehind: {
          en: 'Move Behind',
          de: 'Nach Hinten bewegen',
          fr: 'Allez derrière',
          ja: '背面へ',
          cn: '去背面',
          ko: '보스 뒤로',
        },
      },
    },
    {
      id: 'P5S Claw to Tail',
      type: 'StartsUsing',
      netRegex: { id: '770E', source: 'Proto-Carbuncle', capture: false },
      durationSeconds: 5,
      response: Responses.getBackThenFront(),
    },
    {
      id: 'P5S Raging Claw Move',
      type: 'Ability',
      netRegex: { id: '7710', source: 'Proto-Carbuncle', capture: false },
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
          ja: '前へ',
          cn: '去正面',
          ko: '보스 앞으로',
        },
      },
    },
    {
      id: 'P5S Searing Ray',
      type: 'StartsUsing',
      netRegex: { id: '76[DF]7', source: 'Proto-Carbuncle', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: Outputs.goFront,
      },
    },
    {
      id: 'P5S Raging Claw',
      type: 'StartsUsing',
      netRegex: { id: '76FA', source: 'Proto-Carbuncle', capture: false },
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
    {
      'locale': 'cn',
      'replaceSync': {
        'Lively Bait': '活饵',
        'Proto-Carbuncle': '原型宝石兽',
      },
      'replaceText': {
        '--towers--': '--塔--',
        'Acidic Slaver': '酸性唾液',
        'Claw to Tail': '利爪凶尾',
        'Devour': '捕食',
        'Double Rush': '二连冲',
        'Impact': '践踏冲击',
        'Raging Claw': '暴怒连爪',
        'Raging Tail': '暴怒扫尾',
        'Ruby Glow': '红宝石之光',
        'Ruby Reflection': '红宝石反射',
        'Scatterbait': '碎饵',
        'Searing Ray': '灼热射线',
        'Sonic Howl': '音嚎',
        'Sonic Shatter': '音碎',
        'Spit': '吐出',
        'Starving Stampede': '穷凶极饿',
        'Tail to Claw': '凶尾利爪',
        'Topaz Cluster': '黄宝石晶簇',
        'Topaz Ray': '黄宝石射线',
        'Topaz Stones': '黄宝石',
        'Toxic Crunch': '毒液重咬',
        'Venom(?!( |ous))': '毒液',
        'Venom Drops': '毒液滴落',
        'Venom Pool': '毒液飞溅',
        'Venom Rain': '毒液雨',
        'Venom Squall': '毒液风暴',
        'Venom Surge': '毒液喷涌',
        'Venomous Mass': '毒液倾泻',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Lively Bait': '팔팔한 먹이',
        'Proto-Carbuncle': '프로토 카벙클',
      },
      'replaceText': {
        '--towers--': '--장판--',
        'Acidic Slaver': '산성 군침',
        'Claw to Tail': '발톱과 꼬리',
        'Devour': '포식',
        'Double Rush': '이중 돌진',
        'Impact': '충격',
        'Raging Claw': '성난 발톱',
        'Raging Tail': '성난 꼬리',
        'Ruby Glow': '루비의 빛',
        'Ruby Reflection': '루비 반사',
        'Scatterbait': '먹이 뿌리기',
        'Searing Ray': '타오르는 빛줄기',
        'Sonic Howl': '음속 포효',
        'Sonic Shatter': '음속 박살',
        'Spit': '방출',
        'Starving Stampede': '굶주림의 광란',
        'Tail to Claw': '꼬리와 발톱',
        'Topaz Cluster': '토파즈 클러스터',
        'Topaz Ray': '토파즈 광선',
        'Topaz Stones': '토파즈 스톤',
        'Toxic Crunch': '독성 짓씹기',
        'Venom(?!( |ous))': '독액',
        'Venom Drops': '독성 빗방울',
        'Venom Pool': '독성 물보라',
        'Venom Rain': '독성 비',
        'Venom Squall': '독성 소나기',
        'Venom Surge': '독성 파도',
        'Venomous Mass': '독성 덩어리',
      },
    },
  ],
};

export default triggerSet;
