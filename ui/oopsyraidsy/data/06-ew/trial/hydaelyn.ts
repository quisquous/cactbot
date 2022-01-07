import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: 65CA Ray of Light (standing in the moving lightwave) is super noisy

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheMothercrystal,
  damageWarn: {
    'Hydaelyn Highest Holy': '65C7', // out
    'Hydaelyn Equinox': '668F', // cross
    'Hydaelyn Anthelion': '65C8', // in
    'Hydaelyn Mystic Refulgence Incandescence': '65CD', // Parhelic Circle orbs
    'Hydaelyn Parhelion Beacon 1': '65CE', // initial chakrams
    'Hydaelyn Parhelion Beacon 2': '65CF', // second chakrams
  },
  shareWarn: {
    'Hydaelyn Crystalline Blizzard III': '6C5A', // spread
  },
  shareFail: {
    'Hydaelyn Heros\'s Sundering': '65D5', // single tank cleave
  },
};

export default triggerSet;
