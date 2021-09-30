import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: standing in the wrong side of Interdimensional Bomb causes
//       Interdimensional Explosion (2763) and also gives you a red
//       X headmarker like Bardam's Mettle boss 2.  However, this
//       isn't an actual headmarker line.  So, there is no way to
//       differentiate "somebody failed this" vs "nobody got it".

export type Data = OopsyData;

// O7N - Sigmascape 3.0 Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.SigmascapeV30,
  damageWarn: {
    'O7N Magitek Ray': '276B', // untelegraphed frontal line
    'O7N Ink': '275D', // Initial Ultros targeted circles
    'O7N Tentacle': '275F', // Tentacle simulation targeted circles
    'O7N Wallop': '2760', // Ultros tentacles attacking
    'O7N Chain Cannon': '2770', // baited airship add cannon
    'O7N Missile Explosion': '2765', // Hitting a missile
    'O7N Bibliotaph Deep Darkness': '29BF', // giant donut
    'O7N Dadaluma Aura Cannon': '2767', // large line aoe
    'O7N Guardian Diffractive Laser': '2761', // initial Air Force centered circle on Guardian
    'O7N Air Force Diffractive Laser': '273F', // Air Force add large conal
    'O7N Interdimensional Explosion': '2763', // Failed bomb (either wrong side or ignored)
  },
  damageFail: {
    'O7N Super Chakra Burst': '2769', // Missed Dadaluma tower (hits everybody)
  },
  gainsEffectFail: {
    'O7N Shocked': '5DA', // touching arena edge
  },
};

export default triggerSet;
