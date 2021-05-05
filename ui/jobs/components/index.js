import { setup as setupPld } from './pld';
import { setup as setupWar } from './war';
import { setup as setupDrk } from './drk';
import { setup as setupGnb } from './gnb';
import { setup as setupWhm } from './whm';
import { setup as setupSch } from './sch';
import { setup as setupAst } from './ast';
import { setup as setupMnk } from './mnk';
import { setup as setupDrg } from './drg';
import { setup as setupNin } from './nin';
import { setup as setupSam } from './sam';
import { setup as setupBrd } from './brd';
import { setup as setupMch } from './mch';
import { setup as setupDnc } from './dnc';
import { setup as setupBlm } from './blm';
import { setup as setupSmn } from './smn';
import { setup as setupRdm } from './rdm';
import { setup as setupBlu } from './blu';

/**
 * @callback SetupFunction
 * @param {import("../jobs").Bars} bar
 * @returns {void}
 */

/**
 * @param {import("../../../types/job").Job} job
 * @returns {SetupFunction | undefined}
 */
export function getSetup(job) {
  return {
    'PLD': setupPld,
    'WAR': setupWar,
    'DRK': setupDrk,
    'GNB': setupGnb,
    'WHM': setupWhm,
    'SCH': setupSch,
    'AST': setupAst,
    'MNK': setupMnk,
    'DRG': setupDrg,
    'NIN': setupNin,
    'SAM': setupSam,
    'BRD': setupBrd,
    'MCH': setupMch,
    'DNC': setupDnc,
    'BLM': setupBlm,
    'SMN': setupSmn,
    'RDM': setupRdm,
    'BLU': setupBlu,
  }[job.toUpperCase()];
}
