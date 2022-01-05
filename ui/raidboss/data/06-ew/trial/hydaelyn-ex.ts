import NetRegexes from '../../../../../resources/netregexes';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

// TODO: how to call out crystal LOS???
// TODO: call out directions where party/tanks should go in add phase?
// TODO: call Chakram stack locations / direction to run
// TODO: call out intercard to run to in the final phase
// TODO: Lightwave has different ids, do these mean anything?

export interface Data extends RaidbossData {
  brightSpectrumStack?: string[];
  crystallize?: 'spread' | 'groups' | 'stack';
  parhelion?: boolean;
}

const storedMechanicsOutputStrings = {
  spread: Outputs.spread,
  groups: {
    en: 'Healer Groups',
    de: 'Heiler-Gruppen',
    fr: 'Groupes sur les heals',
    ja: 'ヒラに頭割り',
    cn: '治疗分摊组',
    ko: '힐러 그룹 쉐어',
  },
  stack: {
    en: 'Party Stack',
    de: 'Mit der Party sammeln',
    fr: 'Package en équipe',
    ja: '全員集合',
    cn: '8人分摊',
    ko: '파티 전체 쉐어',
  },
};

const crystallizeOutputStrings = {
  ...storedMechanicsOutputStrings,
  crystallize: {
    en: 'Crystallize: ${name}',
    de: 'Kristalisieren: ${name}',
    fr: 'Cristallisation : ${name}',
    ja: 'クリスタライズ: ${name}',
  },
};

