import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Doubled Impact (680E) shared tankbuster hitting non-tanks?
// TODO: Predatory Sight (680B) dorito stack failure?

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheSecondCircle,
  damageWarn: {
    'P2N Spoken Cataract 1': '67F7', // head and body cleave
    'P2N Spoken Cataract 2': '67F8', // head and body cleave
    'P2N Spoken Cataract 3': '67F9', // head and body cleave
    'P2N Spoken Cataract 4': '67FD', // head and body cleave
    'P2N Dissociation': '6806', // head charge
    'P2N Sewage Eruption': '680D', // chasing targeted telegraphed circles
  },
  gainsEffectWarn: {
    'P2N Dropsy': 'B69', // standing in sludge
  },
  shareWarn: {
    'P2N Tainted Flood': '6809', // spread markers
  },
  soloWarn: {
    'P2N Coherence': '6802', // stack line
  },
};

export default triggerSet;
