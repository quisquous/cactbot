import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheAitiascope,
  damageWarn: {
    'Aitiascope Livia Aglaea Climb': '6444', // diagonal quadrant cleave
    'Aitiascope Livia Aglaea Shot 1': '6446', // lines
    'Aitiascope Livia Aglaea Shot 2': '6447', // lines coming back
    'Aitiascope Livia Ignis Amoris': '644C', // Odi et Amo targeted circles
    'Aitiascope Livia Disparagement': '644A', // wide conal
    'Aitiascope Sinking Desire The Path of Avarice': '6B1B', // line aoe
    'Aitiascope Sinking Partiality Unrightful Claim': '6B1C', // centered circle
    'Aitiascope Sinking Dissension Whisper of Our Discontent': '6B1D', // conal
    'Aitiascope Rhitahtyn Tartarean Spark': '6457', // laser line aoe
    'Aitiascope Rhitahtyn Shield Skewer': '6450', // charge
    'Aitiascope Rhitahtyn Shrapnel Shell': '6454',
    'Aitiascope Sinking Regret Lost Opportunity': '6B1F', // absolutely gigantic conal
    'Aitiascope Amon Thundaga Forte 1': '645B', // initial pinwheel
    'Aitiascope Amon Thundaga Forte 2': '645C', // second pinwheel
    'Aitiascope Amon Epode': '645F', // coin laser
    'Aitiascope Amon Right Firaga Forte': '6460', // right cleave
    'Aitiascope Amon Left Firaga Forte': '6461', // left cleave
    'Aitiascope Amon Eruption Forte': '6468', // targeted circles
    'Aitiascope Amon Dreams of Ice': '6C6C', // shiva icicle appearing
  },
  damageFail: {
    'Aitiascope Rhitahtyn Impact': '644F', // walls appearing during Vexillatio cast
    'Aitiascope Amon Curtain Call': '6466', // line of sight
  },
};

export default triggerSet;
