import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: 62D7 Hyperdimensional Slash line share ???
// TODO: 62E0 Holy Chain failures

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DragonsongsRepriseUltimate,
  damageWarn: {
    'DSR Ser Grinnaux Empty Dimension': '62DA', // donut
    'DSR Ser Grinnaux Full Dimension': '62DB', // circle
    'DSR Ser Adelphel Holy Shield Bash': '63EB', // line charge at tethered player
    'DSR Ser Adelphel Shining Blade': '62CE', // dash attack
    'DSR Brightsphere Bright Flare': '62CF', // spheres generated by 62CE Shining Blade
    'DSR Ser Charibert Skyblind': '631A', // puddles after Brightwing cleaves
    'DSR Spiral Thrust': '63D4', // dashes from Ser Vellguine, Ser Ignasse, Ser Paulecrain
    'DSR Ser Gerrique Heavy Impact 1': '63D6', // expanding earth ring
    'DSR Ser Gerrique Heavy Impact 2': '63D7', // expanding earth ring
    'DSR Ser Gerrique Heavy Impact 3': '63D8', // expanding earth ring
    'DSR Ser Gerrique Heavy Impact 4': '63D9', // expanding earth ring
    'DSR Ser Gerrique Heavy Impact 5': '63DA', // expanding earth ring
    'DSR Ser Grinnaux Dimensional Collapse': '63DC', // red/black puddles
  },
  damageFail: {
    'DSR King Thordan Ascalon\'s Mercy Concealed': '63C9', // protean 2nd hit
  },
  shareWarn: {
    'DSR Hyperdimensional Slash Explosion': '63EE', // the spread damage with the 62D7 slash
    'DSR Ser Adelphel Execution': '62D5', // dive on main tank after 62CE Shining Blade
    'DSR Ser Charibert Heavensflame': '62DF', // spread with 62E0 Holy Chain
    'DSR Ser Charibert Brightwing': '6319', // cleaves during Pure of Heart
    'DSR King Thordan Lightning Storm': '63CD', // spread during Strength of the Ward
  },
  shareFail: {
    'DSR King Thordan Ascalon\'s Might': '63C5', // tank cleaves
  },
};

export default triggerSet;
