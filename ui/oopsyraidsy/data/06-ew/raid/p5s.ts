import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// 770C Venom if tower missed

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheFifthCircleSavage,
  damageWarn: {
    'P5S Topaz Ray': '79FE', // initial Topaz Stone explosion
    'P5S Ruby Reflection 1': '7701', // reflection of Topaz Ray (initial)
    'P5S Ruby Reflection 2': '76F9', // reflection of Topaz Ray (after Double Rush)
    'P5S Raging Claw 1': '770F', // initial front 180 cleave (part of Claw to Tail)
    'P5S Raging Claw 2': '7710', // front 180 cleave (part of Claw to Tail)
    'P5S Raging Claw 3': '76FB', // initial front 180 cleave (with Searing Ray)
    'P5S Raging Claw 4': '76FC', // front 180 cleave (with Searing Ray)
    'P5S Raging Claw 5': '7714', // initial front 180 cleave
    'P5S Raging Claw 6': '7715', // front 180 cleave
    'P5S Raging Tail 1': '7711', // rear 180 cleave
    'P5S Raging Tail 2': '7A0C', // rear 180 cleave
    'P5S Venom Drops': '7719', // baited puddles during Venom Squall/Surge
  },
  damageFail: {
    'P5S Starving Stampede': '7A03', // large circle during Starving Stampede jumps
  },
  gainsEffectFail: {
    // also D4F, but that's probably in tower puddles
    'P5S Toxicosis 1': 'C0A', // 15s debuff (poison puddle)
    'P5S Toxicosis 2': 'C09', // 9999 effect (wall?)
  },
  shareFail: {
    'P5S Venomous Mass': '771E', // First tankbuster
    'P5S Toxic Crunch': '771F', // Second tankbuster
    'P5S Venom Rain': '7718', // spread during Venom Squall/Surge
  },
  soloFail: {
    'P5S Venom Pool': '79E3', // stack during Venom Squall/Surge
  },
};

export default triggerSet;
