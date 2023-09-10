import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.MountOrdeals,
  damageWarn: {
    'Rubicante Circle of Purgatory Fiery Expiation': '7CC5', // conal from outer ring
    'Rubicante Arch Inferno': '7CC8', // center puddle around boss
    'Rubicante Inferno Devil': '7CCA', // 2x large rotating circle AoEs during Arch Inferno
    'Rubicante Hellscathe': '7CCF', // small circle AoEs baited on players during Arch Inferno
    'Rubicante Conflagration': '7CCB', // middle danger bacon during Arch Inferno
    'Rubicante Radial Flagration': '7CCD', // large fan-style AoE during Arch Inferno
    'Rubicante Flamesent Ghastly Wind': '7CD6', // targeted conal (adds phase)
    'Rubicante Flamesent Ghastly Flame 1': '7CD7', // ground circle A0Es (adds phase)
    'Rubicante Flamesent Ghastly Flame 2': '7CD8', // ground circle A0Es (adds phase)
    'Rubicante Flamerake 1': '7CDF', // first of three line AoEs (center)
    'Rubicante Flamerake 2': '7CE0', // second (pair) of three line AoEs (sides of boss)
    'Rubicante Flamerake 3': '7CE1', // third (pair) of three line AoEs (edges)
    'Rubicante Scalding Fleet': '7CE9', // baited proteans
    'Rubicante Sweeping Immolation': '7CE3', // 180 front cleave
  },
  shareWarn: {
    'Rubicante Explosive Pyre': '7CDB', // tank autos w/puddle cleave
  },
  shareFail: {
    'Rubicante Shattering Heat': '7CEB', // solo tankbuster
    'Rubicante Flamesent Shattering Heat': '7CD5', // solo tankbuster (adds phase)
    'Rubicante Inferno (spread)': '7CDA', // spread AoE puddles (post-adds)
    'Rubicante Dualfire': '7D96', // 2x wide cleaving tankbusters
  },
  soloFail: {
    'Rubicante Total Immolation': '7CE5', // party stack during Sweeping Immolation
  },
};

export default triggerSet;
