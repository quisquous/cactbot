import Outputs from '../../../../../resources/outputs';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { NetMatches } from '../../../../../types/net_matches';
import { TriggerSet } from '../../../../../types/trigger';

const wings = {
  // vfx/lockon/eff/m0829_cst19_9s_c0v.avfx
  topLeftFirst: '01A5', // 82E2 cast and damage
  // vfx/lockon/eff/m0829_cst20_9s_c0v.avfx
  topRightFirst: '01A6', // 82E1 cast and damage
  // vfx/lockon/eff/m0829_cst21_6s_c0v.avfx
  middleLeftSecond: '01A7', // 82E4 damage (top down), 82EA damage (bottom up)
  // vfx/lockon/eff/m0829_cst22_6s_c0v.avfx
  middleRightSecond: '01A8', // 82E3 damage (top down), 82E9 damage (bottom up)
  // vfx/lockon/eff/m0829_cst23_9s_c0v.avfx
  bottomLeftFirst: '01A9', // 82E8 cast and damage
  // vfx/lockon/eff/m0829_cst24_9s_c0v.avfx
  bottomRightFirst: '01AA', // 82E7 cast and damage
  // vfx/lockon/eff/m0829_cst19_3s_c0v.avfx
  topLeftThird: '01AF', // 82EC damage
  // vfx/lockon/eff/m0829_cst20_3s_c0v.avfx
  topRightThird: '01B0', // 82EB damage
  // vfx/lockon/eff/m0829_cst22_6s_c0v.avfx
  bottomLeftThird: '01B1', // 82E6 damage
  // vfx/lockon/eff/m0829_cst23_3s_c0v.avfx
  bottomRightThird: '01B2', // 82E5 damage
} as const;

const headmarkers = {
  ...wings,
  // vfx/lockon/eff/tank_laser_5sec_lockon_c0a1.avfx
  glaukopis: '01D7',

  // vfx/lockon/eff/sph_lockon2_num01_s8p.avfx (through sph_lockon2_num04_s8p)
  limitCut1: '0150',
  limitCut2: '0151',
  limitCut3: '0152',
  limitCut4: '0153',
  // vfx/lockon/eff/sph_lockon2_num05_s8t.avfx (through sph_lockon2_num08_s8t)
  limitCut5: '01B5',
  limitCut6: '01B6',
  limitCut7: '01B7',
  limitCut8: '01B8',

  // vfx/lockon/eff/tank_lockonae_0m_5s_01t.avfx
  palladianGrasp: '01D4',
  // vfx/lockon/eff/m0376trg_fire3_a0p.avfx
  chains: '0061',
} as const;

const wingIds: string[] = Object.values(wings);

const getHeadmarkerId = (data: Data, matches: NetMatches['HeadMarker']) => {
  if (data.decOffset === undefined) {
    if (data.expectedFirstHeadmarker === undefined) {
      console.error('missing expected first headmarker');
      return 'OOPS';
    }
    data.decOffset = parseInt(matches.id, 16) - parseInt(data.expectedFirstHeadmarker, 16);
  }
  return (parseInt(matches.id, 16) - data.decOffset).toString(16).toUpperCase().padStart(4, '0');
};

export interface Data extends RaidbossData {
  decOffset?: number;
  expectedFirstHeadmarker?: string;
  phase: 'door' | 'final';
  wingCollect: string[];
  wingCalls: ('swap' | 'stay')[];
}

