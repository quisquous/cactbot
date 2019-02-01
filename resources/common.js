'use strict';

let kCasterJobs = ['BLU', 'RDM', 'BLM', 'WHM', 'SCH', 'SMN', 'ACN', 'AST', 'CNJ', 'THM'];
let kTankJobs = ['GLA', 'PLD', 'MRD', 'WAR', 'DRK'];
let kHealerJobs = ['CNJ', 'WHM', 'SCH', 'AST'];
let kCraftingJobs = ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'];
let kGatheringJobs = ['MIN', 'BTN', 'FSH'];

let Util = {
  jobToRole: function(job) {
    let role;
    if (job.search(/^(WAR|DRK|PLD|MRD|GLA)$/) >= 0) {
      role = 'tank';
    } else if (job.search(/^(WHM|SCH|AST|CNJ)$/) >= 0) {
      role = 'healer';
    } else if (job.search(/^(MNK|NIN|DRG|SAM|ROG|LNC|PGL)$/) >= 0) {
      role = 'dps-melee';
    } else if (job.search(/^(BLU|BLM|SMN|RDM|THM|ACN)$/) >= 0) {
      role = 'dps-caster';
    } else if (job.search(/^(BRD|MCH|ARC)$/) >= 0) {
      role = 'dps-ranged';
    } else if (job.search(/^(CRP|BSM|ARM|GSM|LTW|WVR|ALC|CUL)$/) >= 0) {
      role = 'crafting';
    } else if (job.search(/^(MIN|BTN|FSH)$/) >= 0) {
      role = 'gathering';
    } else {
      role = '';
      console.log('Unknown job role');
    }
    return role;
  },

  isCasterJob: function(job) {
    return kCasterJobs.indexOf(job) >= 0;
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
};
