import { Job } from '../../../types/job';
import { Bars } from '../jobs';

import AstComponent from './ast';
import { BaseComponent } from './base';
import BlmComponent from './blm';
import BluComponent from './blu';
import BrdComponent from './brd';
import DncComponent from './dnc';
import DrgComponent from './drg';
import DrkComponent from './drk';
import GnbComponent from './gnb';
import MchComponent from './mch';
import MnkComponent from './mnk';
import NinComponent from './nin';
import PldComponent from './pld';
import RdmComponent from './rdm';
import SamComponent from './sam';
import SchComponent from './sch';
import SmnComponent from './smn';
import WarComponent from './war';
import WhmComponent from './whm';

export class ComponentFactory {
  static getComponent(bars: Bars, job: Job): BaseComponent<Job> {
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
        return new BaseComponent(bars);
    }
  }
}
