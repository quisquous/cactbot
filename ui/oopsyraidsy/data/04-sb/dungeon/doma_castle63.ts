import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.DomaCastle63,
  damageWarn: {
    'DomaCastle63 Doman Colossus Grand Sword': '2179', // large wide conal
    'DomaCastle63 Doman Gunship Garlean Fire': '217C', // targeted circle (can happen out of combat)
    'DomaCastle63 Magitek Rearguard Garlean Fire': '209F', // line of targeted exaflare-y circles
    'DomaCastle63 Magitek Rearguard Magitek Ray': '20A1', // Rearguard Bit green line aoe
    'DomaCastle63 Magitek Rearguard Self-Detonate': '20A0', // running into a Rearguard Mine
    'DomaCastle63 Doman Vanguard Overcharge': '217E', // centered circle
    'DomaCastle63 Doman Vanguard Drill Cannons': '217D', // frontal line
    'DomaCastle63 Mark XLIII Field Cannon Magitek Cannon': '24E9', // line aoes from stationary cannons
    'DomaCastle63 Doman Reaper Magitek Cannon': '2181', // centered circle
    'DomaCastle63 Hexadrone Bit Chain Mine 1': '2447', // Destroyable laser that does knockback, both 2&3 boss
    'DomaCastle63 Hexadrone Bit Chain Mine 2': '20A7', // Destroyable laser that does knockback, both 2&3 boss
    'DomaCastle63 Magitek Hexadrone Circle Of Death': '20A2', // centered circle
    'DomaCastle63 Magitek Hexadrone Magitek Missiles': '20A6', // failing tower (20A5 is correct tower damage)
    'DomaCastle63 Doman Hastatus Tenka Goken': '2182', // wide conal
    'DomaCastle63 Doman Armored Weapon Diffractive Laser': '2184', // centered circle
    'DomaCastle63 Hypertuned Grynewaht Clean Cut': '20B1', // Magitek Chakram lines
  },
  shareWarn: {
    'DomaCastle63 Hypertuned Grynewaht Delay-Action Charge': '20AD', // spread marker
  },
  soloWarn: {
    'DomaCastle63 Magitek Hexadrone 2-Tonze Magitek Missile': '20A3', // stack marker
  },
};

export default triggerSet;
