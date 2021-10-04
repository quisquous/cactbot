import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: ignoring Fire Breath (2CBD) share warning because it also hits adds (which is fine).
// We could filter out hitting multiple players, but that's a lot of effort for low damage.

// Just for reference, this fight has "double" abilities, where the first hit
// does no damage.  Sometimes the set of people hit by the first and not by
// the second are not the same, but usually they are.  Some of these have
// starts using lines (but targeted on a player or unknown).
// * Mangle (286A), paired with (2CB9)
// * Mangle (287A), paired with (2CC2)
// * Flaming Recoil (2870), paired with (2CBE)
// * Tail Swing (286C), paired with (2CBB)
// * Fire Breath (286E), paired with (2CBD)
// * Rush (286D), paired with (2CBC)
// * Rush (2878), paired with (2CC0)
// * Sweeping Flames (2879), paired with (2CC1)
// * Fireball (2876), paired with (2CBA)

export type Data = OopsyData;

// Rathalos Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheGreatHunt,
  damageWarn: {
    'Rathalos Mangle 1': '2CB9', // first phase frontal conal
    'Rathalos Mangle 2': '2CC2', // second phase conal swipe
    'Rathalos Rush 1': '2CBC', // first phase charge attack
    'Rathalos Rush 2': '2CC0', // second phase charge attack, gives poison
    'Rathalos Tail Smash': '286B', // first phase left/rear conal, paired with Mangle (2CB9)
    'Rathalos Tail Swing': '2CBB', // first phase right side attack
    'Rathalos Flaming Recoil': '2CBE', // frontal conal + knockback
    'Rathalos Steppe Sheep Lullaby': '287B', // centered circle
    'Rathalos Steppe Yamaa Head Butt': '287C', // line aoe
    'Rathalos Steppe Coeurl Wide Blaster': '287D', // very large conal
    'Rathalos Garula Rush': '287F', // line charge into the arena
    'Rathalos Sweeping Flames': '2CC1', // second phase frontal conal
  },
  shareFail: {
    'Rathalos Garula Heave': '287E', // untelegraphed conal cleave
  },
  soloWarn: {
    'Rathalos Fireball': '2CBA', // second phase stack that leaves a fire puddle
  },
};

export default triggerSet;
