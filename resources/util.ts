const kTankJobs = ['GLA', 'PLD', 'MRD', 'WAR', 'DRK', 'GNB'];
const kHealerJobs = ['CNJ', 'WHM', 'SCH', 'AST'];
const kMeleeDpsJobs = ['PGL', 'MNK', 'LNC', 'DRG', 'ROG', 'NIN', 'SAM'];
const kRangedDpsJobs = ['ARC', 'BRD', 'DNC', 'MCH'];
const kCasterDpsJobs = ['BLU', 'RDM', 'BLM', 'SMN', 'ACN', 'THM'];
const kDpsJobs = [...kMeleeDpsJobs, ...kRangedDpsJobs, ...kCasterDpsJobs];
const kCraftingJobs = ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'];
const kGatheringJobs = ['MIN', 'BTN', 'FSH'];
const kStunJobs = ['BLU', ...kTankJobs, ...kMeleeDpsJobs];
const kSilenceJobs = ['BLU', ...kTankJobs, ...kRangedDpsJobs];
const kSleepJobs = ['BLM', 'BLU', ...kHealerJobs];
const kFeintJobs = [...kMeleeDpsJobs];
const kAddleJobs = [...kCasterDpsJobs];
const kCleanseJobs = ['BLU', 'BRD', ...kHealerJobs];
const kAllRoles = ['tank', 'healer', 'dps', 'crafter', 'gatherer', 'none'];

export type Role = typeof kAllRoles[number]
export type Job = 'NONE' | typeof kDpsJobs[number]
type ID =
  0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38

const kJobEnumToName: { [key in ID]: Job } = {
  0: 'NONE',
  1: 'GLA',
  2: 'PGL',
  3: 'MRD',
  4: 'LNC',
  5: 'ARC',
  6: 'CNJ',
  7: 'THM',
  8: 'CRP',
  9: 'BSM',
  10: 'ARM',
  11: 'GSM',
  12: 'LTW',
  13: 'WVR',
  14: 'ALC',
  15: 'CUL',
  16: 'MIN',
  17: 'BTN',
  18: 'FSH',
  19: 'PLD',
  20: 'MNK',
  21: 'WAR',
  22: 'DRG',
  23: 'BRD',
  24: 'WHM',
  25: 'BLM',
  26: 'ACN',
  27: 'SMN',
  28: 'SCH',
  29: 'ROG',
  30: 'NIN',
  31: 'MCH',
  32: 'DRK',
  33: 'AST',
  34: 'SAM',
  35: 'RDM',
  36: 'BLU',
  37: 'GNB',
  38: 'DNC',
};

function swap(data: Record<ID, string>) {
  const ret: Record<string, ID> = {};
  for (const [key, value] of Object.entries(data))
    ret[value] = parseInt(key) as ID;

  return ret;
}

const kNameToJobEnum: { [key in Job]: ID } = swap(kJobEnumToName);

const jobToRoleMap: Map<Job, Role> = (() => {
  function addToMap(map: Map<Job, Role>, keys: Job[], value: Role) {
    return keys.forEach((key) => map.set(key, value));
  }

  const map: Map<Job, Role> = new Map([['NONE', 'none']]);
  addToMap(map, kTankJobs, 'tank');
  addToMap(map, kHealerJobs, 'healer');
  addToMap(map, kDpsJobs, 'dps');
  addToMap(map, kCraftingJobs, 'crafter');
  addToMap(map, kGatheringJobs, 'gatherer');

  return new Proxy(map, {
    get: function(target, element: string) {
      if (element === 'get') return (s: string) => target.get.call(target, s); // bypass `Map.get() `
      if (target.has(element))
        return target.get(element) || '';
      console.log(`Unknown job role ${element}`);
      return '';
    },
  });
})();

export function jobEnumToJob(id: ID): Job {
  return kJobEnumToName[id];
}

export function jobToJobEnum(job: Job): ID {
  return kNameToJobEnum[job] || 0;
}

export function jobToRole(job: Job): Role {
  return jobToRoleMap.get(job) || '';
}

export function getAllRoles(): Role[] {
  return kAllRoles;
}

export function isTankJob(job: Job): boolean {
  return kTankJobs.includes(job);
}


// jobEnumToJob: (id) => kJobEnumToName[id],
export function isHealerJob(job: Job): boolean {
  return kHealerJobs.includes(job);
}

export function isMeleeDpsJob(job: Job): boolean {
  return kMeleeDpsJobs.includes(job);
}

export function isRangedDpsJob(job: Job): boolean {
  return kRangedDpsJobs.includes(job);
}

export function isCasterDpsJob(job: Job): boolean {
  return kCasterDpsJobs.includes(job);
}

export function isDpsJob(job: Job): boolean {
  return kDpsJobs.includes(job);
}

export function isCraftingJob(job: Job): boolean {
  return kCraftingJobs.includes(job);
}

export function isGatheringJob(job: Job): boolean {
  return kGatheringJobs.includes(job);
}

export function isCombatJob(job: Job): boolean {
  return !isCraftingJob(job) && !isGatheringJob(job);
}

export function canStun(job: Job): boolean {
  return kStunJobs.includes(job);
}

export function canSilence(job: Job): boolean {
  return kSilenceJobs.includes(job);
}

export function canSleep(job: Job): boolean {
  return kSleepJobs.includes(job);
}

export function canCleanse(job: Job): boolean {
  return kCleanseJobs.includes(job);
}

export function canFeint(job: Job): boolean {
  return kFeintJobs.includes(job);
}

export function canAddle(job: Job): boolean {
  return kAddleJobs.includes(job);
}

export default {
  jobEnumToJob,
  jobToJobEnum,
  jobToRole,
  getAllRoles,
  isTankJob,
  isHealerJob,
  isMeleeDpsJob,
  isRangedDpsJob,
  isCasterDpsJob,
  isDpsJob,
  isCraftingJob,
  isGatheringJob,
  isCombatJob,
  canStun,
  canSilence,
  canSleep,
  canCleanse,
  canFeint,
  jobToRoleMap,
  canAddle,
};
