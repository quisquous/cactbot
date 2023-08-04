import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { callOverlayHandler } from '../../../../../resources/overlay_plugin_api';
import PartyTracker from '../../../../../resources/party';
import { Responses } from '../../../../../resources/responses';
import Util, { Directions } from '../../../../../resources/util';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { PluginCombatantState } from '../../../../../types/event';
import { Role } from '../../../../../types/job';
import { NetMatches } from '../../../../../types/net_matches';
import { Output, ResponseOutput, TriggerSet } from '../../../../../types/trigger';

const headmarkers = {
  // vfx/lockon/eff/sph_lockon2_num01_s8p.avfx (through sph_lockon2_num04_s8p)
  limitCut1: '0150',
  limitCut2: '0151',
  limitCut3: '0152',
  limitCut4: '0153',
} as const;
const limitCutIds: readonly string[] = Object.values(headmarkers);

type OdderTower = {
  blue?: string;
  orange?: string;
};

type MalformedInfo = {
  d1?: boolean;
  d3?: boolean;
};

const kasumiGiriMap: { [count: string]: number } = {
  '24C': 0,
  '24D': 90,
  '24E': 180,
  '24F': 270,
  '250': 0,
  '251': 90,
  '252': 180,
  '253': 270,
} as const;
const kasumiGiriMapCounts: readonly string[] = Object.keys(kasumiGiriMap);

type KasumiGiriInfo = {
  mark: string;
  outside: boolean;
};

type ShadowGiriInfo = {
  id: string;
  cnt: string;
  mesg: string;
};

export interface Data extends RaidbossData {
  combatantData: PluginCombatantState[];
  wailingCollect: NetMatches['GainsEffect'][];
  wailCount: number;
  sparksCollect: NetMatches['GainsEffect'][];
  sparksCount: number;
  reincarnationCollect: [OdderTower, OdderTower, OdderTower, OdderTower];
  towerCount: number;
  devilishThrallCollect: NetMatches['StartsUsing'][];
  stackFirst?: boolean;
  partner?: string;
  stormClouds: number;
  smokeater: number;
  devilishCount: number;
  malformed: { [name: string]: MalformedInfo };
  vengefulCollect: NetMatches['GainsEffect'][];
  tetherCollect: string[];
  tetherFrom?: string;
  haveTether?: boolean;
  kasumiCount: number;
  kasumiAngle: number;
  kasumiGiri: KasumiGiriInfo[];
  shadowTether: number;
  shadowGiri: ShadowGiriInfo[];
}

const findPlayerByRole = (role: Role, data: Data): string => {
  const collect = role === 'tank'
    ? data.party.tankNames
    : role === 'healer'
    ? data.party.healerNames
    : data.party.dpsNames;
  const [target] = collect.filter((x) => x !== data.me);
  return target === undefined ? 'unknown' : target;
};
const findDpsWithPrior = (prior: boolean, party: PartyTracker): string => {
  const [target1, target2] = party.dpsNames;
  const [job1, job2] = party.dpsNames.map((x) => party.jobName(x));
  if (target1 === undefined || target2 === undefined || job1 === undefined || job2 === undefined)
    return 'unknown';
  if (prior) {
    if (Util.isMeleeDpsJob(job1)) {
      if (Util.isMeleeDpsJob(job2))
        return job1 > job2 ? target1 : target2;
      return target1;
    }
    if (Util.isRangedDpsJob(job1)) {
      if (Util.isMeleeDpsJob(job2))
        return target2;
      if (Util.isRangedDpsJob(job2))
        return job1 > job2 ? target1 : target2;
      return target1;
    }
    if (Util.isCasterDpsJob(job1)) {
      if (Util.isMeleeDpsJob(job2) || Util.isRangedDpsJob(job2))
        return target2;
      if (Util.isCasterDpsJob(job2))
        return job1 > job2 ? target1 : target2;
    }
    return 'unknown';
  }
  if (Util.isMeleeDpsJob(job1)) {
    if (Util.isMeleeDpsJob(job2))
      return job1 > job2 ? target2 : target1;
    return target2;
  }
  if (Util.isRangedDpsJob(job1)) {
    if (Util.isMeleeDpsJob(job2))
      return target1;
    if (Util.isRangedDpsJob(job2))
      return job1 > job2 ? target2 : target1;
    return target2;
  }
  if (Util.isCasterDpsJob(job1)) {
    if (Util.isMeleeDpsJob(job2) || Util.isRangedDpsJob(job2))
      return target1;
    if (Util.isCasterDpsJob(job2))
      return job1 > job2 ? target2 : target1;
  }
  return 'unknown';
};
const findStackPartner = (data: Data, stack1: string, stack2: string): string | undefined => {
  const stacks = [stack1, stack2];
  const nomarks = data.party.partyNames.filter((x) => !stacks.includes(x));
  if (nomarks.length !== 2 || data.party.partyNames.length !== 4)
    return;

  const index = stack1 === data.me ? 0 : stack2 === data.me ? 1 : -1;
  let same;
  if (index < 0) {
    // I'm not target
    const [notme] = nomarks.filter((x) => x !== data.me);
    same = notme;
  } else {
    // I'm in target
    same = index === 0 ? stack2 : stack1;
  }
  if (same === undefined)
    return;

  // Find partner. How can I do for BLU?
  if (data.role === 'tank') {
    if (data.party.isHealer(same))
      return findDpsWithPrior(true, data.party);
    return findPlayerByRole('healer', data);
  } else if (data.role === 'healer') {
    if (data.party.isTank(same))
      return findDpsWithPrior(false, data.party);
    return findPlayerByRole('tank', data);
  }
  if (data.party.isTank(same) || data.party.isHealer(same))
    return findPlayerByRole('dps', data);
  const prior = findDpsWithPrior(true, data.party);
  if (prior === data.me)
    return findPlayerByRole('tank', data);
  return findPlayerByRole('healer', data);
};
const buildStackPartner = (
  data: Data,
  collect: NetMatches['GainsEffect'][],
  stackId: string,
  spreadId: string,
) => {
  const [stack1, stack2] = collect.filter((x) => x.effectId === stackId);
  const spread = collect.find((x) => x.effectId === spreadId);
  if (stack1 === undefined || stack2 === undefined || spread === undefined)
    return;
  const stackTime = parseFloat(stack1.duration);
  const spreadTime = parseFloat(spread.duration);
  data.stackFirst = stackTime < spreadTime;
  data.partner = findStackPartner(data, stack1.target, stack2.target);
};

