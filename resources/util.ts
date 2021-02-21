const allJobs = <const>[
  'NONE',
  'GLA',
  'PGL',
  'MRD',
  'LNC',
  'ARC',
  'CNJ',
  'THM',
  'CRP',
  'BSM',
  'ARM',
  'GSM',
  'LTW',
  'WVR',
  'ALC',
  'CUL',
  'MIN',
  'BTN',
  'FSH',
  'PLD',
  'MNK',
  'WAR',
  'DRG',
  'BRD',
  'WHM',
  'BLM',
  'ACN',
  'SMN',
  'SCH',
  'ROG',
  'NIN',
  'MCH',
  'DRK',
  'AST',
  'SAM',
  'RDM',
  'BLU',
  'GNB',
  'DNC',
];
type Job = typeof allJobs[number];

const allRoles = <const>['tank', 'healer', 'dps', 'crafter', 'gatherer', 'none'];
type Role = typeof allRoles[number];

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

const Util = {
  jobEnumToJob: (id: number): Job => {
    const job = allJobs.find((job: Job) => nameToJobEnum[job] === id);
    return job ?? 'NONE';
  },
  jobToJobEnum: (job: Job): number => nameToJobEnum[job],
  jobToRole: (job: Job): Role => {
    const role = jobToRoleMap.get(job);
    return role ?? 'none';
  },
  getAllRoles: (): readonly Role[] => allRoles,
  isTankJob: (job: Job): boolean => tankJobs.includes(job),
  isHealerJob: (job: Job): boolean => healerJobs.includes(job),
  isMeleeDpsJob: (job: Job): boolean => meleeDpsJobs.includes(job),
  isRangedDpsJob: (job: Job): boolean => rangedDpsJobs.includes(job),
  isCasterDpsJob: (job: Job): boolean => casterDpsJobs.includes(job),
  isDpsJob: (job: Job): boolean => dpsJobs.includes(job),
  isCraftingJob: (job: Job): boolean => craftingJobs.includes(job),
  isGatheringJob: (job: Job): boolean => gatheringJobs.includes(job),
  isCombatJob: (job: Job): boolean => {
    return !craftingJobs.includes(job) && !gatheringJobs.includes(job);
  },
  canStun: (job: Job): boolean => stunJobs.includes(job),
  canSilence: (job: Job): boolean => silenceJobs.includes(job),
  canSleep: (job: Job): boolean => sleepJobs.includes(job),
  canCleanse: (job: Job): boolean => cleanseJobs.includes(job),
  canFeint: (job: Job): boolean => feintJobs.includes(job),
  canAddle: (job: Job): boolean => addleJobs.includes(job),
};

export default Util;
