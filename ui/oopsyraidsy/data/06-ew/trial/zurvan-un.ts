// This file was autogenerated from running ts-node util/sync_files.ts.
// DO NOT EDIT THIS FILE DIRECTLY.
// Edit the source file below and then run `npm run sync-files`
// Source: ui/oopsyraidsy/data/03-hw/trial/zurvan-ex.ts

import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

const triggerSet: OopsyTriggerSet<OopsyData> = {
  zoneId: ZoneId.ContainmentBayZ1T9Unreal,
  damageWarn: {
    'ZurvanUN Flare Star': '8558', // Flame puddle AoEs, phase 1
    'ZurvanUN Twin Spirit 1': '855B', // Zurvan half dives during Soar, phase 3 onward
    'ZurvanUN Twin Spirit 2': '855C', // Zurvan full dives during Soar, phase 3 onward
    'ZurvanUN Biting Halberd': '8562', // 270-degree cleave, phase 3 onward
    'ZurvanUN Tail End': '8563', // Chariot AoE, phase 3 onward
    'ZurvanUN Ciclicle': '8564', // Dynamo AoE, phase 3 onward
    'ZurvanUN Souther Cross': '8566', // Ice puddle explosion, phase 3 onward
    'ZurvanUN South Star 1': '8572', // Tower failure during Broken Seal, phase 5
    'ZurvanUN North Star 1': '8573', // Tower failure during Broken Seal, phase 5
    'ZurvanUN Comet': '856D', // Flame puddle AoEs, add intermission
    'ZurvanUN South Star 2': '859D', // Tower failure during Broken Seal, phase 5
    'ZurvanUN North Star 2': '859E', // Tower failure during Broken Seal, phase 5
  },
  damageFail: {
    'ZurvanUN Meracydian Meteor': '856C',
  },
  gainsEffectWarn: {
    'ZurvanUN Frostbite': '11D', // Southern Cross puddles, phase 3 onward
    'ZurvanUN Hysteria': '128', // Gaze attack, Meracydian Wile, intermission
    'ZurvanUN Infinite Anguish Tower': '487', // Outside of a tower during Broken Seal, phase 5
    'ZurvanUN Infinite Anguish Tether': '48A', // Hyperextended tether during Broken Seal, phase 5
  },
  shareWarn: {
    'ZurvanUN Metal Cutter 1': '857F', // Tank cleave, phase 1
    'ZurvanUN Metal Cutter 2': '8579', // Tank cleave, phase 2 onward
    'ZurvanUN Wave Cannon Avoid': '857C', // Bleed laser, phase 2 onward
    'ZurvanUN Flaming Halberd': '855D', // Giant spread circles during Soar, phase 3 onward
    'ZurvanUN Cool Flame': '855E', // Prey marker during Soar, phase 3 onward
    'ZurvanUN Fire III': '8578', // Tank Cleave
  },
  soloWarn: {
    'ZurvanUN Demonic Dive': '855F', // Stack marker during Soar, phase 3 onward
    'ZurvanUN Wave Cannon Stack': '857B', // Line stack after Demon's Claw, phase 2 onward
  },
};

export default triggerSet;
