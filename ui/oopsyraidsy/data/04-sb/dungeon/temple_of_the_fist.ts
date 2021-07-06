import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

const triggerSet: SimpleOopsyTriggerSet = {
  zoneId: ZoneId.TheTempleOfTheFist,
  damageWarn: {
    'Temple Fire Break': '21ED', // Conal AoE, Bloodglider Monk trash
    'Temple Radial Blaster': '1FD3', // Circle AoE, boss 1
    'Temple Wide Blaster': '1FD4', // Conal AoE, boss 1
    'Temple Crippling Blow': '2016', // Line AoEs, environmental, before boss 2
    'Temple Broken Earth': '236E', // Circle AoE, Singha trash
    'Temple Shear': '1FDD', // Dual conal AoE, boss 2
    'Temple Counter Parry': '1FE0', // Retaliation for incorrect direction after Killer Instinct, boss 2
    'Temple Tapas': '', // Tracking circular ground AoEs, boss 2
    'Temple Hellseal': '200F', // Red/Blue symbol failure, boss 2
    'Temple Pure Will': '2017', // Circle AoE, Spirit Flame trash, before boss 3
    'Temple Megablaster': '163', // Conal AoE, Coeurl Prana trash, before boss 3
    'Temple Windburn': '1FE8', // Circle AoE, Twister wind, boss 3
    'Temple Hurricane Kick': '1FE5', // 270-degree frontal AoE, boss 3
    'Temple Silent Roar': '1FEB', // Frontal line AoE, boss 3
    'Temple Mighty Blow': '1FEA', // Contact with coeurl head, boss 3
  },
  shareWarn: {
    'Temple Heat Lightning': '1FD7', // Purple spread circles, boss 1
  },
};

export default triggerSet;
