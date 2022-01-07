import NetRegexes from '../../../../../resources/netregexes';
import ZoneId from '../../../../../resources/zone_id';
import { OopsyData } from '../../../../../types/data';
import { OopsyTriggerSet } from '../../../../../types/oopsy';
import { playerDamageFields } from '../../../oopsy_common';

export type Data = OopsyData;

// Suzaku Normal
const triggerSet: OopsyTriggerSet<Data> = {
  zoneId: ZoneId.HellsKier,
  damageWarn: {
    'Suzaku Normal Ashes To Ashes': '321F', // Scarlet Lady add, raidwide explosion if not killed in time
    'Suzaku Normal Fleeting Summer': '3223', // Cone AoE (randomly targeted)
    'Suzaku Normal Wing And A Prayer': '3225', // Circle AoEs from unkilled plumes
    'Suzaku Normal Phantom Half': '3233', // Giant half-arena AoE follow-up after tank buster
    'Suzaku Normal Well Of Flame': '3236', // Large rectangle AoE (randomly targeted)
    'Suzaku Normal Hotspot': '3238', // Platform fire when the runes are activated
    'Suzaku Normal Swoop': '323B', // Star cross line AoEs
    'Suzaku Normal Burn': '323D', // Tower mechanic failure on Incandescent Interlude (party failure, not personal)
  },
  shareWarn: {
    'Suzaku Normal Rekindle': '3235', // Purple spread circles
  },
  triggers: [
    {
      id: 'Suzaku Normal Ruthless Refrain',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '3230', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          id: matches.targetId,
          name: matches.target,
          text: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'A été poussé(e) !',
            ja: '落ちた',
            cn: '击退坠落',
            ko: '낙사',
          },
        };
      },
    },
  ],
};

export default triggerSet;
