import PldComponent from './pld';
import WarComponent from './war';
import DrkComponent from './drk';
import GnbComponent from './gnb';
import WhmComponent from './whm';
import { setup as setupSch, reset as resetSch } from './sch';
import AstComponent from './ast';
import { setup as setupMnk, reset as resetMnk } from './mnk';
import { setup as setupDrg, reset as resetDrg } from './drg';
import { setup as setupNin, reset as resetNin } from './nin';
import { setup as setupSam, reset as resetSam } from './sam';
import BrdComponent from './brd';
import { setup as setupMch, reset as resetMch } from './mch';
import DncComponent from './dnc';
import BlmComponent from './blm';
import SmnComponent from './smn';
import { setup as setupRdm, reset as resetRdm } from './rdm';
import BluComponent from './blu';


export function getSetup(job) {
  return {
    'SCH': setupSch,
    'MNK': setupMnk,
    'DRG': setupDrg,
    'NIN': setupNin,
    'SAM': setupSam,
    'MCH': setupMch,
    'RDM': setupRdm,
  }[job.toUpperCase()];
}

export function getReset(job) {
  return {
    'SCH': resetSch,
    'MNK': resetMnk,
    'DRG': resetDrg,
    'NIN': resetNin,
    'SAM': resetSam,
    'MCH': resetMch,
    'RDM': resetRdm,
  }[job.toUpperCase()];
}

export class ComponentFactory {
  static getComponent(bars, job) {
    switch (job.toUpperCase()) {
    case 'PLD':
      return new PldComponent(bars);

    case 'WAR':
      return new WarComponent(bars);

    case 'DRK':
      return new DrkComponent(bars);

    case 'GNB':
      return new GnbComponent(bars);

    case 'WHM':
      return new WhmComponent(bars);

    case 'AST':
      return new AstComponent(bars);

    case 'BRD':
      return new BrdComponent(bars);

    case 'DNC':
      return new DncComponent(bars);

    case 'BLM':
      return new BlmComponent(bars);

    case 'SMN':
      return new SmnComponent(bars);

    case 'BLU':
      return new BluComponent(bars);

    default:
      break;
    }
  }
}
