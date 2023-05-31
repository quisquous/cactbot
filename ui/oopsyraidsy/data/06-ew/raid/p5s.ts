import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: 770C Venom if tower missed, but since this is done intentionally
// after Devour, harder to figure out when this is a mistake.

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.AbyssosTheFifthCircleSavage,
  damageWarn: {
    'P5S Topaz Ray 1': '79FE', // initial Topaz Stone explosion
    'P5S Topaz Ray 2': '79FF', // initial Topaz Stone explosion
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
    'P5S Searing Ray': '76F7', // front laser
  },
  damageFail: {
    'P5S Starving Stampede': '7A03', // large circle during Starving Stampede jumps
    'P5S Lively Bait Scatterbait': '770D', // add created by missing a tower getting its cast off
  },
  gainsEffectFail: {
    'P5S Toxicosis 1': 'C0A', // 15s debuff (poison puddle)
    'P5S Toxicosis 2': 'C09', // 9999 effect (wall?)
  },
  shareFail: {
    'P5S Venomous Mass': '771E', // First tankbuster
    'P5S Toxic Crunch': '771F', // Second tankbuster
    'P5S Venom Rain': '7718', // spread during Venom Squall/Surge
  },
  soloFail: {
    'P5S Venom Pool 1': '79E3', // stack during Venom Squall/Surge
    'P5S Venom Pool 2': '771A', // stack during Venom Squall/Surge
  },
};

export default triggerSet;
