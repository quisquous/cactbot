import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: Do Mustard Bomb or Wheel splash?
// TODO: How to disambiguate the 828 Bleeding debuff? It's unavoidably inflicted by several things,
// including Mustard Bomb and Atomic Ray.
// However, it is also inflicted by arena walls on bosses 1/3.
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheStigmaDreamscape,
  damageWarn: {
    'Dreamscape Omicron Invader Electric Stream': '6DB8', // Line AoE, before boss 1
    'Dreamscape Omicron Invader Shocking Discharge': '6B99', // Small Chariot AoE, before boss 1

    'Dreamscape Proto-Omega Starboard Side Cannons': '6320', // Half-arena cleave, boss 1
    'Dreamscape Proto-Omega Larboard Side Cannons': '6321', // Half-arena cleave, boss 1
    'Dreamscape Proto-Omega Forward Interceptors': '6323', // Forward half arena cleave, boss 1
    'Dreamscape Proto-Omega Rear Interceptors': '6325', // Rear half arena cleave, boss 1
    'Dreamscape Mark II Guided Missile Iron Kiss': '6327', // Missile explosion, boss 1

    'Dreamscape Delta Invader Rail Cannon': '6B9E', // Line AoE, before boss 2

    'Dreamscape Arch-Lambda Tread': '63AC', // Mobile Assault Cannon dashes, boss 2
    'Dreamscape Arch-Lambda Wave Cannon': '63AF', // Get-behind arena cleave after Tread, boss 2
    'Dreamscape Arch-Lambda Main Sniper Cannon': '63B0', // Charge during Auto-Mobile Sniper Cannon, boss 2

    'Dreamscape Hybrid Dragon Engulfing Flames': '6BA0', // Rectangle AoE, after boss 2
    'Dreamscape Omega Frame Thermite Bomb': '6BA1', // Small circle AoE, after boss 2

    'Dreamscape Omega Frame Starboard Proto-Wave Cannon': '642A', // Half-arena cleave, boss 3
    'Dreamscape Omega Frame Larboard Proto-Wave Cannon': '642B', // Half-arena cleave, boss 3
    'Dreamscape Hybrid Dragon Touchdown': '68F9', // Circle AoE, boss 3
    'Dreamscape Hybrid Dragon Fire Breath': '642E', // Giant cone AoE, boss 3
    'Dreamscape Proto-Rocket Punch Rush': '642D', // Line AoEs, boss 3
    'Dreamscape Stigma-4 Electromagnetic Release Dynamo': '6432', // Dynamo AoE, boss 3
    'Dreamscape Stigma-4 Electromagnetic Release Chariot': '6434', // Chariot AoE, boss 3
  },
  gainsEffectWarn: {
    'Dreamscape Proto-Omega Puddle Burns': '892', // Flame puddle effect, boss 1
  },
  shareWarn: {
    'Dreamscape Proto-Omega Spread Burn': '6329', // Spread circles, boss 1. (Cast name is Chemical Missile, 6328.)
    'Dreamscape Arch-Lambda Personal Sniper Cannon': '63B2', // Headmarker lasers, boss 2
  },
  soloWarn: {
    'Dreamscape Proto-Omega Electric Slide': '632A', // Stack marker, boss 1.
  },
};

export default triggerSet;
