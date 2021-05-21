import { setup as setupPld, reset as resetPld } from './pld';
import { setup as setupWar, reset as resetWar } from './war';
import { setup as setupDrk, reset as resetDrk } from './drk';
import { setup as setupGnb, reset as resetGnb } from './gnb';
import { setup as setupWhm, reset as resetWhm } from './whm';
import { setup as setupSch, reset as resetSch } from './sch';
import { setup as setupAst, reset as resetAst } from './ast';
import { setup as setupMnk, reset as resetMnk } from './mnk';
import { setup as setupDrg, reset as resetDrg } from './drg';
import { setup as setupNin, reset as resetNin } from './nin';
import { setup as setupSam, reset as resetSam } from './sam';
import { setup as setupBrd, reset as resetBrd } from './brd';
import { setup as setupMch, reset as resetMch } from './mch';
import { setup as setupDnc, reset as resetDnc } from './dnc';
import { setup as setupBlm, reset as resetBlm } from './blm';
import { setup as setupSmn, reset as resetSmn } from './smn';
import { setup as setupRdm, reset as resetRdm } from './rdm';
import { setup as setupBlu, reset as resetBlu } from './blu';


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

export function getReset(job) {
  return {
    'PLD': resetPld,
    'WAR': resetWar,
    'DRK': resetDrk,
    'GNB': resetGnb,
    'WHM': resetWhm,
    'SCH': resetSch,
    'AST': resetAst,
    'MNK': resetMnk,
    'DRG': resetDrg,
    'NIN': resetNin,
    'SAM': resetSam,
    'BRD': resetBrd,
    'MCH': resetMch,
    'DNC': resetDnc,
    'BLM': resetBlm,
    'SMN': resetSmn,
    'RDM': resetRdm,
    'BLU': resetBlu,
  }[job.toUpperCase()];
}
