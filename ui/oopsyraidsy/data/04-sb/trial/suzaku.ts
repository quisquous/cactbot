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
    'Ashes To Ashes': '321F', // Scarlet Lady add, raidwide explosion if not killed in time
    'Fleeting Summer': '3223', // Cone AoE (randomly targeted)
    'Wing And A Prayer': '3225', // Circle AoEs from unkilled plumes
    'Phantom Half': '3233', // Giant half-arena AoE follow-up after tank buster
    'Well Of Flame': '3236', // Large rectangle AoE (randomly targeted)
    'Hotspot': '3238', // Platform fire when the runes are activated
    'Swoop': '323B', // Star cross line AoEs
    'Burn': '323D', // Tower mechanic failure on Incandescent Interlude (party failure, not personal)
  },
  shareWarn: {
    'Rekindle': '3235', // Purple spread circles
  },
  triggers: [
    {
      id: 'Suzaku Normal Ruthless Refrain',
      type: 'Ability',
      netRegex: NetRegexes.abilityFull({ id: '3230', ...playerDamageFields }),
      deathReason: (_data, matches) => {
        return {
          type: 'fail',
          name: matches.target,
          text: {
            en: 'Pushed off!',
            de: 'Runter geschubst!',
            fr: 'A été poussé(e) !',
            ja: '落ちた',
            cn: '击退坠落',
          },
        };
      },
    },
  ],
};

export default triggerSet;
