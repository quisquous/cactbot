import { setup as setupPld } from './pld.js';
import { setup as setupWar } from './war.js';
import { setup as setupDrk } from './drk.js';
import { setup as setupGnb } from './gnb.js';
import { setup as setupWhm } from './whm.js';
import { setup as setupSch } from './sch.js';
import { setup as setupAst } from './ast.js';
import { setup as setupMnk } from './mnk.js';
import { setup as setupDrg } from './drg.js';
import { setup as setupNin } from './nin.js';
import { setup as setupSam } from './sam.js';
import { setup as setupBrd } from './brd.js';
import { setup as setupMch } from './mch.js';
import { setup as setupDnc } from './dnc.js';
import { setup as setupBlm } from './blm.js';
import { setup as setupSmn } from './smn.js';
import { setup as setupRdm } from './rdm.js';
import { setup as setupBlu } from './blu.js';

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
