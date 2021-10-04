import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: ignoring Fire Breath (2A3E) share warning because it also hits adds (which is fine).
// We could filter out hitting multiple players, but that's a lot of effort for low damage.

// Just for reference, this fight has "double" abilities, where the first hit
// does no damage.  Sometimes the set of people hit by the first and not by
// the second are not the same, but usually they are.  Some of these have
// starts using lines (but targeted on a player or unknown).
// * Mangle (2853), paired with (285C)
// * Mangle (2863), paired with (2CB7)
// * Flaming Recoil (2859), paired with (2CB3)
// * Tail Swing (2855), paired with (2A3C)
// * Fire Breath (2857), paired with (2A3E)
// * Rush (2856), paired with (2A3D)
// * Rush (2861), paired with (2CB5)
// * Sweeping Flames (2862), paired with (2CB6)
// * Fireball 1 (285F), paired with (2860)
// * Fireball 2/3 (2D0A), paired with (2D0B)

export type Data = OopsyData;

// Rathalos Extreme
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheGreatHuntExtreme,
  damageWarn: {
    'RathalosEx Mangle 1': '285C', // first phase frontal 90 degree conal
    'RathalosEx Mangle 2': '2CB7', // second phase conal swipe
    'RathalosEx Rush 1': '2A3D', // first phase charge attack
    'RathalosEx Rush 2': '2CB5', // second phase charge attack, gives poison
    'RathalosEx Tail Smash': '2854', // first phase left/rear conal, paired with Mangle (285C)
    'RathalosEx Tail Swing': '2A3C', // first phase right side attack
    'RathalosEx Flaming Recoil': '2CB3', // frontal conal + knockback
    'RathalosEx Steppe Sheep Lullaby': '2864', // centered circle
    'RathalosEx Steppe Yamaa Head Butt': '2865', // line aoe
    'RathalosEx Steppe Coeurl Wide Blaster': '2866', // very large conal
    'RathalosEx Garula Rush': '2868', // line charge into the arena
    'RathalosEx Sweeping Flames': '2CB6', // second phase frontal conal
  },
  shareFail: {
    'RathalosEx Garula Heave': '2867', // untelegraphed conal cleave
  },
  soloWarn: {
    'RathalosEx Fireball 1': '2860', // second phase stack triple fireball initial
    'RathalosEx Fireball 2': '2D0B', // second phase stack triple fireball second and third
  },
};

export default triggerSet;
