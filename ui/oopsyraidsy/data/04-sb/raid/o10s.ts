import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Death From Above / Death From Below tank debuff problems
// TODO: Akh Rhai (3623) is not unusual to take ~1 hit from, so don't list.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlphascapeV20Savage,
  damageWarn: {
    'O10S Azure Wings': '31B2', // Out
    'O10S Stygian Maw': '31B0', // In
    'O10S Bloodied Maw': '31B5', // Corners
    'O10S Crimson Wings': '31B3', // Cardinals
    'O10S Horrid Roar': '31B9', // targeted circles
    'O10S Dark Wave': '341A', // Ancient Dragon circle upon death
    'O10S Cauterize': '3240', // divebomb attack
    'O10S Flame Blast': '31C1', // bombs
    'O10S Scarlet Thread': '362B', // orb waffle lines
    'O10S Exaflare 1': '362C',
    'O10S Exaflare 2': '362E',
  },
  shareWarn: {
    'O10S Earth Shaker': '31B6', // as it says on the tin
    'O10S Frost Breath': '33F1', // Ancient Dragon frontal conal
    'O10S Thunderstorm': '31B8', // purple spread marker
  },
  shareFail: {
    'O10S Crimson Breath': '31BC', // flame breath dodged with Ancient Bulwark
  },
};

export default triggerSet;
