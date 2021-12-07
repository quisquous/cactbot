import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Prapti Siddhi is a mistake on its own before stop
// and after stop, only a mistake for the person without stop.
// TODO: does Minduruva do anything on final fight if left alive for long?
// TODO: Prakamya Siddhi is a raidwide earlier, but one log had it look like a ground aoe?

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheTowerOfZot,
  damageWarn: {
    'Zot Armored Fiend Soporific Gas': '6CE2', // centered circle
    'Zot Minduruva Manusya Blizzard III': '6296', // blizzard pinwheel
    'Zot Minduruva Manusya Fire III': '6295', // fire donut
    'Zot Minduruva Manusya Thunder III': '6297', // thunder "cross" circles
    'Zot Minduruva Manusya Bio III': '6298', // 180 degree frontal cleave
    'Zot Death Claw Shred': '54ED', // line aoe
    'Zot Hypertuned Left-Arm Slash': '54EC', // frontal conal
    'Zot Sanduruva Berserker Sphere Sphere Shatter': '62A4', // circles during Explosive Force
    'Zot Predator Magitek Ray': '5E4F', // long line aoe
    'Zot Roader Haywire': '5E51', // line aoe charge
    'Zot Mark II Zot Colossus Exhaust': '5E4B', // long line aoe
    'Zot Armored Weapon Diffractive Laser': '5E53', // targeted circle
    'Zot Cinduruva Delta Blizzard III 1': '62B2', // lines/pinwheels
    'Zot Cinduruva Delta Blizzard III 2': '62B3', // lines/pinwheels
    'Zot Cinduruva Delta Thunder III 1': '62B5', // lines/circles
    'Zot Cinduruva Delta Thunder III 2': '62B6', // lines/circles
    'Zot Cinduruva Delta Fire III 1': '62AF', // lines/donuts
    'Zot Cinduruva Delta Fire III 2': '62B0', // lines/donuts
    'Zot Cinduruva Prapti Siddhi': '62BB', // Minduruva line during final boss
    'Zot Cinduruva Berserker Sphere Sphere Shatter': '62BF', // Explosive Force during final boss
    'Zot Cinduruva Prakamya Siddhi': '62BE', // ?? casted by Sinduruva after Minduruva has died
  },
  shareWarn: {
    'Zot Sanduruva Prapti Siddhi': '62A8', // targeted line, sometimes with stop
  },
};

export default triggerSet;