const towerResponse = (
  data: Data,
  output: Output,
): ResponseOutput<Data, NetMatches['None']> => {
  // cactbot-builtin-response
  output.responseOutputStrings = {
    tetherThenBlueTower: {
      en: 'Tether ${num1} => Blue Tower ${num2}',
      ja: '線取り#${num1} => 青塔へ#${num2}',
      ko: '줄채고#${num1} => 파랑 타워로#${num2}',
    },
    tetherThenOrangeTower: {
      en: 'Tether ${num1} => Orange Tower ${num2}',
      ja: '線取り#${num1} => 赤塔へ#${num2}',
      ko: '줄채고#${num1} => 빨강 타워로#${num2}',
    },
    tether: {
      en: 'Tether ${num}',
      ja: '線取り#${num}',
      ko: '줄채요#${num}',
    },
    blueTower: {
      en: 'Blue Tower ${num}',
      ja: '青塔へ#${num}',
      ko: '파랑 타워로#${num}',
    },
    orangeTower: {
      en: 'Orange Tower ${num}',
      ja: '赤塔へ#${num}',
      ko: '빨강 타워로#${num}',
    },
    num1: Outputs.num1,
    num2: Outputs.num2,
    num3: Outputs.num3,
    num4: Outputs.num4,
  };

  // data.towerCount is 0-indexed
  // towerNum for display is 1-indexed
  const theseTowers = data.reincarnationCollect[data.towerCount];
  const towerNum = data.towerCount + 1;
  data.towerCount++;

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
  const nextTowers = data.reincarnationCollect[towerNum + 1];
  const nextNumStr = numMap[towerNum + 1];
  if (towerNum === 4 || nextTowers === undefined || nextNumStr === undefined)
    return { alertText: output.tether!({ num: numStr }) };

  if (data.me === nextTowers.blue)
    return { alertText: output.tetherThenBlueTower!({ num1: numStr, num2: nextNumStr }) };
  if (data.me === nextTowers.orange)
    return { alertText: output.tetherThenOrangeTower!({ num1: numStr, num2: nextNumStr }) };

  // Just in case...
  return { alertText: output.tether!({ num: numStr }) };
};

