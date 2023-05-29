import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

const triggerSet: OopsyTriggerSet<OopsyData> = {
  zoneId: ZoneId.ContainmentBayZ1T9Extreme,
  damageWarn: {
    'ZurvanEX Flare Star': '1C4F', // Flame puddle AoEs, phase 1
    'ZurvanEX Twin Spirit 1': '1C52', // Zurvan half dives during Soar, phase 3 onward
    'ZurvanEX Twin Spirit 2': '1C53', // Zurvan full dives during Soar, phase 3 onward
    'ZurvanEX Biting Halberd': '1C59', // 270-degree cleave, phase 3 onward
    'ZurvanEX Tail End': '1C5A', // Chariot AoE, phase 3 onward
    'ZurvanEX Ciclicle': '1C5B', // Dynamo AoE, phase 3 onward
    'ZurvanEX Souther Cross': '1C5D', // Ice puddle explosion, phase 3 onward
    'ZurvanEX South Star 1': '1C6B', // Tower failure during Broken Seal, phase 5
    'ZurvanEX North Star 1': '1C6C', // Tower failure during Broken Seal, phase 5
    'ZurvanEX Comet': '1C64', // Flame puddle AoEs, add intermission
    'ZurvanEX South Star 2': '1E64', // Tower failure during Broken Seal, phase 5
    'ZurvanEX North Star 2': '1E65', // Tower failure during Broken Seal, phase 5
  },
  damageFail: {
    'ZurvanEX Meracydian Meteor': '1C63',
  },
  gainsEffectWarn: {
    'ZurvanEX Frostbite': '11D', // Southern Cross puddles, phase 3 onward
    'ZurvanEX Hysteria': '128', // Gaze attack, Meracydian Wile, intermission
    'ZurvanEX Infinite Anguish Tower': '487', // Outside of a tower during Broken Seal, phase 5
    'ZurvanEX Infinite Anguish Tether': '48A', // Hyperextended tether during Broken Seal, phase 5
  },
  shareWarn: {
    'ZurvanEX Metal Cutter 1': '1E3F', // Tank cleave, phase 1
    'ZurvanEX Metal Cutter 2': '1C70', // Tank cleave, phase 2 onward
    'ZurvanEX Wave Cannon Avoid': '1C73', // Bleed laser, phase 2 onward
    'ZurvanEX Flaming Halberd': '1C54', // Giant spread circles during Soar, phase 3 onward
    'ZurvanEX Cool Flame': '1C55', // Prey marker during Soar, phase 3 onward
    'ZurvanEX Fire III': '1C6F', // Tank Cleave
  },
  soloWarn: {
    'ZurvanEX Demonic Dive': '1C56', // Stack marker during Soar, phase 3 onward
    'ZurvanEX Wave Cannon Stack': '1C72', // Line stack after Demon's Claw, phase 2 onward
  },
};

export default triggerSet;
