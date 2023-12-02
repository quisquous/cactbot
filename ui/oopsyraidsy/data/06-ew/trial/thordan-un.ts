// This file was autogenerated from running ts-node util/sync_files.ts.
// DO NOT EDIT THIS FILE DIRECTLY.
// Edit the source file below and then run `npm run sync-files`
// Source: ui/oopsyraidsy/data/03-hw/trial/thordan-ex.ts

import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

const triggerSet: OopsyTriggerSet<OopsyData> = {
  zoneId: ZoneId.TheSingularityReactorUnreal,
  damageWarn: {
    'ThordanUN Meteorain': '89C3', // Targeted puddle AoEs, phase 1
    'ThordanUN Ascalons Mercy 1': '89BE', // Fan-shaped conal AoEs
    'ThordanUN Ascalons Mercy 2': '89BF', // Fan-shaped conal AoEs
    'ThordanUN Charibert Heavensflame': '89EB', // Targeted puddle AoEs, phases 2/6
    'ThordanUN Spiral Thrust': '89E5', // Cross-arena dashes, Ignasse/Paulecrain/Vellguine
    'ThordanUN Grinnaux Dimensional Collapse': '89D9', // Gravity puddles
    'ThordanUN Guerrique Heavy Impact 1': '89DF', // Earth ring tiny
    'ThordanUN Guerrique Heavy Impact 2': '89E0', // Earth ring small
    'ThordanUN Guerrique Heavy Impact 3': '89E1', // Earth ring large
    'ThordanUN Guerrique Heavy Impact 4': '89E2', // Earth ring giant
    'ThordanUN Charibert Holy Chain': '89EC', // Failure to break chains on time
  },
  damageFail: {
    'ThordanUN Hermenost Eternal Conviction': '89DD', // Missed towers
    'ThordanUN Comet Circle Comet Impact': '89F2', // Small meteor enrage, might not be survivable
  },
  gainsEffectWarn: {
    'ThordanUN Frostbite': '10C', // Standing in Hiemal Storm ice puddles
    'ThordanUN Hysteria': '128', // Gaze mechanic failure
  },
  shareWarn: {
    'ThordanUN Ascalons Might': '89BD', // Instant tank cleave
    'ThordanUN Lightning Storm': '89C1', // Lightning spread markers
    'ThordanUN Heavenly Slash': '89D3', // Cleaving mini-buster, Adelphel/Janlenoux, phase 2
    'ThordanUN Haumeric Hiemal Storm': '89EE', // Ice spread circles, Haumeric, phase 2/6
    'ThordanUN Spiral Pierce': '89E6', // Tethered line AoEs, Ignasse/Paulecrain/Vellguine
    'ThordanUN Noudenet Comet': '89F4', // Targeted puddle AoEs, phases 2/6
  },
  soloWarn: {
    'ThordanUN Dragons Rage': '89CA', // Standard stack marker
    'ThordanUN Zephirin Spear Of The Fury': '89D1', // Wild Charge
  },
  triggers: [
    {
      id: 'ThordanUN Grinnaux Faith Unmoving',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '89DA' }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed into wall',
            de: 'Rückstoß in die Wand',
            fr: 'Poussé(e) dans le mur',
            ja: '壁へノックバック',
            cn: '击退至墙',
            ko: '벽으로 넉백',
          },
        };
      },
    },
  ],
};

export default triggerSet;