const triggerSet: TriggerSet<Data> = {
  id: 'AnotherMountRokkonSavage',
  zoneId: ZoneId.AnotherMountRokkonSavage,
  timelineFile: 'another_mount_rokkon-savage.txt',
  initData: () => {
    return {
      combatantData: [],
      wailingCollect: [],
      wailCount: 0,
      sparksCollect: [],
      sparksCount: 0,
      reincarnationCollect: [{}, {}, {}, {}],
      towerCount: 0,
      devilishThrallCollect: [],
      stormClouds: 0,
      smokeater: 0,
      devilishCount: 0,
      malformed: {},
      vengefulCollect: [],
      tetherCollect: [],
      kasumiCount: 0,
      kasumiAngle: 0,
      kasumiGiri: [],
      shadowTether: 0,
      shadowGiri: [],
    };
  },
  triggers: [
    // ---------------- first trash ----------------
    {
      id: 'AMRS Shishu Raiko Disciples of Levin',
      type: 'StartsUsing',
      netRegex: { id: '8668', source: 'Shishu Raiko', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'AMRS Shishu Furutsubaki Bloody Caress',
      type: 'StartsUsing',
      netRegex: { id: '8669', source: 'Shishu Furutsubaki', capture: false },
      suppressSeconds: 5,
      response: Responses.getBehind('info'),
    },
    {
      id: 'AMRS Shishu Raiko Barreling Smash',
      type: 'StartsUsing',
      netRegex: { id: '8665', source: 'Shishu Raiko' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          chargeOnYou: {
            en: 'Charge on YOU',
            ja: '自分に突進',
            ko: '내게 돌진',
          },
          chargeOn: {
            en: 'Charge on ${player}',
            ja: '突進: ${player}',
            ko: '돌진: ${player}',
          },
        };

        if (matches.target === data.me)
          return { alarmText: output.chargeOnYou!() };
        return { alertText: output.chargeOn!({ player: data.ShortName(matches.target) }) };
      },
    },
    {
      id: 'AMRS Shishu Raiko Howl',
      type: 'StartsUsing',
      netRegex: { id: '8666', source: 'Shishu Raiko', capture: false },
      response: Responses.bleedAoe('info'),
    },
    {
      id: 'AMRS Shishu Raiko Master of Levin',
      type: 'StartsUsing',
      netRegex: { id: '8667', source: 'Shishu Raiko', capture: false },
      response: Responses.getUnder(),
    },
    {
      id: 'AMRS Shishu Fuko Scythe Tail',
      type: 'StartsUsing',
      netRegex: { id: '866C', source: 'Shishu Raiko', capture: false },
      response: Responses.getOut(),
    },
    {
      id: 'AMRS Shishu Fuko Twister',
      type: 'StartsUsing',
      netRegex: { id: '866A', source: 'Shishu Raiko' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'AMRS Shishu Fuko Crosswind',
      type: 'StartsUsing',
      netRegex: { id: '866B', source: 'Shishu Raiko', capture: false },
      response: Responses.knockback(),
    },
    {
      id: 'AMRS Shishu Yuki Right Swipe',
      type: 'StartsUsing',
      netRegex: { id: '8688', source: 'Shishu Yuki', capture: false },
      response: Responses.goLeft('info'),
    },
    {
      id: 'AMRS Shishu Yuki Left Swipe',
      type: 'StartsUsing',
      netRegex: { id: '8689', source: 'Shishu Yuki', capture: false },
      response: Responses.goRight('info'),
    },
    // ---------------- Shishio ----------------
    {
      id: 'AMRS Shishio Enkyo',
      type: 'StartsUsing',
      netRegex: { id: '8441', source: 'Shishio', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'AMRS Shishio Stormcloud Summons',
      type: 'StartsUsing',
      netRegex: { id: '841F', source: 'Shishio', capture: false },
      alertText: (data, _matches, output) => {
        data.stormClouds++;
        data.smokeater = 0;
        if (data.stormClouds === 2)
          return output.line1!();
        if (data.stormClouds === 4)
          return output.line2!();
      },
      outputStrings: {
        line1: {
          en: 'Dodge fast beams',
          ja: '速いビーム回避',
          ko: '빠른 빔 피해요!',
        },
        line2: {
          en: 'Dodge thick beams',
          ja: '太いビーム回避',
          ko: '굵은 빔 피해요!',
        },
      },
    },
    {
      id: 'AMRS Shishio Smokeater',
      type: 'Ability',
      netRegex: { id: ['8420', '8421'], source: 'Shishio', capture: false },
      run: (data) => data.smokeater++,
    },
    {
      id: 'AMRS Shishio Rokujo Revel',
      type: 'StartsUsing',
      netRegex: { id: '8423', source: 'Shishio', capture: false },
      durationSeconds: 7,
      infoText: (data, _matches, output) => output.text!({ num: data.smokeater }),
      outputStrings: {
        text: {
          en: 'Cloud: ${num}',
          ja: '曇: ${num}回',
          ko: '구름: ${num}번',
        },
      },
    },
    {
      id: 'AMRS Shishio Noble Pursuit',
      type: 'StartsUsing',
      netRegex: { id: '842E', source: 'Shishio', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Charge',
          ja: '突進: 安置確認',
          ko: '돌진: 안전한 곳 찾아요',
        },
      },
    },
    {
      id: 'AMRS Shishio Splitting Cry',
      type: 'StartsUsing',
      netRegex: { id: '8442', source: 'Shishio' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMRS Shishio Splitter',
      type: 'Ability',
      // This comes out ~4s after Splitting Cry.
      netRegex: { id: '8442', source: 'Shishio', capture: false },
      condition: (data) => data.role !== 'tank',
      suppressSeconds: 5,
      response: Responses.goFrontOrSides('info'),
    },
    {
      id: 'AMRS Shishio Unnatural Wail',
      type: 'StartsUsing',
      netRegex: { id: '843E', source: 'Shishio', capture: false },
      run: (data) => {
        data.wailCount++;
        data.wailingCollect = [];
        delete data.stackFirst;
        delete data.partner;
      },
    },
    {
      id: 'AMRS Shishio Wailing Collect',
      type: 'GainsEffect',
      // DEB = Scattered Wailing (spread)
      // DEC = Intensified Wailing (stack)
      netRegex: { effectId: ['DEB', 'DEC'], source: 'Shishio' },
      run: (data, matches) => data.wailingCollect.push(matches),
    },
    {
      id: 'AMRS Shishio Unnatural Wailing 1',
      type: 'GainsEffect',
      netRegex: { effectId: ['DEB', 'DEC'], source: 'Shishio', capture: false },
      condition: (data) => data.wailCount === 1,
      delaySeconds: 0.5,
      suppressSeconds: 999999,
      alertText: (data, _matches, output) => {
        buildStackPartner(data, data.wailingCollect, 'DEC', 'DEB');
        return data.stackFirst ? output.stack!() : output.spread!();
      },
      outputStrings: {
        stack: {
          en: 'Stack => Spread',
          ja: 'ペアから => 散会',
          ko: '뭉쳤다 => 흩어져요',
        },
        spread: {
          en: 'Spread => Stack',
          ja: '散会から => ペア',
          ko: '흩어졌다 => 뭉쳐요',
        },
      },
    },
    {
      id: 'AMRS Shishio Devilish Thrall Collect',
      type: 'StartsUsing',
      // 8432 = Right Swipe
      // 8433 = Left Swipe
      netRegex: { id: ['8432', '8433'], source: 'Devilish Thrall' },
      run: (data, matches) => data.devilishThrallCollect.push(matches),
    },
    {
      id: 'AMRS Shishio Devilish Thrall Safe Spot',
      type: 'StartsUsing',
      netRegex: { id: ['8432', '8433'], source: 'Devilish Thrall', capture: false },
      delaySeconds: 0.5,
      durationSeconds: 7,
      suppressSeconds: 1,
      promise: async (data: Data) => {
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

        // The one case where the difference is 6 instead of 2.
        const averagePos = (pos1 === 0 && pos2 === 6) ? 7 : Math.floor((pos2 + pos1) / 2);
        const args = {
          position: {
            0: output.north!(),
            1: output.northeast!(),
            2: output.east!(),
            3: output.southeast!(),
            4: output.south!(),
            5: output.southwest!(),
            6: output.west!(),
            7: output.northwest!(),
          }[averagePos],
          partner: data.ShortName(data.partner),
        };
        if (data.devilishCount === 0) {
          if (data.stackFirst)
            return output.stack!(args);
          return output.spread!(args);
        }
        if (data.stackFirst)
          return output.spread!(args);
        return output.stack!(args);
      },
      run: (data) => {
        data.devilishCount++;
        data.devilishThrallCollect = [];
      },
      outputStrings: {
        north: {
          en: 'North Diamond',
          ja: 'A',
          ko: 'A마름모',
        },
        east: {
          en: 'East Diamond',
          ja: 'B',
          ko: 'B마름모',
        },
        south: {
          en: 'South Diamond',
          ja: 'C',
          ko: 'C마름모',
        },
        west: {
          en: 'West Diamond',
          ja: 'D',
          ko: 'D마름모',
        },
        northeast: {
          en: 'Northeast Square',
          ja: '1',
          ko: '1사각',
        },
        southeast: {
          en: 'Southeast Square',
          ja: '2',
          ko: '2사각',
        },
        southwest: {
          en: 'Southwest Square',
          ja: '3',
          ko: '3사각',
        },
        northwest: {
          en: 'Northwest Square',
          ja: '4',
          ko: '4사각',
        },
        spread: {
          en: '${position} + Spread (w/${partner})',
          ja: '${position} 散会(${partner})',
          ko: '${position} 흩어져요(${partner})',
        },
        stack: {
          en: '${position} + Stack (w/${partner})',
          ja: '${position} ペア(${partner})',
          ko: '${position} 뭉쳐요(${partner})',
        },
      },
    },
    {
      id: 'AMRS Shishio Vortex of the Thunder Eye',
      type: 'StartsUsing',
      // 843A = Eye of the Thunder Vortex (out)
      // 843C = Vortex of the Thnder Eye (in)
      netRegex: { id: ['843A', '843C'], source: 'Shishio' },
      durationSeconds: 7,
      alertText: (data, matches, output) => {
        buildStackPartner(data, data.wailingCollect, 'DEC', 'DEB');
        const isInFirst = matches.id === '843C';
        const inOut = isInFirst ? output.in!() : output.out!();
        const outIn = isInFirst ? output.out!() : output.in!();
        const args = { inOut: inOut, outIn: outIn, partner: data.ShortName(data.partner) };
        if (data.stackFirst)
          return output.stack!(args);
        return output.spread!(args);
      },
      outputStrings: {
        out: Outputs.out,
        in: Outputs.in,
        stack: {
          en: '${inOut} Stack (w/${partner}) => ${outIn} Spread',
          ja: '${inOut}ペアから(${partner}) => ${outIn}散会',
          ko: '${inOut} 뭉쳤다(${partner}) => ${outIn} 흩어져요',
        },
        spread: {
          en: '${inOut} Spread => ${outIn} Stack (w/${partner})',
          ja: '${inOut}散会から => ${outIn}ペア(${partner})',
          ko: '${inOut} 흩어졌다 => ${outIn} 뭉쳐요(${partner})',
        },
      },
    },
    {
      id: 'AMRS Shishio Thunder Vortex',
      type: 'StartsUsing',
      netRegex: { id: '8439', source: 'Shishio', capture: false },
      response: Responses.getUnder(),
    },
    // ---------------- second trash ----------------
    {
      id: 'AMRS Shishu Kotengu Backward Blows',
      type: 'StartsUsing',
      netRegex: { id: '866E', source: 'Shishu Kotengu', capture: false },
      durationSeconds: 5.7,
      response: Responses.goSides(),
    },
    {
      id: 'AMRS Shishu Kotengu Leftward Blows',
      type: 'StartsUsing',
      netRegex: { id: '866F', source: 'Shishu Kotengu', capture: false },
      durationSeconds: 5.7,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Right + Behind',
          ja: '右 + 後ろ',
          ko: '오른쪽 + 뒤로',
        },
      },
    },
    {
      id: 'AMRS Shishu Kotengu Rightward Blows',
      type: 'StartsUsing',
      netRegex: { id: '8670', source: 'Shishu Kotengu', capture: false },
      durationSeconds: 5.7,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Left + Behind',
          ja: '左 + 後ろ',
          ko: '왼쪽 + 뒤로',
        },
      },
    },
    {
      id: 'AMRS Shishu Kotengu Wrath of the Tengu',
      type: 'StartsUsing',
      netRegex: { id: '8672', source: 'Shishu Kotengu', capture: false },
      response: Responses.bleedAoe('alert'),
    },
    {
      id: 'AMRS Shishu Kotengu Gaze of the Tengu',
      type: 'StartsUsing',
      netRegex: { id: '8673', source: 'Shishu Kotengu', capture: false },
      response: Responses.lookAway('alert'),
    },
    {
      id: 'AMRS Shishu Onmitsugashira Juji Shuriken',
      type: 'StartsUsing',
      netRegex: { id: '8676', source: 'Shishu Onmitsugashira', capture: false },
      response: Responses.getBehind(),
    },
    {
      id: 'AMRS Shishu Onmitsugashira Issen',
      type: 'StartsUsing',
      netRegex: { id: '8674', source: 'Shishu Onmitsugashira' },
      response: Responses.tankBuster(),
    },
    // ---------------- Gorai the Uncaged ----------------
    {
      id: 'AMRS Gorai Unenlightenment',
      type: 'StartsUsing',
      netRegex: { id: '8534', source: 'Gorai the Uncaged', capture: false },
      response: Responses.bleedAoe('info'),
      run: (data) => {
        delete data.stackFirst;
        delete data.partner;
      },
    },
    {
      id: 'AMRS Gorai Sparks Count',
      type: 'StartsUsing',
      netRegex: { id: '8503', source: 'Gorai the Uncaged', capture: false },
      run: (data) => {
        data.sparksCount++;
        data.sparksCollect = [];
      },
    },
    {
      id: 'AMRS Gorai Sparks Collect',
      type: 'GainsEffect',
      // E17 = Live Brazier (stack)
      // E18 = Live Candle (spread)
      netRegex: { effectId: ['E17', 'E18'] },
      run: (data, matches) => data.sparksCollect.push(matches),
    },
    {
      id: 'AMRS Gorai Seal of Scurrying Sparks 1&3',
      type: 'GainsEffect',
      netRegex: { effectId: ['E17', 'E18'], capture: false },
      condition: (data) => data.sparksCount % 2 === 1,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        const [stack1, stack2] = data.sparksCollect.filter((x) => x.effectId === 'E17');
        if (stack1 === undefined || stack2 === undefined)
          return;
        const partner = findStackPartner(data, stack1.target, stack2.target);
        if (partner === undefined) {
          if (data.role === 'tank')
            return output.stackHealer!();
          if (data.role === 'healer')
            return output.stackTank!();
          return output.stackDps!();
        }
        return output.stack!({ partner: data.ShortName(partner) });
      },
      outputStrings: {
        stack: {
          en: 'Stack (w/${partner})',
          ja: 'ペア(${partner})',
          ko: '뭉쳐요(${partner})',
        },
        stackTank: {
          en: 'Stack with Tank',
          ja: 'タンクとペア',
          ko: '탱크랑 뭉쳐요',
        },
        stackHealer: {
          en: 'Stack with Healer',
          ja: 'ヒーラーとペア',
          ko: '힐러랑 뭉쳐요',
        },
        stackDps: {
          en: 'Stack with DPS',
          ja: 'DPSとペア',
          ko: 'DPS랑 뭉쳐요',
        },
      },
    },
    {
      id: 'AMRS Gorai Brazen Ballad',
      type: 'StartsUsing',
      netRegex: { id: ['8509', '850A'], source: 'Gorai the Uncaged', capture: true },
      durationSeconds: 4,
      alertText: (_data, matches, output) => {
        if (matches.id === '850A')
          return output.blue!();
        return output.red!();
      },
      outputStrings: {
        blue: {
          en: 'Blue: Fake',
          ja: '青: 偽',
          ko: '파랑: 가짜',
        },
        red: {
          en: 'Red: True',
          ja: '赤: 本当',
          ko: '빨강: 진짜',
        },
      },
    },
    {
      id: 'AMRS Gorai Seal of Scurrying Sparks 2',
      type: 'GainsEffect',
      netRegex: { effectId: ['E17', 'E18'], capture: false },
      condition: (data) => data.sparksCount === 2,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        buildStackPartner(data, data.sparksCollect, 'E17', 'E18');
        if (data.stackFirst)
          return output.stack!({ partner: data.ShortName(data.partner) });
        return output.spread!({ partner: data.ShortName(data.partner) });
      },
      outputStrings: {
        stack: {
          en: 'Stack (w/${partner}) => Spread',
          ja: 'ペアから(${partner}) => 散会',
          ko: '뭉쳤다(${partner}) => 흩어져요',
        },
        spread: {
          en: 'Spread => Stack (w/${partner})',
          ja: '散会から => ペア(${partner})',
          ko: '흩어졌다 => 뭉쳐요(${partner})',
        },
      },
    },
    {
      id: 'AMRS Gorai Live Brazier Stack',
      type: 'GainsEffect',
      // E17 = Live Brazier (stack)
      netRegex: { effectId: 'E17' },
      delaySeconds: (data, matches) => {
        if (data.sparksCount === 1)
          return parseFloat(matches.duration) - 3;
        if (data.sparksCount === 2)
          return parseFloat(matches.duration);
        return 0;
      },
      durationSeconds: 3,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        if (data.sparksCount === 1)
          return output.explosion!();
        if (data.sparksCount === 2 && data.stackFirst)
          return output.spread!();
      },
      outputStrings: {
        explosion: {
          en: '(Spread soon)',
          ja: 'まもなくペアが爆発！',
          ko: '곧 뭉치기가 터져요!',
        },
        spread: {
          en: 'Spread',
          ja: '散会(エクサ回避)',
          ko: '흩어져요! (엑사 피하면서)',
        },
      },
    },
    {
      id: 'AMRS Gorai Live Candle Spread',
      type: 'GainsEffect',
      // E18 = Live Candle (spread)
      netRegex: { effectId: 'E18' },
      delaySeconds: (data, matches) => {
        if (data.sparksCount === 2)
          return parseFloat(matches.duration);
        return 0;
      },
      durationSeconds: 3,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        if (data.sparksCount === 2 && !data.stackFirst)
          return output.stack!();
      },
      outputStrings: {
        stack: {
          en: 'Stack',
          ja: 'ペア(エクサ回避)',
          ko: '뭉쳐요! (엑사 피하면서)',
        },
      },
    },
    {
      id: 'AMRS Gorai Torching Torment',
      type: 'StartsUsing',
      netRegex: { id: '8532', source: 'Gorai the Uncaged' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMRS Gorai Impure Purgation First Hit',
      type: 'StartsUsing',
      netRegex: { id: '852F', source: 'Gorai the Uncaged', capture: false },
      durationSeconds: 4,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Protean',
          de: 'Um den Boss verteilen',
          fr: 'Changement',
          ja: '基本散会',
          cn: '和队友分散路径',
          ko: '산개',
        },
      },
    },
    {
      id: 'AMRS Gorai Impure Purgation Second Hit',
      type: 'StartsUsing',
      netRegex: { id: '8553', source: 'Gorai the Uncaged', capture: false },
      durationSeconds: 3,
      suppressSeconds: 5,
      response: Responses.moveAway(),
    },
    {
      id: 'AMRS Gorai Humble Hammer',
      type: 'StartsUsing',
      netRegex: { id: '854B', source: 'Gorai the Uncaged' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Shrink Lone Orb',
          ja: '隅の雷玉へ',
          ko: '모서리 번개 구슬 몸통 박치기',
        },
      },
    },
    {
      id: 'AMRS Gorai Flintlock',
      type: 'Ability',
      // Trigger this on Humble Hammer damage
      netRegex: { id: '854B', source: 'Gorai the Uncaged', capture: false },
      condition: (data) => data.role === 'tank' || data.role === 'healer',
      // This cleaves and should hit the orb and the player.
      suppressSeconds: 5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Line Stack',
          de: 'Sammeln in einer Linie',
          fr: 'Packez-vous en ligne',
          ja: '直線ペア',
          cn: '直线分摊',
          ko: '직선 쉐어',
        },
      },
    },
    {
      id: 'AMRS Gorai Rousing Reincarnation',
      type: 'StartsUsing',
      netRegex: { id: '8512', source: 'Gorai the Uncaged', capture: false },
      response: Responses.getBehind('info'),
    },
    {
      id: 'AMRS Gorai Rousing Reincarnation Collect',
      type: 'GainsEffect',
      netRegex: { effectId: ['E0D', 'E0E', 'E0F', 'E10', 'E11', 'E12', 'E13', 'E14'] },
      run: (data, matches) => {
        // Odder Incarnation = blue towers
        // Rodential Rebirth = orange towers
        // durations: I = 20s, II = 26s, III = 32s, IV = 38s
        const id = matches.effectId;
        if (id === 'E11')
          data.reincarnationCollect[0].blue = matches.target;
        else if (id === 'E0D')
          data.reincarnationCollect[0].orange = matches.target;
        else if (id === 'E12')
          data.reincarnationCollect[1].blue = matches.target;
        else if (id === 'E0E')
          data.reincarnationCollect[1].orange = matches.target;
        else if (id === 'E13')
          data.reincarnationCollect[2].blue = matches.target;
        else if (id === 'E0F')
          data.reincarnationCollect[2].orange = matches.target;
        else if (id === 'E14')
          data.reincarnationCollect[3].blue = matches.target;
        else if (id === 'E10')
          data.reincarnationCollect[3].orange = matches.target;
      },
    },
    {
      id: 'AMRS Gorai Rousing Reincarnation First Tower',
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
      id: 'AMRS Gorai Rousing Reincarnation Other Towers',
      type: 'Ability',
      // Technically 851F Pointed Purgation protean happens ~0.2s beforehand,
      // but wait on the tower burst to call things out.
      // 8546 = Burst (blue tower)
      // 8544 = Burst (orange tower)
      // 8545 = Dramatic Burst (missed tower)
      // 8548 = Pointed Purgation (tether)
      netRegex: { id: '8546', source: 'Gorai the Uncaged', capture: false },
      durationSeconds: 4,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        return towerResponse(data, output);
      },
    },
    {
      id: 'AMRS Gorai Fighting Spirits',
      type: 'StartsUsing',
      netRegex: { id: '852B', source: 'Gorai the Uncaged', capture: false },
      // this is also a light aoe but knockback is more important
      response: Responses.knockback('info'),
    },
    {
      id: 'AMRS Gorai Fighting Spirits Limit Cut',
      type: 'HeadMarker',
      netRegex: { id: limitCutIds },
      durationSeconds: 10, // FIXME
      alertText: (data, matches, output) => {
        if (matches.target !== data.me)
          return;
        let num = undefined;
        if (matches.id === headmarkers.limitCut1)
          num = output.num1!();
        else if (matches.id === headmarkers.limitCut2)
          num = output.num2!();
        else if (matches.id === headmarkers.limitCut3)
          num = output.num3!();
        else if (matches.id === headmarkers.limitCut4)
          num = output.num4!();
        else
          return;
        return output.text!({ num: num });
      },
      outputStrings: {
        num1: Outputs.num1,
        num2: Outputs.num2,
        num3: Outputs.num3,
        num4: Outputs.num4,
        text: {
          en: '${num}',
          ja: '${num}番',
          ko: '${num}번',
        },
      },
    },
    {
      id: 'AMRS Gorai Malformed Reincarnation',
      type: 'StartsUsing',
      netRegex: { id: '8514', source: 'Gorai the Uncaged', capture: false },
      run: (data) => data.malformed = {},
    },
    {
      id: 'AMRS Gorai Malformed Reincarnation Debuff',
      type: 'GainsEffect',
      // E0D = Rodential Rebirth#1 / Red
      // E0E = Rodential Rebirth#2 / Red
      // E0F = Rodential Rebirth#3 / Red
      // E11 = Odder Incarnation#1 / Blue
      // E12 = Odder Incarnation#2 / Blue
      // E13 = Odder Incarnation#3 / Blue
      netRegex: { effectId: ['E0D', 'E0F', 'E11', 'E13'] },
      run: (data, matches) => {
        if (data.malformed[matches.target] === undefined)
          data.malformed[matches.target] = {};
        switch (matches.effectId) {
          case 'E0D':
            data.malformed[matches.target]!.d1 = true;
            break;
          case 'E0F':
            data.malformed[matches.target]!.d3 = true;
            break;
          case 'E11':
            data.malformed[matches.target]!.d1 = false;
            break;
          case 'E13':
            data.malformed[matches.target]!.d3 = false;
            break;
        }
      },
    },
    {
      id: 'AMRS Gorai Malformed Reincarnation Action',
      type: 'GainsEffect',
      // E15 = Squirrelly Prayer / Red
      // E16 = Odder Prayer / Blue
      netRegex: { effectId: ['E15', 'E16'], capture: false },
      delaySeconds: 5,
      durationSeconds: 11,
      suppressSeconds: 99999,
      infoText: (data, _matches, output) => {
        const me = data.malformed[data.me];
        if (me === undefined || me.d1 === undefined || me.d3 === undefined)
          return;
        const issame = me.d1 === me.d3; // All same colors
        if (issame) {
          if (me.d1)
            return output.sameRight!();
          return output.sameLeft!();
        }
        const hassame = Object.entries(data.malformed)
          .find((x) => x[1].d1 === x[1].d3) !== undefined;
        if (hassame) {
          if (me.d1)
            return output.southRight!();
          return output.southLeft!();
        }
        if (me.d1)
          return output.right!();
        return output.left!();
      },
      outputStrings: {
        left: {
          en: 'Drop Blue Tower',
          ja: '異色: 左へ',
          ko: '다른색: 왼쪽으로',
        },
        right: {
          en: 'Drop Red Tower',
          ja: '異色: 右へ',
          ko: '다른색: 오른쪽으로',
        },
        sameLeft: {
          en: 'Drop Blue Tower: All Red',
          ja: '同色: 北の左へ',
          ko: '같은색: 북쪽 왼쪽으로',
        },
        sameRight: {
          en: 'Drop Red Tower: All Blue',
          ja: '同色: 北の右へ',
          ko: '같은색: 북쪽 오른쪽으로',
        },
        southLeft: {
          en: 'Drop Blue Tower',
          ja: '異色: 南の左へ',
          ko: '다른색: 남쪽 왼쪽으로',
        },
        southRight: {
          en: 'Drop Red Tower',
          ja: '異色: 南の右へ',
          ko: '다른색: 남쪽 오른쪽으로',
        },
        unknown: Outputs.unknown,
      },
    },
    // ---------------- Moko ----------------
    {
      id: 'AMRS Moko Kenki Release',
      type: 'StartsUsing',
      netRegex: { id: '860C', source: 'Moko the Restless', capture: false },
      response: Responses.aoe('alert'),
    },
    {
      id: 'AMRS Moko Lateral Slice',
      type: 'StartsUsing',
      netRegex: { id: '860D', source: 'Moko the Restless' },
      response: Responses.tankBuster(),
    },
    {
      id: 'AMRS Moko Scarlet Auspice',
      type: 'StartsUsing',
      netRegex: { id: '8600', source: 'Moko the Restless', capture: false },
      response: Responses.goSides(),
    },
    {
      id: 'AMRS Moko Invocation of Vengeance',
      type: 'StartsUsing',
      netRegex: { id: '85DB', source: 'Moko the Restless', capture: false },
      run: (data, _matches) => {
        delete data.stackFirst;
        data.vengefulCollect = [];
      },
    },
    {
      id: 'AMRS Moko Vengeful Collect',
      type: 'GainsEffect',
      // E1A = spread
      // E1B = stack
      netRegex: { effectId: ['E1A', 'E1B'] },
      run: (data, matches) => data.vengefulCollect.push(matches),
    },
    {
      id: 'AMRS Moko Vengeful',
      type: 'GainsEffect',
      netRegex: { effectId: ['E1A', 'E1B'], capture: false },
      delaySeconds: 0.5,
      durationSeconds: 10,
      suppressSeconds: 999999,
      infoText: (data, _matches, output) => {
        const stack = data.vengefulCollect.find((x) => x.effectId === 'E1B');
        const spread = data.vengefulCollect.find((x) => x.effectId === 'E1A');
        if (stack === undefined || spread === undefined)
          return;
        const stackTime = parseFloat(stack.duration);
        const spreadTime = parseFloat(spread.duration);
        data.stackFirst = stackTime < spreadTime;

        if (data.stackFirst)
          return output.stack!();
        return output.spread!();
      },
      outputStrings: {
        stack: {
          en: 'Stack first',
          ja: 'さっきにペア(壁AOE注意)',
          ko: '먼저 뭉쳐요 (외곽 조심)',
        },
        spread: {
          en: 'Spread first',
          ja: 'さっきに散会(壁AOE注意)',
          ko: '먼저 흩어져요 (외곽 조심)',
        },
      },
    },
    {
      id: 'AMRS Moko Vengeful Flame',
      type: 'GainsEffect',
      netRegex: { effectId: 'E1A' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      durationSeconds: 7,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        if (data.stackFirst)
          return;
        if (data.role === 'tank')
          return output.tank!();
        if (data.role === 'healer')
          return output.healer!();
        return output.dps!();
      },
      run: (data) => data.vengefulCollect = [],
      outputStrings: {
        tank: {
          en: 'Stack with Healer',
          ja: 'ヒーラーとペア',
          ko: '힐러랑 뭉쳐요!',
        },
        healer: {
          en: 'Stack with Tank',
          ja: 'タンクとペア',
          ko: '탱크랑 뭉쳐요!',
        },
        dps: {
          en: 'Stack with DPS',
          ja: 'DPSとペア',
          ko: 'DPS끼리 뭉쳐요!',
        },
      },
    },
    {
      id: 'AMRS Moko Vengeful Pyre',
      type: 'GainsEffect',
      netRegex: { effectId: 'E1B' },
      delaySeconds: (_data, matches) => parseFloat(matches.duration),
      durationSeconds: 7,
      suppressSeconds: 10,
      alertText: (data, _matches, output) => {
        if (data.stackFirst)
          return output.text!();
      },
      run: (data) => data.vengefulCollect = [],
      outputStrings: {
        text: {
          en: 'Spread',
          ja: '散会',
          ko: '흩어져요!',
        },
      },
    },
    {
      id: 'AMRS Moko Vengeance Tether',
      type: 'Tether',
      netRegex: { id: '0011', source: 'Moko the Restless' },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tether: {
            en: 'Tethered',
            ja: '自分に線！刀の方向確認',
            ko: '내게 줄! 칼 방향 확인!',
          },
          notether: {
            en: 'No tether (${target})',
            ja: '線なし (${target})',
            ko: '줄없음 (${target})',
          },
        };

        if (matches.target === data.me) {
          data.haveTether = true;
          return { alertText: output.tether!() };
        }
        const target = data.ShortName(matches.target);
        return { infoText: output.notether!({ target: target }) };
      },
    },
    {
      id: 'AMRS Moko Azure Auspice',
      type: 'StartsUsing',
      netRegex: { id: '8603', source: 'Moko the Restless', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Inside => Go Sides',
          ja: '中から => 横へ',
          ko: '안으로 => 옆으로',
        },
      },
    },
    {
      id: 'AMRS Moko Boundless Azure',
      type: 'StartsUsing',
      netRegex: { id: '859D', source: 'Moko the Restless', capture: false },
      response: Responses.goSides(),
    },
    {
      id: 'AMRS Moko Moonless Night',
      type: 'StartsUsing',
      netRegex: { id: '860A', source: 'Moko the Restless', capture: false },
      run: (data) => {
        data.tetherCollect = [];
        delete data.haveTether;
      },
    },
    {
      id: 'AMRS Moko Near/Far Edge',
      type: 'StartsUsing',
      // 85D8 NEAR
      // 85D9 FAR
      netRegex: { id: ['85D8', '85D9'], source: 'Moko the Restless' },
      alertText: (data, matches, output) => {
        if (matches.id === '85D8') {
          if (data.haveTether)
            return output.farIn!();
          return output.farOut!();
        }
        if (data.haveTether)
          return output.nearOut!();
        return output.nearIn!();
      },
      run: (data) => {
        data.tetherCollect = [];
      },
      outputStrings: {
        nearIn: {
          en: 'Inside',
          ja: '中へ',
          ko: '안쪽으로',
        },
        nearOut: {
          en: 'Outside / Look Outside',
          ja: '外へ・外側見る',
          ko: '바깥쪽/바깥보기',
        },
        farIn: {
          en: 'Inside / Look inside',
          ja: '中へ・内側見る',
          ko: '안쪽/안쪽보기',
        },
        farOut: {
          en: 'Outside',
          ja: '外へ',
          ko: '바깥쪽으로',
        },
      },
    },
    {
      id: 'AMRS Moko Shadow Tether Reset',
      type: 'Tether',
      netRegex: { id: '0011', source: 'Moko\'s Shadow', capture: false },
      suppressSeconds: 10,
      run: (data) => {
        data.shadowTether++;
        data.shadowGiri = [];
      },
    },
    {
      id: 'AMRS Moko Shadow Tether',
      type: 'Tether',
      netRegex: { id: '0011', source: 'Moko\'s Shadow' },
      run: (data, matches) => {
        const target = matches.target;
        if (data.shadowTether <= 2) {
          // Shadow-twin #1, Moonless
          data.tetherCollect.push(target);
          if (data.me === target) {
            data.haveTether = true;
            data.tetherFrom = matches.sourceId;
          } else {
            if (data.role === 'tank' && data.party.isHealer(target))
              data.tetherFrom = matches.sourceId;
            else if (data.role === 'healer' && data.party.isTank(target))
              data.tetherFrom = matches.sourceId;
            else if (data.role === 'dps' && data.party.isDPS(target))
              data.tetherFrom = matches.sourceId;
          }
        } else if (data.shadowTether === 3) {
          // Shadow-twin #2, Blue
          if (data.me === target)
            data.tetherFrom = matches.sourceId;
        }
      },
    },
    {
      id: 'AMRS Moko AMRS Moko Shadow Tether Notify',
      type: 'Tether',
      netRegex: { id: '0011', source: 'Moko\'s Shadow', capture: false },
      condition: (data) => data.shadowTether <= 2,
      delaySeconds: 0.5,
      suppressSeconds: 10,
      response: (data, _matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          tether: {
            en: 'Tethered (w/${player})',
            ja: '自分に線！(${player}',
            ko: '내게 줄! (${player})',
          },
          tetheronly: {
            en: 'Tethered',
            ja: '自分に線！',
            ko: '내게 줄!',
          },
          notether: {
            en: 'No tether (${players})',
            ja: '線なし (${players})',
            ko: '줄 없음 (${players})',
          },
          notetheronly: {
            en: 'No tether',
            ja: '線なし',
            ko: '줄 없음',
          },
        };

        if (data.haveTether) {
          const left = data.tetherCollect.filter((x) => data.me !== x);
          if (left.length === 1)
            return { alertText: output.tether!({ player: data.ShortName(left[0]) }) };
          return { alertText: output.tetheronly!() };
        }
        if (data.tetherCollect.length === 2) {
          const tethers = data.tetherCollect.map((x) => data.ShortName(x));
          return { infoText: output.notether!({ players: tethers.join(', ') }) };
        }
        return { infoText: output.notetheronly!() };
      },
    },
    {
      id: 'AMRS Moko Giris',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', target: 'Moko the Restless' },
      durationSeconds: (data, matches) => {
        if (kasumiGiriMapCounts.includes(matches.count))
          return data.kasumiGiri.length < 2 ? 3.5 : 10;
        return 5;
      },
      response: (data, matches, output) => {
        // cactbot-builtin-response
        output.responseOutputStrings = {
          unbound: {
            en: '(${mark} Outside)',
            ja: '(${mark}外)',
            ko: '(${mark}밖)',
          },
          azure: {
            en: '(${mark} Inside)',
            ja: '(${mark}中)',
            ko: '(${mark}안)',
          },
          vengeful: {
            en: 'Look ${dir}',
            ja: '${dir}見て',
            ko: '${dir} 봐요!',
          },
          text: {
            en: '${mesg}',
            ja: '${mesg}',
            ko: '${mesg}',
          },
          outside: {
            en: ' Outside',
            ja: '外',
            ko: '밖',
          },
          inside: {
            en: ' Inside',
            ja: '中',
            ko: '안',
          },
          slashForward: {
            en: 'Behind',
            ja: '外',
            ko: '바깥',
          },
          slashRight: {
            en: 'Left',
            ja: '左',
            ko: '왼쪽',
          },
          slashBackward: {
            en: 'Front',
            ja: '中',
            ko: '안쪽',
          },
          slashLeft: {
            en: 'Right',
            ja: '右',
            ko: '오른쪽',
          },
          north: {
            en: 'North',
            ja: 'A',
            ko: 'A',
          },
          east: {
            en: 'East',
            ja: 'B',
            ko: 'B',
          },
          south: {
            en: 'South',
            ja: 'C',
            ko: 'C',
          },
          west: {
            en: 'West',
            ja: 'D',
            ko: 'D',
          },
          unknown: Outputs.unknown,
        };

        const cnt = matches.count;
        const angle = kasumiGiriMap[cnt];
        if (angle === undefined) {
          if (data.haveTether) {
            // Vengeful Direction
            const vengefulGiriMap: { [count: string]: string } = {
              '248': output.slashForward!(),
              '249': output.slashRight!(),
              '24A': output.slashBackward!(),
              '24B': output.slashLeft!(),
            };
            const vengeful = vengefulGiriMap[cnt];
            if (vengeful !== undefined)
              return { alertText: output.vengeful!({ dir: vengeful }) };
          }
          return;
        }

        const kasumiOuts = ['24C', '24D', '24E', '24F'];
        const kasumiMark: { [angle: number]: string } = {
          0: output.south!(),
          90: output.west!(),
          180: output.north!(),
          270: output.east!(),
          360: output.south!(),
        };

        const rotate = data.kasumiAngle + angle;
        data.kasumiAngle = rotate >= 360 ? rotate - 360 : rotate;
        const giri: KasumiGiriInfo = {
          mark: kasumiMark[data.kasumiAngle] ?? output.unknown!(),
          outside: kasumiOuts.includes(cnt),
        };
        data.kasumiGiri.push(giri);

        if (data.kasumiGiri.length < 3) {
          if (giri.outside)
            return { infoText: output.unbound!({ mark: giri.mark }) };
          return { infoText: output.azure!({ mark: giri.mark }) };
        }

        const out: string[] = [];
        for (const i of data.kasumiGiri)
          out.push(`${i.mark}${i.outside ? output.outside!() : output.inside!()}`);

        data.kasumiCount++;
        data.kasumiGiri = [];
        if (data.kasumiCount > 1)
          data.kasumiAngle = 0;

        return { infoText: output.text!({ mesg: out.join(' => ') }) };
      },
    },
    {
      id: 'AMRS Moko Moko\'s Shadow',
      type: 'GainsEffect',
      netRegex: { effectId: 'B9A', target: 'Moko\'s Shadow', capture: true },
      durationSeconds: 11,
      infoText: (data, matches, output) => {
        const shadowGiriMap: { [count: string]: string } = {
          '248': output.slashForward!(),
          '249': output.slashRight!(),
          '24A': output.slashBackward!(),
          '24B': output.slashLeft!(),
        };
        const giri: ShadowGiriInfo = {
          id: matches.targetId,
          cnt: matches.count,
          mesg: shadowGiriMap[matches.count] ?? output.unknown!(),
        };
        data.shadowGiri.push(giri);

        if (data.tetherFrom === undefined)
          return;

        if (data.shadowTether <= 2) {
          // 1st tether
          if (data.shadowGiri.length !== 4)
            return;
          const mygiri = data.shadowGiri.filter((x) => x.id === data.tetherFrom);
          const out = mygiri.map((x) => x.mesg);
          return output.text!({ mesg: out.join(' => ') });
        } else if (data.shadowTether === 3) {
          // tether after blue
          if (data.shadowGiri.length !== 8)
            return;
          const mygiri = data.shadowGiri.filter((x) => x.id === data.tetherFrom);
          const out = mygiri.map((x) => x.mesg);
          const last = mygiri.pop();
          if (last !== undefined) {
            if (last.cnt === '24B')
              return output.left!({ mesg: out.join(' => ') });
            if (last.cnt === '249')
              return output.right!({ mesg: out.join(' => ') });
          }
          return output.text!({ mesg: out.join(' => ') });
        }
      },
      outputStrings: {
        text: {
          en: '${mesg}',
          ja: '${mesg}',
          ko: '${mesg}',
        },
        left: {
          en: 'Stand left, ${mesg}',
          ja: '[左] ${mesg}',
          ko: '[왼쪽] ${mesg}',
        },
        right: {
          en: 'Stand right, ${mesg}',
          ja: '[右] ${mesg}',
          ko: '[오른쪽] ${mesg}',
        },
        slashForward: {
          en: 'Behind',
          ja: '後ろ',
          ko: '뒤로',
        },
        slashRight: {
          en: 'Left',
          ja: '左',
          ko: '왼쪽',
        },
        slashBackward: {
          en: 'Front',
          ja: '前',
          ko: '앞으로',
        },
        slashLeft: {
          en: 'Right',
          ja: '右',
          ko: '오른쪽',
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
      },
    },
    {
      locale: 'ja',
      missingTranslations: true,
      replaceSync: {
        'Ashigaru Kyuhei': '足軽弓兵',
        'Devilish Thrall': '惑わされた屍鬼',
        'Gorai The Uncaged': '鉄鼠ゴウライ',
        'Moko the Restless': '怨霊モウコ',
        'Moko\'s Shadow': 'モウコの幻影',
        'Shishio': '獅子王',
        'Shishu Fuko': 'シシュウ・フウコウ',
        'Shishu Furutsubaki': 'シシュウ・フルツバキ',
        'Shishu Kotengu': 'シシュウ・コテング',
        'Shishu Onmitsugashira': 'シシュウ・オンミガシラ',
        'Shishu Raiko': 'シシュウ・ライコウ',
        'Shishu Yuki': 'シシュウ・ユウキ',
      },
    },
  ],
};

export default triggerSet;
