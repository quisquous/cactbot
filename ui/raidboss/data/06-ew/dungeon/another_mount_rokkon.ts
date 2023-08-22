import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import PartyTracker from '../../../../../resources/party';
import { Responses } from '../../../../../resources/responses';
import Util, { Directions } from '../../../../../resources/util';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { Job } from '../../../../../types/job';
import { NetMatches } from '../../../../../types/net_matches';
import { Output, ResponseOutput, TriggerSet } from '../../../../../types/trigger';

// TODO: Shishu Onmitsugashira Huton 8663 call something for multiple fast shurikens???
// TODO: could call out Moko Fleeting Iai-giri corners with map effects
//         2C = N
//         2D = NW<->SE
//         2E = NE<->SW
//         2F = S

type RousingTower = {
  blue?: string;
  orange?: string;
};

const headmarkers = {
  // vfx/lockon/eff/sph_lockon2_num01_s8p.avfx (through sph_lockon2_num04_s8p)
  limitCut1: '0150',
  limitCut2: '0151',
  limitCut3: '0152',
  limitCut4: '0153',
} as const;

const mokoVfxMap = {
  '24C': 'backRed',
  '24D': 'leftRed',
  '24E': 'frontRed',
  '24F': 'rightRed',
  '250': 'backBlue',
  '251': 'leftBlue',
  '252': 'frontBlue',
  '253': 'rightBlue',
} as const;
type KasumiGiri = typeof mokoVfxMap[keyof typeof mokoVfxMap];
const looseMokoVfxMap: { [id: string]: KasumiGiri } = mokoVfxMap;

const shadowVfxMap = {
  '248': 'back',
  '249': 'left',
  '24A': 'front',
  '24B': 'right',
} as const;
type ShadowKasumiGiri = typeof shadowVfxMap[keyof typeof shadowVfxMap];
const looseShadowVfxMap: { [id: string]: ShadowKasumiGiri } = shadowVfxMap;

const limitCutIds: readonly string[] = Object.values(headmarkers);

const mokoCenterX = -200;
const mokoCenterY = 0;

const tripleKasumiFirstOutputStrings = {
  backRedFirst: {
    en: 'Back + Out',
  },
  leftRedFirst: {
    en: 'Left + Out',
  },
  frontRedFirst: {
    en: 'Front + Out',
  },
  rightRedFirst: {
    en: 'Right + Out',
  },
  backBlueFirst: {
    en: 'Back + In',
  },
  leftBlueFirst: {
    en: 'Left + In',
  },
  frontBlueFirst: {
    en: 'Front + In',
  },
  rightBlueFirst: {
    en: 'Right + In',
  },
} as const;

// It might be more accurate to say "rotate right" here than "right" (implying right flank)
// but that's very long. This is one of those "you need to know the mechanic" situations.
const tripleKasumiFollowupOutputStrings = {
  backRed: {
    en: 'Stay + Out',
  },
  leftRed: {
    en: 'Left + Out',
  },
  frontRed: {
    en: 'Through + Out',
  },
  rightRed: {
    en: 'Right + Out',
  },
  backBlue: {
    en: 'Stay + In',
  },
  leftBlue: {
    en: 'Left + In',
  },
  frontBlue: {
    en: 'Through + In',
  },
  rightBlue: {
    en: 'Right + In',
  },
};

const tripleKasumiAbilityIds = [
  '85B0', // back red first
  '85B1', // left red first
  '85B2', // front red first
  '85B3', // right red first
  '85B4', // back red followup
  '85B5', // left red followup
  '85B6', // front red followup
  '85B7', // right red followup
  '85BA', // back blue first
  '85BB', // left blue first
  '85BC', // front blue first
  '85BD', // right blue first
  '85BE', // back blue followup
  '85BF', // left blue followup
  '85C0', // front blue followup
  '85C1', // right blue followup
] as const;

const shadowKasumiAbilityIds = [
  '85CA', // back purple first
] as const;

export interface Data extends RaidbossData {
  combatantData: PluginCombatantState[];
  rairinCollect: NetMatches['AddedCombatant'][];
  wailingCollect: NetMatches['GainsEffect'][];
  wailCount: number;
  devilishThrallCollect: NetMatches['StartsUsing'][];
  sparksCollect: NetMatches['GainsEffect'][];
  sparksCount: number;
  rousingCollect: [RousingTower, RousingTower, RousingTower, RousingTower];
  rousingTowerCount: number;
  malformedCollect: NetMatches['GainsEffect'][];
  tripleKasumiCollect: KasumiGiri[];
  shadowKasumiCollect: { [shadowId: string]: ShadowKasumiGiri[] };
  shadowKasumiTether: { [shadowId: string]: string };
  invocationCollect: NetMatches['GainsEffect'][];
  iaigiriTether: NetMatches['Tether'][];
  iaigiriPurple: NetMatches['GainsEffect'][];
  iaigiriCasts: NetMatches['StartsUsing'][];
  myAccursedEdge?: NetMatches['Ability'];
  myIaigiriTether?: NetMatches['Tether'];
  seenSoldiersOfDeath?: boolean;
}

const countJob = (job1: Job, job2: Job, func: (x: Job) => boolean): number => {
  return (func(job1) ? 1 : 0) + (func(job2) ? 1 : 0);
};

// For a given criteria func, if there's exactly one person who matches in the stack group
// and exactly one person who matches in the unmarked group, then they can stack together.
// This also filters out weird party comps naturally.
const couldStackLooseFunc = (
  stackJob1: Job,
  stackJob2: Job,
  unmarkedJob1: Job,
  unmarkedJob2: Job,
  func: (x: Job) => boolean,
): boolean => {
  const stackCount = countJob(stackJob1, stackJob2, func);
  const unmarkedCount = countJob(unmarkedJob1, unmarkedJob2, func);
  return stackCount === 1 && unmarkedCount === 1;
};
const isMeleeOrTank = (x: Job) => Util.isMeleeDpsJob(x) || Util.isTankJob(x);
const isSupport = (x: Job) => Util.isHealerJob(x) || Util.isTankJob(x);

type StackPartners = 'melee' | 'role' | 'mixed' | 'unknown';
const findStackPartners = (
  party: PartyTracker,
  stack1?: string,
  stack2?: string,
): StackPartners => {
  if (stack1 === undefined || stack2 === undefined)
    return 'unknown';

  const stacks = [stack1, stack2];
  const unmarked = party.partyNames.filter((x) => !stacks.includes(x));
  if (unmarked.length !== 2 || party.partyNames.length !== 4)
    return 'unknown';

  const [stackJob1, stackJob2] = stacks.map((x) => party.jobName(x));
  if (stackJob1 === undefined || stackJob2 === undefined)
    return 'unknown';
  const [unmarkedJob1, unmarkedJob2] = unmarked.map((x) => party.jobName(x));
  if (unmarkedJob1 === undefined || unmarkedJob2 === undefined)
    return 'unknown';

  const couldStack = (func: (x: Job) => boolean): boolean => {
    return couldStackLooseFunc(stackJob1, stackJob2, unmarkedJob1, unmarkedJob2, func);
  };

  if (couldStack(isMeleeOrTank))
    return 'melee';
  if (couldStack(isSupport))
    return 'role';

  // if we get here, then you have a not normal light party comp, e.g. two ranged.
  // For a tank/healer/ranged/ranged comp, this condition will always be true
  // when the role stack check above fails, but make it anyway in case the party
  // comp is something else entirely.
  const stackCount = countJob(stackJob1, stackJob2, isSupport);
  const unmarkedCount = countJob(unmarkedJob1, unmarkedJob2, isSupport);
  if (stackCount === 2 && unmarkedCount === 0 || stackCount === 0 && unmarkedCount === 2)
    return 'mixed';

  // if something has gone incredibly awry, then just return the default
  return 'unknown';
};