const comboOutputStrings = {
  ...storedMechanicsOutputStrings,
  combo: {
    en: '${first} => ${second}',
    de: '${first} => ${second}',
    fr: '${first} => ${second}',
    ja: '${first} => ${second}',
    cn: '${first} => ${second}',
    ko: '${first} => ${second}',
  },
};

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladHydaelynsCall,
  timelineFile: 'hydaelyn-ex.txt',
  timelineTriggers: [
    {
      id: 'HydaelynEx Marker Equinox',
      // There is no 8E1 effect here (maybe because it is deterministic?) so use a timeline trigger.
      regex: /Equinox/,
      beforeSeconds: 3.5,
      durationSeconds: (data) => data.crystallize ? 6.5 : 3.5,
      alertText: (data, _matches, output) => {
        if (data.crystallize)
          return output.combo!({ first: output.intercards!(), second: output[data.crystallize]!() });
        return output.intercards!();
      },
      run: (data) => delete data.crystallize,
      outputStrings: {
        ...comboOutputStrings,
        intercards: {
          en: 'Intercards',
          de: 'Interkardinal',
          fr: 'Intercardinal',
          ja: '斜めへ',
          cn: '四角',
          ko: '대각선 쪽으로',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'HydaelynEx Heros\'s Radiance',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65C1', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65C1', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65C1', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65C1', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65C1', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65C1', source: '하이델린', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'HydaelynEx Shining Saber',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '68C8', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '68C8', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '68C8', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '68C8', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '68C8', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '68C8', source: '하이델린', capture: false }),
      // In the final phase, there's a Shining Saber -> Crystalline Water III section.
      durationSeconds: (data) => data.crystallize ? 7 : 4,
      alertText: (data, _matches, output) => {
        if (data.crystallize)
          return output.combo!({ first: output.stack!(), second: output[data.crystallize]!() });
        return output.stack!();
      },
      run: (data) => delete data.crystallize,
      outputStrings: comboOutputStrings,
    },
    {
      id: 'HydaelynEx Magos\'s Raidance',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65C2', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65C2', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65C2', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65C2', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65C2', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65C2', source: '하이델린', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'HydaelynEx Parhelion Tracker',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65B0', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65B0', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65B0', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65B0', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65B0', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65B0', source: '하이델린', capture: false }),
      run: (data) => data.parhelion = true,
    },
    {
      id: 'HydaelynEx Crystallize Water',
      type: 'Ability',
      // We could call this out on startsUsing, but no action needs to be taken for ~17 seconds,
      // and so just call this out on the action.
      netRegex: NetRegexes.ability({ id: ['659A', '6ED5'], source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.ability({ id: ['659A', '6ED5'], source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.ability({ id: ['659A', '6ED5'], source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.ability({ id: ['659A', '6ED5'], source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: ['659A', '6ED5'], source: '海德林', capture: false }),
      netRegexKo: NetRegexes.ability({ id: ['659A', '6ED5'], source: '하이델린', capture: false }),
      infoText: (_data, _matches, output) => output.crystallize!({ name: output.groups!() }),
      run: (data) => data.crystallize = 'groups',
      outputStrings: crystallizeOutputStrings,
    },
    {
      // During Parhelion, there's a Crystallize Water with no mechanic in between.
      id: 'HydaelynEx Crystallize Water Parhelion',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['659A', '6ED5'], source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.ability({ id: ['659A', '6ED5'], source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.ability({ id: ['659A', '6ED5'], source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.ability({ id: ['659A', '6ED5'], source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: ['659A', '6ED5'], source: '海德林', capture: false }),
      netRegexKo: NetRegexes.ability({ id: ['659A', '6ED5'], source: '하이델린', capture: false }),
      condition: (data) => data.parhelion,
      // There's 10 seconds between Crystallize Water ability and action in this one case.
      // Subparhelion occurs ~2s before, but that's too soon.
      delaySeconds: 5,
      alertText: (_data, _matches, output) => output.groups!(),
      run: (data) => {
        delete data.crystallize;
        delete data.parhelion;
      },
      outputStrings: {
        groups: crystallizeOutputStrings.groups,
      },
    },
    {
      id: 'HydaelynEx Crystallize Ice',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['659C', '659D'], source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.ability({ id: ['659C', '659D'], source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.ability({ id: ['659C', '659D'], source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.ability({ id: ['659C', '659D'], source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: ['659C', '659D'], source: '海德林', capture: false }),
      netRegexKo: NetRegexes.ability({ id: ['659C', '659D'], source: '하이델린', capture: false }),
      infoText: (_data, _matches, output) => output.crystallize!({ name: output.spread!() }),
      run: (data) => data.crystallize = 'spread',
      outputStrings: crystallizeOutputStrings,
    },
    {
      id: 'HydaelynEx Crystallize Stone',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: ['659B', '659E'], source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.ability({ id: ['659B', '659E'], source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.ability({ id: ['659B', '659E'], source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.ability({ id: ['659B', '659E'], source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: ['659B', '659E'], source: '海德林', capture: false }),
      netRegexKo: NetRegexes.ability({ id: ['659B', '659E'], source: '하이델린', capture: false }),
      infoText: (_data, _matches, output) => output.crystallize!({ name: output.stack!() }),
      run: (data) => data.crystallize = 'stack',
      outputStrings: crystallizeOutputStrings,
    },
    {
      id: 'HydaelynEx Marker Anthelion',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B5', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B5', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B5', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '8E1', source: 'ハイデリン', count: '1B5', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: '8E1', source: '海德林', count: '1B5', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ effectId: '8E1', source: '하이델린', count: '1B5', capture: false }),
      // Example timeline:
      //     t=0 StartsCasting Crystallize
      //     t=4 ActionEffect Crystalize
      //     t=7 StatusAdd 81E (this regex)
      //     t=9.5 marker appears
      //     t=13 ActionEffect Anthelion
      //     t=17 ActionEffect Crystalline Blizzard
      //
      // We could call this out immediately, but then it's very close to the Crystallize call.
      // Additionally, if we call this out immediately then players have to remember something
      // for 10 seconds.  A delay of 2.5 feels more natural in terms of time to react and
      // handle this, rather than calling it out extremely early.  Also, add a duration so that
      // this stays on screen until closer to the Crystalline action.  This also puts this call
      // closer to when the marker appears on screen, and so feels a little bit more natural.
      delaySeconds: 2.5,
      durationSeconds: (data) => data.crystallize ? 6.5 : 3.5,
      alertText: (data, _matches, output) => {
        if (data.crystallize)
          return output.combo!({ first: output.in!(), second: output[data.crystallize]!() });
        return output.in!();
      },
      run: (data) => delete data.crystallize,
      outputStrings: {
        ...comboOutputStrings,
        in: Outputs.in,
      },
    },
    {
      id: 'HydaelynEx Marker Highest Holy',
      type: 'GainsEffect',
      netRegex: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B4', capture: false }),
      netRegexDe: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B4', capture: false }),
      netRegexFr: NetRegexes.gainsEffect({ effectId: '8E1', source: 'Hydaelyn', count: '1B4', capture: false }),
      netRegexJa: NetRegexes.gainsEffect({ effectId: '8E1', source: 'ハイデリン', count: '1B4', capture: false }),
      netRegexCn: NetRegexes.gainsEffect({ effectId: '8E1', source: '海德林', count: '1B4', capture: false }),
      netRegexKo: NetRegexes.gainsEffect({ effectId: '8E1', source: '하이델린', count: '1B4', capture: false }),
      delaySeconds: 2.5,
      durationSeconds: (data) => data.crystallize ? 6.5 : 3.5,
      alertText: (data, _matches, output) => {
        if (data.crystallize)
          return output.combo!({ first: output.out!(), second: output[data.crystallize]!() });
        return output.out!();
      },
      run: (data) => delete data.crystallize,
      outputStrings: {
        ...comboOutputStrings,
        out: Outputs.out,
      },
    },
    {
      id: 'HydaelynEx Aureole',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['6C91', '6F11'], source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['6C91', '6F11'], source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['6C91', '6F11'], source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['6C91', '6F11'], source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['6C91', '6F11'], source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['6C91', '6F11'], source: '하이델린', capture: false }),
      // Late in the fight there is a Crystallize -> Aureole combo.
      alertText: (data, _matches, output) => {
        if (data.crystallize)
          return output.combo!({ first: output.sides!(), second: output[data.crystallize]!() });
        return output.sides!();
      },
      run: (data) => delete data.crystallize,
      outputStrings: {
        ...comboOutputStrings,
        sides: Outputs.sides,
      },
    },
    {
      id: 'HydaelynEx Lateral Aureole',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: ['65C5', '6F13'], source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: ['65C5', '6F13'], source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: ['65C5', '6F13'], source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: ['65C5', '6F13'], source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: ['65C5', '6F13'], source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: ['65C5', '6F13'], source: '하이델린', capture: false }),
      alertText: (data, _matches, output) => {
        if (data.crystallize)
          return output.combo!({ first: output.frontBack!(), second: output[data.crystallize]!() });
        return output.frontBack!();
      },
      run: (data) => delete data.crystallize,
      outputStrings: {
        ...comboOutputStrings,
        frontBack: Outputs.goFrontBack,
      },
    },
    {
      id: 'HydaelynEx Mousa\'s Scorn',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65C0', source: 'Hydaelyn' }),
      netRegexDe: NetRegexes.startsUsing({ id: '65C0', source: 'Hydaelyn' }),
      netRegexFr: NetRegexes.startsUsing({ id: '65C0', source: 'Hydaelyn' }),
      netRegexJa: NetRegexes.startsUsing({ id: '65C0', source: 'ハイデリン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '65C0', source: '海德林' }),
      netRegexKo: NetRegexes.startsUsing({ id: '65C0', source: '하이델린' }),
      response: Responses.sharedTankBuster(),
    },
    {
      id: 'HydaelynEx Exodus',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '6B55', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.ability({ id: '6B55', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.ability({ id: '6B55', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.ability({ id: '6B55', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.ability({ id: '6B55', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.ability({ id: '6B55', source: '하이델린', capture: false }),
      // 14.8 seconds from this ability (no cast) to 662B raidwide.
      delaySeconds: 5,
      response: Responses.aoe(),
    },
    {
      id: 'HydaelynEx Halo',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65A5', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65A5', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65A5', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65A5', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65A5', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65A5', source: '하이델린', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'HydaelynEx Radiant Halo',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6B54', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6B54', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6B54', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6B54', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6B54', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6B54', source: '하이델린', capture: false }),
      response: Responses.aoe(),
    },
    {
      id: 'HydaelynEx Heros\'s Sundering',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65BF', source: 'Hydaelyn' }),
      netRegexDe: NetRegexes.startsUsing({ id: '65BF', source: 'Hydaelyn' }),
      netRegexFr: NetRegexes.startsUsing({ id: '65BF', source: 'Hydaelyn' }),
      netRegexJa: NetRegexes.startsUsing({ id: '65BF', source: 'ハイデリン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '65BF', source: '海德林' }),
      netRegexKo: NetRegexes.startsUsing({ id: '65BF', source: '하이델린' }),
      response: Responses.tankCleave('alert'),
    },
    {
      id: 'HydaelynEx Infralateral Arc',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '6669', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '6669', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '6669', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '6669', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '6669', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '6669', source: '하이델린', capture: false }),
      durationSeconds: 4,
      infoText: (_data, _matches, output) => output.rolePositions!(),
      outputStrings: {
        rolePositions: {
          en: 'Role positions',
          de: 'Rollenposition',
          fr: 'Positions par rôle',
          ja: 'ロール特定位置へ',
          cn: '去指定位置',
          ko: '직업별 산개위치로',
        },
      },
    },
    {
      id: 'HydaelynEx Heros\'s Glory',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65A8', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65A8', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65A8', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65A8', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65A8', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65A8', source: '하이델린', capture: false }),
      response: Responses.getBehind(),
    },
    {
      id: 'HydaelynEx Parhelic Circle',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65AC', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65AC', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65AC', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65AC', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65AC', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65AC', source: '하이델린', capture: false }),
      durationSeconds: 9,
      alertText: (data, _matches, output) => {
        // This is always crystallize === 'spread'.
        return output.combo!({ first: output.avoid!(), second: output.spread!() });
      },
      run: (data) => delete data.crystallize,
      outputStrings: {
        ...comboOutputStrings,
        avoid: {
          en: 'Avoid Line Ends',
          de: 'Weiche den Enden der Linien aus',
          fr: 'Évitez les fins de lignes',
          ja: '線の端から離れる',
          cn: '远离线',
          ko: '선의 끝부분 피하기',
        },
      },
    },
    {
      id: 'HydaelynEx Echoes',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65B5', source: 'Hydaelyn', capture: false }),
      netRegexDe: NetRegexes.startsUsing({ id: '65B5', source: 'Hydaelyn', capture: false }),
      netRegexFr: NetRegexes.startsUsing({ id: '65B5', source: 'Hydaelyn', capture: false }),
      netRegexJa: NetRegexes.startsUsing({ id: '65B5', source: 'ハイデリン', capture: false }),
      netRegexCn: NetRegexes.startsUsing({ id: '65B5', source: '海德林', capture: false }),
      netRegexKo: NetRegexes.startsUsing({ id: '65B5', source: '하이델린', capture: false }),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack 5x',
          de: '5x Sammeln',
          fr: '5x Packages',
          ja: '頭割り５回',
          cn: '5连分摊',
          ko: '쉐어 5번',
        },
      },
    },
    {
      id: 'HydaelynEx Bright Spectrum',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65B9', source: 'Hydaelyn' }),
      netRegexDe: NetRegexes.startsUsing({ id: '65B9', source: 'Hydaelyn' }),
      netRegexFr: NetRegexes.startsUsing({ id: '65B9', source: 'Hydaelyn' }),
      netRegexJa: NetRegexes.startsUsing({ id: '65B9', source: 'ハイデリン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '65B9', source: '海德林' }),
      netRegexKo: NetRegexes.startsUsing({ id: '65B9', source: '하이델린' }),
      preRun: (data, matches) => (data.brightSpectrumStack ??= []).push(matches.target),
      infoText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.spread!();
      },
      outputStrings: {
        spread: Outputs.spread,
      },
    },
    {
      // In practice, this cast begins after the Bright Spectrum casts.
      id: 'HydaelynEx Dichroic Spectrum',
      type: 'StartsUsing',
      netRegex: NetRegexes.startsUsing({ id: '65B8', source: 'Hydaelyn' }),
      netRegexDe: NetRegexes.startsUsing({ id: '65B8', source: 'Hydaelyn' }),
      netRegexFr: NetRegexes.startsUsing({ id: '65B8', source: 'Hydaelyn' }),
      netRegexJa: NetRegexes.startsUsing({ id: '65B8', source: 'ハイデリン' }),
      netRegexCn: NetRegexes.startsUsing({ id: '65B8', source: '海德林' }),
      netRegexKo: NetRegexes.startsUsing({ id: '65B8', source: '하이델린' }),
      infoText: (data, matches, output) => {
        if (data.brightSpectrumStack?.includes(data.me))
          return;
        if (data.me === matches.target || data.role === 'tank')
          return output.sharedTankbuster!();
      },
      run: (data) => delete data.brightSpectrumStack,
      outputStrings: {
        sharedTankbuster: Outputs.sharedTankbuster,
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Hydaelyn': 'Hydaelyn',
        'Mystic Refulgence': 'Truglicht',
        'Parhelion': 'Parhelion',
      },
      'replaceText': {
        '--transition--': '--Übergang--',
        '--top-middle': '--Oben-Mitte',
        '--middle': '--Mitte',
        'Anthelion': 'Anthelion',
        'Aureole': 'Aureole',
        'Beacon': 'Lichtschein',
        'Bright Spectrum': 'Gleißendes Spektrum',
        'Crystalline Blizzard III': 'Kristall-Eisga',
        'Crystalline Stone III': 'Kristall-Steinga',
        'Crystalline Water/Stone III': 'Kristall-Aquaga/Steinga',
        'Crystalline Water III': 'Kristall-Aquaga',
        'Crystallize': 'Kristallisieren',
        'Dichroic Spectrum': 'Dichroitisches Spektrum',
        'Echoes': 'Echos',
        'Equinox': 'Äquinoktium',
        'Exodus': 'Exodus',
        '(?<!Radiant )Halo': 'Halo',
        'Heros\'s Glory': 'Glorie des Heros',
        'Heros\'s Radiance': 'Glanz des Heros',
        'Heros\'s Sundering': 'Schlag des Heros',
        'Highest Holy': 'Höchstes Sanctus',
        'Incandescence': 'Inkandeszenz',
        'Infralateral Arc': 'Infralateralbogen',
        'Lateral Aureole': 'Lateralaureole',
        'Light of the Crystal': 'Licht des Kristalls',
        'Lightwave': 'Lichtwoge',
        'Magos\'s Radiance': 'Glanz des Magos',
        'Mousa\'s Scorn': 'Zorn der Mousa',
        'Parhelic Circle': 'Horizontalkreis',
        '(?<!Sub)Parhelion': 'Parhelion',
        'Pure Crystal': 'Reiner Kristall',
        'Radiant Halo': 'Strahlender Halo',
        'Shining Saber': 'Strahlender Säbel',
        'Subparhelion': 'Subparhelion',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Hydaelyn': 'Hydaelyn',
        'Mystic Refulgence': 'illusion de Lumière',
        'Parhelion': 'Parhélie',
      },
      'replaceText': {
        '\\?': ' ?',
        '--top-middle': '--En haut au milieu',
        '--middle': '--Milieu',
        'Anthelion': 'Anthélie',
        'Aureole': 'Auréole',
        'Beacon': 'Rayon de Lumière',
        'Bright Spectrum': 'Spectre lumineux',
        'Crystalline Blizzard III': 'Méga Glace cristallisée',
        'Crystalline Stone III': 'Méga Terre cristallisée',
        'Crystalline Water III': 'Méga Eau cristallisée',
        'Crystalline Water/Stone III': 'Méga Eau/Terre cristallisée',
        'Crystallize': 'Cristallisation',
        'Dichroic Spectrum': 'Spectre dichroïque',
        'Echoes': 'Échos',
        'Equinox': 'Équinoxe',
        'Exodus': 'Exode',
        '(?<!Radiant )Halo': 'Halo',
        'Heros\'s Glory': 'Gloire du héros',
        'Heros\'s Radiance': 'Radiance du héros',
        'Heros\'s Sundering': 'Fragmentation du héros',
        'Highest Holy': 'Miracle suprême',
        'Incandescence': 'Incandescence',
        'Infralateral Arc': 'Arc infralatéral',
        'Lateral Aureole': 'Auréole latérale',
        'Light of the Crystal': 'Lumière du cristal',
        'Lightwave': 'Vague de Lumière',
        'Magos\'s Radiance': 'Radiance du mage',
        'Mousa\'s Scorn': 'Mépris de la muse',
        'Parhelic Circle': 'Cercle parhélique',
        '(?<!Sub)Parhelion': 'Parhélie',
        'Pure Crystal': 'Cristal pur',
        'Radiant Halo': 'Halo radiant',
        'Shining Saber': 'Sabre de brillance',
        'Subparhelion': 'Subparhélie',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Hydaelyn': 'ハイデリン',
        'Mystic Refulgence': '幻想光',
        'Parhelion': 'パルヘリオン',
      },
      'replaceText': {
        '--middle': '--中央',
        '--top-middle': '--中央前方',
        'Anthelion': 'アントゥヘリオン',
        'Aureole/Lateral Aureole': '(サイド?) オーレオール',
        'Beacon': '光芒',
        'Bright Spectrum': 'ブライトスペクトル',
        'Crystalline Blizzard III': 'クリスタル・ブリザガ',
        'Crystalline Stone III': 'クリスタル・ストンガ',
        'Crystalline Water III': 'クリスタル・ウォタガ',
        'Crystalline Water/Stone III': 'クリスタル・ウォタガ/ストンガ',
        'Crystallize': 'クリスタライズ',
        'Dichroic Spectrum': 'ダイクロイックスペクトル',
        'Echoes': 'エコーズ',
        'Equinox': 'エクイノックス',
        'Exodus': 'エクソダス',
        '(?<!Radiant )Halo': 'ヘイロー',
        'Heros\'s Glory': 'ヘロイスグローリー',
        'Heros\'s Radiance': 'ヘロイスラジエンス',
        'Heros\'s Sundering': 'ヘロイスサンダリング',
        'Highest Holy': 'ハイエストホーリー',
        'Incandescence': '幻閃光',
        'Infralateral Arc': 'ラテラルアーク',
        'Light of the Crystal': 'ライト・オブ・クリスタル',
        'Lightwave': 'ライトウェーブ',
        'Magos\'s Radiance': 'マゴスラジエンス',
        'Mousa\'s Scorn': 'ムーサスコーン',
        'Parhelic Circle': 'パーヘリックサークル',
        '(?<!Sub)Parhelion': 'パルヘリオン',
        'Pure Crystal': 'ピュアクリスタル',
        'Radiant Halo': 'レディアントヘイロー',
        'Shining Saber': 'シャイニングセイバー',
        'Subparhelion': 'サブパルヘリオン',
      },
    },
  ],
};

export default triggerSet;
