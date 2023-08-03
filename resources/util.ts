import {
  OverlayHandlerRequests,
  OverlayHandlerResponseTypes,
  PluginCombatantState,
} from '../types/event';
import { Job, Role } from '../types/job';
import { NetMatches } from '../types/net_matches';
import { LocaleText, OutputStrings } from '../types/trigger';

import { Lang } from './languages';
import { gameLogCodes } from './netregexes';
import Outputs from './outputs';
import { callOverlayHandler } from './overlay_plugin_api';

// TODO: it'd be nice to not repeat job names, but at least Record enforces that all are set.
const nameToJobEnum: Record<Job, number> = {
  NONE: 0,
  GLA: 1,
  PGL: 2,
  MRD: 3,
  LNC: 4,
  ARC: 5,
  CNJ: 6,
  THM: 7,
  CRP: 8,
  BSM: 9,
  ARM: 10,
  GSM: 11,
  LTW: 12,
  WVR: 13,
  ALC: 14,
  CUL: 15,
  MIN: 16,
  BTN: 17,
  FSH: 18,
  PLD: 19,
  MNK: 20,
  WAR: 21,
  DRG: 22,
  BRD: 23,
  WHM: 24,
  BLM: 25,
  ACN: 26,
  SMN: 27,
  SCH: 28,
  ROG: 29,
  NIN: 30,
  MCH: 31,
  DRK: 32,
  AST: 33,
  SAM: 34,
  RDM: 35,
  BLU: 36,
  GNB: 37,
  DNC: 38,
  RPR: 39,
  SGE: 40,
};

const nameToLocaleText: Record<Job, LocaleText> = {
  NONE: { en: 'Adventurer', cn: '无' },
  GLA: { en: 'Gladiator', cn: '剑术师' },
  PGL: { en: 'Pugilist', cn: '格斗家' },
  MRD: { en: 'Marauder', cn: '斧术师' },
  LNC: { en: 'Lancer', cn: '枪术士' },
  ARC: { en: 'Archer', cn: '弓箭手' },
  CNJ: { en: 'Conjurer', cn: '幻术师' },
  THM: { en: 'Thaumaturge', cn: '咒术师' },
  CRP: { en: 'Carpenter', cn: '刻木匠' },
  BSM: { en: 'Blacksmith', cn: '段铁匠' },
  ARM: { en: 'Armorer', cn: '铸甲匠' },
  GSM: { en: 'Goldsmith', cn: '雕金匠' },
  LTW: { en: 'Leatherworker', cn: '制革匠' },
  WVR: { en: 'Weaver', cn: '裁衣匠' },
  ALC: { en: 'Alchemist', cn: '炼金术师' },
  CUL: { en: 'Culinarian', cn: '烹调师' },
  MIN: { en: 'Miner', cn: '采矿工' },
  BTN: { en: 'Botanist', cn: '园艺工' },
  FSH: { en: 'Fisher', cn: '捕鱼人' },
  PLD: { en: 'Paladin', cn: '骑士' },
  MNK: { en: 'Monk', cn: '武僧' },
  WAR: { en: 'Warrior', cn: '战士' },
  DRG: { en: 'Dragoon', cn: '龙骑士' },
  BRD: { en: 'Bard', cn: '吟游诗人' },
  WHM: { en: 'White Mage', cn: '白魔法师' },
  BLM: { en: 'Black Mage', cn: '黑魔法师' },
  ACN: { en: 'Arcanist', cn: '秘术师' },
  SMN: { en: 'Summoner', cn: '召唤师' },
  SCH: { en: 'Scholar', cn: '学者' },
  ROG: { en: 'Rogue', cn: '双剑师' },
  NIN: { en: 'Ninja', cn: '忍者' },
  MCH: { en: 'Machinist', cn: '机工士' },
  DRK: { en: 'Dark Knight', cn: '暗黑骑士' },
  AST: { en: 'Astrologian', cn: '占星术士' },
  SAM: { en: 'Samurai', cn: '武士' },
  RDM: { en: 'Red Mage', cn: '赤魔法师' },
  BLU: { en: 'Blue Mage Mage', cn: '青魔法师' },
  GNB: { en: 'Gunbreaker', cn: '绝枪战士' },
  DNC: { en: 'Dancer', cn: '舞者' },
  RPR: { en: 'Reaper', cn: '钐镰客' },
  SGE: { en: 'Sage', cn: '贤者' },
};

const allJobs = Object.keys(nameToJobEnum) as Job[];
const allRoles = ['tank', 'healer', 'dps', 'crafter', 'gatherer', 'none'] as Role[];