const stackSpreadResponse = (
  data: Data,
  output: Output,
  collect: NetMatches['GainsEffect'][],
  stackId: string,
  spreadId: string,
): ResponseOutput<Data, NetMatches['GainsEffect']> => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    // In a 4 person party with two randomly assigned stacks,
    // there are a couple of different "kinds of pairs" that make sense to call.
    //
    // You can have two melees together and two ranged together,
    // or you can have two supports together and two dps together (role stacks)
    // or you have no melee in your comp, and you could have mixed support and range.
    // Arguably things like "tank+ranged, melee+healer" are possible but are harder to call.
    //
    // Prefer "melee/ranged" stacks here and elsewhere because it keeps
    // the tank and melee together for uptime.
    spreadThenMeleeStack: {
      en: 'Spread => Melees Stack/Ranged Stack',
    },
    spreadThenRoleStack: {
      en: 'Spread => Role Stacks',
    },
    spreadThenMixedStack: {
      en: 'Spread => Support w/DPS Stacks',
    },
    meleeStackThenSpread: {
      en: 'Melees Stack/Ranged Stack => Spread',
    },
    roleStackThenSpread: {
      en: 'Role Stacks => Spread',
    },
    mixedStackThenSpread: {
      en: 'Support w/DPS Stacks => Spread',
    },
    spreadThenStack: Outputs.spreadThenStack,
    stackThenSpread: Outputs.stackThenSpread,
    stacks: {
      en: 'Stacks: ${player1}, ${player2}',
    },
  };

  const [stack1, stack2] = collect.filter((x) => x.effectId === stackId);
  const spread = collect.find((x) => x.effectId === spreadId);
  if (stack1 === undefined || stack2 === undefined || spread === undefined)
    return;
  const stackTime = parseFloat(stack1.duration);
  const spreadTime = parseFloat(spread.duration);
  const isStackFirst = stackTime < spreadTime;

  const stackType = findStackPartners(data.party, stack1.target, stack2.target);

  const stacks = [stack1, stack2].map((x) => x.target).sort();
  const [player1, player2] = stacks.map((x) => data.ShortName(x));
  const stackInfo = { infoText: output.stacks!({ player1: player1, player2: player2 }) };

  if (stackType === 'melee') {
    if (isStackFirst)
      return { alertText: output.meleeStackThenSpread!(), ...stackInfo };
    return { alertText: output.spreadThenMeleeStack!(), ...stackInfo };
  } else if (stackType === 'role') {
    if (isStackFirst)
      return { alertText: output.roleStackThenSpread!(), ...stackInfo };
    return { alertText: output.spreadThenRoleStack!(), ...stackInfo };
  } else if (stackType === 'mixed') {
    if (isStackFirst)
      return { alertText: output.mixedStackThenSpread!(), ...stackInfo };
    return { alertText: output.spreadThenMixedStack!(), ...stackInfo };
  }

  // 'unknown' catch-all
  if (isStackFirst)
    return { alertText: output.stackThenSpread!(), ...stackInfo };
  return { alertText: output.spreadThenStack!(), ...stackInfo };
};

const towerResponse = (
  data: Data,
  output: Output,
): ResponseOutput<Data, NetMatches['None']> => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    tetherThenBlueTower: {
      en: 'Tether ${num1} => Blue Tower ${num2}',
    },
    tetherThenOrangeTower: {
      en: 'Tether ${num1} => Orange Tower ${num2}',
    },
    tether: {
      en: 'Tether ${num}',
    },
    blueTower: {
      en: 'Blue Tower ${num}',
    },
    orangeTower: {
      en: 'Orange Tower ${num}',
    },
    num1: Outputs.num1,
    num2: Outputs.num2,
    num3: Outputs.num3,
    num4: Outputs.num4,
  };

  // data.rousingTowerCount is 0-indexed
  // towerNum for display is 1-indexed
  const theseTowers = data.rousingCollect[data.rousingTowerCount];
  const towerNum = data.rousingTowerCount + 1;
  data.rousingTowerCount++;

  if (theseTowers === undefined)
    return;

  const numMap: { [towerNum: number]: string } = {
    1: output.num1!(),
    2: output.num2!(),
    3: output.num3!(),
    4: output.num4!(),
  } as const;

  const numStr = numMap[towerNum];
  if (numStr === undefined)
    return;

  if (data.me === theseTowers.blue)
    return { alertText: output.blueTower!({ num: numStr }) };
  if (data.me === theseTowers.orange)
    return { alertText: output.orangeTower!({ num: numStr }) };
  const nextTowers = data.rousingCollect[towerNum + 1];
  const nextNumStr = numMap[towerNum + 1];
  if (towerNum === 4 || nextTowers === undefined || nextNumStr === undefined)
    return { infoText: output.tether!({ num: numStr }) };

  if (data.me === nextTowers.blue)
    return { infoText: output.tetherThenBlueTower!({ num1: numStr, num2: nextNumStr }) };
  if (data.me === nextTowers.orange)
    return { infoText: output.tetherThenOrangeTower!({ num1: numStr, num2: nextNumStr }) };

  // Just in case...
  return { infoText: output.tether!({ num: numStr }) };
};

