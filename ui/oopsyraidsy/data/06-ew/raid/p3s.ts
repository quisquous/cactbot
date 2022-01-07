import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AsphodelosTheThirdCircleSavage,
  damageWarn: {
    'P3S Fireplume Out': '66BF', // get out Experimental Fireplume short telegraph
    'P3S Fireplume Circles': '66C1', // optical sight Experimental Fireplume circles
    'P3S Left Cinderwing': '6703', // left 180 cleave
    'P3S Right Cinderwing': '6702', // right 180 cleave

    'P3S Devouring Brand 1': '66CE', // fire cross
    'P3S Devouring Brand 2': '66CF', // fire cross
    'P3S Devouring Brand 3': '66D0', // fire cross
    'P3S Devouring Brand 4': '66D1', // fire cross
    'P3S Devouring Brand 5': '6D83', // fire cross
    'P3S Searing Breeze': '66B7', // circles during Devouring Brand fire cross

    'P3S Gloryplume Rotating': '66CB', // Experimental Glorypllume rotating circles
    'P3S Gloryplume Middle': '66C7', // Experimental Gloryplume middle
  },
  damageFail: {
    'P3S Darkened Blaze': '66BA', // failing to kill the Darkened Fire in time
  },
  shareWarn: {
    'P3S Flare of Condemnation': '66FE', // sides spread during Trail of Condemnation
    'P3S Gloryplume': '66C9', // spread during Experimental Gloryplume
  },
  shareFail: {
    'P3S Heat of Condemnation': '6701', // double tank buster
  },
};

export default triggerSet;
