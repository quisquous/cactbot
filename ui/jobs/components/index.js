import PldComponent from './pld';
import WarComponent from './war';
import DrkComponent from './drk';
import GnbComponent from './gnb';
import WhmComponent from './whm';
import SchComponent from './sch';
import AstComponent from './ast';
import MnkComponent from './mnk';
import DrgComponent from './drg';
import NinComponent from './nin';
import SamComponent from './sam';
import BrdComponent from './brd';
import MchComponent from './mch';
import DncComponent from './dnc';
import BlmComponent from './blm';
import SmnComponent from './smn';
import RdmComponent from './rdm';
import BluComponent from './blu';


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

    case 'SCH':
      return new SchComponent(bars);

    case 'AST':
      return new AstComponent(bars);

    case 'MNK':
      return new MnkComponent(bars);

    case 'DRG':
      return new DrgComponent(bars);

    case 'NIN':
      return new NinComponent(bars);

    case 'SAM':
      return new SamComponent(bars);

    case 'BRD':
      return new BrdComponent(bars);

    case 'MCH':
      return new MchComponent(bars);

    case 'DNC':
      return new DncComponent(bars);

    case 'BLM':
      return new BlmComponent(bars);

    case 'SMN':
      return new SmnComponent(bars);

    case 'RDM':
      return new RdmComponent(bars);

    case 'BLU':
      return new BluComponent(bars);

    default:
      break;
    }
  }
}