const triggerSet: TriggerSet<Data> = {
  id: 'AnotherMountRokkon',
  zoneId: ZoneId.AnotherMountRokkon,
  timelineFile: 'another_mount_rokkon.txt',
  initData: () => {
    return {
      combatantData: [],
      rairinCollect: [],
      wailingCollect: [],
      wailCount: 0,
      devilishThrallCollect: [],
      sparksCollect: [],
      sparksCount: 0,
      rousingCollect: [{}, {}, {}, {}],
      rousingTowerCount: 0,
      malformedCollect: [],
      tripleKasumiCollect: [],
      shadowKasumiCollect: {},
      shadowKasumiTether: {},
      invocationCollect: [],
      iaigiriTether: [],
      iaigiriPurple: [],
      iaigiriCasts: [],
    };
  },
  triggers: [
    // ---------------- first trash ----------------
    {
      id: 'AMR Shishu Raiko Disciples of Levin',
      type: 'StartsUsing',
      netRegex: { id: '8656', source: 'Shishu Raiko', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'AMR Shishu Furutsubaki Bloody Caress',
      type: 'StartsUsing',
      netRegex: { id: '8657', source: 'Shishu Furutsubaki', capture: false },
      suppressSeconds: 5,
      response: Responses.getBehind('info'),
    },
    {
      id: 'AMR Shishu Raiko Barreling Smash',
      type: 'StartsUsing',
      netRegex: { id: '8653', source: 'Shishu Raiko' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          chargeOnYou: {
            en: 'Charge on YOU',
          },
          chargeOn: {
            en: 'Charge on ${player}',
          },
        };

        if (matches.target === data.me)
          return { alarmText: output.chargeOnYou!() };
        return { alertText: output.chargeOn!({ player: data.ShortName(matches.target) }) };
      },
    },
    {
      id: 'AMR Shishu Raiko Howl',
      type: 'StartsUsing',
      netRegex: { id: '8654', source: 'Shishu Raiko', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AMR Shishu Raiko Master of Levin',
      type: 'StartsUsing',
      netRegex: { id: '8655', source: 'Shishu Raiko', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'AMR Shishu Fuko Scythe Tail',
      type: 'StartsUsing',
      netRegex: { id: '865A', source: 'Shishu Fuko', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'AMR Shishu Fuko Twister',
      type: 'StartsUsing',
      netRegex: { id: '8658', source: 'Shishu Fuko' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'AMR Shishu Fuko Crosswind',
      type: 'StartsUsing',
      netRegex: { id: '8659', source: 'Shishu Fuko', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'AMR Shishu Yuki Right Swipe',
      type: 'StartsUsing',
      netRegex: { id: '8685', source: 'Shishu Yuki', capture: false },
      response: Responses.goLeft('info'),
    },
    {
      id: 'AMR Shishu Yuki Left Swipe',
      type: 'StartsUsing',
      netRegex: { id: '8686', source: 'Shishu Yuki', capture: false },
      response: Responses.goRight('info'),
    },
    // ---------------- Shishio ----------------
    {
      id: 'AMR Shishio Enkyo',
      type: 'StartsUsing',
      netRegex: { id: '841A', source: 'Shishio', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AMR Shishio Splitting Cry',
      type: 'StartsUsing',
      netRegex: { id: '841B', source: 'Shishio' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMR Shishio Splitter',
      type: 'Ability',
      // This comes out ~4s after Splitting Cry.
      netRegex: { id: '841B', source: 'Shishio', capture: false },
      suppressSeconds: 5,
      response: Responses.goFrontOrSides('info'),
    },
    {
      id: 'AMR Rairin Collect',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12430' },
      run: (data, matches) => data.rairinCollect.push(matches),
    },
    {
      id: 'AMR Noble Pursuit',
      type: 'AddedCombatant',
      netRegex: { npcNameId: '12430', capture: false },
      condition: (data) => data.rairinCollect.length === 4,
      alertText: (data, _matches, output) => {
        const [one, two, three, four] = data.rairinCollect;
        if (one === undefined || two === undefined || three === undefined || four === undefined)
          return;

        // one is always north (0, -115)
        // two is always south (0, -85)
        // three is left or right (+/-15, -80)
        // four is either diagonal (7.5, -92.5) / (-6, -94) or back north (+/-20, -95)

        // We always end up on the opposite side as the third charge.
        const isThreeEast = parseFloat(three.x) > 0;
        // If four is diagonal, you go south otherwise north.
        const isFourDiagonal = Math.abs(parseFloat(four.x)) < 18;

        if (isFourDiagonal)
          return isThreeEast ? output.southwest!() : output.southeast!();
        return isThreeEast ? output.northwest!() : output.northeast!();
      },
      outputStrings: {
        northeast: Outputs.northeast,
        southeast: Outputs.southeast,
        southwest: Outputs.southwest,
        northwest: Outputs.northwest,
      },
    },
    {
      id: 'AMR Shishio Unnatural Wail Count',
      type: 'StartsUsing',
      netRegex: { id: '8417', source: 'Shishio', capture: false },
      run: (data) => {
        data.wailCount++;
        data.wailingCollect = [];
      },
    },
    {
      id: 'AMR Shishio Wailing Collect',
      type: 'GainsEffect',
      // DEB = Scattered Wailing (spread)
      // DEC = Intensified Wailing (stack)
      netRegex: { effectId: ['DEB', 'DEC'], source: 'Shishio' },
      run: (data, matches) => data.wailingCollect.push(matches),
    },
    {
      id: 'AMR Shishio Unnatural Wailing 1',
      type: 'GainsEffect',
      netRegex: { effectId: ['DEB', 'DEC'], source: 'Shishio', capture: false },
      condition: (data) => data.wailCount === 1,
      delaySeconds: 0.5,
      suppressSeconds: 999999,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        return stackSpreadResponse(data, output, data.wailingCollect, 'DEC', 'DEB');
      },
    },
    {
      id: 'AMR Shishio Vortex of the Thunder Eye',
      type: 'StartsUsing',
      // 8413 = Eye of the Thunder Vortex (out)
      // 8415 = Vortex of the Thnder Eye (in)
      netRegex: { id: ['8413', '8415'], source: 'Shishio' },
      durationSeconds: 7,
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          out: Outputs.out,
          in: Outputs.in,
          spreadThenMeleeStack: {
            en: '${inOut} + Spread => ${outIn} + Melees Stack',
          },
          spreadThenRoleStack: {
            en: '${inOut} + Spread => ${outIn} + Role Stacks',
          },
          spreadThenMixedStack: {
            en: '${inOut} + Spread => ${outIn} + Support w/DPS Stacks',
          },
          meleeStackThenSpread: {
            en: '${inOut} + Melees Stack => ${outIn} + Spread',
          },
          roleStackThenSpread: {
            en: '${inOut} + Role Stacks => ${outIn} + Spread',
          },
          mixedStackThenSpread: {
            en: '${inOut} + Support w/DPS Stacks => ${outIn} + Spread',
          },
          spreadThenStack: {
            en: '${inOut} + Spread => ${outIn} + Stack',
          },
          stackThenSpread: {
            en: '${inOut} + Stack => ${outIn} + Spread',
          },
          stacks: {
            en: 'Stacks: ${player1}, ${player2}',
          },
        };

        const [stack1, stack2] = data.wailingCollect.filter((x) => x.effectId === 'DEC');
        const spread = data.wailingCollect.find((x) => x.effectId === 'DEB');
        if (stack1 === undefined || stack2 === undefined || spread === undefined)
          return;
        const stackTime = parseFloat(stack1.duration);
        const spreadTime = parseFloat(spread.duration);
        const isStackFirst = stackTime < spreadTime;

        const stackType = findStackPartners(data.party, stack1.target, stack2.target);

        const isInFirst = matches.id === '8415';
        const inOut = isInFirst ? output.in!() : output.out!();
        const outIn = isInFirst ? output.out!() : output.in!();
        const args = { inOut: inOut, outIn: outIn };

        const stacks = [stack1, stack2].map((x) => x.target).sort();
        const [player1, player2] = stacks.map((x) => data.ShortName(x));
        const stackInfo = { infoText: output.stacks!({ player1: player1, player2: player2 }) };

        if (stackType === 'melee') {
          if (isStackFirst)
            return { alertText: output.meleeStackThenSpread!(args), ...stackInfo };
          return { alertText: output.spreadThenMeleeStack!(args), ...stackInfo };
        } else if (stackType === 'role') {
          if (isStackFirst)
            return { alertText: output.roleStackThenSpread!(args), ...stackInfo };
          return { alertText: output.spreadThenRoleStack!(args), ...stackInfo };
        } else if (stackType === 'mixed') {
          if (isStackFirst)
            return { alertText: output.mixedStackThenSpread!(args), ...stackInfo };
          return { alertText: output.spreadThenMixedStack!(args), ...stackInfo };
        }

        // 'unknown' catch-all
        if (isStackFirst)
          return { alertText: output.stackThenSpread!(args), ...stackInfo };
        return { alertText: output.spreadThenStack!(args), ...stackInfo };
      },
    },
    {
      id: 'AMR Shishio Thunder Vortex',
      type: 'StartsUsing',
      netRegex: { id: '8412', source: 'Shishio', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'AMR Shishio Devilish Thrall Collect',
      type: 'StartsUsing',
      // 840B = Right Swipe
      // 840C = Left Swipe
      netRegex: { id: ['840B', '840C'], source: 'Devilish Thrall' },
      run: (data, matches) => data.devilishThrallCollect.push(matches),
    },
    {
      id: 'AMR Shishio Devilish Thrall Safe Spot',
      type: 'StartsUsing',
      netRegex: { id: ['840B', '840C'], source: 'Devilish Thrall', capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      promise: async (data) => {
        data.combatantData = [];

        const ids = data.devilishThrallCollect.map((x) => parseInt(x.sourceId, 16));
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: ids,
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        if (data.combatantData.length !== 4)
          return;
        const centerX = 0;
        const centerY = -100;

        // Intercard thralls:
        //   x = 0 +/- 10
        //   y = -100 +/- 10
        //   heading = intercards (pi/4 + pi/2 * n)
        // Cardinal thralls:
        //   x = 0 +/- 12
        //   y = -100 +/- 12
        //   heading = cardinals (pi/2 * n)

        // One is a set of four on cardinals, the others a set of 4 on intercards.
        // There seems to be only one pattern of thralls, rotated.
        // Two are pointed inward (direct opposite to their position)
        // and two are pointed outward (perpendicular to their position).
        // Because of this, no need to check left/right cleave as position and directions tell all.
        const states = data.combatantData.map((combatant) => {
          return {
            dir: Directions.combatantStatePosTo8Dir(combatant, centerX, centerY),
            heading: Directions.combatantStateHdgTo8Dir(combatant),
          };
        });
        const outwardStates = states.filter((state) => state.dir !== (state.heading + 4) % 8);
        const [pos1, pos2] = outwardStates.map((x) => x.dir).sort();
        if (pos1 === undefined || pos2 === undefined || outwardStates.length !== 2)
          return;

        // 0/6 (average 7) and 1/7 (average 0) are the two cases where the difference is 6 and not 2.
        const averagePos = Math.floor((pos2 + pos1 + (pos2 - pos1 === 6 ? 8 : 0)) / 2) % 8;
        return {
          0: output.north!(),
          1: output.northeast!(),
          2: output.east!(),
          3: output.southeast!(),
          4: output.south!(),
          5: output.southwest!(),
          6: output.west!(),
          7: output.northwest!(),
        }[averagePos];
      },
      run: (data) => data.devilishThrallCollect = [],
      outputStrings: {
        north: {
          en: 'North Diamond',
        },
        east: {
          en: 'East Diamond',
        },
        south: {
          en: 'South Diamond',
        },
        west: {
          en: 'West Diamond',
        },
        northeast: {
          en: 'Northeast Square',
        },
        southeast: {
          en: 'Southeast Square',
        },
        southwest: {
          en: 'Southwest Square',
        },
        northwest: {
          en: 'Northwest Square',
        },
      },
    },
    // ---------------- second trash ----------------
    {
      id: 'AMR Shishu Kotengu Backward Blows',
      type: 'StartsUsing',
      netRegex: { id: '865C', source: 'Shishu Kotengu', capture: false },
      durationSeconds: 5.7,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Sides (Stay Sides)',
        },
      },
    },
    {
      id: 'AMR Shishu Kotengu Leftward Blows',
      type: 'StartsUsing',
      netRegex: { id: '865D', source: 'Shishu Kotengu', capture: false },
      durationSeconds: 5.7,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Right + Behind',
        },
      },
    },
    {
      id: 'AMR Shishu Kotengu Rightward Blows',
      type: 'StartsUsing',
      netRegex: { id: '865E', source: 'Shishu Kotengu', capture: false },
      durationSeconds: 5.7,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Left + Behind',
        },
      },
    },
    {
      id: 'AMR Shishu Kotengu Wrath of the Tengu',
      type: 'StartsUsing',
      netRegex: { id: '8654', source: 'Shishu Kotengu', capture: false },
      response: Responses.bleedAoe('info'),
    },
    {
      id: 'AMR Shishu Kotengu Gaze of the Tengu',
      type: 'StartsUsing',
      netRegex: { id: '8661', source: 'Shishu Kotengu', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'AMR Shishu Onmitsugashira Juji Shuriken',
      type: 'StartsUsing',
      netRegex: { id: '8664', source: 'Shishu Onmitsugashira', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'AMR Shishu Onmitsugashira Issen',
      type: 'StartsUsing',
      netRegex: { id: '8662', source: 'Shishu Onmitsugashira' },
      response: Responses.tankBuster(),
    },
    // ---------------- Gorai the Uncaged ----------------
    {
      id: 'AMR Gorai Unenlightenment',
      type: 'StartsUsing',
      netRegex: { id: '8534', source: 'Gorai the Uncaged', capture: false },
      response: Responses.bleedAoe('info'),
    },
    {
      id: 'AMR Gorai Brazen Ballad Purple',
      type: 'StartsUsing',
      netRegex: { id: '8509', source: 'Gorai the Uncaged', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Expanding Lines',
        },
      },
    },
    {
      id: 'AMR Gorai Brazen Ballad Blue',
      type: 'StartsUsing',
      netRegex: { id: '850A', source: 'Gorai the Uncaged', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Under Rock + Lines',
        },
      },
    },
    {
      id: 'AMR Gorai Sparks Count',
      type: 'StartsUsing',
      netRegex: { id: '8503', source: 'Gorai the Uncaged', capture: false },
      run: (data) => {
        data.sparksCount++;
        data.sparksCollect = [];
      },
    },
    {
      id: 'AMR Gorai Sparks Collect',
      type: 'GainsEffect',
      // E17 = Live Brazier (stack)
      // E18 = Live Candle (spread)
      netRegex: { effectId: ['E17', 'E18'] },
      run: (data, matches) => data.sparksCollect.push(matches),
    },
    {
      id: 'AMR Gorai Seal of Scurrying Sparks 1',
      type: 'GainsEffect',
      netRegex: { effectId: ['E17', 'E18'], capture: false },
      condition: (data) => data.sparksCount === 1,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          meleeStack: {
            en: 'Melees Stack/Ranged Stack',
          },
          roleStack: {
            en: 'Role Stacks',
          },
          mixedStack: {
            en: 'Support w/DPS Stacks',
          },
          stacks: {
            en: 'Stacks: ${player1}, ${player2}',
          },
        };

        const [stack1, stack2] = data.sparksCollect.filter((x) => x.effectId === 'E17');
        if (stack1 === undefined || stack2 === undefined)
          return;

        const stackType = findStackPartners(data.party, stack1.target, stack2.target);

        const stacks = [stack1, stack2].map((x) => x.target).sort();
        const [player1, player2] = stacks.map((x) => data.ShortName(x));
        const stackInfo = { infoText: output.stacks!({ player1: player1, player2: player2 }) };

        if (stackType === 'melee') {
          return { alertText: output.meleeStack!(), ...stackInfo };
        } else if (stackType === 'role') {
          return { alertText: output.roleStack!(), ...stackInfo };
        } else if (stackType === 'mixed') {
          return { alertText: output.mixedStack!(), ...stackInfo };
        }

        // 'unknown' catch-all
        return stackInfo;
      },
    },
    {
      id: 'AMR Gorai Seal of Scurrying Sparks 2',
      type: 'GainsEffect',
      netRegex: { effectId: ['E17', 'E18'], capture: false },
      condition: (data) => data.sparksCount === 2,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        return stackSpreadResponse(data, output, data.sparksCollect, 'E17', 'E18');
      },
    },
    {
      id: 'AMR Gorai Torching Torment',
      type: 'StartsUsing',
      netRegex: { id: '8532', source: 'Gorai the Uncaged' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMR Gorai Impure Purgation First Hit',
      type: 'StartsUsing',
      netRegex: { id: '852F', source: 'Gorai the Uncaged', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Protean',
          de: 'Um den Boss verteilen',
          fr: 'Changement',
          ja: 'ボスを基準として散開',
          cn: '和队友分散路径',
          ko: '산개',
        },
      },
    },
    {
      id: 'AMR Gorai Impure Purgation Second Hit',
      type: 'StartsUsing',
      netRegex: { id: '8531', source: 'Gorai the Uncaged', capture: false },
      suppressSeconds: 5,
      response: Responses.moveAway(),
    },
    {
      id: 'AMR Gorai Humble Hammer',
      type: 'StartsUsing',
      netRegex: { id: '8525', source: 'Gorai the Uncaged' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Shrink Lone Orb',
        },
      },
    },
    {
      id: 'AMR Gorai Flintlock',
      type: 'Ability',
      // Trigger this on Humble Hammer damage
      netRegex: { id: '8525', source: 'Gorai the Uncaged', capture: false },
      // This cleaves and should hit the orb and the player.
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Line Stack',
          de: 'Sammeln in einer Linie',
          fr: 'Packez-vous en ligne',
          ja: '頭割り',
          cn: '直线分摊',
          ko: '직선 쉐어',
        },
      },
    },
    {
      id: 'AMR Gorai Rousing Reincarnation Collect',
      type: 'GainsEffect',
      netRegex: { effectId: ['E0D', 'E0E', 'E0F', 'E10', 'E11', 'E12', 'E13', 'E14'] },
      condition: (data) => data.rousingTowerCount === 0,
      run: (data, matches) => {
        // Odder Incarnation = blue towers
        // Rodential Rebirth = orange towers
        // durations: I = 20s, II = 26s, III = 32s, IV = 38s
        const id = matches.effectId;
        if (id === 'E11')
          data.rousingCollect[0].blue = matches.target;
        else if (id === 'E0D')
          data.rousingCollect[0].orange = matches.target;
        else if (id === 'E12')
          data.rousingCollect[1].blue = matches.target;
        else if (id === 'E0E')
          data.rousingCollect[1].orange = matches.target;
        else if (id === 'E13')
          data.rousingCollect[2].blue = matches.target;
        else if (id === 'E0F')
          data.rousingCollect[2].orange = matches.target;
        else if (id === 'E14')
          data.rousingCollect[3].blue = matches.target;
        else if (id === 'E10')
          data.rousingCollect[3].orange = matches.target;
      },
    },
    {
      id: 'AMR Gorai Rousing Reincarnation First Tower',
      type: 'StartsUsing',
      // Malformed Prayer cast
      netRegex: { id: '8518', source: 'Gorai the Uncaged', capture: false },
      durationSeconds: 15,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        return towerResponse(data, output);
      },
    },
    {
      id: 'AMR Gorai Rousing Reincarnation Other Towers',
      type: 'Ability',
      // Technically 851F Pointed Purgation protean happens ~0.2s beforehand,
      // but wait on the tower burst to call things out.
      // 851B = Burst (blue tower)
      // 8519 = Burst (orange tower)
      // 851C = Dramatic Burst (missed tower)
      netRegex: { id: '851B', source: 'Gorai the Uncaged', capture: false },
      durationSeconds: 4,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        return towerResponse(data, output);
      },
    },
    {
      id: 'AMR Gorai Fighting Spirits',
      type: 'StartsUsing',
      netRegex: { id: '852B', source: 'Gorai the Uncaged', capture: false },
      // this is also a light aoe but knockback is more important
      response: Responses.knockback('info'),
    },
    {
      id: 'AMR Gorai Fighting Spirits Limit Cut',
      type: 'HeadMarker',
      netRegex: { id: limitCutIds },
      condition: Conditions.targetIsYou(),
      durationSeconds: 6,
      alertText: (_data, matches, output) => {
        if (matches.id === headmarkers.limitCut1)
          return output.num1!();
        if (matches.id === headmarkers.limitCut2)
          return output.num2!();
        if (matches.id === headmarkers.limitCut3)
          return output.num3!();
        if (matches.id === headmarkers.limitCut4)
          return output.num4!();
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
      },
    },
    {
      id: 'AMR Gorai Malformed Reincarnation Collect',
      type: 'GainsEffect',
      // E0D = Rodential Rebirth 1 (first orange tower)
      // E0E = Rodential Rebirth 2 (second orange tower)
      // E0F = Rodential Rebirth 3 (third orange tower)
      // E10 = Rodential Rebirth 4 (fourth orange tower)
      // E11 = Odder Incarnation 1 (first blue tower)
      // E12 = Odder Incarnation 2 (second blue tower)
      // E13 = Odder Incarnation 3 (third blue tower)
      // E14 = Odder Incarnation 4 (fourth blue tower)
      // E15 = Squirrelly Prayer (place orange tower)
      // E16 = Odder Prayer (place blue tower)
      netRegex: { effectId: ['E0D', 'E0E', 'E0F', 'E11', 'E12', 'E13'] },
      condition: (data) => data.rousingTowerCount !== 0,
      run: (data, matches) => data.malformedCollect.push(matches),
    },
    {
      id: 'AMR Gorai Malformed Reincarnation',
      type: 'GainsEffect',
      netRegex: { effectId: ['E0D', 'E0E', 'E0F', 'E11', 'E12', 'E13'], capture: false },
      condition: (data) => data.rousingTowerCount !== 0,
      delaySeconds: 0.5,
      durationSeconds: 10,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        let playerCount = 0;
        let mixedCount = 0;
        const firstColor: { [name: string]: 'blue' | 'orange' } = {};

        for (const line of data.malformedCollect) {
          const isOrange = line.effectId === 'E0D' || line.effectId === 'E0E' ||
            line.effectId === 'E0F';
          const color = isOrange ? 'orange' : 'blue';
          const lastColor = firstColor[line.target];
          if (lastColor === undefined) {
            playerCount++;
            firstColor[line.target] = color;
            continue;
          }
          if (lastColor === color)
            continue;
          mixedCount++;
        }

        const myColor = firstColor[data.me];
        if (myColor === undefined)
          return;

        // Try to handle dead players who don't have debuffs here.
        const isAllMixed = playerCount === mixedCount;
        if (!isAllMixed) {
          if (myColor === 'orange')
            return output.halfMixedOrangeSide!();
          return output.halfMixedBlueSide!();
        }

        let partner = output.unknown!();
        for (const [name, color] of Object.entries(firstColor)) {
          if (name !== data.me && color === myColor) {
            partner = data.ShortName(name);
            break;
          }
        }

        // If your first tower is orange you're placing blue in "all mixed".
        if (myColor === 'orange')
          return output.allMixedPlaceBlue!({ player: partner });
        return output.allMixedPlaceOrange!({ player: partner });
      },
      outputStrings: {
        // TODO: This is somewhat ambiguous, as you don't want to place blue *with* this player
        // you want to flex for them.
        // TODO: I don't know if this is correct or even what other people do
        // (please don't tell me).
        allMixedPlaceBlue: {
          en: 'All Mixed: Place Blue (w/${player})',
        },
        allMixedPlaceOrange: {
          en: 'All Mixed: Place Orange (w/${player})',
        },
        halfMixedOrangeSide: {
          en: 'Half Mixed: Orange Side',
        },
        halfMixedBlueSide: {
          en: 'Half Mixed: Blue Side',
        },
        unknown: Outputs.unknown,
      },
    },
    {
      id: 'AMR Gorai Malformed Tower Calls',
      type: 'GainsEffect',
      netRegex: { effectId: ['E0D', 'E0E', 'E0F', 'E11', 'E12', 'E13'] },
      condition: (data, matches) => data.rousingTowerCount !== 0 && data.me === matches.target,
      // Only two seconds between towers.
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 2,
      alertText: (_data, matches, output) => {
        if (matches.effectId === 'E0D')
          return output.orangeTower1!();
        if (matches.effectId === 'E0E')
          return output.orangeTower2!();
        if (matches.effectId === 'E0F')
          return output.orangeTower3!();
        if (matches.effectId === 'E11')
          return output.blueTower1!();
        if (matches.effectId === 'E12')
          return output.blueTower2!();
        if (matches.effectId === 'E13')
          return output.blueTower3!();
      },
      outputStrings: {
        blueTower1: {
          en: 'Inside Blue Tower 1',
        },
        orangeTower1: {
          en: 'Inside Orange Tower 1',
        },
        blueTower2: {
          en: 'Corner Blue Tower 2',
        },
        orangeTower2: {
          en: 'Corner Orange Tower 2',
        },
        blueTower3: {
          en: 'Placed Blue Tower 3',
        },
        orangeTower3: {
          en: 'Placed Orange Tower 3',
        },
      },
    },
    // ---------------- Moko the Restless ----------------
    {
      id: 'AMR Moko Kenki Release',
      type: 'StartsUsing',
      netRegex: { id: '85E0', source: 'Moko the Restless', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AMR Moko Triple Kasumi-giri Collect',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap) },
      run: (data, matches) => {
        const thisAbility = looseMokoVfxMap[matches.count];
        if (thisAbility === undefined)
          return;
        data.tripleKasumiCollect.push(thisAbility);
      },
    },
    {
      id: 'AMR Moko Triple Kasumi-giri 1',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap), capture: false },
      condition: (data) => data.tripleKasumiCollect.length === 1,
      durationSeconds: 10,
      alertText: (data, _matches, output) => {
        const [ability] = data.tripleKasumiCollect;
        if (ability === undefined)
          return;
        return output[`${ability}First`]!();
      },
      outputStrings: tripleKasumiFirstOutputStrings,
    },
    {
      id: 'AMR Moko Triple Kasumi-giri 2',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap), capture: false },
      condition: (data) => data.tripleKasumiCollect.length === 2,
      infoText: (data, _matches, output) => {
        const ability = data.tripleKasumiCollect[1];
        if (ability === undefined)
          return;
        const text = output[ability]!();
        return output.text!({ text: text });
      },
      outputStrings: {
        text: {
          en: '(${text})',
        },
        ...tripleKasumiFollowupOutputStrings,
      },
    },
    {
      id: 'AMR Moko Triple Kasumi-giri 3',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(mokoVfxMap), capture: false },
      condition: (data) => data.tripleKasumiCollect.length === 3,
      durationSeconds: 10,
      infoText: (data, _matches, output) => {
        const [ability1, ability2, ability3] = data.tripleKasumiCollect;
        if (ability1 === undefined || ability2 === undefined || ability3 === undefined)
          return;
        const text1 = output[`${ability1}First`]!();
        const text2 = output[ability2]!();
        const text3 = output[ability3]!();

        return output.text!({ text1: text1, text2: text2, text3: text3 });
      },
      outputStrings: {
        text: {
          en: '${text1} => ${text2} => ${text3}',
        },
        ...tripleKasumiFirstOutputStrings,
        ...tripleKasumiFollowupOutputStrings,
      },
    },
    {
      id: 'AMR Moko Triple Kasumi-giri Followup',
      type: 'Ability',
      netRegex: { id: tripleKasumiAbilityIds, source: 'Moko the Restless', capture: false },
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        // First one has already been called, so ignore it.
        if (data.tripleKasumiCollect.length === 3)
          data.tripleKasumiCollect.shift();
        const ability = data.tripleKasumiCollect.shift();
        if (ability === undefined)
          return;
        return output[ability]!();
      },
      outputStrings: tripleKasumiFollowupOutputStrings,
    },
    {
      id: 'AMR Moko Lateral Slice',
      type: 'StartsUsing',
      netRegex: { id: '85E3', source: 'Moko the Restless' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMR Moko Scarlet Auspice',
      type: 'StartsUsing',
      netRegex: { id: '85D1', source: 'Moko the Restless', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Out => Stay Out',
        },
      },
    },
    {
      id: 'AMR Moko Azure Auspice',
      type: 'StartsUsing',
      netRegex: { id: '85D4', source: 'Moko the Restless', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Under => Get Out',
        },
      },
    },
    {
      id: 'AMR Moko Azure Auspice Followup',
      type: 'Ability',
      netRegex: { id: '85D4', source: 'Moko the Restless', capture: false },
      suppressSeconds: 1,
      response: Responses.getOut('info'),
    },
    {
      id: 'AMR Moko Invocation Collect',
      type: 'GainsEffect',
      // E1A = Vengeful Flame (spread)
      // E1B = Vengeful Pyre (stack)
      netRegex: { effectId: ['E1A', 'E1B'] },
      run: (data, matches) => data.invocationCollect.push(matches),
    },
    {
      id: 'AMR Moko Invocation of Vengeance',
      type: 'GainsEffect',
      netRegex: { effectId: ['E1A', 'E1B'], capture: false },
      delaySeconds: 0.5,
      suppressSeconds: 999999,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        // TODO: maybe drop the "stack people here" and add a longer duration?
        // TODO: or include the location?
        return stackSpreadResponse(data, output, data.invocationCollect, 'E1B', 'E1A');
      },
    },
    {
      id: 'AMR Moko Iai-giri Cleanup',
      type: 'StartsUsing',
      // 85C2 = Fleeting Iai-giri (from Moko the Restless)
      // 85C8 = Double Iai-giri (from Moko's Shadow)
      netRegex: { id: ['85C2', '85C8'], capture: false },
      // Clean up once so we can collect casts.
      suppressSeconds: 5,
      run: (data) => {
        data.iaigiriTether = [];
        data.iaigiriPurple = [];
        data.iaigiriCasts = [];
        delete data.myAccursedEdge;
        delete data.myIaigiriTether;
      },
    },
    {
      id: 'AMR Moko Iai-giri Tether Collect',
      type: 'Tether',
      netRegex: { id: '0011' },
      run: (data, matches) => {
        data.iaigiriTether.push(matches);
        if (matches.target === data.me)
          data.myIaigiriTether = matches;
      },
    },
    {
      id: 'AMR Moko Iai-giri Purple Marker Collect',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(shadowVfxMap) },
      run: (data, matches) => data.iaigiriPurple.push(matches),
    },
    {
      id: 'AMR Moko Iai-giri Double Iai-giri Collect',
      type: 'StartsUsing',
      netRegex: { id: '85C8', source: 'Moko\'s Shadow' },
      run: (data, matches) => data.iaigiriCasts.push(matches),
    },
    {
      id: 'AMR Moko Iai-giri Accursed Edge Collect',
      type: 'Ability',
      netRegex: { id: '85DA' },
      condition: Conditions.targetIsYou(),
      // You could (but shouldn't) be hit by multiple of these, so just take the last.
      run: (data, matches) => data.myAccursedEdge = matches,
    },
    {
      id: 'AMR Moko Fleeting Iai-giri',
      type: 'Tether',
      netRegex: { id: '0011', capture: false },
      delaySeconds: 0.5,
      durationSeconds: 6,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          backOnYou: {
            en: 'Back Tether on YOU',
          },
          leftOnYou: {
            en: 'Left Tether on YOU',
          },
          frontOnYou: {
            en: 'Front Tether on YOU',
          },
          rightOnYou: {
            en: 'Right Tether on YOU',
          },
          backOnPlayer: {
            en: 'Back Tether on ${player}',
          },
          leftOnPlayer: {
            en: 'Left Tether on ${player}',
          },
          frontOnPlayer: {
            en: 'Front Tether on ${player}',
          },
          rightOnPlayer: {
            en: 'Right Tether on ${player}',
          },
        };

        if (data.iaigiriTether.length !== 1 || data.iaigiriPurple.length !== 1)
          return;

        const [tether] = data.iaigiriTether;
        const [marker] = data.iaigiriPurple;
        if (tether === undefined || marker === undefined)
          return;

        const thisAbility = looseShadowVfxMap[marker.count];
        if (thisAbility === undefined)
          return;

        const player = tether.target;
        if (player === data.me) {
          const outputKey = `${thisAbility}OnYou`;
          return { alarmText: output[outputKey]!() };
        }

        const outputKey = `${thisAbility}OnPlayer`;
        return { infoText: output[outputKey]!({ player: data.ShortName(player) }) };
      },
    },
    {
      id: 'AMR Moko Moonless Night',
      type: 'StartsUsing',
      netRegex: { id: '85DE', source: 'Moko the Restless', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AMR Moko Shadow Kasumi-giri Initial',
      type: 'Tether',
      netRegex: { id: '0011', capture: false },
      condition: (data) => !data.seenSoldiersOfDeath,
      delaySeconds: 0.5,
      durationSeconds: 4,
      suppressSeconds: 1,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          backOnYou: {
            en: 'Back Tether (w/${player})',
          },
          leftOnYou: {
            en: 'Left Tether (w/${player})',
          },
          frontOnYou: {
            en: 'Front Tether (w/${player})',
          },
          rightOnYou: {
            en: 'Right Tether (w/${player})',
          },
          unmarkedWithPlayer: {
            en: 'Unmarked (w/${player})',
          },
          unknown: Outputs.unknown,
        };

        if (data.iaigiriTether.length !== 2 || data.iaigiriPurple.length !== 2)
          return;

        const [tether1, tether2] = data.iaigiriTether;
        const [marker1, marker2] = data.iaigiriPurple;
        if (
          tether1 === undefined || tether2 === undefined || marker1 === undefined ||
          marker2 === undefined
        )
          return;

        const player1 = tether1.target;
        const player2 = tether2.target;

        // Technically if folks are dead you could have both, and this will say "with you" but the pull
        // will not last much longer, so don't worry about this too much.
        if (data.myIaigiriTether === undefined) {
          const remainingPlayer = data.party.partyNames.find((x) => {
            return x !== data.me && x !== player1 && x !== player2;
          }) ?? output.unknown!();

          return {
            alertText: output.unmarkedWithPlayer!({ player: data.ShortName(remainingPlayer) }),
          };
        }

        const otherPlayer = data.me === player1 ? player2 : player1;
        const myMarker = marker1.sourceId === data.myIaigiriTether.sourceId ? marker1 : marker2;

        const thisAbility = looseShadowVfxMap[myMarker.count];
        if (thisAbility === undefined)
          return;

        const outputKey = `${thisAbility}OnYou`;
        return { alarmText: output[outputKey]!({ player: data.ShortName(otherPlayer) }) };
      },
    },
    {
      id: 'AMR Moko Near Far Edge',
      type: 'StartsUsing',
      // 85D8 = Far Edge
      // 85D9 = Near Edge
      netRegex: { id: ['85D8', '85D9'], source: 'Moko the Restless' },
      alertText: (data, matches, output) => {
        // TODO: include hands
        const isFarEdge = matches.id === '85D8';
        if (data.myIaigiriTether === undefined)
          return isFarEdge ? output.baitFar!() : output.baitNear!();

        // TODO: should we remind people of "back tether" etc?
        return isFarEdge ? output.tetherNear!() : output.tetherFar!();
      },
      outputStrings: {
        baitNear: {
          en: 'Bait Near (Tether Far)',
        },
        baitFar: {
          en: 'Bait Far (Tether Near)',
        },
        tetherNear: {
          en: 'Tether Near (Bait Far)',
        },
        tetherFar: {
          en: 'Tether Far (Bait Near)',
        },
      },
    },
    {
      id: 'AMR Moko Shadow Kasumi-giri Second Mark',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', count: Object.keys(shadowVfxMap) },
      condition: (data, matches) => {
        const initialMarks = data.seenSoldiersOfDeath ? 4 : 2;

        // Ignore the first set of marks, which get called with the tether.
        if (data.iaigiriPurple.length <= initialMarks)
          return false;

        // Special case: for the first two Double-Iaigiris before Soldiers of Death,
        // if this is the 4th mark (i.e. the 2nd in the 2nd set) and they are both the same,
        // then we can call that mark for everyone because it doesn't matter where they are.
        const third = data.iaigiriPurple[2]?.count;
        const fourth = data.iaigiriPurple[3]?.count;
        if (third === fourth && third !== undefined && !data.seenSoldiersOfDeath)
          return true;

        // See if the current player is attached to a tether that
        // is attached to the mob gaining this effect.
        // Since we aren't sure where the baiters are we can't really tell them anything.
        return data.myIaigiriTether?.sourceId === matches.targetId;
      },
      // Don't collide with Near Far Edge, which is more important.
      delaySeconds: (data) => data.seenSoldiersOfDeath ? 0 : 3,
      durationSeconds: 5,
      suppressSeconds: 5,
      infoText: (data, matches, output) => {
        const third = data.iaigiriPurple[2]?.count;
        const fourth = data.iaigiriPurple[3]?.count;
        if (third === fourth && third !== undefined && !data.seenSoldiersOfDeath) {
          const thisAbility = looseShadowVfxMap[third];
          if (thisAbility === undefined)
            return;
          return output[thisAbility]!();
        }

        const thisAbility = looseShadowVfxMap[matches.count];
        if (thisAbility === undefined)
          return;
        return output[thisAbility]!();
      },
      outputStrings: {
        // This is probably not possible.
        back: {
          en: '(then stay)',
        },
        left: {
          en: '(then left)',
        },
        front: {
          en: '(then through)',
        },
        right: {
          en: '(then right)',
        },
      },
    },
    {
      id: 'AMR Moko Shadow Kasumi-giri Back Tether',
      type: 'Ability',
      netRegex: { id: '85C9', source: 'Moko\'s Shadow' },
      condition: (data, matches) => data.myIaigiriTether?.sourceId === matches.sourceId,
      // Maybe you have two tethers, although it probably won't go well.
      suppressSeconds: 1,
      alertText: (_data, _matches, output) => output.back!(),
      outputStrings: {
        // This is a reminder to make sure to move after the clone jumps to you.
        back: Outputs.back,
      },
    },
    {
      id: 'AMR Moko Shadow Kasumi-giri Followup',
      type: 'Ability',
      netRegex: { id: shadowKasumiAbilityIds, source: 'Moko\'s Shadow' },
      condition: (data, matches) => {
        // Reject anybody not tethered by this add or on the same side.
        if (data.myIaigiriTether === undefined) {
          const myYStr = data.myAccursedEdge?.targetY;
          if (myYStr === undefined)
            return false;

          const thisY = parseFloat(matches.y);
          const myY = parseFloat(myYStr);
          if (myY < mokoCenterY && thisY > mokoCenterY || myY > mokoCenterY && thisY < mokoCenterY)
            return false;
        } else if (matches.sourceId !== data.myIaigiriTether.sourceId) {
          return false;
        }

        return true;
      },
      suppressSeconds: 1,
      alertText: (data, matches, output) => {
        // Find the second marker for this add.
        const marker = [...data.iaigiriPurple].reverse().find((x) => {
          return x.targetId === matches.sourceId;
        });
        if (marker === undefined)
          return;

        const thisAbility = looseShadowVfxMap[marker.count];
        if (thisAbility === undefined)
          return;
        return output[thisAbility]!();
      },
      outputStrings: {
        // This probably can't happen.
        back: {
          en: 'Stay',
        },
        left: Outputs.left,
        front: {
          en: 'Through',
        },
        right: Outputs.right,
      },
    },
    {
      id: 'AMR Moko Soldiers of Death',
      type: 'StartsUsing',
      netRegex: { id: '8593', source: 'Moko the Restless', capture: false },
      run: (data, _matches) => data.seenSoldiersOfDeath = true,
    },
    {
      id: 'AMR Moko Soldiers of Death Blue Add',
      type: 'GainsEffect',
      // The red soldiers get 1E8 effects, and the blue add gets 5E.
      // TODO: unfortunately there's no information about where casts are being targeted
      // and so there's no way to know the final safe spot, only which half.
      netRegex: { effectId: '808', count: '5E' },
      promise: async (data, matches) => {
        data.combatantData = [];
        data.combatantData = (await callOverlayHandler({
          call: 'getCombatants',
          ids: [parseInt(matches.targetId, 16)],
        })).combatants;
      },
      alertText: (data, _matches, output) => {
        const [combatant] = data.combatantData;
        if (combatant === undefined || data.combatantData.length !== 1)
          return;

        const x = combatant.PosX - mokoCenterX;
        const y = combatant.PosY - mokoCenterY;

        // This add is off the edge (far) and then along that edge (less far).
        // We need to look at the "less far" direction and go opposite.
        if (Math.abs(x) > Math.abs(y))
          return y < 0 ? output.south!() : output.north!();
        return x < 0 ? output.east!() : output.west!();
      },
      outputStrings: {
        north: Outputs.north,
        east: Outputs.east,
        south: Outputs.south,
        west: Outputs.west,
      },
    },
    {
      id: 'AMR Moko Shadow Kasumi-giri Final Tether',
      type: 'Tether',
      netRegex: { id: '0011', capture: false },
      condition: (data) => data.seenSoldiersOfDeath,
      delaySeconds: 0.5,
      durationSeconds: 7,
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const myIaigiriTether = data.myIaigiriTether;
        if (myIaigiriTether === undefined)
          return;

        const idToDir: { [id: string]: number } = {};
        for (const m of data.iaigiriCasts) {
          const dir = Directions.xyTo4DirNum(
            parseFloat(m.x),
            parseFloat(m.y),
            mokoCenterX,
            mokoCenterY,
          );
          idToDir[m.sourceId] = dir;
        }

        const myDir = idToDir[myIaigiriTether.sourceId];
        if (myDir === undefined)
          return;

        const partnerTether = data.iaigiriTether.find((x) => {
          if (x.sourceId === myIaigiriTether.sourceId)
            return false;
          const dir = idToDir[x.sourceId];
          if (dir === undefined)
            return false;
          return (myDir + 2) % 4 === dir;
        });

        const partner = partnerTether === undefined
          ? output.unknown!()
          : data.ShortName(partnerTether.target);

        if (myDir === 0)
          return output.north!({ player: partner });
        if (myDir === 1)
          return output.east!({ player: partner });
        if (myDir === 2)
          return output.south!({ player: partner });
        if (myDir === 3)
          return output.west!({ player: partner });
      },
      outputStrings: {
        north: {
          en: 'North Add (w/${player})',
        },
        east: {
          en: 'East Add (w/${player})',
        },
        south: {
          en: 'South Add (w/${player})',
        },
        west: {
          en: 'West Add (w/${player})',
        },
        unknown: Outputs.unknown,
      },
    },
  ],
  timelineReplace: [
    {
      locale: 'en',
      replaceText: {
        'Unnatural Ailment/Unnatural Force': 'Unnatural Ailment/Force',
        'Unnatural Force/Unnatural Ailment': 'Unnatural Force/Ailment',
        'Eye of the Thunder Vortex/Vortex of the Thunder Eye': 'Thunder Eye/Vortex',
        'Vortex of the Thunder Eye/Eye of the Thunder Vortex': 'Thunder Vortex/Eye',
        'Greater Ball of Fire/Great Ball of Fire': 'Great/Greater Ball of Fire',
        'Great Ball of Fire/Greater Ball of Fire': 'Greater/Great Ball of Fire',
        'Vengeful Flame/Vengeful Pyre': 'Vengeful Flame/Pyre',
        'Near Edge/Far Edge': 'Near/Far Edge',
        'Far Edge/Near Edge': 'Far/Near Edge',
      },
    },
  ],
};

export default triggerSet;
