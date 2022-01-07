import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: taking two 65AA Infralateral Arc (party share)
// TODO: 65A7 Ray of Light (standing in the moving lightwave) is super noisy

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheMinstrelsBalladHydaelynsCall,
  damageWarn: {
    'HydaelynEx Highest Holy': '6598', // out
    'HydaelynEx Equinox': '6EB2', // cross
    'HydaelynEx Anthelion': '6594', // in
    'HydaelynEx Aureole 1': '6F12', // go sides
    'HydaelynEx Aureole 2': '6C92', // go sides
    'HydaelynEx Lateral Aureole 1': '6690', // go front back
    'HydaelynEx Lateral Aureole 2': '6F14', // go front back
    'HydaelynEx Mystic Refulgence Incandescence': '65AF', // Parhelic Circle orbs
    'HydaelynEx Light of the Crystal': '65A6', // line of sight wave+crystal
    'HydaelynEx Heros\'s Glory': '65A8', // get behind
    'HydaelynEx Parhelion Beacon 1': '65B2', // initial chakrams
    'HydaelynEx Parhelion Beacon 2': '65B3', // second chakrams
  },
  shareWarn: {
    'HydaelynEx Crystalline Blizzard III': '65A4', // spread
  },
  shareFail: {
    'HydaelynEx Heros\'s Sundering': '65BF', // single tank cleave
  },
};

export default triggerSet;