const tankJobs: Job[] = ['GLA', 'PLD', 'MRD', 'WAR', 'DRK', 'GNB'];
const healerJobs: Job[] = ['CNJ', 'WHM', 'SCH', 'AST', 'SGE'];
const meleeDpsJobs: Job[] = ['PGL', 'MNK', 'LNC', 'DRG', 'ROG', 'NIN', 'SAM', 'RPR'];
const rangedDpsJobs: Job[] = ['ARC', 'BRD', 'DNC', 'MCH'];
const casterDpsJobs: Job[] = ['BLU', 'RDM', 'BLM', 'SMN', 'ACN', 'THM'];
const dpsJobs: Job[] = [...meleeDpsJobs, ...rangedDpsJobs, ...casterDpsJobs];
const craftingJobs: Job[] = ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'];
const gatheringJobs: Job[] = ['MIN', 'BTN', 'FSH'];

const stunJobs: Job[] = ['BLU', ...tankJobs, ...meleeDpsJobs];
const silenceJobs: Job[] = ['BLU', ...tankJobs, ...rangedDpsJobs];
const sleepJobs: Job[] = [...casterDpsJobs, ...healerJobs];
const feintJobs: Job[] = [...meleeDpsJobs];
const addleJobs: Job[] = [...casterDpsJobs];
const cleanseJobs: Job[] = ['BLU', 'BRD', ...healerJobs];

const jobToRoleMap: Map<Job, Role> = (() => {
  const addToMap = (map: Map<Job, Role>, jobs: Job[], role: Role) => {
    jobs.forEach((job) => map.set(job, role));
  };

  const map: Map<Job, Role> = new Map([['NONE', 'none']]);
  addToMap(map, tankJobs, 'tank');
  addToMap(map, healerJobs, 'healer');
  addToMap(map, dpsJobs, 'dps');
  addToMap(map, craftingJobs, 'crafter');
  addToMap(map, gatheringJobs, 'gatherer');

  return map;
})();

export type WatchCombatantParams = {
  ids?: number[];
  names?: string[];
  props?: string[];
  delay?: number;
  maxDuration?: number;
};

export type WatchCombatantFunc = (
  params: WatchCombatantParams,
  func: (ret: OverlayHandlerResponseTypes['getCombatants']) => boolean,
) => Promise<void>;

type WatchCombatantMapEntry = {
  cancel: boolean;
  start: number;
};

const watchCombatantMap: WatchCombatantMapEntry[] = [];

const shouldCancelWatch = (
  params: WatchCombatantParams,
  entry: WatchCombatantMapEntry,
): boolean => {
  if (entry.cancel)
    return true;
  if (params.maxDuration !== undefined && Date.now() - entry.start > params.maxDuration)
    return true;
  return false;
};

const defaultWatchCombatant: WatchCombatantFunc = (params, func) => {
  return new Promise<void>((res, rej) => {
    const delay = params.delay ?? 1000;

    const call: OverlayHandlerRequests['getCombatants'] = {
      call: 'getCombatants',
    };

    if (params.ids)
      call.ids = params.ids;

    if (params.names)
      call.names = params.names;

    if (params.props)
      call.props = params.props;

    const entry: WatchCombatantMapEntry = {
      cancel: false,
      start: Date.now(),
    };

    watchCombatantMap.push(entry);

    const checkFunc = () => {
      if (shouldCancelWatch(params, entry)) {
        rej(new Error('cancelled'));
        return;
      }
      void callOverlayHandler(call).then((response) => {
        if (entry.cancel) {
          rej(new Error('was cancelled'));
          return;
        }
        if (func(response))
          res();
        else
          window.setTimeout(checkFunc, delay);
      });
    };

    window.setTimeout(checkFunc, delay);
  });
};

let watchCombatantOverride: WatchCombatantFunc | undefined;
let clearCombatantsOverride: () => void | undefined;

const defaultClearCombatants = () => {
  while (watchCombatantMap.length > 0) {
    const watch = watchCombatantMap.pop();
    if (watch)
      watch.cancel = true;
  }
};

const watchCombatant: WatchCombatantFunc = (params, func) => {
  if (watchCombatantOverride)
    return watchCombatantOverride(params, func);

  return defaultWatchCombatant(params, func);
};

export type DirectionOutput16 =
  | 'dirN'
  | 'dirNNE'
  | 'dirNE'
  | 'dirENE'
  | 'dirE'
  | 'dirESE'
  | 'dirSE'
  | 'dirSSE'
  | 'dirS'
  | 'dirSSW'
  | 'dirSW'
  | 'dirWSW'
  | 'dirW'
  | 'dirWNW'
  | 'dirNW'
  | 'dirNNW'
  | 'unknown';

