import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Apocalyptic Explosion (279B) from not handling Rocket Punch adds, but
//       if doing this unsynced, you can just ignore them and that's spammy.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlphascapeV30Savage,
  damageWarn: {
    'O11S Afterburner': '325E', // followup to Flame Thrower
    'O11S Rocket Punch Iron Kiss 1': '3608', // Rocket Punch hand circle from Peripheral Synthesis #1
    'O11S Rocket Punch Iron Kiss 2': '36F4', // Rocket Punch hand circle from Peripheral Synthesis #3
    'O11S Starboard Wave Cannon 1': '3262',
    'O11S Starboard Wave Cannon 2': '3263',
    'O11S Larboard Wave Cannon 1': '3264',
    'O11S Larboard Wave Cannon 2': '3265',
    'O11S Starboard Wave Cannon Surge 1': '3266',
    'O11S Starboard Wave Cannon Surge 2': '3267',
    'O11S Larboard Wave Cannon Surge 1': '3268',
    'O11S Larboard Wave Cannon Surge 2': '3269',
    'O11S Critical Dual Storage Violation': '3258', // failing a tower
    // FIXME: this id is the same as Wave Cannon Surge 1 above, is it correct or one of them incorrect?
    // 'O11S Level Checker Reset': '3268', // "get out" circle
    // FIXME: this id is the same as Wave Cannon Surge 2 above, is it correct or one of them incorrect?
    // 'O11S Level Checker Reformat': '3267', // "get in" donut
    'O11S Ballistic Impact': '370B', // circles during Panto 1
    'O11S Flame Thrower Panto': '3707', // pinwheel during Panto 2
    'O11S Guided Missile Kyrios': '370A', // Panto 2 baited circle
  },
  gainsEffectWarn: {
    'O11S Burns': 'FA', // standing in ballistic missile fire puddle
  },
  gainsEffectFail: {
    'O11S Memory Loss': '65A', // failing to cleanse Looper in a tower
  },
  shareWarn: {
    'O11S Flame Thrower': '325D', // protean wave
    'O11S Rocket Punch Rush': '3250', // tethered Rocket Punch charge from Peripheral Synthesis #2
    'O11S Wave Cannon Kyrios': '3705', // Panto 2 distance baited lasers
  },
  shareFail: {
    'O11S Mustard Bomb': '326D', // tank buster
    'O11S Blaster': '3261', // tethered explosion
    // FIXME: this id is the same as Wave Cannon Kyrios above, is it correct or one of them incorrect?
    // 'O11S Diffuse Wave Cannon Kyrios': '3705', // Panto 2 tank lasers
  },
};

export default triggerSet;
