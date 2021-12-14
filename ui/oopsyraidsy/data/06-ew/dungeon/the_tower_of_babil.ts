import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: Figure out how to determine whether someone actively stood in Boundless Pain
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.TheTowerOfBabil,
  damageWarn: {
    'Babil Nimrod Cannon Shot': '6DE1', // Large circle AoE, before first boss
    'Babil Tempered Imperial Spread Shot': '6DE2', // Conal AoE, before first boss
    'Babil Satellite Incendiary Circle': '6DE3', // Large donut AoE, before first boss
    'Babil Reaper Magitek Cannon': '6DE4', // AOE circle, before first boss

    'Babil Barnabas Ground and Pound': '62EA', // Telegraphed line knockback, boss 1
    'Babil Barnabas Dynamic Scrapline': '62F0', // Inner circle during Dynamic Scrapline, boss 1
    'Babil Barnabas Dynamic Pound': '62EE', // Line during Dynamic Pound, boss 1
    'Babil Barnabas Electromagnetic Release 1': '62F1', // Center AoE circle, boss 1
    'Babil Barnabas Electromagnetic Release 2': '62EF', // Center magnetic line, boss 1
    'Babil Barnabas Rolling Scrapline': '62EB', // Center AoE circle, no magnets, boss 1
    'Babil Thunderball Shock': '62F2', // Cardinal/intercardinal AoE circles, boss 1

    'Babil Sky Armor Aethershot': '6DE7', // Circle AoE, after boss 1
    'Babil Rearguard Cermet Pile': '6DE8', // Line AoE, before boss 2
    'Babil Colossus Grand Sword': '6DE9', // Frontal cone, before boss 2
    'Babil Avenger Shoulder Cannon': '6DEA', // AoE circle, before boss 2

    'Babil Magitek Chakram Mighty Blow': '62F4', // Arena AoE, if not mini, boss 2
    'Babil Lugae Surface Missile': '62F7', // Targeted AoE circles from Magitek Missile, boss 2
    'Babil Magitek Explosive Explosion': '62F9', // Bomberman line AoE, boss 2
    'Babil Lugae Magitek Ray': '62FC', // Frontal line AoE, boss 2

    'Babil Gunship Garlean Fire': '6DEE', // Circle AoE, after boss 2
    'Babil Armored Weapon Diffractive Laser': '5E53', // Circle AoE, after boss 2
    'Babil Magitek Crane Crane Game': '6C35', // Large environmental circle AoE, after boss 2
    'Babil Hexadrone 2-Tonze Magitek Missile': '6DEC', // Circle AoE, after boss 2
    'Babil Roader Rush': '6DED', // Rectangle AoE, after boss 2
    'Babil Hypertuned Specimen Right-arm Blaster': '6DF0', // Rectangle AoE, after boss 2

    'Babil Anima Phantom Pain': '62FF', // Lunar Nail squares, boss 3
    'Babil Mega-graviton Graviton Spark': '6302', // Tether failure, boss 3
    'Babil Anima Pater Patiae': '6306', // Line AoE, boss 3
    'Babil Anima Obliviating Claw': '630A', // Chase puddle initial circle, boss 3
    'Babil Iron Nail Obliviating Claw': '630C', // Iron Nail spawn circles, boss 3
    'Babil Iron Nail Charnel Claw': '630D', // Line dashes, boss 3
    'Babil Anima Coffin Scratch': '630E', // Chase puddles, boss 3
  },
  gainsEffectWarn: {
    'Babil Barnabas Electrocution': '826', // Arena edge effect, boss 1
  },
  shareWarn: {
    'Babil Anima Erupting Pain': '6308', // Purple spread circles, boss 3
  },
  soloWarn: {
    'Babil Barnabas Shocking Force': '62EC', // Stack marker, boss 1
  },
  triggers: [
    {
      // Reaching 8 stacks of Breathless is a death
      id: 'Babil Lugae Breathless',
      type: 'LosesEffect',
      netRegex: NetRegexes.losesEffect({ effectId: 'A70', count: '7' }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Suffocated',
            de: 'Erstickt',
            ko: '질식',
          },
        };
      },
    },
  ],
};

export default triggerSet;
