import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: failing life's agonies
// TODO: missing a tick of a fountain
// TODO: tracking whose bird hit you?

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
    'P3S Searing Breeze 1': '66B7', // circles during Devouring Brand fire cross
    'P3S Searing Breeze 2': '6705', // circles during Firestorms

    'P3S Gloryplume Rotating': '66CB', // Experimental Glorypllume rotating circles
    'P3S Gloryplume Middle': '66C7', // Experimental Gloryplume middle

    'P3S Sparkfledged Ashen Eye': '66E6', // initial Fledgling Flight dodge
    'P3S Flames of Asphodelos 1': '66F2', // pizza slice 1
    'P3S Flames of Asphodelos 2': '66F3', // pizza slice 2
    'P3S Flames of Asphodelos 3': '66F4', // pizza slice 3
    'P3S Burning Twister': '66FA', // donut around tornado
  },
  damageFail: {
    'P3S Darkened Blaze': '66BA', // failing to kill the Darkened Fire in time
  },
  shareWarn: {
    'P3S Flare of Condemnation': '66FE', // sides spread during Trail of Condemnation
    'P3S Gloryplume Spread': '66C9', // spread during Experimental Gloryplume
    'P3S Ashplume Spread': '66C5', // spread during Experimental Ashplume
    'P3S Beacons of Asphodelos': '66F7', // tankbuster during Firestorms
    'P3S Sun\'s Pinion': '66EB', // spread marker during Fountain of Fire
  },
  shareFail: {
    'P3S Heat of Condemnation': '6701', // double tank buster
  },
  soloWarn: {
    'P3S Gloryplume Stack': '66CD', // stack during Experimental Gloryplume
    'P3S Ashplume Stack': '66C3', // stack during Experimental Ashplume
  },
};

export default triggerSet;