export type DirectionOutput8 =
  | 'dirN'
  | 'dirNE'
  | 'dirE'
  | 'dirSE'
  | 'dirS'
  | 'dirSW'
  | 'dirW'
  | 'dirNW'
  | 'unknown';

export type DirectionOutputCardinal =
  | 'dirN'
  | 'dirE'
  | 'dirS'
  | 'dirW'
  | 'unknown';

export type DirectionOutputIntercard =
  | 'dirNE'
  | 'dirSE'
  | 'dirSW'
  | 'dirNW'
  | 'unknown';

const output8Dir: DirectionOutput8[] = [
  'dirN',
  'dirNE',
  'dirE',
  'dirSE',
  'dirS',
  'dirSW',
  'dirW',
  'dirNW',
];
const outputCardinalDir: DirectionOutputCardinal[] = ['dirN', 'dirE', 'dirS', 'dirW'];
const outputIntercardDir: DirectionOutputIntercard[] = ['dirNE', 'dirSE', 'dirSW', 'dirNW'];

const outputStrings16Dir: { [outputString: string]: OutputStrings } = {
  dirN: Outputs.dirN,
  dirNNE: Outputs.dirNNE,
  dirNE: Outputs.dirNE,
  dirENE: Outputs.dirENE,
  dirE: Outputs.dirE,
  dirESE: Outputs.dirESE,
  dirSE: Outputs.dirSE,
  dirSSE: Outputs.dirSSE,
  dirS: Outputs.dirS,
  dirSSW: Outputs.dirSSW,
  dirSW: Outputs.dirSW,
  dirWSW: Outputs.dirWSW,
  dirW: Outputs.dirW,
  dirWNW: Outputs.dirWNW,
  dirNW: Outputs.dirNW,
  dirNNW: Outputs.dirNNW,
  unknown: Outputs.unknown,
};

const outputStrings8Dir: { [outputString: string]: OutputStrings } = {
  dirN: Outputs.dirN,
  dirNE: Outputs.dirNE,
  dirE: Outputs.dirE,
  dirSE: Outputs.dirSE,
  dirS: Outputs.dirS,
  dirSW: Outputs.dirSW,
  dirW: Outputs.dirW,
  dirNW: Outputs.dirNW,
  unknown: Outputs.unknown,
};

const outputStringsCardinalDir: { [outputString: string]: OutputStrings } = {
  dirN: Outputs.dirN,
  dirE: Outputs.dirE,
  dirS: Outputs.dirS,
  dirW: Outputs.dirW,
  unknown: Outputs.unknown,
};

const outputStringsIntercardDir: { [outputString: string]: OutputStrings } = {
  dirNE: Outputs.dirNE,
  dirSE: Outputs.dirSE,
  dirSW: Outputs.dirSW,
  dirNW: Outputs.dirNW,
  unknown: Outputs.unknown,
};

// TODO: Accept 'north' as a function input and adjust output accordingly.
// E.g. Math.round((north + 4) - 4 * Math.atan2(x, y) / Math.PI) % 8;
// Will need to adjust the output arrays as well though.

const xyTo8DirNum = (x: number, y: number, centerX: number, centerY: number): number => {
  // N = 0, NE = 1, ..., NW = 7
  x = x - centerX;
  y = y - centerY;
  return Math.round(4 - 4 * Math.atan2(x, y) / Math.PI) % 8;
};

const hdgTo8DirNum = (heading: number): number => {
  // N = 0, NE = 1, ..., NW = 7
  return (Math.round(4 - 4 * heading / Math.PI) % 8 + 8) % 8;
};

const hdgTo4DirNum = (heading: number): number => {
  // N = 0, E = 1, S = 2, W = 3
  return (Math.round(2 - heading * 2 / Math.PI) % 4 + 4) % 4;
};

const outputFrom8DirNum = (dirNum: number): DirectionOutput8 => {
  return output8Dir[dirNum] ?? 'unknown';
};

