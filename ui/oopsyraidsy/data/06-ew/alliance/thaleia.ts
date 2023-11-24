import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

// TODO: Thaliak: getting knocked off Thaliak's arena from pushback
// TODO: Thaliak: standing on bad triangle during initial Tetraktys cast
// TODO: Llymlaen: standing on red knockback line
// TODO: Llymlaen: 8812 vs 8813 go stand on purple knockback puck (also what happens if not knocked back to area)
// TODO: Eulogia can Hydrostasis 8A38/9/A knock you off?

export type Data = OopsyData;

const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.Thaleia,
  damageWarn: {
    // Trash 1
    'Thaleia Serpent of Thaleia Water III': '8A6E', // large targeted circle
    'Thaleia Triton of Thaleia Pelagic Cleaver': '8A6F', // large front conal
    'Thaleia Divine Sprite Flood': '8A72', // centered? circle

    // Thaliak
    'Thaleia Thaliak Crash': '88C8', // rock damage from Rheognosis Petrine knockback
    'Thaleia Thaliak Tetraktys 1': '88CA', // small blue triangle
    'Thaleia Thaliak Tetraktys 2': '88CB', // large green triangle
    'Thaleia Thaliak Tetraktuos Kosmos 1': '88CD', // being hit by the falling walls
    'Thaleia Thaliak Tetraktuos Kosmos 2': '88CE', // standing in the initial triangle with falling walls
    'Thaleia Thaliak Hieroglyphika': '88D0', // rotated green squares
    'Thaleia Thaliak Left Bank 1': '88D2', // 180 left cleave
    'Thaleia Thaliak Left Bank 2': '8C2C', // 180 left cleave during Hieroglyphika
    'Thaleia Thaliak Right Bank 1': '88D3', // 180 right cleave
    'Thaleia Thaliak Right Bank 2': '8C2D', // 180 right cleave during Hieroglyphika

    // Llymlaen
    'Thaleia Llymlaen Wind Rose': '880C', // "get out"
    'Thaleia Llymlaen Seafoam Spiral': '880D', // "get under"
    'Thaleia Llymlaen Left Strait': '8851', // 180 left cleave
    'Thaleia Llymlaen Right Strait': '8852', // 180 right cleave
    'Thaleia Llymlaen Dire Straits 1': '880F', // Navigator's Trident left 180 cleave
    'Thaleia Llymlaen Dire Straits 2': '8810', // Navigator's Trident right 180 cleave
    'Thaleia Llymlaen Landing': '881C', // large trident circles
    'Thaleia Llymlaen Stormwhorl': '881E', // ground puddle during 881F Stormwinds spread
    'Thaleia Llymlaen Maelstrom': '882A', // three puddles on the ground after Serpents' Tide
    'Thaleia Llymlaen Surging Wave 1': '8812', // purple puck along with Shockwave knockback
    'Thaleia Llymlaen Surging Wave 2': '8813', // purple puck along with Shockwave knockback
    'Thaleia Llymlaen Frothing Sea': '880A', // damage from the water afer Shockwave knockback
    'Thaleia Llymlaen Sphere Shatter': '882D', // hitting one of the Sea-foam bubbles after Shockwave knockback
    'Thaleia Llymlaen To the Last': '8818', // left/right cleaves after Shockwave (both sides)
    'Thaleia Llymlaen Serpents\' Tide 1': '8826', // vertical Perykos serpent dash
    'Thaleia Llymlaen Serpents\' Tide 2': '8827', // horizontal Perykos serpent dash
    'Thaleia Llymlaen Serpents\' Tide 3': '8828', // vertical Thalaos serpent dash
    'Thaleia Llymlaen Serpents\' Tide 4': '8829', // horizontal Thalaos serpent dash

    // Oschon
    'Thaleia Oschon Trek Shot 1': '898F', // moving arrow conal
    'Thaleia Oschon Trek Shot 2': '8C44', // moving arrow conal
    'Thaleia Oschon Soaring Minuet 1': '8D0E', // back safe 270 cleave (1st one)
    'Thaleia Oschon Soaring Minuet 2': '8994', // back safe 270 cleave (2nd one)
    'Thaleia Oschon Swinging Draw': '898C', // clone moving arrow conal
    'Thaleia Oschon Downhill 1': '89A1', // orange puddles during Climbing Shot knockback (small version)
    'Thaleia Oschon Downhill 2': '89A2', // red puddles during Wandering Volley knockback (big version)
    'Thaleia Oschon Downhill 3': '8C45', // puddle damage during 89B2 Arrow Trail
    'Thaleia Oschon Piton Pull': '89AB', //  Piton Pull large circles
    'Thaleia Oschon Great Whirlwind': '89AE', // Wandering Shot/Volley orb explosion
    'Thaleia Oschon Altitude': '89B1', // previewed green circles
    'Thaleia Oschon Arrow Trail': '89B4', // line of arrows after 89B3 preview

    // Trash 2
    'Thaleia Angelos Ring of Skylight': '8A74', // large donut from big add
    'Thaleia Angelos Skylight Cross': '8A75', // large cross attack from big add
    'Thaleia Angelos Mikros Skylight': '8A76', // targeted circles from small adds

    // Eulogia
    'Thaleia Eulogia Quintessence 1': '8A1A', // First Form movement (right cleave)
    'Thaleia Eulogia Quintessence 2': '8A1B', // First Form movement (left cleave)
    'Thaleia Eulogia Quintessence 3': '8A1C', // First Form movement (under)
    'Thaleia Eulogia Quintessence 4': '8CE5', // Second Form movement (right cleave)
    'Thaleia Eulogia Quintessence 5': '8CE6', // Second Form movement (left cleave)
    'Thaleia Eulogia Quintessence 6': '8CE7', // Second Form movement (under)
    'Thaleia Eulogia Quintessence 7': '8CE8', // Third Form movement (right cleave)
    'Thaleia Eulogia Quintessence 8': '8CE9', // Third Form movement (left cleave)
    'Thaleia Eulogia Quintessence 9': '8CEA', // Third Form movement (under)
    'Thaleia Eulogia First Blush 1': '8A33', // Love's Light moon #1 line
    'Thaleia Eulogia First Blush 2': '8A34', // Love's Light moon #2 line
    'Thaleia Eulogia First Blush 3': '8A35', // Love's Light moon #3 line
    'Thaleia Eulogia First Blush 4': '8A36', // Love's Light moon #4 line
    'Thaleia Eulogia Solar Fans': '8A3C', // initial Warden's Flame fan lines
    'Thaleia Eulogia Radiant Flight ': '8A3F', // Warden's Flame fans when moving with Radiant Flight
    'Thaleia Eulogia Radiant Flourish': '8A41', // Warden's Flame fan large circles during Radiant Finish
    'Thaleia Eulogia Hieroglyphika': '8A44', // rotated green squares
    'Thaleia Eulogia Hand of the Destroyer 1': '8A49', // red half room cleave fist punch
    'Thaleia Eulogia Hand of the Destroyer 2': '8A4A', // blue half room cleave fist punch
    'Thaleia Eulogia Lightning Bolt': '8A50', // large trident circles
    'Thaleia Eulogia Byregot\'s Strike 1': '8A52', // blue puck that knocks back
    'Thaleia Eulogia Byregot\'s Strike 2': '8A54', // lightning bolts
    'Thaleia Eulogia Thousandfold Thrust 1': '8A59', // initial hit of 180 red shield cleave
    'Thaleia Eulogia Thousandfold Thrust 2': '8A5A', // ongoing hits of 180 red shield cleave
    'Thaleia Eulogia Soaring Minuet': '8A69', // back safe 270 cleave
    'Thaleia Eulogia Once Burned 1': '8D00', // initial orange puddles
    'Thaleia Eulogia Once Burned 2': '8D02', // moving orange puddles
    'Thaleia Eulogia Everfire 1': '8D01', // initial blue puddles
    'Thaleia Eulogia Everfire 2': '8D03', // moving blue puddles
  },
  shareWarn: {
    'Thaleia Thaliak Hydroptosis': '88D5', // spread
    'Thaleia Llymlaen Stormwinds': '881F', // spread
  },
  shareFail: {
    'Thaleia Thaliak Rhyton': '88D7', // triple tankbuster lasers
    'Thaleia Oschon The Arrow 1': '889D', // triple tankbusters (small version)
    'Thaleia Oschon The Arrow 2': '889E', // triple tankbusters (big version)
    'Thaleia Eulogia Sunbeam': '8A01', // triple tankbusters
  },
};

export default triggerSet;
