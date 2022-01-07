import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DomaCastle,
  damageWarn: {
    'Doma Castle Doman Colossus Grand Sword': '2179', // large wide conal
    'Doma Castle Doman Gunship Garlean Fire': '217C', // targeted circle (can happen out of combat)
    'Doma Castle Magitek Rearguard Garlean Fire': '209F', // line of targeted exaflare-y circles
    'Doma Castle Magitek Rearguard Magitek Ray': '20A1', // Rearguard Bit green line aoe
    'Doma Castle Magitek Rearguard Self-Detonate': '20A0', // running into a Rearguard Mine
    'Doma Castle Doman Vanguard Overcharge': '217E', // centered circle
    'Doma Castle Doman Vanguard Drill Cannons': '217D', // frontal line
    'Doma Castle Mark XLIII Field Cannon Magitek Cannon': '24E9', // line aoes from stationary cannons
    'Doma Castle Doman Reaper Magitek Cannon': '2181', // centered circle
    'Doma Castle Hexadrone Bit Chain Mine 1': '2447', // Destroyable laser that does knockback, both 2&3 boss
    'Doma Castle Hexadrone Bit Chain Mine 2': '20A7', // Destroyable laser that does knockback, both 2&3 boss
    'Doma Castle Magitek Hexadrone Circle Of Death': '20A2', // centered circle
    'Doma Castle Magitek Hexadrone Magitek Missiles': '20A6', // failing tower (20A5 is correct tower damage)
    'Doma Castle Doman Hastatus Tenka Goken': '2182', // wide conal
    'Doma Castle Doman Armored Weapon Diffractive Laser': '2184', // centered circle
    'Doma Castle Hypertuned Grynewaht Clean Cut': '20B1', // Magitek Chakram lines
  },
  shareWarn: {
    'Doma Castle Hypertuned Grynewaht Delay-Action Charge': '20AD', // spread marker
  },
  soloWarn: {
    'Doma Castle Magitek Hexadrone 2-Tonze Magitek Missile': '20A3', // stack marker
  },
};

export default triggerSet;
