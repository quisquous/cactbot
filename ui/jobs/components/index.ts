import { Bars } from '../jobs';

import { reset as resetAst, setup as setupAst } from './ast';
import { reset as resetBlm, setup as setupBlm } from './blm';
import { reset as resetBlu, setup as setupBlu } from './blu';
import { reset as resetBrd, setup as setupBrd } from './brd';
import { reset as resetDnc, setup as setupDnc } from './dnc';
import { reset as resetDrg, setup as setupDrg } from './drg';
import { reset as resetDrk, setup as setupDrk } from './drk';
import { reset as resetGnb, setup as setupGnb } from './gnb';
import { reset as resetMch, setup as setupMch } from './mch';
import { reset as resetMnk, setup as setupMnk } from './mnk';
import { reset as resetNin, setup as setupNin } from './nin';
import { reset as resetPld, setup as setupPld } from './pld';
import { reset as resetRdm, setup as setupRdm } from './rdm';
import { reset as resetSam, setup as setupSam } from './sam';
import { reset as resetSch, setup as setupSch } from './sch';
import { reset as resetSmn, setup as setupSmn } from './smn';
import { reset as resetWar, setup as setupWar } from './war';
import { reset as resetWhm, setup as setupWhm } from './whm';

export const getSetup = (job: string): undefined | ((bars: Bars) => void) => {
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
};

export const getReset = (job: string): undefined | ((bars: Bars) => void) => {
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
};
