import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// O11N - Alphascape 3.0 Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlphascapeV30,
  damageWarn: {
    'O11N Starboard Wave Cannon 1': '3281', // initial right cleave
    'O11N Starboard Wave Cannon 2': '3282', // follow-up right cleave
    'O11N Larboard Wave Cannon 1': '3283', // initial left cleave
    'O11N Larboard Wave Cannon 2': '3284', // follow-up left cleave
    'O11N Flame Thrower': '327D', // pinwheel conals
    'O11N Critical Storage Violation': '3279', // missing midphase towers
    'O11N Level Checker Reset': '35AA', // "get out" circle
    'O11N Level Checker Reformat': '35A9', // "get in" donut
    'O11N Rocket Punch Rush': '3606', // giant hand 1/3 arena line aoes
  },
  gainsEffectWarn: {
    'O11N Burns': 'FA', // standing in ballistic missile fire puddle
  },
  gainsEffectFail: {
    'O11N Memory Loss': '65A', // failing to cleanse Looper in a tower
  },
  shareWarn: {
    'O11N Ballistic Impact': '327F', // spread markers
  },
  shareFail: {
    'O11N Blaster': '3280', // tank tether
  },
  soloFail: {
    'O11N Electric Slide': '3285', // stack marker
  },
};

export default triggerSet;
