import Util from '../../resources/util';
import chai from 'chai';

const { assert } = chai;

// Duplicate values from util.ts
// Expect to update these as patches and expansions change job capabilities
const jobs = (() => {
  class Job {
    constructor(name, role, actions = []) {
      this.name = name;
      this.role = role;
      this.actions = actions;
    }
  }

  const tankJobs = ['GLA', 'PLD', 'MRD', 'WAR', 'DRK', 'GNB'];
  const healerJobs = ['CNJ', 'WHM', 'SCH', 'AST'];
  const meleeDpsJobs = ['PGL', 'MNK', 'LNC', 'DRG', 'ROG', 'NIN', 'SAM'];
  const rangedDpsJobs = ['ARC', 'BRD', 'DNC', 'MCH'];
  const casterDpsJobs = ['BLU', 'RDM', 'BLM', 'SMN', 'ACN', 'THM'];
  const dpsJobs = [...meleeDpsJobs, ...rangedDpsJobs, ...casterDpsJobs];
  const craftingJobs = ['CRP', 'BSM', 'ARM', 'GSM', 'LTW', 'WVR', 'ALC', 'CUL'];
  const gatheringJobs = ['MIN', 'BTN', 'FSH'];

  const jobs = [];

  // Initialize all the jobs with standardized role action values
  tankJobs.forEach((job) => jobs.push(new Job(job, 'tank', ['Silence', 'Stun'])));
  healerJobs.forEach((job) => jobs.push(new Job(job, 'healer', ['Cleanse', 'Sleep'])));
  meleeDpsJobs.forEach((job) => jobs.push(new Job(job, 'dps', ['Feint', 'Stun'])));
  rangedDpsJobs.forEach((job) => jobs.push(new Job(job, 'dps', ['Silence'])));
  casterDpsJobs.forEach((job) => jobs.push(new Job(job, 'dps', ['Addle'])));
  craftingJobs.forEach((job) => jobs.push(new Job(job, 'crafter')));
  gatheringJobs.forEach((job) => jobs.push(new Job(job, 'gatherer')));

  // Special classes
  jobs.find((job) => job.name === 'BRD').actions.push('Cleanse');
  jobs.find((job) => job.name === 'BLM').actions.push('Sleep');
  jobs.find((job) => job.name === 'BLU').actions.push('Cleanse', 'Silence', 'Sleep', 'Stun');

  return jobs;
})();

describe('util tests', () => {
  // Check test job values match actual values from util.js and return their expected values
  it('jobs should support Util.canX if it can', () => {
    [['Addle', Util.canAddle], ['Cleanse', Util.canCleanse], ['Feint', Util.canFeint], ['Silence', Util.canSilence], ['Sleep', Util.canSleep], ['Stun', Util.canStun]]
      .forEach(([action, functionCall]) => {
        // If job can do X, assert canX returns true
        jobs.filter((job) => job.actions.includes(action))
          .forEach((job) => assert(functionCall(job.name)));
        // If job can't do X, assert canX returns false
        jobs.filter((job) => !job.actions.includes(action))
          .forEach((job) => assert(!functionCall(job.name)));
      });
  });
  it('jobs should have the correct roles', () => {
    [['crafter', Util.isCraftingJob], ['dps', Util.isDpsJob], ['gatherer', Util.isGatheringJob], ['healer', Util.isHealerJob], ['tank', Util.isTankJob]]
      .forEach(([role, functionCall]) => {
        // If job is a role, assert isRole returns true
        jobs.filter((job) => job.role === role).forEach((job) => assert(functionCall(job.name)));
        // If job is not a role, assert isRole returns false
        jobs.filter((job) => job.role !== role).forEach((job) => assert(!functionCall(job.name)));
      });
  });
  it('jobs should be in the role map correctly', () => {
    jobs.forEach((job) => assert.deepEqual(job.role, Util.jobToRole(job.name)));
  });
  it('jobs should be set as combat roles correctly', () => {
    jobs.filter((job) => ['tank', 'healer', 'dps'].includes(job.role)).forEach((job) => assert(Util.isCombatJob(job.name)));
    jobs.filter((job) => ['crafter', 'gatherer'].includes(job.role)).forEach((job) => assert(!Util.isCombatJob(job.name)));
  });
});
