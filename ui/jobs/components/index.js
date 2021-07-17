import { setup as setupPld, reset as resetPld } from './pld';
import { setup as setupWar, reset as resetWar } from './war';
import DrkComponent from './drk';
import GnbComponent from './gnb';
import { setup as setupWhm, reset as resetWhm } from './whm';
import { setup as setupSch, reset as resetSch } from './sch';
import AstComponent from './ast';
import { setup as setupMnk, reset as resetMnk } from './mnk';
import { setup as setupDrg, reset as resetDrg } from './drg';
import { setup as setupNin, reset as resetNin } from './nin';
import { setup as setupSam, reset as resetSam } from './sam';
import { setup as setupBrd, reset as resetBrd } from './brd';
import { setup as setupMch, reset as resetMch } from './mch';
import { setup as setupDnc, reset as resetDnc } from './dnc';
import BlmComponent from './blm';
import SmnComponent from './smn';
import { setup as setupRdm, reset as resetRdm } from './rdm';
import { setup as setupBlu, reset as resetBlu } from './blu';


export function getSetup(job) {
  return {
    'PLD': setupPld,
    'WAR': setupWar,
    'WHM': setupWhm,
    'SCH': setupSch,
    'MNK': setupMnk,
    'DRG': setupDrg,
    'NIN': setupNin,
    'SAM': setupSam,
    'BRD': setupBrd,
    'MCH': setupMch,
    'DNC': setupDnc,
    'RDM': setupRdm,
    'BLU': setupBlu,
  }[job.toUpperCase()];
}

export function getReset(job) {
  return {
    'PLD': resetPld,
    'WAR': resetWar,
    'WHM': resetWhm,
    'SCH': resetSch,
    'MNK': resetMnk,
    'DRG': resetDrg,
    'NIN': resetNin,
    'SAM': resetSam,
    'BRD': resetBrd,
    'MCH': resetMch,
    'DNC': resetDnc,
    'RDM': resetRdm,
    'BLU': resetBlu,
  }[job.toUpperCase()];
}

export class ComponentFactory {
  static getComponent(bars, job) {
    switch (job.toUpperCase()) {
    case 'DRK':
      return new DrkComponent(bars);

    case 'GNB':
      return new GnbComponent(bars);

    case 'AST':
      return new AstComponent(bars);

    case 'BLM':
      return new BlmComponent(bars);

    case 'SMN':
      return new SmnComponent(bars);

    default:
      break;
    }
  }
}
