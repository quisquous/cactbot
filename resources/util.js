const Util = (() => {
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

  const kJobEnumToName = {
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

  const jobToRoleMap = (() => {
    const addToMap = (map, keys, value) => keys.forEach((key) => map.set(key, value));

    const map = new Map([['NONE', 'none']]);
    addToMap(map, kTankJobs, 'tank');
    addToMap(map, kHealerJobs, 'healer');
    addToMap(map, kDpsJobs, 'dps');
    addToMap(map, kCraftingJobs, 'crafter');
    addToMap(map, kGatheringJobs, 'gatherer');

    return new Proxy(map, {
      get: function(target, element) {
        if (target.has(element))
          return target.get(element);
        console.log(`Unknown job role ${element}`);
        return '';
      },
    });
  })();

  return {
    jobEnumToJob: (id) => kJobEnumToName[id],
    jobToJobEnum: (job) => Object.keys(kJobEnumToName).find((k) => kJobEnumToName[k] === job),
    jobToRole: (job) => jobToRoleMap[job],
    getAllRoles: () => kAllRoles,
    isTankJob: (job) => kTankJobs.includes(job),
    isHealerJob: (job) => kHealerJobs.includes(job),
    isMeleeDpsJob: (job) => kMeleeDpsJobs.includes(job),
    isRangedDpsJob: (job) => kRangedDpsJobs.includes(job),
    isCasterDpsJob: (job) => kCasterDpsJobs.includes(job),
    isDpsJob: (job) => kDpsJobs.includes(job),
    isCraftingJob: (job) => kCraftingJobs.includes(job),
    isGatheringJob: (job) => kGatheringJobs.includes(job),
    isCombatJob: function(job) {
      return !this.isCraftingJob(job) && !this.isGatheringJob(job);
    },
    canStun: (job) => kStunJobs.includes(job),
    canSilence: (job) => kSilenceJobs.includes(job),
    canSleep: (job) => kSleepJobs.includes(job),
    canCleanse: (job) => kCleanseJobs.includes(job),
    canFeint: (job) => kFeintJobs.includes(job),
    canAddle: (job) => kAddleJobs.includes(job),
  };
})();

export default Util;