const triggerSet: TriggerSet<Data> = {
  id: 'AnabaseiosTheTwelfthCircleSavage',
  zoneId: ZoneId.AnabaseiosTheTwelfthCircleSavage,
  timelineFile: 'p12s.txt',
  initData: () => {
    return {
      phase: 'door',
      wingCollect: [],
      wingCalls: [],
    };
  },
  triggers: [
    {
      id: 'P12S Phase Tracker',
      type: 'StartsUsing',
      // Ultima cast
      netRegex: { id: '8682', source: 'Pallas Athena', capture: false },
      run: (data) => {
        data.phase = 'final';
        data.expectedFirstHeadmarker = headmarkers.palladianGrasp;
      },
    },
    {
      id: 'P12S Door Boss Headmarker Tracker',
      type: 'StartsUsing',
      netRegex: { id: ['82E7', '82E8'], source: 'Athena' },
      suppressSeconds: 99999,
      run: (data, matches) => {
        // The first headmarker in the door boss is EITHER the bottom left or bottom right wing.
        const isBottomLeft = matches.id === '82E8';
        const first = isBottomLeft ? headmarkers.bottomLeftFirst : headmarkers.bottomRightFirst;
        data.expectedFirstHeadmarker = first;
      },
    },
    {
      id: 'P12S First Wing',
      type: 'StartsUsing',
      netRegex: { id: ['82E7', '82E8', '82E1', '82E2'], source: 'Athena' },
      durationSeconds: 7,
      alertText: (data, matches, output) => {
        data.wingCollect = [];
        data.wingCalls = [];
        const isLeft = matches.id === '82E8' || matches.id === '82E2';
        return isLeft ? output.right!() : output.left!();
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
      },
    },
    {
      id: 'P12S Wing Collect',
      type: 'HeadMarker',
      netRegex: {},
      delaySeconds: (data) => data.decOffset === undefined ? 1 : 0,
      durationSeconds: 7,
      infoText: (data, matches, output) => {
        const id = getHeadmarkerId(data, matches);
        console.log(id);
        if (!wingIds.includes(id))
          return;

        console.log(`${id}: ${JSON.stringify(data.wingCollect)}`);
        data.wingCollect.push(id);
        if (data.wingCollect.length !== 3)
          return;

        const [first, second, third] = data.wingCollect;
        if (first === undefined || second === undefined || third === undefined)
          return;

        const isFirstLeft = first === wings.topLeftFirst || first === wings.bottomLeftFirst;
        const isSecondLeft = second === wings.middleLeftSecond;
        const isThirdLeft = third === wings.topLeftThird || third === wings.bottomLeftThird;

        const firstStr = isFirstLeft ? output.right!() : output.left!();

        const isFirstTop = first === wings.topLeftFirst || first === wings.topRightFirst;
        if (isFirstTop) {
          const secondCall = isFirstLeft === isSecondLeft ? 'stay' : 'swap';
          const thirdCall = isSecondLeft === isThirdLeft ? 'stay' : 'swap';
          data.wingCalls = [secondCall, thirdCall];
          return output.text!({
            first: firstStr,
            second: output[secondCall]!(),
            third: output[thirdCall]!(),
          });
        }

        const secondCall = isFirstLeft === isSecondLeft ? 'swap' : 'stay';
        const thirdCall = isSecondLeft === isThirdLeft ? 'swap' : 'stay';
        data.wingCalls = [secondCall, thirdCall];
        return output.text!({
          first: firstStr,
          second: output[secondCall]!(),
          third: output[thirdCall]!(),
        });
      },
      outputStrings: {
        left: Outputs.left,
        right: Outputs.right,
        swap: {
          en: 'Swap',
        },
        stay: {
          en: 'Stay',
        },
        text: {
          en: '${first} => ${second} => ${third}',
          de: '${first} => ${second} => ${third}',
          fr: '${first} => ${second} => ${third}',
        },
      },
    },
    {
      id: 'P12S Wing Followup',
      type: 'Ability',
      netRegex: {
        id: ['82E1', '82E2', '82E3', '82E4', '82E7', '82E8', '82E9', '82EA'],
        source: 'Athena',
        capture: false,
      },
      suppressSeconds: 1,
      alertText: (data, _matches, output) => {
        const call = data.wingCalls.shift();
        if (call === 'swap')
          return output.swap!();
        if (call === 'stay')
          return output.stay!();
      },
      outputStrings: {
        swap: {
          en: 'Swap',
        },
        stay: {
          en: 'Stay',
        },
      },
    },
  ],
};

export default triggerSet;