export const Directions = {
  output8Dir: output8Dir,
  outputCardinalDir: outputCardinalDir,
  outputIntercardDir: outputIntercardDir,
  outputStrings16Dir: outputStrings16Dir,
  outputStrings8Dir: outputStrings8Dir,
  outputStringsCardinalDir: outputStringsCardinalDir,
  outputStringsIntercardDir: outputStringsIntercardDir,
  xyTo8DirNum: xyTo8DirNum,
  hdgTo8DirNum: hdgTo8DirNum,
  hdgTo4DirNum: hdgTo4DirNum,
  outputFrom8DirNum: outputFrom8DirNum,
  combatantStatePosTo8Dir: (
    combatant: PluginCombatantState,
    centerX: number,
    centerY: number,
  ): number => {
    return xyTo8DirNum(combatant.PosX, combatant.PosY, centerX, centerY);
  },
  combatantStatePosTo8DirOutput: (
    combatant: PluginCombatantState,
    centerX: number,
    centerY: number,
  ): DirectionOutput8 => {
    const dirNum = xyTo8DirNum(combatant.PosX, combatant.PosY, centerX, centerY);
    return outputFrom8DirNum(dirNum);
  },
  combatantStateHdgTo8Dir: (combatant: PluginCombatantState): number => {
    return hdgTo8DirNum(combatant.Heading);
  },
  combatantStateHdgTo8DirOutput: (combatant: PluginCombatantState): DirectionOutput8 => {
    const dirNum = hdgTo8DirNum(combatant.Heading);
    return outputFrom8DirNum(dirNum);
  },
  addedCombatantPosTo8Dir: (
    combatant: NetMatches['AddedCombatant'],
    centerX: number,
    centerY: number,
  ): number => {
    const x = parseFloat(combatant.x);
    const y = parseFloat(combatant.y);
    return xyTo8DirNum(x, y, centerX, centerY);
  },
  addedCombatantPosTo8DirOutput: (
    combatant: NetMatches['AddedCombatant'],
    centerX: number,
    centerY: number,
  ): DirectionOutput8 => {
    const x = parseFloat(combatant.x);
    const y = parseFloat(combatant.y);
    const dirNum = xyTo8DirNum(x, y, centerX, centerY);
    return outputFrom8DirNum(dirNum);
  },
  addedCombatantHdgTo8Dir: (combatant: NetMatches['AddedCombatant']): number => {
    const heading = parseFloat(combatant.heading);
    return hdgTo8DirNum(heading);
  },
  addedCombatantHdgTo8DirOutput: (combatant: NetMatches['AddedCombatant']): DirectionOutput8 => {
    const heading = parseFloat(combatant.heading);
    const dirNum = hdgTo8DirNum(heading);
    return outputFrom8DirNum(dirNum);
  },
  xyTo8DirOutput: (x: number, y: number, centerX: number, centerY: number): DirectionOutput8 => {
    const dirNum = xyTo8DirNum(x, y, centerX, centerY);
    return outputFrom8DirNum(dirNum);
  },
};

const Util = {
  jobEnumToJob: (id: number) => {
    const job = allJobs.find((job: Job) => nameToJobEnum[job] === id);
    return job ?? 'NONE';
  },
  jobEnumToLocaleText: (id: number, lang: Lang) => {
    const job = allJobs.find((job: Job) => nameToJobEnum[job] === id);
    if (job) {
      return nameToLocaleText?.[job]?.[lang] ?? 'NONE';
    }
    return 'NONE';
  },
  jobToJobEnum: (job: Job) => nameToJobEnum[job],
  jobToRole: (job: Job) => {
    const role = jobToRoleMap.get(job);
    return role ?? 'none';
  },
  getAllRoles: (): readonly Role[] => allRoles,
  isTankJob: (job: Job) => tankJobs.includes(job),
  isHealerJob: (job: Job) => healerJobs.includes(job),
  isMeleeDpsJob: (job: Job) => meleeDpsJobs.includes(job),
  isRangedDpsJob: (job: Job) => rangedDpsJobs.includes(job),
  isCasterDpsJob: (job: Job) => casterDpsJobs.includes(job),
  isDpsJob: (job: Job) => dpsJobs.includes(job),
  isCraftingJob: (job: Job) => craftingJobs.includes(job),
  isGatheringJob: (job: Job) => gatheringJobs.includes(job),
  isCombatJob: (job: Job) => {
    return !craftingJobs.includes(job) && !gatheringJobs.includes(job);
  },
  canStun: (job: Job) => stunJobs.includes(job),
  canSilence: (job: Job) => silenceJobs.includes(job),
  canSleep: (job: Job) => sleepJobs.includes(job),
  canCleanse: (job: Job) => cleanseJobs.includes(job),
  canFeint: (job: Job) => feintJobs.includes(job),
  canAddle: (job: Job) => addleJobs.includes(job),
  watchCombatant: watchCombatant,
  clearWatchCombatants: () => {
    if (clearCombatantsOverride !== undefined)
      clearCombatantsOverride();
    else
      defaultClearCombatants();
  },
  setWatchCombatantOverride: (watchFunc: WatchCombatantFunc, clearFunc: () => void) => {
    watchCombatantOverride = watchFunc;
    clearCombatantsOverride = clearFunc;
  },
  gameLogCodes: gameLogCodes,
} as const;

export default Util;
