import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';

export type Data = OopsyData;

// TODO: Ink (277D) seems to always be 0x16
// TODO: Failing Virus?
// TODO: failing Interdimensional Bombs?

// O7S - Sigmascape 3.0 Savage
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.SigmascapeV30Savage,
  damageWarn: {
    'O7S Magitek Ray': '2788', // front line laser
    'O7S Lightning Bomb Explosion': '278E', // baited orbs
    'O7S Chain Cannon': '278F', // damage from baited aerial attack
    'O7S Tentacle': '277E', // tentacles appearing
    'O7S Tentacle Wallop': '277F', // tentacles attacking
    'O7S Air Force Diffractive Laser': '2740', // Air Force adds conal
    'O7S Guardian Diffractive Laser': '2780', // initial Air Force centered circle on Guardian
    'O7S The Heat': '2777', // explosion from searing wind
    'O7S Super Chakra Burst': '2786', // failing Dadaluma towers
  },
  damageFail: {
    'O7S Missile': '2782',
  },
  gainsEffectFail: {
    'O7S Shocked': '5DA', // touching arena edge
  },
  shareWarn: {
    'O7S Aura Cannon': '2784', // Dadaluma line aoe
  },
  triggers: [
    {
      id: 'O7S Stoneskin',
      type: 'Ability',
      netRegex: NetRegexes.ability({ id: '2AB5' }),
      mistake: (_data, matches) => {
        return { type: 'fail', blame: matches.source, text: matches.ability };
      },
    },
  ],
};

export default triggerSet;
