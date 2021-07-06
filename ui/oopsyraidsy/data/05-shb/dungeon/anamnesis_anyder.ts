import ZoneId from '../../../../../resources/zone_id';
import { SimpleOopsyTriggerSet } from '../../../../../types/oopsy';

export { OopsyData as Data } from '../../../../../types/data';

const triggerSet: SimpleOopsyTriggerSet = {
  zoneId: ZoneId.AnamnesisAnyder,
  damageWarn: {
    'Anamnesis Trench Phuabo Spine Lash': '4D1A', // frontal conal
    'Anamnesis Trench Anemone Falling Rock': '4E37', // ground circle aoe from Trench Anemone showing up
    'Anamnesis Trench Dagonite Sewer Water': '4D1C', // frontal conal from Trench Anemone (?!)
    'Anamnesis Trench Yovra Rock Hard': '4D21', // targeted circle aoe
    'Anamnesis Trench Yovra Torrential Torment': '4D21', // frontal conal
    'Anamnesis Unknown Luminous Ray': '4E27', // Unknown line aoe
    'Anamnesis Unknown Sinster Bubble Explosion': '4B6E', // Unknown explosions during Scrutiny
    'Anamnesis Unknown Reflection': '4B6F', // Unknown conal attack during Scrutiny
    'Anamnesis Unknown Clearout 1': '4B74', // Unknown frontal cone
    'Anamnesis Unknown Clearout 2': '4B6B', // Unknown frontal cone
    'Anamnesis Unknown Setback 1': '4B75', // Unknown rear cone
    'Anamnesis Unknown Setback 2': '5B6C', // Unknown rear cone
    'Anamnesis Anyder Clionid Acrid Stream': '4D24', // targeted circle aoe
    'Anamnesis Anyder Diviner Dreadstorm': '4D28', // ground circle aoe
    'Anamnesis Kyklops 2000-Mina Swing': '4B55', // Kyklops get out mechanic
    'Anamnesis Kyklops Terrible Hammer': '4B5D', // Kyklops Hammer/Blade alternating squares
    'Anamnesis Kyklops Terrible Blade': '4B5E', // Kyklops Hammer/Blade alternating squares
    'Anamnesis Kyklops Raging Glower': '4B56', // Kyklops line aoe
    'Anamnesis Kyklops Eye Of The Cyclone': '4B57', // Kyklops donut
    'Anamnesis Anyder Harpooner Hydroball': '4D26', // frontal conal
    'Anamnesis Rukshs Swift Shift': '4B83', // Rukshs Deem teleport N/S
    'Anamnesis Rukshs Depth Grip Wavebreaker': '33D4', // Rukshs Deem hand attacks
    'Anamnesis Rukshs Rising Tide': '4B8B', // Rukshs Deem cross aoe
    'Anamnesis Rukshs Command Current': '4B82', // Rukshs Deem protean-ish ground aoes
  },
  shareWarn: {
    'Anamnesis Trench Xzomit Mantle Drill': '4D19', // charge attack
    'Anamnesis Io Ousia Barreling Smash': '4E24', // charge attack
    'Anamnesis Kyklops Wanderer\'s Pyre': '4B5F', // Kyklops spread attack
  },
};

export default triggerSet;
