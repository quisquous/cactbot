import { OverlayHandlerRequests, OverlayHandlerResponseTypes } from '../types/event';
import { Job, Role } from '../types/job';

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
};

const allJobs = Object.keys(nameToJobEnum) as Job[];
const allRoles = ['tank', 'healer', 'dps', 'crafter', 'gatherer', 'none'] as Role[];

const tankJobs: Job[] = ['GLA', 'PLD', 'MRD', 'WAR', 'DRK', 'GNB'];
const healerJobs: Job[] = ['CNJ', 'WHM', 'SCH', 'AST'];
const meleeDpsJobs: Job[] = ['PGL', 'MNK', 'LNC', 'DRG', 'ROG', 'NIN', 'SAM'];
const rangedDpsJobs: Job[] = ['ARC', 'BRD', 'DNC', 'MCH'];
const casterDpsJobs: Job[] = ['BLU', 'RDM', 'BLM', 'SMN', 'ACN', 'THM'];
const dpsJobs: Job[] = [...meleeDpsJobs, ...rangedDpsJobs, ...casterDpsJobs];
const craftingJobs: Job[] = ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'];
const gatheringJobs: Job[] = ['MIN', 'BTN', 'FSH'];

const stunJobs: Job[] = ['BLU', ...tankJobs, ...meleeDpsJobs];
const silenceJobs: Job[] = ['BLU', ...tankJobs, ...rangedDpsJobs];
const sleepJobs: Job[] = ['BLM', 'BLU', ...healerJobs];
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

type WatchCombatantParams = {
  ids?: number[];
  names?: string[];
  props?: string[];
  delay?: number;
  maxDuration?: number;
};

type WatchCombatantFunc = (
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

const watchCombatant: WatchCombatantFunc = (params, func) => {
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
        rej();
        return;
      }
      void callOverlayHandler(call).then((response) => {
        if (entry.cancel) {
          rej();
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

const clearWatchCombatants = (): void => {
  while (watchCombatantMap.length > 0) {
    const watch = watchCombatantMap.pop();
    if (watch)
      watch.cancel = true;
  }
};

const jobEnumToJob = (id: number): Job => {
  const job = allJobs.find((job: Job) => nameToJobEnum[job] === id);
  return job ?? 'NONE';
};
const jobToJobEnum = (job: Job): number => nameToJobEnum[job];
const jobToRole = (job: Job): Role => {
  const role = jobToRoleMap.get(job);
  return role ?? 'none';
};
const getAllRoles = (): readonly Role[] => allRoles;
const isTankJob = (job: Job): boolean => tankJobs.includes(job);
const isHealerJob = (job: Job): boolean => healerJobs.includes(job);
const isMeleeDpsJob = (job: Job): boolean => meleeDpsJobs.includes(job);
const isRangedDpsJob = (job: Job): boolean => rangedDpsJobs.includes(job);
const isCasterDpsJob = (job: Job): boolean => casterDpsJobs.includes(job);
const isDpsJob = (job: Job): boolean => dpsJobs.includes(job);
const isCraftingJob = (job: Job): boolean => craftingJobs.includes(job);
const isGatheringJob = (job: Job): boolean => gatheringJobs.includes(job);
const isCombatJob = (job: Job): boolean => {
  return !craftingJobs.includes(job) && !gatheringJobs.includes(job);
};
const canStun = (job: Job): boolean => stunJobs.includes(job);
const canSilence = (job: Job): boolean => silenceJobs.includes(job);
const canSleep = (job: Job): boolean => sleepJobs.includes(job);
const canCleanse = (job: Job): boolean => cleanseJobs.includes(job);
const canFeint = (job: Job): boolean => feintJobs.includes(job);
const canAddle = (job: Job): boolean => addleJobs.includes(job);

export default {
  canAddle,
  canCleanse,
  canFeint,
  canSilence,
  canSleep,
  canStun,
  clearWatchCombatants,
  getAllRoles,
  isCasterDpsJob,
  isCombatJob,
  isCraftingJob,
  isDpsJob,
  isGatheringJob,
  isHealerJob,
  isMeleeDpsJob,
  isRangedDpsJob,
  isTankJob,
  jobEnumToJob,
  jobToJobEnum,
  jobToRole,
  watchCombatant,
};
