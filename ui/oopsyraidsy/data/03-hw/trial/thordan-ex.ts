import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

const triggerSet: OopsyTriggerSet<OopsyData> = {
  zoneId: ZoneId.TheMinstrelsBalladThordansReign,
  damageWarn: {
    'ThordanEX Meteorain': '1484', // Targeted puddle AoEs, phase 1
    'ThordanEX Ascalons Mercy 1': '147F', // Fan-shaped conal AoEs
    'ThordanEX Ascalons Mercy 2': '1480', // Fan-shaped conal AoEs
    'ThordanEX Charibert Heavensflame': '14AC', // Targeted puddle AoEs, phases 2/6
    'ThordanEX Spiral Thrust': '14A6', // Cross-arena dashes, Ignasse/Paulecrain/Vellguine
    'ThordanEX Grinnaux Dimensional Collapse': '149A', // Gravity puddles
    'ThordanEX Guerrique Heavy Impact 1': '14A0', // Earth ring tiny
    'ThordanEX Guerrique Heavy Impact 2': '14A1', // Earth ring small
    'ThordanEX Guerrique Heavy Impact 3': '14A2', // Earth ring large
    'ThordanEX Guerrique Heavy Impact 4': '14A3', // Earth ring giant
    'ThordanEX Charibert Holy Chain': '14AD', // Failure to break chains on time
  },
  damageFail: {
    'ThordanEX Hermenost Eternal Conviction': '149E', // Missed towers
    'ThordanEX Comet Circle Comet Impact': '14B3', // Small meteor enrage, might not be survivable
  },
  gainsEffectWarn: {
    'ThordanEX Frostbite': '10C', // Standing in Hiemal Storm ice puddles
    'ThordanEX Hysteria': '128', // Gaze mechanic failure
  },
  shareWarn: {
    'ThordanEX Ascalons Might': '147E', // Instant tank cleave
    'ThordanEX Lightning Storm': '1482', // Lightning spread markers
    'ThordanEX Heavenly Slash': '1494', // Cleaving mini-buster, Adelphel/Janlenoux, phase 2
    'ThordanEX Haumeric Hiemal Storm': '14AF', // Ice spread circles, Haumeric, phase 2/6
    'ThordanEX Spiral Pierce': '14A7', // Tethered line AoEs, Ignasse/Paulecrain/Vellguine
    'ThordanEX Noudenet Comet': '14B5', // Targeted puddle AoEs, phases 2/6
  },
  soloWarn: {
    'ThordanEX Dragons Rage': '148B', // Standard stack marker
    'ThordanEX Zephirin Spear Of The Fury': '1492', // Wild Charge
  },
  triggers: [
    {
      id: 'ThordanEX Grinnaux Faith Unmoving',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '149B' }),
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
