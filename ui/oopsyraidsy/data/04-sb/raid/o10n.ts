import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: Akh Rhai (3624) is not unusual to take ~1 hit from, so don't list.

// O10N - Alphascape 2.0 Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AlphascapeV20,
  damageWarn: {
    'O10N Azure Wings': '31CD', // Out
    'O10N Stygian Maw': '31CF', // In
    'O10N Horrid Roar': '31D3', // targeted circles
    'O10N Bloodied Maw': '31D0', // Corners
    'O10N Cauterize': '3241', // divebomb attack
    'O10N Scarlet Thread': '362B', // orb waffle lines
    'O10N Exaflare 1': '362D',
    'O10N Exaflare 2': '362F',
  },
  shareWarn: {
    'O10N Earth Shaker': '31D1', // as it says on the tin
    'O10N Frost Breath': '33EE', // Ancient Dragon frontal conal
    'O10N Thunderstorm': '31D2', // purple spread marker
  },
};

export default triggerSet;
