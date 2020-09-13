'use strict';

let kCasterJobs = ['BLU', 'RDM', 'BLM', 'WHM', 'SCH', 'SMN', 'ACN', 'AST', 'CNJ', 'THM'];
let kRangedDpsJobs = ['ARC', 'BRD', 'DNC', 'MCH'];
let kTankJobs = ['GLA', 'PLD', 'MRD', 'WAR', 'DRK', 'GNB'];
let kHealerJobs = ['CNJ', 'WHM', 'SCH', 'AST'];
let kCraftingJobs = ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'];
let kGatheringJobs = ['MIN', 'BTN', 'FSH'];

let kStunJobs = ['SAM', 'NIN', 'ROG', 'DRG', 'LNC', 'MNK', 'PGL', 'WAR', 'MRD', 'PLD', 'GLA', 'DRK', 'GNB'];
let kSilenceJobs = ['MCH', 'BRD', 'ARC', 'DNC', 'BLU', 'GLA', 'PLD', 'MRD', 'WAR', 'DRK', 'GNB'];
let kSleepJobs = ['BLM', 'WHM', 'SCH', 'AST'];
let kFeintJobs = ['SAM', 'NIN', 'ROG', 'DRG', 'LNC', 'MNK', 'PGL'];
let kAddleJobs = ['BLU', 'RDM', 'SMN', 'ACN', 'BLM', 'THM'];
let kCleanseJobs = ['AST', 'BRD', 'CNJ', 'SCH', 'WHM'];
let kAllRoles = ['tank', 'healer', 'dps', 'crafter', 'gatherer', 'none'];

let kJobEnumToName = {
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

let Util = {
  jobEnumToJob: function(id) {
    return kJobEnumToName[id];
  },
  jobToJobEnum: function(job) {
    return Object.keys(kJobEnumToName).filter((k) => kJobEnumToName[k] === job).pop();
  },
  jobToRole: function(job) {
    let role;
    if (job.search(/^(WAR|DRK|PLD|GNB|MRD|GLA)$/) >= 0) {
      role = 'tank';
    } else if (job.search(/^(WHM|SCH|AST|CNJ)$/) >= 0) {
      role = 'healer';
    } else if (job.search(/^(MNK|NIN|DRG|SAM|ROG|LNC|PGL)$/) >= 0) {
      role = 'dps';
    } else if (job.search(/^(BLU|BLM|SMN|RDM|THM|ACN)$/) >= 0) {
      role = 'dps';
    } else if (job.search(/^(BRD|MCH|DNC|ARC)$/) >= 0) {
      role = 'dps';
    } else if (job.search(/^(CRP|BSM|ARM|GSM|LTW|WVR|ALC|CUL)$/) >= 0) {
      role = 'crafter';
    } else if (job.search(/^(MIN|BTN|FSH)$/) >= 0) {
      role = 'gatherer';
    } else if (job === 'NONE') {
      role = 'none';
    } else {
      role = '';
      console.log('Unknown job role');
    }
    return role;
  },

  isCasterJob: function(job) {
    return kCasterJobs.indexOf(job) >= 0;
  },

  isRangedDpsJob: function(job) {
    return kRangedDpsJobs.indexOf(job) >= 0;
  },

  isTankJob: function(job) {
    return kTankJobs.indexOf(job) >= 0;
  },

  isHealerJob: function(job) {
    return kHealerJobs.indexOf(job) >= 0;
  },

  isCraftingJob: function(job) {
    return kCraftingJobs.indexOf(job) >= 0;
  },

  isGatheringJob: function(job) {
    return kGatheringJobs.indexOf(job) >= 0;
  },

  isCombatJob: function(job) {
    return !this.isCraftingJob(job) && !this.isGatheringJob(job);
  },

  canStun: function(job) {
    return kStunJobs.indexOf(job) >= 0;
  },
  canSilence: function(job) {
    return kSilenceJobs.indexOf(job) >= 0;
  },
  canSleep: function(job) {
    return kSleepJobs.indexOf(job) >= 0;
  },
  canCleanse: function(job) {
    return kCleanseJobs.indexOf(job) >= 0;
  },
  canFeint: function(job) {
    return kFeintJobs.indexOf(job) >= 0;
  },
  canAddle: function(job) {
    return kAddleJobs.indexOf(job) >= 0;
  },
};
