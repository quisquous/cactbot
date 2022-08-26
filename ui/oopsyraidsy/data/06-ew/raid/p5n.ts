import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: Touched poison wall
// TODO: Touched poison puddle

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheFifthCircle,
  damageWarn: {
    'P5N Searing Ray 1': '6697', // Normal
    'P5N Searing Ray 2': '6698', // With Reflection
    'P5N Topaz Stones': '76DE', // Topaz Stone AoE
    'P5N Topaz Ray': '79FC', // Topaz Stone Square Tile
    'P5N Venom Drops': '76EE', // Puddles
    'P5N Starving Stampede': '79E9', // Stomped
    'P5N Spit': '7727', // Spitting Devoured Player
  },
  damageFail: {
    'P5N Devour': '7728', // Nom
  },
  shareFail: {
    'P5N Venom Rain': '76ED', // Spread
  },
};

export default triggerSet;
